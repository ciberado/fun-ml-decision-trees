import { FEATURE_CONFIG, FEATURE_OPTIONS, MAX_TREE_DEPTH } from "../domain/config.js";
import "./leaf-bucket.js";

function renderOperatorOptions(featureName, currentOperator) {
  return FEATURE_CONFIG[featureName].operators
    .map(
      (operator) =>
        `<option value="${operator}" ${operator === currentOperator ? "selected" : ""}>${operator}</option>`
    )
    .join("");
}

function renderValueControl(nodeId, condition) {
  const feature = FEATURE_CONFIG[condition.feature];

  if (feature.type === "numeric") {
    return `
      <label class="field">
        <span>Value</span>
        <input
          class="field-input"
          type="number"
          value="${condition.value}"
          data-node-id="${nodeId}"
          data-condition-field="value"
        >
      </label>
    `;
  }

  return `
    <label class="field">
      <span>Value</span>
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
    this.addEventListener("change", (event) => {
      const control = event.target.closest("[data-condition-field]");

      if (!control || control.closest("tree-node") !== this) {
        return;
      }

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
    });

    this.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-split]");

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

    const { node, depth, leafDetails, selectedRowId, activeNodeIds, activeLeafId } = this._data;

    if (node.type === "leaf") {
      this.innerHTML = `<leaf-bucket></leaf-bucket>`;
      this.querySelector("leaf-bucket").data = {
        node,
        detail: leafDetails[node.id],
        depth,
        maxDepth: MAX_TREE_DEPTH,
        selectedRowId,
        activeLeafId
      };
      return;
    }

    const isActive = activeNodeIds.includes(node.id);

    this.innerHTML = `
      <section class="tree-node ${isActive ? "is-active" : ""}">
        <div class="node-card">
          <div class="node-head">
            <div>
              <p class="eyebrow">Split ${node.id}</p>
              <h3>Decision ${depth}</h3>
            </div>
            <button type="button" class="mini-action danger" data-remove-split="${node.id}">
              Remove Split
            </button>
          </div>

          <div class="field-grid">
            <label class="field">
              <span>Feature</span>
              <select class="field-input" data-node-id="${node.id}" data-condition-field="feature">
                ${FEATURE_OPTIONS.map(
                  (feature) =>
                    `<option value="${feature.value}" ${
                      feature.value === node.condition.feature ? "selected" : ""
                    }>${feature.label}</option>`
                ).join("")}
              </select>
            </label>

            <label class="field">
              <span>Operator</span>
              <select class="field-input" data-node-id="${node.id}" data-condition-field="operator">
                ${renderOperatorOptions(node.condition.feature, node.condition.operator)}
              </select>
            </label>

            ${renderValueControl(node.id, node.condition)}
          </div>
        </div>

        <div class="branch-grid">
          <section class="branch-column">
            <p class="branch-label">True branch</p>
            <tree-node data-branch="true"></tree-node>
          </section>
          <section class="branch-column">
            <p class="branch-label">False branch</p>
            <tree-node data-branch="false"></tree-node>
          </section>
        </div>
      </section>
    `;

    this.querySelector('[data-branch="true"]').data = {
      ...this._data,
      node: node.trueBranch,
      depth: depth + 1
    };

    this.querySelector('[data-branch="false"]').data = {
      ...this._data,
      node: node.falseBranch,
      depth: depth + 1
    };
  }
}

customElements.define("tree-node", TreeNode);
