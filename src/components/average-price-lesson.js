import { DATASET, getTargetRowId } from "../data/dataset.js";
import { buildAveragePriceModel } from "../domain/average-price-model.js";
import {
  detectInitialLocale,
  getMessages,
  resolveLocale,
  translateClassLabel
} from "../i18n/index.js";
import { formatPrice, formatPricePerM2Value } from "../utils/formatters.js";
import "./dataset-table.js";
import "./hero-qr.js";

class AveragePriceLesson extends HTMLElement {
  constructor() {
    super();
    this.rows = structuredClone(DATASET);
    this.locale = detectInitialLocale();
    this.selectedRowId = getTargetRowId(this.rows);
    this.hasEngineeredFeature = false;
    this.result = null;
    this.notice = "";
    this.handleClick = this.handleClick.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
  }

  connectedCallback() {
    this.addEventListener("click", this.handleClick);
    this.addEventListener("row-select", this.handleRowSelect);
    window.addEventListener("app-locale-change", this.handleLocaleChange);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("row-select", this.handleRowSelect);
    window.removeEventListener("app-locale-change", this.handleLocaleChange);
  }

  getTableState() {
    return {
      dataset: this.rows,
      selectedRow: {
        rowId: this.selectedRowId
      },
      ui: {
        locale: this.locale,
        showPricePerM2: this.hasEngineeredFeature
      }
    };
  }

  handleClick(event) {
    const action = event.target.closest("[data-action]")?.dataset.action;

    if (action === "feature-engineering") {
      this.hasEngineeredFeature = true;
      this.result = null;
      this.notice = "";
      this.render();
      return;
    }

    if (action === "extrapolate") {
      if (!this.hasEngineeredFeature) {
        return;
      }

      try {
        this.result = buildAveragePriceModel(this.rows);
        this.notice = "";
      } catch (error) {
        this.notice = error instanceof Error ? error.message : getMessages(this.locale).status.unknownError;
      }

      this.render();
      return;
    }

    if (action === "clear-estimate") {
      this.result = null;
      this.notice = "";
      this.render();
    }
  }

  handleLocaleChange(event) {
    this.locale = resolveLocale(event.detail?.locale);
    this.render();
  }

  handleRowSelect(event) {
    this.selectedRowId = Number(event.detail.rowId);
    this.render();
  }

  renderSummaryPills(messages) {
    const targetRowId = getTargetRowId(this.rows);
    const knownRowCount = this.rows.filter((row) => !row.isTarget).length;

    return `
      <div class="summary-pills" aria-label="${messages.averageLesson.summaryLabel}">
        <span class="summary-pill">${messages.averageLesson.target}: <strong>${messages.common.row(targetRowId)}</strong></span>
        <span class="summary-pill">${messages.averageLesson.knownRows(knownRowCount)}</span>
        ${
          this.result
            ? `
              <span class="summary-pill">${messages.averageLesson.averagePricePerM2}: <strong>${formatPricePerM2Value(this.result.averagePricePerM2, this.locale)}</strong></span>
              <span class="summary-pill">${messages.averageLesson.verdict}: <strong>${translateClassLabel(this.result.predictedLabel, this.locale)}</strong></span>
            `
            : `<span class="summary-pill">${this.hasEngineeredFeature ? messages.averageLesson.featureReady : messages.averageLesson.featureMissing}</span>`
        }
      </div>
    `;
  }

  renderResult(messages) {
    if (!this.result) {
      return `
        <section class="subpanel lesson-result-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">${messages.averageLesson.resultTitle}</p>
              <h2>${messages.averageLesson.placeholderTitle}</h2>
            </div>
          </div>
          <div class="muted-panel lesson-placeholder" aria-live="polite">
            <p class="empty-copy">${
              this.hasEngineeredFeature
                ? messages.averageLesson.placeholderCopy
                : messages.averageLesson.featurePlaceholderCopy
            }</p>
          </div>
        </section>
      `;
    }

    const label = translateClassLabel(this.result.predictedLabel, this.locale);
    const averagePricePerM2 = formatPricePerM2Value(this.result.averagePricePerM2, this.locale);
    const targetSize = messages.common.sizeValue(this.result.targetSize);
    const estimatedPrice = formatPrice(this.result.estimatedPrice, this.locale);
    const threshold = formatPrice(this.result.threshold, this.locale);

    return `
      <section class="subpanel lesson-result-panel" aria-live="polite">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">${messages.averageLesson.resultTitle}</p>
            <h2>${messages.averageLesson.predictedAs(this.result.targetRowId, label)}</h2>
          </div>
        </div>

        <div class="result-stack">
          <div class="calculation-card">
            <p class="metric-label">${messages.averageLesson.calculation}</p>
            <p class="formula-line">${messages.averageLesson.formula(averagePricePerM2, targetSize, estimatedPrice)}</p>
          </div>

          <div class="result-metric-grid">
            <div class="metric-card">
              <p class="metric-label">${messages.averageLesson.averagePricePerM2}</p>
              <p class="metric-value">${averagePricePerM2}</p>
            </div>
            <div class="metric-card">
              <p class="metric-label">${messages.averageLesson.targetSize}</p>
              <p class="metric-value">${targetSize}</p>
            </div>
            <div class="metric-card">
              <p class="metric-label">${messages.averageLesson.estimatedPrice}</p>
              <p class="metric-value">${estimatedPrice}</p>
            </div>
          </div>

          <p class="inline-hint">${messages.averageLesson.modelNote}</p>

          <div class="verdict-card is-${this.result.predictedLabel.toLowerCase()}">
            <p class="metric-label">${messages.averageLesson.verdict}</p>
            <p class="verdict-value">${label}</p>
            <p class="detail-copy">${messages.averageLesson.thresholdRule(threshold)}</p>
          </div>
        </div>
      </section>
    `;
  }

  renderActionHint(messages) {
    return this.hasEngineeredFeature ? messages.averageLesson.extrapolateHint : messages.averageLesson.engineeringHint;
  }

  render() {
    const messages = getMessages(this.locale);

    document.documentElement.lang = this.locale;

    this.innerHTML = `
      <div class="page-shell">
        <header class="hero">
          <div class="hero-head">
            <div class="hero-title-block">
              <p class="eyebrow">${messages.averageLesson.eyebrow}</p>
              <h1>${messages.averageLesson.title}</h1>
            </div>
            <hero-qr locale="${this.locale}"></hero-qr>
          </div>
          <p class="hero-copy">${messages.averageLesson.copy}</p>
        </header>

        <section class="control-strip">
          <div class="control-actions">
          </div>
          ${this.renderSummaryPills(messages)}
        </section>

        ${this.notice ? `<p class="status-banner" role="status">${this.notice}</p>` : ""}

        <main class="lesson-grid">
          <section class="panel lesson-dataset-panel">
            <dataset-table></dataset-table>
            <section class="subpanel lesson-action-panel">
              <div class="lesson-action-row">
                <div class="lesson-action-copy">
                  <p class="eyebrow">${messages.averageLesson.actionEyebrow}</p>
                  <p class="inline-hint">${this.renderActionHint(messages)}</p>
                </div>
                <div class="lesson-action-buttons">
                  <button
                    type="button"
                    class="action-button ${this.hasEngineeredFeature ? "" : "primary"}"
                    data-action="feature-engineering"
                    ${this.hasEngineeredFeature ? "disabled" : ""}
                  >
                    ${this.hasEngineeredFeature ? messages.averageLesson.featureReady : messages.averageLesson.featureEngineering}
                  </button>
                  <button
                    type="button"
                    class="action-button primary extrapolate-button"
                    data-action="extrapolate"
                    ${this.hasEngineeredFeature ? "" : "disabled"}
                  >
                    ${messages.averageLesson.extrapolate}
                  </button>
                  ${
                    this.result
                      ? `<button type="button" class="action-button" data-action="clear-estimate">${messages.averageLesson.clear}</button>`
                      : ""
                  }
                </div>
              </div>
            </section>
          </section>

          <section class="panel lesson-result-shell">
            ${this.renderResult(messages)}
          </section>
        </main>
      </div>
    `;

    this.querySelector("dataset-table").state = this.getTableState();
  }
}

customElements.define("average-price-lesson", AveragePriceLesson);
