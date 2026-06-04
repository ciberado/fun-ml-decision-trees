import { getMessages } from "../i18n/index.js";
import { formatPercent } from "../utils/formatters.js";

function renderRowList(rowIds, locale) {
  const messages = getMessages(locale);

  if (rowIds.length === 0) {
    return `<span class="empty-copy">${messages.common.none}</span>`;
  }

  return rowIds.map((rowId) => `<span class="tiny-pill">${messages.common.row(rowId)}</span>`).join("");
}

class EvaluationPanel extends HTMLElement {
  set state(value) {
    this._state = value;
    this.render();
  }

  render() {
    if (!this._state) {
      return;
    }

    const { dataset, evaluation, ui } = this._state;
    const messages = getMessages(ui.locale);
    const knownRowIds = dataset.filter((row) => !row.isTarget).map((row) => row.id);

    this.innerHTML = `
      <section class="subpanel">
        <p class="eyebrow">${messages.evaluation.title}</p>
        <h2>${messages.evaluation.summary(knownRowIds[0], knownRowIds[knownRowIds.length - 1])}</h2>

        <div class="metric-grid">
          <article class="metric-card">
            <p class="metric-label">${messages.controls.accuracy}</p>
            <p class="metric-value">${formatPercent(evaluation.accuracy, ui.locale)}</p>
            <p class="metric-baseline">${messages.evaluation.starterBaseline}: ${formatPercent(evaluation.baselineAccuracy, ui.locale)}</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">${messages.controls.falsePositives}</p>
            <p class="metric-value">${evaluation.falsePositives.length}</p>
            <p class="metric-baseline">${messages.evaluation.starterBaseline}: ${evaluation.baselineFalsePositives.length}</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">${messages.controls.falseNegatives}</p>
            <p class="metric-value">${evaluation.falseNegatives.length}</p>
            <p class="metric-baseline">${messages.evaluation.starterBaseline}: ${evaluation.baselineFalseNegatives.length}</p>
          </article>
        </div>

        <div class="warning-stack">
          ${
            evaluation.hasAccuracyWarning
              ? `<p class="warning-note">${messages.evaluation.lowerAccuracyWarning}</p>`
              : ""
          }
          ${
            evaluation.hasFalsePositiveWarning
              ? `<p class="warning-note">${messages.evaluation.falsePositiveWarning}</p>`
              : ""
          }
          ${
            evaluation.hasFalseNegativeWarning
              ? `<p class="warning-note">${messages.evaluation.falseNegativeWarning}</p>`
              : ""
          }
          ${
            !evaluation.hasAccuracyWarning &&
            !evaluation.hasFalsePositiveWarning &&
            !evaluation.hasFalseNegativeWarning
              ? `<p class="success-note">${messages.evaluation.noWarnings}</p>`
              : ""
          }
        </div>

        <div class="list-block">
          <p class="member-heading">${messages.evaluation.correctRows}</p>
          <div class="pill-row">${renderRowList(evaluation.correctRows, ui.locale)}</div>
        </div>
        <div class="list-block">
          <p class="member-heading">${messages.evaluation.incorrectRows}</p>
          <div class="pill-row">${renderRowList(evaluation.incorrectRows, ui.locale)}</div>
        </div>
        <div class="list-block">
          <p class="member-heading">${messages.evaluation.falsePositives}</p>
          <div class="pill-row">${renderRowList(evaluation.falsePositives, ui.locale)}</div>
        </div>
        <div class="list-block">
          <p class="member-heading">${messages.evaluation.falseNegatives}</p>
          <div class="pill-row">${renderRowList(evaluation.falseNegatives, ui.locale)}</div>
        </div>
      </section>
    `;
  }
}

customElements.define("evaluation-panel", EvaluationPanel);
