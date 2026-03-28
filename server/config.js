"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const envDir = path.resolve(__dirname, "..");
const runtimeEnv = (process.env.NODE_ENV || "development").trim().toLowerCase();

loadEnvFile(path.join(envDir, ".env"));

if (runtimeEnv === "production") {
  loadEnvFile(path.join(envDir, ".env.production"));
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const projectRoot = path.resolve(__dirname, "..");

module.exports = {
  projectRoot,
  publicDir: projectRoot,
  port: parsePositiveInteger(process.env.PORT, 3000),
  recipeApiBaseUrl: process.env.NEXT_PUBLIC_RECIPE_API_BASE_URL || "",
  reelDailyLimit: parsePositiveInteger(process.env.MYCOOKBOOK_REEL_DAILY_LIMIT, 5),
  rateWindowMs: ONE_DAY_MS,
  allowedOrigin: process.env.PUBLIC_SITE_ORIGIN || "",
  appConfig: {
    androidPackage: process.env.MYCOOKBOOK_ANDROID_PACKAGE || "ai.mycookbook.app",
    playStoreUrl:
      process.env.MYCOOKBOOK_GOOGLE_PLAY_URL ||
      "https://play.google.com/store/apps/details?id=ai.mycookbook.app",
    deepLinkScheme: process.env.MYCOOKBOOK_APP_SCHEME || "mycookbookai",
    deepLinkHost: process.env.MYCOOKBOOK_APP_HOST || "import-recipe"
  }
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!key) {
      continue;
    }

    process.env[key] = stripQuotes(value);
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
