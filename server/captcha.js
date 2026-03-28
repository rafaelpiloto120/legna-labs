"use strict";

const config = require("./config");
const { normalizeError } = require("./errors");

async function verifyCaptchaToken({ token, remoteIp }) {
  if (!config.captcha.enabled) {
    return { ok: true };
  }

  if (!token) {
    return normalizeError({
      status: 400,
      code: "captcha_required",
      message: "Please complete the verification check and try again."
    });
  }

  if (config.captcha.provider !== "turnstile") {
    return normalizeError({
      status: 500,
      code: "unsupported_captcha_provider",
      message: "Captcha is configured with an unsupported provider."
    });
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        secret: config.captcha.secretKey,
        response: token,
        remoteip: remoteIp || ""
      })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.success !== true) {
      return normalizeError({
        status: 400,
        code: "captcha_failed",
        message: "Verification failed. Please try the check again."
      });
    }

    return { ok: true };
  } catch (_error) {
    return normalizeError({
      status: 502,
      code: "captcha_unavailable",
      message: "Verification is temporarily unavailable. Please try again in a moment."
    });
  }
}

module.exports = {
  verifyCaptchaToken
};
