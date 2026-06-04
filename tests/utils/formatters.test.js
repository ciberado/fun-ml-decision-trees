import test from "node:test";
import assert from "node:assert/strict";
import {
  describeFallback,
  formatCondition,
  formatPercent,
  formatPrice,
  formatPricePerM2
} from "../../src/utils/formatters.js";

test("formatters localize labels and numeric output", () => {
  assert.equal(
    formatCondition({ feature: "size", operator: "<=", value: 80 }, "ca"),
    "Mida <= 80"
  );
  assert.equal(
    formatCondition({ feature: "neighborhood", operator: "=", value: "B" }, "es"),
    "Barrio = B"
  );
  assert.match(formatPercent(0.125, "es"), /^12,5/);
  assert.match(formatPrice(180, "ca"), /180/);
  assert.match(formatPricePerM2({ price: 180, size: 100 }, "es"), /1,80/);
  assert.equal(
    describeFallback("tie", "es"),
    "Se usa la mayoría global porque la hoja está empatada."
  );
});
