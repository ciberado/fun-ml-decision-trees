import {
  detectInitialLocale,
  getMessages,
  resolveLocale
} from "../i18n/index.js";
import "./hero-qr.js";
import "./site-nav.js";

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.locale = detectInitialLocale();
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
  }

  connectedCallback() {
    window.addEventListener("app-locale-change", this.handleLocaleChange);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("app-locale-change", this.handleLocaleChange);
  }

  handleLocaleChange(event) {
    this.locale = resolveLocale(event.detail?.locale);
    this.render();
  }

  render() {
    const messages = getMessages(this.locale);

    document.documentElement.lang = this.locale;

    this.innerHTML = `
      <site-nav locale="${this.locale}"></site-nav>
      <div class="home-shell">
        <header class="home-hero">
          <div class="hero-head">
            <div class="home-hero-copy">
              <p class="eyebrow">${messages.home.eyebrow}</p>
              <h1>${messages.home.title}</h1>
            </div>
            <hero-qr locale="${this.locale}"></hero-qr>
          </div>
          <p>${messages.home.copy}</p>
        </header>

        <main class="home-main">
          <section class="home-intro">
            <h2>${messages.home.valueTitle}</h2>
            <p>${messages.home.valueCopy}</p>
          </section>

          <section class="home-card-grid" aria-label="${messages.home.conceptsTitle}">
            ${messages.home.concepts
              .map(
                (concept) => `
                  <article class="home-card">
                    <p class="home-card-kicker">${concept.kicker}</p>
                    <h3>${concept.title}</h3>
                    <p>${concept.copy}</p>
                  </article>
                `
              )
              .join("")}
          </section>

          <section class="home-lesson-list" aria-label="${messages.home.lessonsTitle}">
            <div class="home-section-heading">
              <p class="eyebrow">${messages.home.lessonsEyebrow}</p>
              <h2>${messages.home.lessonsTitle}</h2>
            </div>
            ${messages.home.lessons
              .map(
                (lesson) => `
                  <a class="home-lesson-link" href="${lesson.href}">
                    <span>${lesson.label}</span>
                    <strong>${lesson.title}</strong>
                    <small>${lesson.copy}</small>
                  </a>
                `
              )
              .join("")}
          </section>
        </main>
      </div>
    `;
  }
}

customElements.define("home-page", HomePage);
