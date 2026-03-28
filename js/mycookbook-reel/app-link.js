const APP_CONFIG = {
  androidPackage: "ai.mycookbook.app",
  playStoreUrl: "https://play.google.com/store/apps/details?id=ai.mycookbook.app",
  scheme: "mycookbookai",
  host: "import-recipe"
};

export function openMyCookbookApp(recipe, sourceUrl) {
  const deepLinkUrl = buildDeepLink(recipe, sourceUrl);
  const intentUrl = buildAndroidIntent(deepLinkUrl);
  const fallbackUrl = APP_CONFIG.playStoreUrl;
  const startedAt = Date.now();

  const timer = window.setTimeout(() => {
    if (Date.now() - startedAt < 1800) {
      window.location.href = fallbackUrl;
    }
  }, 1200);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  const isAndroid = /android/i.test(navigator.userAgent);
  window.location.href = isAndroid ? intentUrl : deepLinkUrl;
}

function buildDeepLink(recipe, sourceUrl) {
  const url = new URL(`${APP_CONFIG.scheme}://${APP_CONFIG.host}`);
  url.searchParams.set("source", "instagram-reel-web");
  url.searchParams.set("sourceUrl", sourceUrl);
  url.searchParams.set("title", recipe.title || "Recipe draft");
  return url.toString();
}

function buildAndroidIntent(deepLinkUrl) {
  const encodedFallback = encodeURIComponent(APP_CONFIG.playStoreUrl);
  const noScheme = deepLinkUrl.replace(`${APP_CONFIG.scheme}://`, "");
  return `intent://${noScheme}#Intent;scheme=${APP_CONFIG.scheme};package=${APP_CONFIG.androidPackage};S.browser_fallback_url=${encodedFallback};end`;
}
