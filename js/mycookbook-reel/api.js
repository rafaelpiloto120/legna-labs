import { normalizeRecipeError, readRateLimitMeta } from "./errors.js";

export async function generateRecipeDraft({ url, language }) {
  const response = await fetch("/api/mycookbook-ai/reel-to-recipe", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      url,
      language,
      measurementSystem: "Metric"
    })
  });

  const payload = await response.json().catch(() => ({}));
  const rateLimit = readRateLimitMeta(response, payload);

  if (!response.ok || !payload?.ok) {
    return {
      ok: false,
      error: normalizeRecipeError(payload, response.status),
      rateLimit
    };
  }

  return {
    ok: true,
    recipe: payload.recipe,
    rateLimit
  };
}
