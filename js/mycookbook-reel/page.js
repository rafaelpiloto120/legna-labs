import { fetchPublicConfig, generateRecipeDraft } from "./api.js";
import { openMyCookbookApp } from "./app-link.js";
import { validateInstagramReelUrl } from "./instagram.js";
import { parseRecipeResponse } from "./parsing.js";

const form = document.querySelector("[data-reel-form]");
const urlInput = document.querySelector("[data-reel-url]");
const inlineError = document.querySelector("[data-inline-error]");
const statusMessage = document.querySelector("[data-status-message]");
const resultEmpty = document.querySelector("[data-result-empty]");
const resultCard = document.querySelector("[data-result-card]");
const rateNote = document.querySelector("[data-rate-note]");
const addToAppButton = document.querySelector("[data-open-app]");
const copyIngredientsButton = document.querySelector("[data-copy-ingredients]");
const copyStepsButton = document.querySelector("[data-copy-steps]");
const captchaShell = document.querySelector("[data-captcha-shell]");
const captchaContainer = document.querySelector("[data-captcha-container]");
const captchaNote = document.querySelector("[data-captcha-note]");

const resultFields = {
  title: document.querySelector("[data-field='title']"),
  cookingTime: document.querySelector("[data-field='cookingTime']"),
  difficulty: document.querySelector("[data-field='difficulty']"),
  servings: document.querySelector("[data-field='servings']"),
  cost: document.querySelector("[data-field='cost']"),
  ingredients: document.querySelector("[data-field='ingredients']"),
  steps: document.querySelector("[data-field='steps']"),
  tags: document.querySelector("[data-field='tags']"),
  warnings: document.querySelector("[data-field='warnings']")
};

let latestRecipe = null;
let captchaConfig = { enabled: false, provider: "", siteKey: "" };
let captchaReady = false;

initialize();

async function initialize() {
  if (!form || !urlInput) return;

  window.__mycookbookCaptchaToken = "";

  urlInput.addEventListener("input", handleInlineValidation);
  form.addEventListener("submit", handleSubmit);
  addToAppButton?.addEventListener("click", () => {
    if (latestRecipe) {
      openMyCookbookApp(latestRecipe, urlInput.value.trim());
    }
  });
  copyIngredientsButton?.addEventListener("click", () =>
    copyList(latestRecipe?.ingredients || [], "Ingredients copied.")
  );
  copyStepsButton?.addEventListener("click", () =>
    copyList(latestRecipe?.steps || [], "Steps copied.")
  );

  const publicConfig = await fetchPublicConfig();
  captchaConfig = publicConfig.captcha || captchaConfig;

  if (captchaConfig.enabled) {
    await mountCaptcha(captchaConfig);
  } else if (captchaNote) {
    captchaNote.textContent = "Basic rate limiting is enabled. Captcha can be turned on in server config.";
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const validation = validateInstagramReelUrl(urlInput.value);

  if (!validation.isValid) {
    showInlineError(validation.message);
    return;
  }

  if (captchaConfig.enabled && !window.__mycookbookCaptchaToken) {
    showInlineError("Please complete the verification check before generating a recipe draft.");
    return;
  }

  setLoading(true);
  clearInlineError();
  showStatus("Generating your recipe draft...");
  hideResult();

  const response = await generateRecipeDraft({
    url: validation.normalizedUrl,
    language: getBrowserLanguage()
  });

  setLoading(false);
  updateRateLimit(response.rateLimit);

  if (!response.ok) {
    showStatus(response.error.message, true);
    if (captchaConfig.enabled && window.turnstile && captchaContainer?.dataset.widgetId) {
      window.__mycookbookCaptchaToken = "";
      window.turnstile.reset(captchaContainer.dataset.widgetId);
    }
    return;
  }

  latestRecipe = parseRecipeResponse(response.recipe);
  renderRecipe(latestRecipe);
  showStatus(
    "Recipe draft ready. Review it carefully before cooking, then add it to MyCookbook AI."
  );
}

function handleInlineValidation() {
  const value = urlInput.value.trim();
  if (!value) {
    clearInlineError();
    return;
  }

  const validation = validateInstagramReelUrl(value);
  if (!validation.isValid) {
    showInlineError(validation.message);
    return;
  }

  clearInlineError();
}

function renderRecipe(recipe) {
  showResult();
  resultFields.title.textContent = recipe.title;
  resultFields.cookingTime.textContent = recipe.cookingTime;
  resultFields.difficulty.textContent = recipe.difficulty;
  resultFields.servings.textContent = recipe.servings;
  resultFields.cost.textContent = recipe.cost;
  renderList(resultFields.ingredients, recipe.ingredients);
  renderList(resultFields.steps, recipe.steps, true);
  renderTagList(resultFields.tags, recipe.tags, "No tags returned");
  renderTagList(resultFields.warnings, recipe.warnings, "No warnings returned");
}

function renderList(container, items, ordered = false) {
  container.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "Not provided";
    container.appendChild(li);
    return;
  }

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = ordered ? item : item;
    container.appendChild(li);
  });
}

function renderTagList(container, items, emptyText) {
  container.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = emptyText;
    container.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

function showInlineError(message) {
  inlineError.textContent = message;
  inlineError.hidden = false;
}

function clearInlineError() {
  inlineError.textContent = "";
  inlineError.hidden = true;
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.dataset.state = isError ? "error" : "default";
}

function hideResult() {
  resultCard.hidden = true;
  resultEmpty.hidden = false;
}

function showResult() {
  resultCard.hidden = false;
  resultEmpty.hidden = true;
}

function setLoading(isLoading) {
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = isLoading || (captchaConfig.enabled && !captchaReady);
  submitButton.textContent = isLoading ? "Generating..." : "Generate recipe draft";
}

function getBrowserLanguage() {
  const locale = (navigator.language || "en").toLowerCase();
  const [language] = locale.split("-");
  return language || "en";
}

function updateRateLimit(rateLimit) {
  if (!rateLimit || rateLimit.remaining == null || rateLimit.limit == null) {
    rateNote.textContent = "Daily limit: 5 recipe drafts per visitor.";
    return;
  }

  rateNote.textContent = `${rateLimit.remaining} of ${rateLimit.limit} recipe drafts remaining today.`;
}

async function copyList(items, successMessage) {
  if (!items.length) return;

  const text = items.join("\n");
  try {
    await navigator.clipboard.writeText(text);
    showStatus(successMessage);
  } catch (_error) {
    showStatus("Copy wasn’t available in this browser.", true);
  }
}

async function mountCaptcha(config) {
  if (!captchaShell || !captchaContainer || !config.siteKey) {
    return;
  }

  captchaShell.hidden = false;
  captchaNote.textContent = "Verification helps us protect this public tool from abuse.";
  await loadTurnstileScript();

  if (!window.turnstile) {
    captchaNote.textContent = "Verification could not be loaded. Please refresh and try again.";
    return;
  }

  const widgetId = window.turnstile.render(captchaContainer, {
    sitekey: config.siteKey,
    theme: "light",
    callback(token) {
      window.__mycookbookCaptchaToken = token;
      captchaReady = true;
      clearInlineError();
      setLoading(false);
    },
    "expired-callback"() {
      window.__mycookbookCaptchaToken = "";
      captchaReady = false;
      setLoading(false);
    },
    "error-callback"() {
      window.__mycookbookCaptchaToken = "";
      captchaReady = false;
      showStatus("Verification could not be completed. Please refresh and try again.", true);
      setLoading(false);
    }
  });

  captchaContainer.dataset.widgetId = String(widgetId);
  captchaReady = false;
  setLoading(false);
}

function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (window.__turnstileLoaderPromise) {
    return window.__turnstileLoaderPromise;
  }

  window.__turnstileLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.__turnstileLoaderPromise;
}
