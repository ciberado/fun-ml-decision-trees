import test from "node:test";
import assert from "node:assert/strict";
import {
  addSplitAtLeaf,
  createInitialState,
  removeSplitNode,
  resetTree,
  updateNodeCondition
} from "../../src/state/app-state.js";

test("editing a split recomputes evaluation warnings", () => {
  const initialState = createInitialState();
  const nextState = updateNodeCondition(initialState, "split-size-b", {
    operator: ">",
    value: 70
  });

  assert.equal(nextState.prediction.predictedLabel, "Budget");
  assert.equal(nextState.evaluation.accuracy, 5 / 7);
  assert.equal(nextState.evaluation.hasAccuracyWarning, true);
  assert.equal(nextState.evaluation.hasFalsePositiveWarning, true);
  assert.equal(nextState.evaluation.hasFalseNegativeWarning, false);
});

test("adding a split to a leaf creates new empty-leaf details", () => {
  const initialState = createInitialState();
  const nextState = addSplitAtLeaf(initialState, "leaf-not-b");

  const splitNode = nextState.tree.falseBranch;
  assert.equal(splitNode.type, "split");
  assert.ok(nextState.routing.leafDetails[splitNode.trueBranch.id]);
  assert.ok(nextState.routing.leafDetails[splitNode.falseBranch.id]);
});

test("removing a split collapses the subtree and reset restores the starter tree", () => {
  const initialState = createInitialState();
  const collapsedState = removeSplitNode(initialState, "root");

  assert.equal(collapsedState.tree.type, "leaf");
  assert.equal(collapsedState.evaluation.accuracy, 4 / 7);

  const restoredState = resetTree(collapsedState);
  assert.equal(restoredState.tree.type, "split");
  assert.equal(restoredState.tree.id, "root");
  assert.equal(restoredState.evaluation.accuracy, 6 / 7);
});
