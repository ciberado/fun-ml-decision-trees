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
import "./hero-qr.js";
import "./tree-editor.js";

const EVENT_NAMES = [
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
    this.handleEvent = this.handleEvent.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
  }

  connectedCallback() {
    for (const eventName of EVENT_NAMES) {
      this.addEventListener(eventName, this.handleEvent);
    }

    window.addEventListener("app-locale-change", this.handleLocaleChange);
    this.render();
  }

  disconnectedCallback() {
    for (const eventName of EVENT_NAMES) {
      this.removeEventListener(eventName, this.handleEvent);
    }

    window.removeEventListener("app-locale-change", this.handleLocaleChange);
  }

  updateControlBar(state) {
    const controlBar = this.querySelector("control-bar");

    if (controlBar) {
      controlBar.state = state;
    }
  }

  handleLocaleChange(event) {
    this.state = setLocale(this.state, event.detail?.locale);
    this.notice = "";
    this.render();
  }

  handleEvent(event) {
    try {
      switch (event.type) {
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

    document.documentElement.lang = this.state.ui.locale;

    this.innerHTML = `
      <div class="page-shell">
        <header class="hero">
          <div class="hero-head">
            <div class="hero-title-block">
              <p class="eyebrow">${messages.hero.eyebrow}</p>
              <h1>${messages.hero.title(targetRowId)}</h1>
            </div>
            <hero-qr locale="${this.state.ui.locale}"></hero-qr>
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

      </div>
    `;

    this.updateControlBar(this.state);
    this.querySelector("dataset-table").state = this.state;
    this.querySelector("tree-editor").state = this.state;
  }
}

customElements.define("app-root", AppRoot);
