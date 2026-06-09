import test from "node:test";
import assert from "node:assert/strict";
import { DATASET } from "../../src/data/dataset.js";
import { evaluateModel } from "../../src/domain/evaluate-model.js";
import { routeAllRows } from "../../src/domain/route-all-rows.js";
import { trainDecisionTree } from "../../src/domain/train-decision-tree.js";

function collectLeafDetails(tree, routing) {
  const details = {};

  function visit(node) {
    if (node.type === "leaf") {
      const assignment = routing.leafAssignments[node.id];
      details[node.id] = {
        leafId: node.id,
        rowIds: assignment.rowIds,
        knownRowIds: assignment.knownRowIds,
        targetRowIds: assignment.targetRowIds,
        rows: assignment.rowIds.map((rowId) => DATASET.find((row) => row.id === rowId)),
        ...node.classification
      };
      return;
    }

    visit(node.trueBranch);
    visit(node.falseBranch);
  }

  visit(tree);
  return details;
}

test("trainDecisionTree chooses the expected root and branch splits", () => {
  const model = trainDecisionTree(DATASET, { maxDepth: 2 });

  assert.deepEqual(model.tree.condition, {
    feature: "neighborhood",
    operator: "=",
    value: "B"
  });
  assert.deepEqual(model.tree.trueBranch.condition, {
    feature: "size",
    operator: "<=",
    value: 80
  });
  assert.deepEqual(model.tree.falseBranch.condition, {
    feature: "size",
    operator: "<=",
    value: 85
  });
});

test("trainDecisionTree classifies every known row correctly at depth two", () => {
  const model = trainDecisionTree(DATASET, { maxDepth: 2 });
  const routing = routeAllRows(model.tree, DATASET);
  const leafDetails = collectLeafDetails(model.tree, routing);
  const evaluation = evaluateModel(DATASET, routing.rowLeafIds, leafDetails);

  assert.equal(evaluation.accuracy, 1);
  assert.deepEqual(evaluation.incorrectRows, []);
});

test("trainDecisionTree predicts the target row as Budget", () => {
  const model = trainDecisionTree(DATASET, { maxDepth: 2 });
  const routing = routeAllRows(model.tree, DATASET);
  const leafDetails = collectLeafDetails(model.tree, routing);
  const targetLeaf = leafDetails[routing.rowLeafIds[1]];

  assert.equal(targetLeaf.predictedLabel, "Budget");
});
