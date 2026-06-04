import { formatPrice, formatPricePerM2 } from "../utils/formatters.js";

class DatasetTable extends HTMLElement {
  set state(value) {
    this._state = value;
    this.render();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      const rowButton = event.target.closest("[data-row-select]");

      if (!rowButton) {
        return;
      }

      this.dispatchEvent(
        new CustomEvent("row-select", {
          bubbles: true,
          detail: {
            rowId: Number(rowButton.dataset.rowSelect)
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

    const { dataset, selectedRow, prediction } = this._state;
    const activeRow = dataset.find((row) => row.id === selectedRow.rowId);

    this.innerHTML = `
      <section class="subpanel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Dataset</p>
          </div>
        </div>

        <div class="table-wrap">
          <table class="dataset-table">
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Price</th>
                <th scope="col">Class</th>
                <th scope="col">Size</th>
                <th scope="col">N.</th>
                <th scope="col">€/m2</th>
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
                    <tr class="${rowClass}">
                      <td>
                        <button type="button" class="row-select-button" data-row-select="${row.id}">
                          ${row.id}
                        </button>
                      </td>
                      <td>${formatPrice(row.price)}</td>
                      <td>${row.label ?? "?"}</td>
                      <td>${row.size} m2</td>
                      <td>${row.neighborhood}</td>
                      <td>${formatPricePerM2(row)}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>

        <section class="detail-card">
          <p class="eyebrow">Selected Row</p>
          <h3>Row ${activeRow.id}${activeRow.isTarget ? " (target row)" : ""}</h3>
          <p class="detail-copy">
            Path: ${selectedRow.pathSummary.join(" -> ")}
          </p>
          <p class="detail-copy">
            Leaf prediction: <strong>${selectedRow.leafPrediction}</strong>
          </p>
          <p class="detail-copy">
            Row 8 currently lands in <strong>${prediction.predictedLeafId}</strong> and is predicted as
            <strong>${prediction.predictedLabel}</strong>.
          </p>
        </section>
      </section>
    `;
  }
}

customElements.define("dataset-table", DatasetTable);
