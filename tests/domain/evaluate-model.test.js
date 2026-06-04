import test from "node:test";
import assert from "node:assert/strict";
import { recomputeDerivedState } from "../../src/state/recompute.js";
import { DATASET } from "../../src/data/dataset.js";
import { STARTER_TREE } from "../../src/data/starter-tree.js";

test("starter tree produces the documented baseline metrics", () => {
  const state = recomputeDerivedState({
    dataset: structuredClone(DATASET),
    tree: structuredClone(STARTER_TREE),
    baselineTree: structuredClone(STARTER_TREE),
    ui: {
      selectedRowId: 1,
      showEvaluation: true
    }
  });

  assert.equal(state.prediction.predictedLabel, "Budget");
  assert.equal(state.evaluation.correctRows.length, 12);
  assert.equal(state.evaluation.accuracy, 12 / 14);
  assert.deepEqual(state.evaluation.falsePositives, []);
  assert.deepEqual(state.evaluation.falseNegatives, [5, 11]);
});
