class RowBallLayer extends HTMLElement {
  set rows(value) {
    this._rows = value;
    this.render();
  }

  set selectedRowId(value) {
    this._selectedRowId = value;
    this.render();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      const button = event.target.closest("[data-row-ball]");

      if (!button) {
        return;
      }

      this.dispatchEvent(
        new CustomEvent("row-select", {
          bubbles: true,
          detail: {
            rowId: Number(button.dataset.rowBall)
          }
        })
      );
    });

    this.render();
  }

  render() {
    const rows = this._rows ?? [];

    this.innerHTML = `
      <div class="ball-cluster">
        ${rows
          .map((row) => {
            const classes = [
              "row-ball",
              row.isTarget ? "is-target" : "",
              row.id === this._selectedRowId ? "is-selected" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return `
              <button type="button" class="${classes}" data-row-ball="${row.id}" aria-label="Select row ${row.id}">
                ${row.id}
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  }
}

customElements.define("row-ball-layer", RowBallLayer);
