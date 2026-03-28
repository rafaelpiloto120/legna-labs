export function validateInstagramReelUrl(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";

  if (!trimmed) {
    return {
      isValid: false,
      code: "missing_url",
      message: "Paste a public Instagram Reel URL to get started."
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
        message: "Only public Instagram Reel URLs are supported."
      };
    }
  } catch (_error) {
    return {
      isValid: false,
      code: "invalid_url",
      message: "Enter a valid Instagram Reel URL."
    };
  }

  return {
    isValid: true,
    normalizedUrl: trimmed
  };
}
