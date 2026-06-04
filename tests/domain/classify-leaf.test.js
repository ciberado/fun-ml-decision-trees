import test from "node:test";
import assert from "node:assert/strict";
import { classifyLeaf } from "../../src/domain/classify-leaf.js";

test("classifyLeaf returns direct majority when present", () => {
  const result = classifyLeaf(
    [
      { id: 1, label: "Budget", isTarget: false },
      { id: 4, label: "Premium", isTarget: false },
      { id: 2, label: "Budget", isTarget: false }
    ],
    "Budget"
  );

  assert.equal(result.predictedLabel, "Budget");
  assert.equal(result.usedTieBreak, false);
  assert.equal(result.fallbackReason, "majority");
});

test("classifyLeaf uses global majority on ties and empty leaves", () => {
  const tieResult = classifyLeaf(
    [
      { id: 1, label: "Budget", isTarget: false },
      { id: 4, label: "Premium", isTarget: false }
    ],
    "Budget"
  );
  const emptyResult = classifyLeaf([], "Budget");

  assert.equal(tieResult.predictedLabel, "Budget");
  assert.equal(tieResult.fallbackReason, "tie");
  assert.equal(emptyResult.predictedLabel, "Budget");
  assert.equal(emptyResult.fallbackReason, "empty");
});
