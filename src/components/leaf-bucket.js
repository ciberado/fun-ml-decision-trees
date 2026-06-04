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

    const { node, detail, depth, maxDepth, selectedRowId } = this._data;
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
            <p class="eyebrow">Leaf ${node.id}</p>
            <h4>${detail.predictedLabel}</h4>
          </div>
          ${
            canAdd
              ? `<button type="button" class="mini-action" data-add-split="${node.id}">Add Split</button>`
              : `<span class="mini-tag">Depth limit reached</span>`
          }
        </div>
        <p class="leaf-meta">
          Known rows: ${detail.knownRowIds.length} | Budget ${detail.counts.Budget} | Premium ${detail.counts.Premium}
        </p>
        <p class="leaf-meta">${describeFallback(detail.fallbackReason)}</p>
        <row-ball-layer></row-ball-layer>
      </section>
    `;

    const rowBallLayer = this.querySelector("row-ball-layer");
    rowBallLayer.rows = detail.rows;
    rowBallLayer.selectedRowId = selectedRowId;
  }
}

customElements.define("leaf-bucket", LeafBucket);
