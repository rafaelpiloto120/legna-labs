"use strict";

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");

const config = require("./server/config");
const { normalizeBackendSuccess } = require("./server/backend-response");
const { normalizeError, normalizeBackendError } = require("./server/errors");
const { validateInstagramReelUrl } = require("./server/instagram");
const { DailyIpRateLimiter } = require("./server/rate-limit-store");
const { verifyCaptchaToken } = require("./server/captcha");

const rateLimiter = new DailyIpRateLimiter({
  limit: config.reelDailyLimit,
  windowMs: config.rateWindowMs
});

const MIME_TYPES = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (requestUrl.pathname === "/api/mycookbook-ai/reel-to-recipe") {
      await handleRecipeProxy(req, res);
      return;
    }

    if (requestUrl.pathname === "/api/mycookbook-ai/public-config") {
      handlePublicConfig(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, normalizeError({ status: 405, code: "method_not_allowed" }).body);
      return;
    }

    await serveStaticFile(requestUrl.pathname, res, req.method === "HEAD");
  } catch (error) {
    console.error("Unhandled request error", error);
    sendJson(
      res,
      500,
      normalizeError({
        status: 500,
        code: "server_error",
        message: "Something went wrong while serving this page."
      }).body
    );
  }
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(
      `Port ${config.port} is already in use. Stop the other process or run with a different port, for example: PORT=3001 npm start`
    );
    process.exit(1);
  }

  console.error("Failed to start server", error);
  process.exit(1);
});

server.listen(config.port, () => {
  console.log(`Legna Labs site running on http://localhost:${config.port}`);
});

async function handleRecipeProxy(req, res) {
  if (req.method !== "POST") {
    sendJson(
      res,
      405,
      normalizeError({
        status: 405,
        code: "method_not_allowed",
        message: "Use POST when generating a recipe draft."
      }).body
    );
    return;
  }

  if (!config.recipeApiBaseUrl) {
    sendJson(
      res,
      500,
      normalizeError({
        status: 500,
        code: "missing_backend_config",
        message:
          "Recipe generation is not configured yet. Add NEXT_PUBLIC_RECIPE_API_BASE_URL on the server."
      }).body
    );
    return;
  }

  const body = await readJsonBody(req);
  if (!body.ok) {
    sendJson(res, body.status, body.payload);
    return;
  }

  const urlValidation = validateInstagramReelUrl(body.value.url);
  if (!urlValidation.isValid) {
    sendJson(
      res,
      400,
      normalizeError({
        status: 400,
        code: urlValidation.code,
        message: urlValidation.message
      }).body
    );
    return;
  }

  const botGuard = await verifyBotProtection(req, body.value);
  if (!botGuard.ok) {
    sendJson(res, botGuard.status, botGuard.body);
    return;
  }

  const clientIp = getClientIp(req);
  const rateState = rateLimiter.consume(clientIp);
  setRateLimitHeaders(res, rateState);

  if (!rateState.allowed) {
    sendJson(res, 429, {
      ok: false,
      error: {
        code: "daily_limit_reached",
        message: "You’ve reached today’s recipe draft limit. Please try again tomorrow.",
        details: null
      }
    });
    return;
  }

  const upstreamResponse = await fetchUpstream(urlValidation.normalizedUrl, body.value.language);
  if (!upstreamResponse.ok) {
    sendJson(res, upstreamResponse.status, upstreamResponse.body);
    return;
  }

  sendJson(res, 200, {
    ok: true,
    recipe: upstreamResponse.body.recipe,
    meta: {
      remaining: rateState.remaining,
      limit: rateState.limit,
      resetAt: rateState.resetAt
    }
  });
}

function handlePublicConfig(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(
      res,
      405,
      normalizeError({
        status: 405,
        code: "method_not_allowed",
        message: "Use GET for public config."
      }).body
    );
    return;
  }

  sendJson(res, 200, {
    ok: true,
    captcha: {
      enabled: config.captcha.enabled,
      provider: config.captcha.provider,
      siteKey: config.captcha.enabled ? config.captcha.siteKey : ""
    }
  });
}

async function fetchUpstream(url, language) {
  const endpoint = new URL("/extractRecipeDraftFromUrl", ensureTrailingSlash(config.recipeApiBaseUrl));

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        url,
        language: normalizeLanguage(language),
        measurementSystem: "Metric"
      })
    });
  } catch (_error) {
    return normalizeError({
      status: 502,
      code: "network_failure",
      message: "The recipe service is unavailable right now. Please try again in a bit."
    });
  }

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    return normalizeBackendError(response.status, payload);
  }

  const normalized = normalizeBackendSuccess(payload);
  if (!normalized.ok) {
    return normalizeBackendError(422, payload);
  }

  return {
    ok: true,
    status: 200,
    body: normalized
  };
}

async function verifyBotProtection(req, body) {
  const token = typeof body.botToken === "string" ? body.botToken.trim() : "";

  return verifyCaptchaToken({
    token,
    remoteIp: getClientIp(req)
  });
}

function normalizeLanguage(language) {
  if (typeof language !== "string") return "en";
  const trimmed = language.trim().toLowerCase();
  return /^[a-z]{2}(-[a-z]{2})?$/i.test(trimmed) ? trimmed : "en";
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf-8");
  if (!raw) {
    return {
      ok: false,
      status: 400,
      payload: normalizeError({
        status: 400,
        code: "missing_body",
        message: "Paste a Reel link before generating a recipe draft."
      }).body
    };
  }

  try {
    return {
      ok: true,
      value: JSON.parse(raw)
    };
  } catch (_error) {
    return {
      ok: false,
      status: 400,
      payload: normalizeError({
        status: 400,
        code: "invalid_json",
        message: "The request body must be valid JSON."
      }).body
    };
  }
}

async function parseResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (_error) {
      return {};
    }
  }

  return await response.text();
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket.remoteAddress || "unknown";
}

function setRateLimitHeaders(res, state) {
  res.setHeader("X-RateLimit-Limit", String(state.limit));
  res.setHeader("X-RateLimit-Remaining", String(state.remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.floor(state.resetAt / 1000)));
}

async function serveStaticFile(requestPath, res, headOnly) {
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const unsafePath = path.join(config.publicDir, normalizedPath);
  const filePath = await resolveFilePath(unsafePath);

  if (!filePath || !isWithinPublicDir(filePath)) {
    sendNotFound(res);
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[extension] || "application/octet-stream";

  try {
    const stat = await fsp.stat(filePath);
    res.writeHead(200, {
      "content-type": mimeType,
      "content-length": stat.size
    });

    if (headOnly) {
      res.end();
      return;
    }

    fs.createReadStream(filePath).pipe(res);
  } catch (_error) {
    sendNotFound(res);
  }
}

async function resolveFilePath(filePath) {
  try {
    const stat = await fsp.stat(filePath);
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      await fsp.access(indexPath);
      return indexPath;
    }
    return filePath;
  } catch (_error) {
    return null;
  }
}

function isWithinPublicDir(filePath) {
  const relativePath = path.relative(config.publicDir, filePath);
  return relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

function sendNotFound(res) {
  res.writeHead(404, {
    "content-type": "text/plain; charset=utf-8"
  });
  res.end("Not found");
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload));
}

function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
