import { formatPercent } from "../utils/formatters.js";

class ControlBar extends HTMLElement {
  set state(value) {
    this._state = value;
    this.render();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;

      if (!action) {
        return;
      }

      const eventMap = {
        reset: "reset-tree",
        recompute: "recompute-tree",
        evaluation: "toggle-evaluation"
      };

      this.dispatchEvent(
        new CustomEvent(eventMap[action], {
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

    const { prediction, evaluation, ui } = this._state;

    this.innerHTML = `
      <section class="control-strip">
        <div class="control-actions">
          <button type="button" class="action-button primary" data-action="reset">Reset To Starter Tree</button>
          <button type="button" class="action-button" data-action="recompute">Recompute</button>
          <button type="button" class="action-button" data-action="evaluation">
            ${ui.showEvaluation ? "Hide" : "Show"} Evaluation
          </button>
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
