import { getMessages, translateClassLabel } from "../i18n/index.js";
import "./row-ball-layer.js";
import { describeFallback } from "../utils/formatters.js";

class LeafBucket extends HTMLElement {
  set data(value) {
    this._data = value;
    this.render();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add-split]");

      if (!addButton || addButton.closest("leaf-bucket") !== this) {
        return;
      }

      this.dispatchEvent(
        new CustomEvent("add-split", {
          bubbles: true,
          detail: {
            leafId: addButton.dataset.addSplit
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

    const { node, detail, depth, maxDepth, selectedRowId, locale = "en" } = this._data;
    const messages = getMessages(locale);
    const canAdd = depth <= maxDepth;
    const bucketClass = [
      "leaf-bucket",
      detail.targetRowIds.length ? "contains-target" : "",
      detail.leafId === this._data.activeLeafId ? "is-active" : ""
    ]
      .filter(Boolean)
      .join(" ");

    this.innerHTML = `
      <section class="${bucketClass}">
        <div class="leaf-header">
          <div>
            <p class="eyebrow">${messages.common.leaf(node.id)}</p>
            <h4>${translateClassLabel(detail.predictedLabel, locale)}</h4>
          </div>
          ${
            canAdd
              ? `<button type="button" class="mini-action" data-add-split="${node.id}">${messages.treeEditor.addSplit}</button>`
              : `<span class="mini-tag">${messages.leafBucket.depthLimitReached}</span>`
          }
        </div>
        <p class="leaf-meta">
          ${messages.leafBucket.knownRowsSummary(detail.knownRowIds.length, detail.counts.Budget, detail.counts.Premium)}
        </p>
        <p class="leaf-meta">${describeFallback(detail.fallbackReason, locale)}</p>
        <row-ball-layer></row-ball-layer>
      </section>
    `;

    const rowBallLayer = this.querySelector("row-ball-layer");
    rowBallLayer.rows = detail.rows;
    rowBallLayer.selectedRowId = selectedRowId;
    rowBallLayer.locale = locale;
  }
}

customElements.define("leaf-bucket", LeafBucket);
