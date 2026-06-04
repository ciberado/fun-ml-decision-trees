import { getMessages, translateClassLabel } from "../i18n/index.js";
import { formatPrice, formatPricePerM2 } from "../utils/formatters.js";

class RowBallLayer extends HTMLElement {
  set rows(value) {
    this._rows = value;
    this.render();
  }

  set selectedRowId(value) {
    this._selectedRowId = value;
    this.render();
  }

  set locale(value) {
    this._locale = value;
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

  getTooltip(row) {
    const locale = this._locale ?? "en";
    const messages = getMessages(locale);
    const price = formatPrice(row.price, locale);
    const label = translateClassLabel(row.label, locale);
    const pricePerM2 = formatPricePerM2(row, locale);

    return [
      row.isTarget ? messages.common.targetRow(row.id) : messages.common.row(row.id),
      `${messages.rowTooltip.class}: ${label}`,
      `${messages.rowTooltip.price}: ${price}`,
      `${messages.rowTooltip.size}: ${messages.common.sizeValue(row.size)}`,
      `${messages.rowTooltip.neighborhood}: ${row.neighborhood}`,
      `${messages.rowTooltip.pricePerM2}: ${pricePerM2}`
    ].join("\n");
  }

  render() {
    const rows = this._rows ?? [];
    const locale = this._locale ?? "en";
    const messages = getMessages(locale);

    this.innerHTML = `
      <div class="ball-cluster">
        ${rows
          .map((row) => {
            const classes = [
              "row-ball",
              row.label === "Premium" ? "is-premium" : "",
              row.label === "Budget" ? "is-budget" : "",
              row.isTarget ? "is-target" : "",
              row.id === this._selectedRowId ? "is-selected" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return `
              <button
                type="button"
                class="${classes}"
                data-row-ball="${row.id}"
                aria-label="${messages.common.selectRow(row.id)}"
                title="${this.getTooltip(row)}"
              >
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
