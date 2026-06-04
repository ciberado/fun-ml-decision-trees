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

    const { dataset, prediction, selectedRow } = this._state;
    const rowsById = Object.fromEntries(dataset.map((row) => [row.id, row]));
    const targetLeafRows = prediction.leafRowIds.map((rowId) => rowsById[rowId]);
    const selectedLeafRows = selectedRow.leafRowIds.map((rowId) => rowsById[rowId]);

    this.innerHTML = `
      <section class="subpanel highlight-panel">
        <p class="eyebrow">Prediction</p>
        <h2>Row ${prediction.targetRowId} is currently predicted as ${prediction.predictedLabel}</h2>
        <p class="detail-copy">
          Path: ${prediction.path.map((step) => formatCondition(step.condition)).join(" -> ")} -> Leaf ${prediction.predictedLeafId}
        </p>
        <p class="detail-copy">${describeFallback(prediction.fallbackReason)}</p>
        <div class="member-block">
          <p class="member-heading">Rows in the same leaf as row ${prediction.targetRowId}</p>
          <row-ball-layer data-slot="target"></row-ball-layer>
        </div>
      </section>

      <section class="subpanel">
        <p class="eyebrow">Selected Row</p>
        <h2>Row ${selectedRow.rowId} lands in ${selectedRow.leafId}</h2>
        <p class="detail-copy">
          Path summary: ${selectedRow.path.map((step) => formatCondition(step.condition)).join(" -> ")} -> Leaf ${selectedRow.leafId}
        </p>
        <p class="detail-copy">
          Leaf prediction: <strong>${selectedRow.leafPrediction}</strong>
        </p>
        <p class="detail-copy">${describeFallback(selectedRow.fallbackReason)}</p>
        <div class="member-block">
          <p class="member-heading">Rows sharing the selected leaf</p>
          <row-ball-layer data-slot="selected"></row-ball-layer>
        </div>
      </section>
    `;

    const targetLayer = this.querySelector('[data-slot="target"]');
    targetLayer.rows = targetLeafRows;
    targetLayer.selectedRowId = this._state.selectedRow.rowId;

    const selectedLayer = this.querySelector('[data-slot="selected"]');
    selectedLayer.rows = selectedLeafRows;
    selectedLayer.selectedRowId = this._state.selectedRow.rowId;
  }
}

customElements.define("prediction-panel", PredictionPanel);
