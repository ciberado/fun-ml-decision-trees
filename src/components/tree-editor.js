import "./tree-node.js";

class TreeEditor extends HTMLElement {
  set state(value) {
    this._state = value;
    this.render();
  }

  render() {
    if (!this._state) {
      return;
    }

    this.innerHTML = `
      <section class="subpanel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Tree Editor</p>
            <h2>Process one ball at a time</h2>
          </div>
          <p class="inline-hint">Add a split to a bucket, then use <strong>Play</strong> to move the next ball into the matching side.</p>
        </div>
        <tree-node></tree-node>
      </section>
    `;

    this.querySelector("tree-node").data = {
      flow: this._state.editor.flow,
      treeNode: this._state.tree,
      dataset: this._state.dataset,
      splitProgress: this._state.ui.splitProgress,
      selectedRowId: this._state.selectedRow.rowId,
      selectedLeafId: this._state.selectedRow.leafId
    };
  }
}

customElements.define("tree-editor", TreeEditor);
