import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAveragePriceModel,
  calculateAveragePricePerM2,
  classifyEstimatedPrice
} from "../../src/domain/average-price-model.js";
import { DATASET } from "../../src/data/dataset.js";

test("average price model extrapolates the target row price from known price per m2", () => {
  const averagePricePerM2 = calculateAveragePricePerM2(DATASET);
  const model = buildAveragePriceModel(DATASET);

  assert.equal(model.knownRowCount, 14);
  assert.equal(model.targetRowId, 1);
  assert.equal(model.targetSize, 60);
  assert.equal(model.threshold, 250);
  assert.equal(model.predictedLabel, "Budget");
  assert.equal(averagePricePerM2, model.averagePricePerM2);
  assert.ok(Math.abs(model.averagePricePerM2 - 2.750188592773675) < 1e-12);
  assert.ok(Math.abs(model.estimatedPrice - 165.0113155664205) < 1e-12);
});

test("classifyEstimatedPrice keeps the documented budget boundary inclusive", () => {
  assert.equal(classifyEstimatedPrice(250), "Budget");
  assert.equal(classifyEstimatedPrice(250.01), "Premium");
});
