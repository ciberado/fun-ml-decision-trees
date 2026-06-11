import {
  detectInitialLocale,
  getMessages,
  LOCALE_OPTIONS,
  resolveLocale,
  storeLocale
} from "../i18n/index.js";

const LINKS = [
  { key: "home", href: "./index.html" },
  { key: "average", href: "./lesson-average-price.html" },
  { key: "decisionTree", href: "./lesson-decision-tree.html" },
  { key: "trainedTree", href: "./lesson-trained-tree.html" }
];

function getCurrentPath() {
  return window.location.pathname.split("/").pop() || "index.html";
}

class SiteNav extends HTMLElement {
  constructor() {
    super();
    this.locale = resolveLocale(this.getAttribute("locale") ?? detectInitialLocale());
    this.handleChange = this.handleChange.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
  }

  connectedCallback() {
    this.addEventListener("change", this.handleChange);
    window.addEventListener("app-locale-change", this.handleLocaleChange);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.handleChange);
    window.removeEventListener("app-locale-change", this.handleLocaleChange);
  }

  handleChange(event) {
    const localeSelect = event.target.closest("[data-site-locale-select]");

    if (!localeSelect) {
      return;
    }

    this.locale = storeLocale(localeSelect.value);
    window.dispatchEvent(new CustomEvent("app-locale-change", { detail: { locale: this.locale } }));
    this.render();
  }

  handleLocaleChange(event) {
    this.locale = storeLocale(event.detail?.locale);
    this.render();
  }

  render() {
    const messages = getMessages(this.locale);
    const currentPath = getCurrentPath();

    this.innerHTML = `
      <nav class="site-nav" aria-label="${messages.navigation.label}">
        <a class="site-nav-brand" href="./index.html">${messages.navigation.brand}</a>
        <div class="site-nav-links">
          ${LINKS.map((link) => {
            const hrefPath = link.href.replace("./", "");
            const isCurrent = hrefPath === currentPath;

            return `
              <a class="site-nav-link ${isCurrent ? "is-current" : ""}" href="${link.href}" ${
                isCurrent ? 'aria-current="page"' : ""
              }>${messages.navigation.links[link.key]}</a>
            `;
          }).join("")}
        </div>
        <label class="locale-picker site-locale-picker">
          <span class="locale-picker-label">${messages.controls.language}</span>
          <select
            class="locale-select"
            data-site-locale-select
            aria-label="${messages.controls.language}"
          >
            ${LOCALE_OPTIONS.map(
              (option) =>
                `<option value="${option.value}" ${option.value === this.locale ? "selected" : ""}>${option.label}</option>`
            ).join("")}
          </select>
        </label>
      </nav>
    `;
  }
}

customElements.define("site-nav", SiteNav);
