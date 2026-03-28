"use strict";

const INSTAGRAM_REEL_REGEX =
  /^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|reels)\/[A-Za-z0-9._-]+(?:\/)?(?:\?.*)?$/i;

function validateInstagramReelUrl(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";

  if (!trimmed) {
    return {
      isValid: false,
      code: "missing_url",
      message: "Paste a public Instagram Reel link to generate a recipe draft."
    };
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return {
      isValid: false,
      code: "invalid_url",
      message: "The link needs to start with http:// or https://."
    };
  }

  try {
    const parsed = new URL(trimmed);
    const isInstagramHost = /(^|\.)instagram\.com$/i.test(parsed.hostname);
    const isReelPath = /^\/(?:reel|reels)\/[A-Za-z0-9._-]+\/?$/i.test(parsed.pathname);

    if (!isInstagramHost || !isReelPath) {
      return {
        isValid: false,
        code: "unsupported_url",
        message: "Only public Instagram Reel URLs are supported on this page."
      };
    }
  } catch (_error) {
    return {
      isValid: false,
      code: "invalid_url",
      message: "That doesn’t look like a valid Instagram Reel URL."
    };
  }

  if (!INSTAGRAM_REEL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      code: "unsupported_url",
      message: "Only public Instagram Reel URLs are supported on this page."
    };
  }

  return {
    isValid: true,
    normalizedUrl: trimmed
  };
}

module.exports = {
  validateInstagramReelUrl
};
