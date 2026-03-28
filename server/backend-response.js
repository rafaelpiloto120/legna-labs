"use strict";

const { normalizeBackendError } = require("./errors");

function normalizeBackendSuccess(payload) {
  if (
    payload &&
    typeof payload === "object" &&
    (payload.ok === false || payload.success === false || payload.error)
  ) {
    return normalizeBackendError(422, payload);
  }

  const recipeSource = findRecipeCandidate(payload);
  const recipe = buildRecipe(recipeSource || payload);

  if (!recipe || !recipe.ingredients.length || !recipe.steps.length) {
    return normalizeBackendError(422, payload);
  }

  return {
    ok: true,
    recipe,
    raw: payload
  };
}

function buildRecipe(source) {
  if (!source || typeof source !== "object") {
    return null;
  }

  const title = firstString(source, [
    "title",
    "name",
    "recipeTitle",
    "recipe_name",
    "recipeName"
  ]);

  const ingredients = normalizeList(source.ingredients || source.ingredientLines || source.items);
  const steps = normalizeList(
    source.steps || source.instructions || source.method || source.directions
  );

  if (!title && !ingredients.length && !steps.length) {
    return null;
  }

  return {
    title: title || "Untitled recipe draft",
    cookingTime:
      firstString(source, [
        "cookingTime",
        "cookTime",
        "totalTime",
        "duration",
        "time"
      ]) || "Not specified",
    difficulty:
      firstString(source, ["difficulty", "skillLevel", "level"]) || "Not specified",
    servings:
      firstString(source, ["servings", "yield", "serves", "portionCount"]) || "Not specified",
    cost: firstString(source, ["cost", "estimatedCost", "budget"]) || "Not specified",
    ingredients,
    steps,
    tags: normalizeList(source.tags || source.labels || source.categories),
    warnings: normalizeList(source.warnings || source.notes || source.alerts)
  };
}

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
            JSON.stringify(item)
          )
            .trim()
            .replace(/^"|"$/g, "");
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

function firstString(source, keys) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
}

function findRecipeCandidate(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const directCandidates = [
    payload.recipe,
    payload.recipeDraft,
    payload.draft,
    payload.data,
    payload.result,
    payload.output
  ];

  for (const candidate of directCandidates) {
    if (candidate && typeof candidate === "object") {
      const built = buildRecipe(candidate);
      if (built) {
        return candidate;
      }
    }
  }

  const stack = [payload];

  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;

    const built = buildRecipe(current);
    if (built) {
      return current;
    }

    for (const value of Object.values(current)) {
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }

  return null;
}

module.exports = {
  normalizeBackendSuccess
};
