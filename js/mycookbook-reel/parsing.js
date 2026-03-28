function normalizeList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          return (
            item.text ||
            item.name ||
            item.value ||
            item.step ||
            item.instruction ||
            ""
          ).trim();
        }
        return String(item).trim();
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function parseRecipeResponse(payload) {
  const source = payload?.recipe || payload?.data || payload;

  return {
    title: source?.title || "Untitled recipe draft",
    cookingTime: source?.cookingTime || "Not specified",
    difficulty: source?.difficulty || "Not specified",
    servings: source?.servings || "Not specified",
    cost: source?.cost || "Not specified",
    ingredients: normalizeList(source?.ingredients),
    steps: normalizeList(source?.steps),
    tags: normalizeList(source?.tags),
    warnings: normalizeList(source?.warnings)
  };
}
