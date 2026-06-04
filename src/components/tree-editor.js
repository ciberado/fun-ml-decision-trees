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

    const activeNodeIds = this._state.selectedRow.path.map((step) => step.nodeId);

    this.innerHTML = `
      <section class="subpanel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Tree Editor</p>
            <h2>Binary rules route the row balls</h2>
          </div>
          <p class="inline-hint">Only <strong>size</strong> and <strong>neighborhood</strong> can be used for splits. Max depth: 4.</p>
        </div>
        <tree-node></tree-node>
      </section>
    `;

    this.querySelector("tree-node").data = {
      node: this._state.tree,
      depth: 1,
      leafDetails: this._state.routing.leafDetails,
      selectedRowId: this._state.selectedRow.rowId,
      activeNodeIds,
      activeLeafId: this._state.selectedRow.leafId
    };
  }
}

customElements.define("tree-editor", TreeEditor);
