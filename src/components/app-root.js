import {
  addSplitAtLeaf,
  createInitialState,
  playSplitNode,
  previewNodeCondition,
  removeSplitNode,
  resetTree,
  selectRow,
  setLocale,
  updateNodeCondition
} from "../state/app-state.js";
import { getMessages } from "../i18n/index.js";
import "./control-bar.js";
import "./dataset-table.js";
import "./tree-editor.js";

const QR_CODE_URL =
  "https://quickchart.io/qr?text=https%3A%2F%2Fciberado.github.io%2Ffun-ml-decision-trees%2F&size=400";

const EVENT_NAMES = [
  "locale-change",
  "row-select",
  "reset-tree",
  "preview-condition",
  "condition-edit",
  "add-split",
  "play-node",
  "remove-split"
];

class AppRoot extends HTMLElement {
  constructor() {
    super();
    this.state = createInitialState();
    this.notice = "";
    this.isQrModalOpen = false;
    this.handleEvent = this.handleEvent.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  connectedCallback() {
    for (const eventName of EVENT_NAMES) {
      this.addEventListener(eventName, this.handleEvent);
    }

    this.addEventListener("click", this.handleClick);
    window.addEventListener("keydown", this.handleKeydown);
    this.render();
  }

  disconnectedCallback() {
    for (const eventName of EVENT_NAMES) {
      this.removeEventListener(eventName, this.handleEvent);
    }

    this.removeEventListener("click", this.handleClick);
    window.removeEventListener("keydown", this.handleKeydown);
  }

  updateControlBar(state) {
    const controlBar = this.querySelector("control-bar");

    if (controlBar) {
      controlBar.state = state;
    }
  }

  handleClick(event) {
    const qrToggle = event.target.closest("[data-qr-toggle]");
    const qrClose = event.target.closest("[data-qr-close]");

    if (qrToggle) {
      this.isQrModalOpen = true;
      this.render();
      return;
    }

    if (this.isQrModalOpen && qrClose) {
      this.isQrModalOpen = false;
      this.render();
    }
  }

  handleKeydown() {
    if (!this.isQrModalOpen) {
      return;
    }

    this.isQrModalOpen = false;
    this.render();
  }

  handleEvent(event) {
    try {
      switch (event.type) {
        case "locale-change":
          this.state = setLocale(this.state, event.detail.locale);
          break;
        case "row-select":
          this.state = selectRow(this.state, event.detail.rowId);
          break;
        case "reset-tree":
          this.state = resetTree(this.state);
          break;
        case "preview-condition":
          this.updateControlBar(
            previewNodeCondition(this.state, event.detail.nodeId, {
              [event.detail.field]: event.detail.value
            })
          );
          return;
        case "condition-edit":
          this.state = updateNodeCondition(this.state, event.detail.nodeId, {
            [event.detail.field]: event.detail.value
          });
          break;
        case "add-split":
          this.state = addSplitAtLeaf(this.state, event.detail.leafId);
          break;
        case "play-node":
          this.state = playSplitNode(this.state, event.detail.nodeId);
          break;
        case "remove-split":
          this.state = removeSplitNode(this.state, event.detail.nodeId);
          break;
        default:
          return;
      }

      this.notice = "";
      this.render();
    } catch (error) {
      this.notice =
        error instanceof Error ? error.message : getMessages(this.state.ui.locale).status.unknownError;
      this.render();
    }
  }

  render() {
    const targetRowId = this.state.prediction.targetRowId;
    const messages = getMessages(this.state.ui.locale);

    this.innerHTML = `
      <div class="page-shell">
        <header class="hero">
          <div class="hero-head">
            <div class="hero-title-block">
              <p class="eyebrow">${messages.hero.eyebrow}</p>
              <h1>${messages.hero.title(targetRowId)}</h1>
            </div>
            <button
              type="button"
              class="hero-qr-button"
              data-qr-toggle
              aria-label="${messages.hero.qrButtonLabel}"
              title="${messages.hero.qrButtonLabel}"
            >
              <img class="hero-qr-image" src="${QR_CODE_URL}" alt="${messages.hero.qrAlt}">
            </button>
          </div>
          <p class="hero-copy">${messages.hero.copy}</p>
        </header>

        <control-bar></control-bar>

        ${this.notice ? `<p class="status-banner" role="status">${this.notice}</p>` : ""}

        <main class="layout-grid">
          <section class="panel panel-left">
            <dataset-table></dataset-table>
          </section>

          <section class="panel panel-center">
            <tree-editor></tree-editor>
          </section>
        </main>

        ${
          this.isQrModalOpen
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
      </div>
    `;

    this.updateControlBar(this.state);
    this.querySelector("dataset-table").state = this.state;
    this.querySelector("tree-editor").state = this.state;
  }
}

customElements.define("app-root", AppRoot);
