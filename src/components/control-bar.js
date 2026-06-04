import { getMessages, LOCALE_OPTIONS, translateClassLabel } from "../i18n/index.js";
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

    this.addEventListener("change", (event) => {
      const localeSelect = event.target.closest("[data-locale-select]");

      if (!localeSelect) {
        return;
      }

      this.dispatchEvent(
        new CustomEvent("locale-change", {
          bubbles: true,
          detail: {
            locale: localeSelect.value
          }
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
          <label class="locale-picker">
            <span class="locale-picker-label">${messages.controls.language}</span>
            <select class="locale-select" data-locale-select aria-label="${messages.controls.language}">
              ${LOCALE_OPTIONS.map(
                (option) =>
                  `<option value="${option.value}" ${option.value === ui.locale ? "selected" : ""}>${option.label}</option>`
              ).join("")}
            </select>
          </label>
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
