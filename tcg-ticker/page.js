"use strict";

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.classList.toggle("is-open", open);
  nav.classList.toggle("is-open", open);
}
toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});
window.matchMedia("(min-width: 721px)").addEventListener("change", () => setMenu(false));
document.querySelector("#year").textContent = new Date().getFullYear();
