import { getMessages, translateClassLabel } from "../i18n/index.js";
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

    const { prediction, evaluation, ui } = this._state;
    const messages = getMessages(ui.locale);

    this.innerHTML = `
      <section class="control-strip">
        <div class="control-actions">
          <button type="button" class="action-button primary" data-action="reset">${messages.controls.reset}</button>
        </div>
        <div class="summary-pills" aria-label="${messages.controls.modelSummary}">
          <span class="summary-pill">${messages.common.row(prediction.targetRowId)}: <strong>${translateClassLabel(prediction.predictedLabel, ui.locale)}</strong></span>
          <span class="summary-pill">${messages.controls.accuracy}: <strong>${formatPercent(evaluation.accuracy, ui.locale)}</strong></span>
          <span class="summary-pill">${messages.controls.falsePositives}: <strong>${evaluation.falsePositives.length}</strong></span>
          <span class="summary-pill">${messages.controls.falseNegatives}: <strong>${evaluation.falseNegatives.length}</strong></span>
        </div>
      </section>
    `;
  }
}

customElements.define("control-bar", ControlBar);
