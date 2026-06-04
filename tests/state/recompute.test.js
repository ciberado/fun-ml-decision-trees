import test from "node:test";
import assert from "node:assert/strict";
import {
  addSplitAtLeaf,
  createInitialState,
  playSplitNode,
  removeSplitNode,
  resetTree,
  updateNodeCondition
} from "../../src/state/app-state.js";

test("editing a split recomputes evaluation warnings", () => {
  const initialState = resetTree(createInitialState());
  const nextState = updateNodeCondition(initialState, "split-size-b", {
    feature: "neighborhood",
    operator: "=",
    value: "A"
  });

  assert.equal(nextState.prediction.predictedLabel, "Premium");
  assert.equal(nextState.evaluation.accuracy, 5 / 7);
  assert.equal(nextState.evaluation.hasAccuracyWarning, true);
  assert.equal(nextState.evaluation.hasFalsePositiveWarning, true);
  assert.equal(nextState.evaluation.hasFalseNegativeWarning, false);
});

test("adding a split to a leaf creates new empty-leaf details", () => {
  const initialState = createInitialState();
  const nextState = addSplitAtLeaf(initialState, "root");

  const splitNode = nextState.tree;
  assert.equal(splitNode.type, "split");
  assert.ok(nextState.routing.leafDetails[splitNode.trueBranch.id]);
  assert.ok(nextState.routing.leafDetails[splitNode.falseBranch.id]);
  assert.equal(nextState.editor.nodesById.root.processedCount, 0);
});

test("removing a split collapses the subtree and reset restores the starter tree", () => {
  const initialState = addSplitAtLeaf(createInitialState(), "root");
  const collapsedState = removeSplitNode(initialState, "root");

  assert.equal(collapsedState.tree.type, "leaf");
  assert.equal(collapsedState.evaluation.accuracy, 4 / 7);

  const restoredState = resetTree(collapsedState);
  assert.equal(restoredState.tree.type, "split");
  assert.equal(restoredState.tree.id, "root");
  assert.equal(restoredState.evaluation.accuracy, 6 / 7);
});

test("playing a split moves one ball at a time and condition edits redistribute processed rows", () => {
  const withSplit = addSplitAtLeaf(createInitialState(), "root");
  const afterOnePlay = playSplitNode(withSplit, "root");

  assert.equal(afterOnePlay.editor.nodesById.root.processedCount, 1);
  assert.deepEqual(afterOnePlay.editor.nodesById.root.remainingRowIds, [2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(afterOnePlay.editor.nodesById[afterOnePlay.tree.trueBranch.id].rowIds, []);
  assert.deepEqual(afterOnePlay.editor.nodesById[afterOnePlay.tree.falseBranch.id].rowIds, [1]);

  const redistributed = updateNodeCondition(afterOnePlay, "root", {
    operator: ">",
    value: 80
  });

  assert.equal(redistributed.editor.nodesById.root.processedCount, 1);
  assert.deepEqual(redistributed.editor.nodesById.root.remainingRowIds, [2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(redistributed.editor.nodesById[redistributed.tree.trueBranch.id].rowIds, [1]);
  assert.deepEqual(redistributed.editor.nodesById[redistributed.tree.falseBranch.id].rowIds, []);
});

test("leaf buckets get a class marker only after upstream processing is complete", () => {
  let state = addSplitAtLeaf(createInitialState(), "root");

  assert.equal(state.editor.nodesById[state.tree.trueBranch.id].majorityLabel, null);
  assert.equal(state.editor.nodesById[state.tree.trueBranch.id].isSettled, false);

  for (let index = 0; index < state.dataset.length; index += 1) {
    state = playSplitNode(state, "root");
  }

  assert.equal(state.editor.nodesById.root.canPlay, false);
  assert.equal(state.editor.nodesById[state.tree.trueBranch.id].isSettled, true);
  assert.equal(state.editor.nodesById[state.tree.trueBranch.id].majorityLabel, null);
  assert.equal(state.editor.nodesById[state.tree.falseBranch.id].majorityLabel, "Budget");
});
