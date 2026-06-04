import { formatPercent } from "../utils/formatters.js";

function renderRowList(rowIds) {
  if (rowIds.length === 0) {
    return '<span class="empty-copy">None</span>';
  }

  return rowIds.map((rowId) => `<span class="tiny-pill">Row ${rowId}</span>`).join("");
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

    const { dataset, evaluation } = this._state;
    const knownRowIds = dataset.filter((row) => !row.isTarget).map((row) => row.id);

    this.innerHTML = `
      <section class="subpanel">
        <p class="eyebrow">Evaluation</p>
        <h2>Known rows ${knownRowIds[0]} to ${knownRowIds[knownRowIds.length - 1]} score the current tree</h2>

        <div class="metric-grid">
          <article class="metric-card">
            <p class="metric-label">Accuracy</p>
            <p class="metric-value">${formatPercent(evaluation.accuracy)}</p>
            <p class="metric-baseline">Starter baseline: ${formatPercent(evaluation.baselineAccuracy)}</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">False Positives</p>
            <p class="metric-value">${evaluation.falsePositives.length}</p>
            <p class="metric-baseline">Starter baseline: ${evaluation.baselineFalsePositives.length}</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">False Negatives</p>
            <p class="metric-value">${evaluation.falseNegatives.length}</p>
            <p class="metric-baseline">Starter baseline: ${evaluation.baselineFalseNegatives.length}</p>
          </article>
        </div>

        <div class="warning-stack">
          ${
            evaluation.hasAccuracyWarning
              ? '<p class="warning-note">Accuracy is lower than the starter tree baseline.</p>'
              : ""
          }
          ${
            evaluation.hasFalsePositiveWarning
              ? '<p class="warning-note">This edited tree creates more false positives than the starter tree.</p>'
              : ""
          }
          ${
            evaluation.hasFalseNegativeWarning
              ? '<p class="warning-note">This edited tree creates more false negatives than the starter tree.</p>'
              : ""
          }
          ${
            !evaluation.hasAccuracyWarning &&
            !evaluation.hasFalsePositiveWarning &&
            !evaluation.hasFalseNegativeWarning
              ? '<p class="success-note">No baseline warnings are active for this tree.</p>'
              : ""
          }
        </div>

        <div class="list-block">
          <p class="member-heading">Correct rows</p>
          <div class="pill-row">${renderRowList(evaluation.correctRows)}</div>
        </div>
        <div class="list-block">
          <p class="member-heading">Incorrect rows</p>
          <div class="pill-row">${renderRowList(evaluation.incorrectRows)}</div>
        </div>
        <div class="list-block">
          <p class="member-heading">False positives</p>
          <div class="pill-row">${renderRowList(evaluation.falsePositives)}</div>
        </div>
        <div class="list-block">
          <p class="member-heading">False negatives</p>
          <div class="pill-row">${renderRowList(evaluation.falseNegatives)}</div>
        </div>
      </section>
    `;
  }
}

customElements.define("evaluation-panel", EvaluationPanel);
