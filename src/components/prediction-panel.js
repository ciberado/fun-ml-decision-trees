import { getMessages, translateClassLabel } from "../i18n/index.js";
import { describeFallback, formatCondition } from "../utils/formatters.js";
import "./row-ball-layer.js";

class PredictionPanel extends HTMLElement {
  set state(value) {
    this._state = value;
    this.render();
  }

  render() {
    if (!this._state) {
      return;
    }

    const { dataset, prediction, selectedRow, ui } = this._state;
    const messages = getMessages(ui.locale);
    const rowsById = Object.fromEntries(dataset.map((row) => [row.id, row]));
    const targetLeafRows = prediction.leafRowIds.map((rowId) => rowsById[rowId]);
    const selectedLeafRows = selectedRow.leafRowIds.map((rowId) => rowsById[rowId]);

    this.innerHTML = `
      <section class="subpanel highlight-panel">
        <p class="eyebrow">${messages.prediction.title}</p>
        <h2>${messages.prediction.currentPrediction(prediction.targetRowId, translateClassLabel(prediction.predictedLabel, ui.locale))}</h2>
        <p class="detail-copy">
          ${messages.prediction.path}: ${prediction.path.map((step) => formatCondition(step.condition, ui.locale)).join(" -> ")} -> ${messages.common.leaf(prediction.predictedLeafId)}
        </p>
        <p class="detail-copy">${describeFallback(prediction.fallbackReason, ui.locale)}</p>
        <div class="member-block">
          <p class="member-heading">${messages.prediction.sameLeafAsTarget(prediction.targetRowId)}</p>
          <row-ball-layer data-slot="target"></row-ball-layer>
        </div>
      </section>

      <section class="subpanel">
        <p class="eyebrow">${messages.prediction.selectedRow}</p>
        <h2>${messages.prediction.selectedRowLeaf(selectedRow.rowId, selectedRow.leafId)}</h2>
        <p class="detail-copy">
          ${messages.prediction.pathSummary}: ${selectedRow.path.map((step) => formatCondition(step.condition, ui.locale)).join(" -> ")} -> ${messages.common.leaf(selectedRow.leafId)}
        </p>
        <p class="detail-copy">
          ${messages.prediction.leafPrediction}: <strong>${translateClassLabel(selectedRow.leafPrediction, ui.locale)}</strong>
        </p>
        <p class="detail-copy">${describeFallback(selectedRow.fallbackReason, ui.locale)}</p>
        <div class="member-block">
          <p class="member-heading">${messages.prediction.sameSelectedLeaf}</p>
          <row-ball-layer data-slot="selected"></row-ball-layer>
        </div>
      </section>
    `;

    const targetLayer = this.querySelector('[data-slot="target"]');
    targetLayer.rows = targetLeafRows;
    targetLayer.selectedRowId = this._state.selectedRow.rowId;
    targetLayer.locale = ui.locale;

    const selectedLayer = this.querySelector('[data-slot="selected"]');
    selectedLayer.rows = selectedLeafRows;
    selectedLayer.selectedRowId = this._state.selectedRow.rowId;
    selectedLayer.locale = ui.locale;
  }
}

customElements.define("prediction-panel", PredictionPanel);
