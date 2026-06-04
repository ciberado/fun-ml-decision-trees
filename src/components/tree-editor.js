import { getMessages } from "../i18n/index.js";
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

    const messages = getMessages(this._state.ui.locale);

    this.innerHTML = `
      <section class="subpanel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">${messages.treeEditor.title}</p>
          </div>
          <p class="inline-hint">${messages.treeEditor.hint}</p>
        </div>
        <tree-node></tree-node>
      </section>
    `;

    this.querySelector("tree-node").data = {
      flow: this._state.editor.flow,
      treeNode: this._state.tree,
      dataset: this._state.dataset,
      splitProgress: this._state.ui.splitProgress,
      rootBucketLabel: messages.treeEditor.allRows,
      locale: this._state.ui.locale,
      bucketLabel: "",
      selectedRowId: this._state.selectedRow.rowId,
      selectedLeafId: this._state.selectedRow.leafId
    };
  }
}

customElements.define("tree-editor", TreeEditor);
