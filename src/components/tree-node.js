import { FEATURE_CONFIG, FEATURE_OPTIONS } from "../domain/config.js";
import { buildEditorFlow } from "../state/recompute.js";
import "./row-ball-layer.js";

function invertOperator(operator) {
  if (operator === "<=") {
    return ">";
  }

  if (operator === ">") {
    return "<=";
  }

  if (operator === "=") {
    return "!=";
  }

  return "=";
}

function formatConditionText(condition, negate = false) {
  const operator = negate ? invertOperator(condition.operator) : condition.operator;
  return `${condition.feature} ${operator} ${condition.value}`;
}

function appendBucketLabel(prefix, conditionText) {
  if (!prefix || prefix === "All rows") {
    return conditionText;
  }

  return `${prefix} · ${conditionText}`;
}

function renderOperatorOptions(featureName, currentOperator) {
  return FEATURE_CONFIG[featureName].operators
    .map(
      (operator) =>
        `<option value="${operator}" ${operator === currentOperator ? "selected" : ""}>${operator}</option>`
    )
    .join("");
}

function getNumericRange(dataset, featureName) {
  const values = dataset.map((row) => Number(row[featureName])).filter(Number.isFinite);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const uniqueValues = [...new Set(values)].sort((left, right) => left - right);
  let step = 1;

  if (uniqueValues.length > 1) {
    step = Math.min(
      ...uniqueValues
        .slice(1)
        .map((value, index) => value - uniqueValues[index])
        .filter((delta) => delta > 0)
    );
  }

  return { min, max, step };
}

function renderValueControl(nodeId, condition, dataset) {
  const feature = FEATURE_CONFIG[condition.feature];

  if (feature.type === "numeric") {
    const range = getNumericRange(dataset, condition.feature);
    return `
      <label class="field range-field">
        <div class="range-control">
          <input
            class="field-input range-input"
            type="range"
            min="${range.min}"
            max="${range.max}"
            step="${range.step}"
            value="${condition.value}"
            data-node-id="${nodeId}"
            data-condition-field="value"
            data-live-update="true"
          >
          <span class="range-value">${condition.value}</span>
        </div>
      </label>
    `;
  }

  return `
      <label class="field">
        <select class="field-input" data-node-id="${nodeId}" data-condition-field="value">
          ${feature.options
            .map(
            (option) =>
              `<option value="${option}" ${option === condition.value ? "selected" : ""}>${option}</option>`
          )
          .join("")}
      </select>
    </label>
  `;
}

class TreeNode extends HTMLElement {
  set data(value) {
    this._data = value;
    this.render();
  }

  connectedCallback() {
    const emitConditionEdit = (control) => {
      this.dispatchEvent(
        new CustomEvent("condition-edit", {
          bubbles: true,
          detail: {
            nodeId: control.dataset.nodeId,
            field: control.dataset.conditionField,
            value: control.value
          }
        })
      );
    };

    this.addEventListener("change", (event) => {
      const control = event.target.closest("[data-condition-field]");

      if (!control || control.closest("tree-node") !== this) {
        return;
      }

      emitConditionEdit(control);
    });

    this.addEventListener("input", (event) => {
      const control = event.target.closest("[data-live-update]");

      if (!control || control.closest("tree-node") !== this) {
        return;
      }

      const valueLabel = control.parentElement?.querySelector(".range-value");

      if (valueLabel) {
        valueLabel.textContent = control.value;
      }

      this.applyLivePreview(control.value);
      this.dispatchEvent(
        new CustomEvent("preview-condition", {
          bubbles: true,
          detail: {
            nodeId: control.dataset.nodeId,
            field: control.dataset.conditionField,
            value: control.value
          }
        })
      );
    });

    this.addEventListener("click", (event) => {
      const playButton = event.target.closest("[data-play-node]");
      const removeButton = event.target.closest("[data-remove-split]");
      const addButton = event.target.closest("[data-add-split]");

      if (playButton && playButton.closest("tree-node") === this) {
        this.dispatchEvent(
          new CustomEvent("play-node", {
            bubbles: true,
            detail: {
              nodeId: playButton.dataset.playNode
            }
          })
        );
        return;
      }

      if (addButton && addButton.closest("tree-node") === this) {
        this.dispatchEvent(
          new CustomEvent("add-split", {
            bubbles: true,
            detail: {
              leafId: addButton.dataset.addSplit
            }
          })
        );
        return;
      }

      if (!removeButton || removeButton.closest("tree-node") !== this) {
        return;
      }

      this.dispatchEvent(
        new CustomEvent("remove-split", {
          bubbles: true,
          detail: {
            nodeId: removeButton.dataset.removeSplit
          }
        })
      );
    });

    this.render();
  }

  render() {
    if (!this._data) {
      return;
    }

    const { flow, treeNode, dataset, bucketLabel, selectedRowId, selectedLeafId } = this._data;
    const isSelectedLeaf = flow.type === "leaf" && flow.nodeId === selectedLeafId;
    const leafBadge =
      flow.type === "leaf" && flow.isSettled && flow.majorityLabel
        ? `<span class="leaf-result-badge is-${flow.majorityLabel.toLowerCase()}">${flow.majorityLabel}</span>`
        : "";
    const sourceCardClasses = [
      "stage-source-card",
      isSelectedLeaf ? "is-active" : "",
      flow.rows.some((row) => row.isTarget) ? "contains-target" : ""
    ]
      .filter(Boolean)
      .join(" ");

    this.innerHTML = `
      <section class="tree-node stage-node depth-${flow.depth}">
        <div class="${sourceCardClasses}">
          <div class="stage-source-main">
            <div class="stage-source-copy">
              <h3>
                ${bucketLabel}
                ${leafBadge}
              </h3>
            </div>
            <div class="stage-source-actions">
              <button
                type="button"
                class="stage-icon-button"
                data-add-split="${treeNode.id}"
                ${flow.type === "split" || !flow.canAddSplit ? "disabled" : ""}
                aria-label="Add split to ${treeNode.id}"
              >
                +
              </button>
              <button
                type="button"
                class="stage-play-button"
                data-play-node="${treeNode.id}"
                ${flow.type !== "split" || !flow.canPlay ? "disabled" : ""}
                aria-label="Process next ball"
              >
                &#9654;
              </button>
            </div>
          </div>
          <row-ball-layer data-slot="source"></row-ball-layer>
        </div>

        ${
          flow.type === "split"
            ? `
              <div class="stage-split-card">
                <div class="compact-split-row">
                  <label class="field compact-field">
                    <select class="field-input" data-node-id="${treeNode.id}" data-condition-field="feature">
                      ${FEATURE_OPTIONS.map(
                        (feature) =>
                          `<option value="${feature.value}" ${
                            feature.value === treeNode.condition.feature ? "selected" : ""
                          }>${feature.label}</option>`
                      ).join("")}
                    </select>
                  </label>

                  <label class="field compact-field">
                    <select class="field-input" data-node-id="${treeNode.id}" data-condition-field="operator">
                      ${renderOperatorOptions(treeNode.condition.feature, treeNode.condition.operator)}
                    </select>
                  </label>

                  ${renderValueControl(treeNode.id, treeNode.condition, dataset)}

                  <button type="button" class="mini-action danger compact-remove" data-remove-split="${treeNode.id}">
                    Remove
                  </button>
                </div>
              </div>

              <div class="stage-branch-grid">
                <section class="stage-branch">
                  <tree-node data-branch="false"></tree-node>
                </section>
                <section class="stage-branch">
                  <tree-node data-branch="true"></tree-node>
                </section>
              </div>
            `
            : ""
        }
      </section>
    `;

    const sourceLayer = this.querySelector('[data-slot="source"]');
    sourceLayer.rows =
      flow.type === "split"
        ? flow.remainingRows
        : flow.rows;
    sourceLayer.selectedRowId = selectedRowId;

    if (flow.type === "split") {
      this.querySelector('[data-branch="true"]').data = this.renderChildData("true");
      this.querySelector('[data-branch="false"]').data = this.renderChildData("false");
    }
  }

  applyLivePreview(value) {
    if (!this._data || this._data.flow.type !== "split") {
      return;
    }

    const previewNode = structuredClone(this._data.treeNode);
    previewNode.condition.value = Number(value);

    const previewFlow = buildEditorFlow(
      previewNode,
      this._data.flow.rows,
      this._data.splitProgress ?? {},
      {},
      this._data.flow.depth,
      this._data.flow.isSettled
    );

    const sourceLayer = this.querySelector('[data-slot="source"]');

    if (sourceLayer) {
      sourceLayer.rows = previewFlow.remainingRows;
      sourceLayer.selectedRowId = this._data.selectedRowId;
    }

    const sourceMeta = this.querySelector(".stage-meta");

    const trueBranch = this.querySelector('[data-branch="true"]');
    const falseBranch = this.querySelector('[data-branch="false"]');

    if (trueBranch) {
      trueBranch.data = {
        ...this._data,
        flow: previewFlow.trueBranch,
        treeNode: previewNode.trueBranch,
        bucketLabel: appendBucketLabel(
          this._data.bucketLabel,
          formatConditionText(previewNode.condition)
        )
      };
    }

    if (falseBranch) {
      falseBranch.data = {
        ...this._data,
        flow: previewFlow.falseBranch,
        treeNode: previewNode.falseBranch,
        bucketLabel: appendBucketLabel(
          this._data.bucketLabel,
          formatConditionText(previewNode.condition, true)
        )
      };
    }
  }

  renderChildData(branchKey) {
    const isTrueBranch = branchKey === "true";
    const nextFlow = isTrueBranch ? this._data.flow.trueBranch : this._data.flow.falseBranch;
    const nextTreeNode = isTrueBranch ? this._data.treeNode.trueBranch : this._data.treeNode.falseBranch;
    const nextLabel = appendBucketLabel(
      this._data.bucketLabel,
      formatConditionText(this._data.treeNode.condition, !isTrueBranch)
    );

    return {
      ...this._data,
      flow: nextFlow,
      treeNode: nextTreeNode,
      bucketLabel: nextLabel
    };
  }
}

customElements.define("tree-node", TreeNode);
