"use strict";

function normalizeError({ status = 500, code, message, details } = {}) {
  return {
    status,
    body: {
      ok: false,
      error: {
        code: code || "backend_failure",
        message:
          message || "We couldn’t generate a recipe draft right now. Please try again in a bit.",
        details: details || null
      }
    }
  };
}

function normalizeBackendError(status, payload) {
  const text = collectErrorText(payload);
  const lowered = text.toLowerCase();

  if (status === 429 || /rate limit|too many requests|abuse|throttle|captcha/.test(lowered)) {
    return normalizeError({
      status: 429,
      code: "rate_limited",
      message: "This feature is temporarily busy right now. Please wait a bit before trying again."
    });
  }

  if (/cookie/.test(lowered)) {
    return normalizeError({
      status: 503,
      code: "insufficient_cookies",
      message:
        "Recipe extraction is temporarily unavailable right now. Please try again later."
    });
  }

  if (/invalid url|malformed url|bad url/.test(lowered)) {
    return normalizeError({
      status: 400,
      code: "invalid_url",
      message: "Paste a valid public Instagram Reel URL to continue."
    });
  }

  if (/unsupported|public instagram reel|instagram reel|not supported|only public/.test(lowered)) {
    return normalizeError({
      status: 400,
      code: "unsupported_url",
      message: "Only public Instagram Reel URLs are supported on this page."
    });
  }

  if (
    /insufficient quality|quality|not good enough|not extracted|could not extract|unable to extract|no recipe/i.test(
      lowered
    )
  ) {
    return normalizeError({
      status: 422,
      code: "insufficient_quality",
      message:
        "We couldn’t get a reliable recipe draft from that Reel. Please try a clearer cooking Reel or open the app for other import options."
    });
  }

  return normalizeError({
    status: status >= 400 ? status : 502,
    code: "backend_failure",
    message: "We couldn’t generate a recipe draft right now. Please try again in a bit."
  });
}

function collectErrorText(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;

  const candidates = [
    payload.message,
    payload.error,
    payload.code,
    payload.details,
    payload.reason
  ];

  if (payload.error && typeof payload.error === "object") {
    candidates.push(payload.error.message, payload.error.code, payload.error.details);
  }

  return candidates
    .flat()
    .filter(Boolean)
    .map((value) => (typeof value === "string" ? value : JSON.stringify(value)))
    .join(" ");
}

module.exports = {
  normalizeError,
  normalizeBackendError
};
