import { getMessages, resolveLocale } from "../i18n/index.js";

const QR_CODE_URL =
  "https://quickchart.io/qr?text=https%3A%2F%2Fciberado.github.io%2Ffun-ml-decision-trees%2F&size=400";

class HeroQr extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  static get observedAttributes() {
    return ["locale"];
  }

  connectedCallback() {
    this.addEventListener("click", this.handleClick);
    window.addEventListener("keydown", this.handleKeydown);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    window.removeEventListener("keydown", this.handleKeydown);
  }

  attributeChangedCallback() {
    this.render();
  }

  handleClick(event) {
    const qrToggle = event.target.closest("[data-qr-toggle]");
    const qrClose = event.target.closest("[data-qr-close]");

    if (qrToggle) {
      this.isOpen = true;
      this.render();
      return;
    }

    if (this.isOpen && qrClose) {
      this.isOpen = false;
      this.render();
    }
  }

  handleKeydown() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.render();
  }

  render() {
    if (!this.isConnected) {
      return;
    }

    const locale = resolveLocale(this.getAttribute("locale"));
    const messages = getMessages(locale);

    this.innerHTML = `
      <button
        type="button"
        class="hero-qr-button"
        data-qr-toggle
        aria-label="${messages.hero.qrButtonLabel}"
        title="${messages.hero.qrButtonLabel}"
      >
        <img class="hero-qr-image" src="${QR_CODE_URL}" alt="${messages.hero.qrAlt}">
      </button>
      ${
        this.isOpen
          ? `
            <div class="modal-overlay" data-qr-close role="presentation">
              <div
                class="modal-card modal-card-image"
                role="dialog"
                aria-modal="true"
                aria-label="${messages.hero.qrDialogLabel}"
                data-qr-close
              >
                <img class="modal-qr-image" src="${QR_CODE_URL}" alt="${messages.hero.qrAlt}" data-qr-close>
              </div>
            </div>
          `
          : ""
      }
    `;
  }
}

customElements.define("hero-qr", HeroQr);
