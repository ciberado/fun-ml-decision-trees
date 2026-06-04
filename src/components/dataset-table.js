import { getMessages, translateClassLabel } from "../i18n/index.js";
import { formatPrice, formatPricePerM2 } from "../utils/formatters.js";

class DatasetTable extends HTMLElement {
  set state(value) {
    this._state = value;
    this.render();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      const rowButton = event.target.closest("[data-row-select]");
      const rowElement = event.target.closest("[data-row-id]");

      if (!rowButton && !rowElement) {
        return;
      }

      const rowId = Number(rowButton?.dataset.rowSelect ?? rowElement?.dataset.rowId);

      this.dispatchEvent(
        new CustomEvent("row-select", {
          bubbles: true,
          detail: {
            rowId
          }
        })
      );
    });

    this.render();
  }

  render() {
    if (!this._state) {
      return;
    }

    const { dataset, selectedRow, ui } = this._state;
    const messages = getMessages(ui.locale);

    this.innerHTML = `
      <section class="subpanel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">${messages.dataset.title}</p>
          </div>
        </div>

        <div class="table-wrap">
          <table class="dataset-table">
            <thead>
              <tr>
                <th scope="col">${messages.dataset.select}</th>
                <th scope="col">${messages.dataset.price}</th>
                <th scope="col">${messages.dataset.class}</th>
                <th scope="col">${messages.dataset.size}</th>
                <th scope="col">${messages.dataset.neighborhood}</th>
                <th scope="col">${messages.dataset.pricePerM2}</th>
              </tr>
            </thead>
            <tbody>
              ${dataset
                .map((row) => {
                  const rowClass = [
                    row.id === selectedRow.rowId ? "is-selected" : "",
                    row.isTarget ? "is-target" : ""
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return `
                    <tr class="${rowClass}" data-row-id="${row.id}">
                      <td>
                        <button type="button" class="row-select-button" data-row-select="${row.id}" aria-label="${messages.common.selectRow(row.id)}">
                          ${row.id}
                        </button>
                      </td>
                      <td>${formatPrice(row.price, ui.locale)}</td>
                      <td>${translateClassLabel(row.label, ui.locale)}</td>
                      <td>${messages.common.sizeValue(row.size)}</td>
                      <td>${row.neighborhood}</td>
                      <td>${formatPricePerM2(row, ui.locale)}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }
}

customElements.define("dataset-table", DatasetTable);
