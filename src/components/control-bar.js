import { formatPercent } from "../utils/formatters.js";

class ControlBar extends HTMLElement {
  set state(value) {
    this._state = value;
    this.render();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;

      if (action !== "reset") {
        return;
      }

      this.dispatchEvent(
        new CustomEvent("reset-tree", {
          bubbles: true
        })
      );
    });

    this.render();
  }

  render() {
    if (!this._state) {
      return;
    }

    const { prediction, evaluation } = this._state;

    this.innerHTML = `
      <section class="control-strip">
        <div class="control-actions">
          <button type="button" class="action-button primary" data-action="reset">Reset To Starter Tree</button>
        </div>
        <div class="summary-pills" aria-label="Model summary">
          <span class="summary-pill">Row ${prediction.targetRowId}: <strong>${prediction.predictedLabel}</strong></span>
          <span class="summary-pill">Accuracy: <strong>${formatPercent(evaluation.accuracy)}</strong></span>
          <span class="summary-pill">False Positives: <strong>${evaluation.falsePositives.length}</strong></span>
          <span class="summary-pill">False Negatives: <strong>${evaluation.falseNegatives.length}</strong></span>
        </div>
      </section>
    `;
  }
}

customElements.define("control-bar", ControlBar);
