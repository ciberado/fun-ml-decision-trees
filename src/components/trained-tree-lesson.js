import { DATASET, getTargetRowId } from "../data/dataset.js";
import { classifyLeaf } from "../domain/classify-leaf.js";
import { evaluateModel } from "../domain/evaluate-model.js";
import { routeAllRows } from "../domain/route-all-rows.js";
import { trainDecisionTree } from "../domain/train-decision-tree.js";
import {
  detectInitialLocale,
  getMessages,
  resolveLocale,
  translateClassLabel
} from "../i18n/index.js";
import { formatCondition, formatPercent } from "../utils/formatters.js";
import "./hero-qr.js";
import "./row-ball-layer.js";

const TRAINING_PREVIEW_DELAY = 1000;
const BEST_SELECTION_DELAY = 1500;

function buildLeafDetails(dataset, routing, globalMajorityLabel) {
  const rowsById = Object.fromEntries(dataset.map((row) => [row.id, row]));

  return Object.fromEntries(
    Object.entries(routing.leafAssignments).map(([leafId, assignment]) => {
      const rows = assignment.rowIds.map((rowId) => rowsById[rowId]);
      return [
        leafId,
        {
          leafId,
          rowIds: assignment.rowIds,
          knownRowIds: assignment.knownRowIds,
          targetRowIds: assignment.targetRowIds,
          rows,
          ...classifyLeaf(rows, globalMajorityLabel)
        }
      ];
    })
  );
}

function sameCondition(left, right) {
  return (
    left.feature === right.feature &&
    left.operator === right.operator &&
    String(left.value) === String(right.value)
  );
}

function splitRows(rows, condition) {
  return {
    trueRows: rows.filter((row) => {
      const rowValue = row[condition.feature];

      if (condition.operator === "=") {
        return rowValue === condition.value;
      }

      if (condition.operator === "!=") {
        return rowValue !== condition.value;
      }

      if (condition.operator === "<=") {
        return rowValue <= Number(condition.value);
      }

      return rowValue > Number(condition.value);
    }),
    falseRows: rows.filter((row) => {
      const rowValue = row[condition.feature];

      if (condition.operator === "=") {
        return rowValue !== condition.value;
      }

      if (condition.operator === "!=") {
        return rowValue === condition.value;
      }

      if (condition.operator === "<=") {
        return rowValue > Number(condition.value);
      }

      return rowValue <= Number(condition.value);
    })
  };
}

function getKnownRows(rows) {
  return rows.filter((row) => !row.isTarget);
}

function getTargetRows(rows) {
  return rows.filter((row) => row.isTarget);
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

class TrainedTreeLesson extends HTMLElement {
  constructor() {
    super();
    this.rows = structuredClone(DATASET);
    this.locale = detectInitialLocale();
    this.selectedRowId = getTargetRowId(this.rows);
    this.result = null;
    this.visibleStepCount = 0;
    this.previewStepIndex = null;
    this.previewCandidateIndex = null;
    this.previewIsBestSelection = false;
    this.isPlayingTraining = false;
    this.playbackToken = 0;
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
    this.cancelTrainingPlayback();
  }

  async handleClick(event) {
    const action = event.target.closest("[data-action]")?.dataset.action;

    if (action === "generate-model") {
      this.cancelTrainingPlayback();
      try {
        this.result = this.buildResult();
        this.visibleStepCount = 0;
        this.clearPreview();
        this.notice = "";
      } catch (error) {
        this.notice = error instanceof Error ? error.message : getMessages(this.locale).status.unknownError;
      }

      this.render();
      return;
    }

    if (action === "previous-step" && this.result) {
      this.cancelTrainingPlayback();
      this.clearPreview();
      this.visibleStepCount = Math.max(0, this.visibleStepCount - 1);
      this.render();
      return;
    }

    if (action === "next-step" && this.result) {
      this.cancelTrainingPlayback();
      this.clearPreview();
      this.visibleStepCount = Math.min(this.result.trainingSteps.length, this.visibleStepCount + 1);
      this.render();
      return;
    }

    if (action === "show-final" && this.result) {
      this.cancelTrainingPlayback();
      this.clearPreview();
      this.visibleStepCount = this.result.trainingSteps.length;
      this.render();
      return;
    }

    if (action === "play-training") {
      await this.playTraining();
      return;
    }

    if (action === "stop-training") {
      this.cancelTrainingPlayback();
      this.clearPreview();
      this.render();
      return;
    }

    if (action === "clear-model") {
      this.cancelTrainingPlayback();
      this.result = null;
      this.visibleStepCount = 0;
      this.clearPreview();
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

  clearPreview() {
    this.previewStepIndex = null;
    this.previewCandidateIndex = null;
    this.previewIsBestSelection = false;
  }

  cancelTrainingPlayback() {
    this.playbackToken += 1;
    this.isPlayingTraining = false;
  }

  getPreviewCandidates(step) {
    return [...step.candidates].sort((left, right) => left.gain - right.gain);
  }

  getDisplayCandidates(step, preview) {
    if (preview) {
      return this.getPreviewCandidates(step);
    }

    return [...step.candidates].sort((left, right) => right.gain - left.gain);
  }

  getActivePreview() {
    if (
      this.previewStepIndex == null ||
      this.previewCandidateIndex == null ||
      !this.result
    ) {
      return null;
    }

    const step = this.result.trainingSteps[this.previewStepIndex];

    if (!step) {
      return null;
    }

    const candidate = this.getPreviewCandidates(step)[this.previewCandidateIndex];

    if (!candidate) {
      return null;
    }

    return {
      stepIndex: this.previewStepIndex,
      candidateIndex: this.previewCandidateIndex,
      isBestSelection: this.previewIsBestSelection,
      step,
      candidate
    };
  }

  async playTraining() {
    if (this.isPlayingTraining) {
      return;
    }

    if (!this.result) {
      try {
        this.result = this.buildResult();
        this.visibleStepCount = 0;
      } catch (error) {
        this.notice = error instanceof Error ? error.message : getMessages(this.locale).status.unknownError;
        this.render();
        return;
      }
    }

    const token = this.playbackToken + 1;
    this.playbackToken = token;
    this.isPlayingTraining = true;
    this.clearPreview();
    this.render();

    for (let stepIndex = this.visibleStepCount; stepIndex < this.result.trainingSteps.length; stepIndex += 1) {
      const step = this.result.trainingSteps[stepIndex];
      const candidates = this.getPreviewCandidates(step);

      for (let candidateIndex = 0; candidateIndex < candidates.length; candidateIndex += 1) {
        if (this.playbackToken !== token) {
          return;
        }

        this.previewStepIndex = stepIndex;
        this.previewCandidateIndex = candidateIndex;
        this.previewIsBestSelection = false;
        this.render();
        await wait(TRAINING_PREVIEW_DELAY);
      }

      if (this.playbackToken !== token) {
        return;
      }

      const bestCandidateIndex = candidates.findIndex((candidate) =>
        sameCondition(candidate.condition, step.bestCondition)
      );
      this.previewStepIndex = stepIndex;
      this.previewCandidateIndex = Math.max(0, bestCandidateIndex);
      this.previewIsBestSelection = true;
      this.render();
      await wait(BEST_SELECTION_DELAY);

      if (this.playbackToken !== token) {
        return;
      }

      this.clearPreview();
      this.visibleStepCount = stepIndex + 1;
      this.render();
      await wait(TRAINING_PREVIEW_DELAY);
    }

    if (this.playbackToken === token) {
      this.clearPreview();
      this.isPlayingTraining = false;
      this.render();
    }
  }

  buildResult() {
    const trained = trainDecisionTree(this.rows, { maxDepth: 2 });
    const routing = routeAllRows(trained.tree, this.rows);
    const leafDetails = buildLeafDetails(this.rows, routing, trained.globalMajorityLabel);
    const evaluation = evaluateModel(this.rows, routing.rowLeafIds, leafDetails);
    const targetRowId = getTargetRowId(this.rows);
    const targetLeafId = routing.rowLeafIds[targetRowId];
    const targetLeaf = leafDetails[targetLeafId];

    return {
      ...trained,
      routing,
      leafDetails,
      evaluation,
      prediction: {
        targetRowId,
        predictedLabel: targetLeaf.predictedLabel,
        leafId: targetLeafId,
        path: routing.rowPaths[targetRowId]
      }
    };
  }

  renderSummaryPills(messages) {
    const knownRowCount = this.rows.filter((row) => !row.isTarget).length;

    return `
      <div class="summary-pills" aria-label="${messages.trainedLesson.summaryLabel}">
        <span class="summary-pill">${messages.trainedLesson.trainingRows(knownRowCount)}</span>
        <span class="summary-pill">${messages.trainedLesson.depthLimit(2)}</span>
        ${
          this.result
            ? `
              <span class="summary-pill">${messages.controls.accuracy}: <strong>${formatPercent(this.result.evaluation.accuracy, this.locale)}</strong></span>
              <span class="summary-pill">${messages.trainedLesson.targetPrediction}: <strong>${translateClassLabel(this.result.prediction.predictedLabel, this.locale)}</strong></span>
            `
            : `<span class="summary-pill">${messages.trainedLesson.notGenerated}</span>`
        }
      </div>
    `;
  }

  renderCandidate(candidate, bestCondition, maxGain, activeCondition = null, isBestSelection = false) {
    const messages = getMessages(this.locale);
    const isBest = sameCondition(candidate.condition, bestCondition);
    const isActive = activeCondition && sameCondition(candidate.condition, activeCondition);
    const width = maxGain > 0 ? Math.max(4, (candidate.gain / maxGain) * 100) : 4;

    return `
      <li class="candidate-row ${isBest ? "is-best" : ""} ${isActive ? "is-active" : ""} ${isActive && isBestSelection ? "is-selected-best" : ""}">
        <div class="candidate-main">
          <span class="candidate-condition">${formatCondition(candidate.condition, this.locale)}</span>
          ${
            isActive
              ? `<span class="tiny-pill">${isBestSelection ? messages.trainedLesson.selectedBest : messages.trainedLesson.previewing}</span>`
              : ""
          }
          ${isBest ? `<span class="tiny-pill">${messages.trainedLesson.bestSplit}</span>` : ""}
        </div>
        <div class="candidate-meter" aria-hidden="true">
          <span style="width: ${width}%"></span>
        </div>
        <span class="candidate-score">${formatPercent(candidate.gain, this.locale)}</span>
      </li>
    `;
  }

  renderTrainingSteps(messages) {
    if (!this.result) {
      return `
        <section class="panel trained-placeholder-panel">
          <div class="muted-panel lesson-placeholder">
            <p class="empty-copy">${messages.trainedLesson.placeholderCopy}</p>
          </div>
        </section>
      `;
    }

    const preview = this.getActivePreview();
    const visibleStep = preview?.step ?? this.result.trainingSteps[this.visibleStepCount - 1];
    const maxGain = visibleStep
      ? Math.max(...visibleStep.candidates.map((candidate) => candidate.gain))
      : 0;
    const activeCondition = preview?.candidate.condition ?? null;
    const isBestSelection = preview?.isBestSelection ?? false;

    return `
      <section class="panel trained-steps-panel">
        <div class="subpanel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">${messages.trainedLesson.trainingTitle}</p>
              <h2>${messages.trainedLesson.trainingSubtitle}</h2>
            </div>
            <span class="summary-pill">${messages.trainedLesson.stepProgress(this.visibleStepCount, this.result.trainingSteps.length)}</span>
          </div>
          <div class="step-control-row">
            <button
              type="button"
              class="action-button"
              data-action="previous-step"
              ${this.visibleStepCount <= 0 || this.isPlayingTraining ? "disabled" : ""}
            >
              ${messages.trainedLesson.previousStep}
            </button>
            <button
              type="button"
              class="action-button primary"
              data-action="next-step"
              ${this.visibleStepCount >= this.result.trainingSteps.length || this.isPlayingTraining ? "disabled" : ""}
            >
              ${messages.trainedLesson.nextStep}
            </button>
            ${
              this.isPlayingTraining
                ? `
                  <button type="button" class="action-button" data-action="stop-training">
                    ${messages.trainedLesson.stopTraining}
                  </button>
                `
                : `
                  <button
                    type="button"
                    class="action-button"
                    data-action="play-training"
                    ${this.visibleStepCount >= this.result.trainingSteps.length ? "disabled" : ""}
                  >
                    ${messages.trainedLesson.playTraining}
                  </button>
                `
            }
          </div>
          <div class="training-step-list">
            ${
              visibleStep
                ? `
                  <article class="training-step-card">
                    <div class="training-step-head">
                      <div>
                        <p class="metric-label">${messages.trainedLesson.nodeRows(visibleStep.rowIds.join(", "))}</p>
                        <h3>${
                          preview
                            ? isBestSelection
                              ? messages.trainedLesson.selectedBestSplit(formatCondition(preview.candidate.condition, this.locale))
                              : messages.trainedLesson.previewingSplit(formatCondition(preview.candidate.condition, this.locale))
                            : messages.trainedLesson.chosenSplit(formatCondition(visibleStep.bestCondition, this.locale))
                        }</h3>
                      </div>
                    </div>
                    <div class="candidate-table" role="table" aria-label="${messages.trainedLesson.trainingSubtitle}">
                      <div class="candidate-header" role="row">
                        <span role="columnheader">${messages.trainedLesson.candidateRule}</span>
                        <span role="columnheader">${messages.trainedLesson.purity}</span>
                        <span role="columnheader">${messages.trainedLesson.purityValue}</span>
                      </div>
                      <ul class="candidate-list">
                        ${this.getDisplayCandidates(visibleStep, preview)
                          .map((candidate) =>
                            this.renderCandidate(candidate, visibleStep.bestCondition, maxGain, activeCondition, isBestSelection)
                          )
                          .join("")}
                      </ul>
                    </div>
                  </article>
                `
                : `
                  <article class="training-step-card">
                    <div class="training-step-head">
                      <div>
                        <p class="metric-label">${messages.trainedLesson.beforeFirstSplit}</p>
                        <h3>${messages.trainedLesson.allRowsWaiting}</h3>
                      </div>
                    </div>
                    <p class="inline-hint">${messages.trainedLesson.firstSplitHint}</p>
                  </article>
                `
            }
          </div>
        </div>
      </section>
    `;
  }

  renderPendingGroup(rows, branchLabel = "") {
    const messages = getMessages(this.locale);
    const containsTarget = rows.some((row) => row.isTarget);

    return `
      ${
        branchLabel
          ? `<p class="branch-label trained-branch-label">${branchLabel}</p>`
          : ""
      }
      <section class="trained-pending-group ${containsTarget ? "contains-target" : ""}">
        <div class="leaf-header">
          <div>
            <p class="eyebrow">${messages.trainedLesson.pendingSplit}</p>
            <h4>${messages.trainedLesson.pendingGroup}</h4>
          </div>
        </div>
        <p class="leaf-meta">${messages.trainedLesson.pendingRows(rows.map((row) => row.id).join(", "))}</p>
        <row-ball-layer data-pending-row-ids="${rows.map((row) => row.id).join(",")}"></row-ball-layer>
      </section>
    `;
  }

  renderLeaf(node, rows, branchLabel = "") {
    const classification = classifyLeaf(rows, this.result.globalMajorityLabel);
    const knownRows = rows.filter((row) => !row.isTarget);
    const targetRows = rows.filter((row) => row.isTarget);
    const detail = {
      targetRowIds: targetRows.map((row) => row.id),
      knownRowIds: knownRows.map((row) => row.id),
      counts: classification.counts,
      predictedLabel: classification.predictedLabel
    };
    const messages = getMessages(this.locale);
    const label = translateClassLabel(detail.predictedLabel, this.locale);

    return `
      ${
        branchLabel
          ? `<p class="branch-label trained-branch-label">${branchLabel}</p>`
          : ""
      }
      <section class="trained-leaf ${detail.targetRowIds.length ? "contains-target" : ""}">
        <div class="leaf-header">
          <div>
            <p class="eyebrow">${messages.common.leaf(node.id)}</p>
            <h4>${label}</h4>
          </div>
          <span class="leaf-result-badge is-${detail.predictedLabel.toLowerCase()}">${label}</span>
        </div>
        <p class="leaf-meta">
          ${messages.leafBucket.knownRowsSummary(detail.knownRowIds.length, detail.counts.Budget, detail.counts.Premium)}
        </p>
        <row-ball-layer data-step-row-ids="${rows.map((row) => row.id).join(",")}"></row-ball-layer>
      </section>
    `;
  }

  renderTreeNode(node, branchLabel = "", rows = this.rows) {
    const messages = getMessages(this.locale);

    if (node.type === "leaf") {
      return this.renderLeaf(node, rows, branchLabel);
    }

    const preview = this.getActivePreview();
    const visibleNodeIds = new Set(
      this.result.trainingSteps.slice(0, this.visibleStepCount).map((step) => step.nodeId)
    );

    if (!visibleNodeIds.has(node.id)) {
      if (preview?.step.nodeId === node.id) {
        const branchRows = splitRows(rows, preview.candidate.condition);

        return `
          <section class="trained-tree-node">
            ${
              branchLabel
                ? `<p class="branch-label trained-branch-label">${branchLabel}</p>`
                : ""
            }
            <div class="trained-split-card is-preview ${preview.isBestSelection ? "is-selected-best" : ""}">
              <p class="metric-label">${preview.isBestSelection ? messages.trainedLesson.selectedRule : messages.trainedLesson.previewRule}</p>
              <h3>${formatCondition(preview.candidate.condition, this.locale)}</h3>
            </div>
            <div class="trained-branch-grid">
              <div class="trained-branch">
                ${this.renderPendingGroup(branchRows.trueRows, messages.trainedLesson.trueBranch)}
              </div>
              <div class="trained-branch">
                ${this.renderPendingGroup(branchRows.falseRows, messages.trainedLesson.falseBranch)}
              </div>
            </div>
          </section>
        `;
      }

      return this.renderPendingGroup(rows, branchLabel);
    }

    const branchRows = splitRows(rows, node.condition);

    return `
      <section class="trained-tree-node">
        ${
          branchLabel
            ? `<p class="branch-label trained-branch-label">${branchLabel}</p>`
            : ""
        }
        <div class="trained-split-card">
          <p class="metric-label">${messages.trainedLesson.splitRule}</p>
          <h3>${formatCondition(node.condition, this.locale)}</h3>
        </div>
        <div class="trained-branch-grid">
          <div class="trained-branch">
            ${this.renderTreeNode(node.trueBranch, messages.trainedLesson.trueBranch, branchRows.trueRows)}
          </div>
          <div class="trained-branch">
            ${this.renderTreeNode(node.falseBranch, messages.trainedLesson.falseBranch, branchRows.falseRows)}
          </div>
        </div>
      </section>
    `;
  }

  renderGeneratedModel(messages) {
    if (!this.result) {
      return `
        <section class="panel trained-model-panel">
          <div class="muted-panel lesson-placeholder">
            <p class="empty-copy">${messages.trainedLesson.placeholderCopy}</p>
          </div>
        </section>
      `;
    }

    const label = translateClassLabel(this.result.prediction.predictedLabel, this.locale);
    const isFinalStep = this.visibleStepCount >= this.result.trainingSteps.length;
    const preview = this.getActivePreview();
    const treeRows = isFinalStep ? this.rows : getKnownRows(this.rows);
    const targetRows = getTargetRows(this.rows);

    return `
      <section class="panel trained-model-panel is-generated">
        <div class="subpanel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">${messages.trainedLesson.modelTitle}</p>
              <h2>${messages.trainedLesson.predictedAs(this.result.prediction.targetRowId, label)}</h2>
            </div>
            <div class="metric-card compact-metric">
              <p class="metric-label">${messages.controls.accuracy}</p>
              <p class="metric-value">${formatPercent(this.result.evaluation.accuracy, this.locale)}</p>
            </div>
          </div>

          <div class="trained-tree-shell">
            ${
              this.visibleStepCount === 0 && !preview
                ? this.renderPendingGroup(this.rows)
                : `
                  ${
                    isFinalStep
                      ? ""
                      : `<div class="target-waiting-row">${this.renderPendingGroup(targetRows, messages.trainedLesson.targetWaiting)}</div>`
                  }
                  ${this.renderTreeNode(this.result.tree, "", treeRows)}
                `
            }
          </div>
        </div>
      </section>
    `;
  }

  hydrateLeafBalls() {
    if (!this.result) {
      return;
    }

    for (const layer of this.querySelectorAll("row-ball-layer[data-pending-row-ids], row-ball-layer[data-step-row-ids]")) {
      const rowIds = (layer.dataset.pendingRowIds ?? layer.dataset.stepRowIds).split(",").map(Number);
      layer.rows = rowIds.map((rowId) => this.rows.find((row) => row.id === rowId));
      layer.selectedRowId = this.selectedRowId;
      layer.locale = this.locale;
    }
  }

  render() {
    const messages = getMessages(this.locale);

    document.documentElement.lang = this.locale;

    this.innerHTML = `
      <div class="page-shell trained-page-shell">
        <header class="hero">
          <div class="hero-head">
            <div class="hero-title-block">
              <p class="eyebrow">${messages.trainedLesson.eyebrow}</p>
              <h1>${messages.trainedLesson.title}</h1>
            </div>
            <hero-qr locale="${this.locale}"></hero-qr>
          </div>
          <p class="hero-copy">${messages.trainedLesson.copy}</p>
        </header>

        <section class="control-strip">
          <div class="control-actions">
            <button type="button" class="action-button primary" data-action="generate-model">
              ${messages.trainedLesson.generateModel}
            </button>
            ${
              this.result
                ? `<button type="button" class="action-button" data-action="clear-model">${messages.trainedLesson.clearModel}</button>`
                : ""
            }
          </div>
          ${this.renderSummaryPills(messages)}
        </section>

        ${this.notice ? `<p class="status-banner" role="status">${this.notice}</p>` : ""}

        <main class="trained-lesson-grid">
          ${this.renderGeneratedModel(messages)}
          ${this.renderTrainingSteps(messages)}
        </main>
      </div>
    `;

    this.hydrateLeafBalls();
  }
}

customElements.define("trained-tree-lesson", TrainedTreeLesson);
