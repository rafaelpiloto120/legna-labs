const FALLBACK_MESSAGE =
  "We couldn’t generate a recipe draft right now. Please try again in a bit.";

export function normalizeRecipeError(payload, status) {
  const code = payload?.error?.code || "backend_failure";
  const message = payload?.error?.message || mapStatusToMessage(status);

  return {
    code,
    message: message || FALLBACK_MESSAGE
  };
}

function mapStatusToMessage(status) {
  if (status === 429) {
    return "You’ve reached today’s recipe draft limit. Please try again tomorrow.";
  }

  if (status >= 500) {
    return FALLBACK_MESSAGE;
  }

  return FALLBACK_MESSAGE;
}

export function readRateLimitMeta(response, payload) {
  const remaining = Number.parseInt(
    response.headers.get("x-ratelimit-remaining") || payload?.meta?.remaining,
    10
  );
  const limit = Number.parseInt(
    response.headers.get("x-ratelimit-limit") || payload?.meta?.limit,
    10
  );
  const resetHeader = response.headers.get("x-ratelimit-reset");
  const resetPayload = payload?.meta?.resetAt;
  const resetAt = resetHeader
    ? Number.parseInt(resetHeader, 10) * 1000
    : Number.isFinite(Number(resetPayload))
      ? Number(resetPayload)
      : null;

  return {
    remaining: Number.isFinite(remaining) ? remaining : null,
    limit: Number.isFinite(limit) ? limit : null,
    resetAt
  };
}
