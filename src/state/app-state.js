import { DATASET } from "../data/dataset.js";
import { STARTER_TREE } from "../data/starter-tree.js";
import { makeDefaultSplit, findNodeById, getSplitDepthForLeafPath, normalizeCondition, replaceNodeAtPath, validateTree, cloneTree } from "../domain/tree-utils.js";
import { MAX_TREE_DEPTH } from "../domain/config.js";
import { recomputeDerivedState } from "./recompute.js";
import { createNodeId } from "../utils/ids.js";

function deriveState(source) {
  return {
    ...source,
    ...recomputeDerivedState(source)
  };
}

export function createInitialState() {
  return deriveState({
    dataset: structuredClone(DATASET),
    baselineTree: structuredClone(STARTER_TREE),
    tree: structuredClone(STARTER_TREE),
    ui: {
      selectedRowId: 8,
      showEvaluation: true
    }
  });
}

export function selectRow(state, rowId) {
  return deriveState({
    ...state,
    ui: {
      ...state.ui,
      selectedRowId: Number(rowId)
    }
  });
}

export function toggleEvaluation(state) {
  return {
    ...state,
    ui: {
      ...state.ui,
      showEvaluation: !state.ui.showEvaluation
    }
  };
}

export function resetTree(state) {
  return deriveState({
    ...state,
    tree: structuredClone(state.baselineTree),
    ui: {
      ...state.ui,
      selectedRowId: 8
    }
  });
}

export function forceRecompute(state) {
  return deriveState(state);
}

export function updateNodeCondition(state, nodeId, patch) {
  const tree = cloneTree(state.tree);
  const found = findNodeById(tree, nodeId);

  if (!found || found.node.type !== "split") {
    throw new Error(`Split node ${nodeId} was not found`);
  }

  found.node.condition = normalizeCondition({
    ...found.node.condition,
    ...patch
  });

  validateTree(tree);

  return deriveState({
    ...state,
    tree
  });
}

export function addSplitAtLeaf(state, leafId) {
  const found = findNodeById(state.tree, leafId);

  if (!found || found.node.type !== "leaf") {
    throw new Error(`Leaf ${leafId} was not found`);
  }

  const nextSplitDepth = getSplitDepthForLeafPath(found.path) + 1;

  if (nextSplitDepth > MAX_TREE_DEPTH) {
    throw new Error(`Cannot add a split deeper than ${MAX_TREE_DEPTH}`);
  }

  const replacement = makeDefaultSplit(
    createNodeId("split"),
    createNodeId("leaf"),
    createNodeId("leaf")
  );

  const tree = replaceNodeAtPath(state.tree, found.path, replacement);
  validateTree(tree);

  return deriveState({
    ...state,
    tree
  });
}

export function removeSplitNode(state, nodeId) {
  const found = findNodeById(state.tree, nodeId);

  if (!found || found.node.type !== "split") {
    throw new Error(`Split node ${nodeId} was not found`);
  }

  const replacement = {
    id: createNodeId("leaf"),
    type: "leaf"
  };

  const tree = replaceNodeAtPath(state.tree, found.path, replacement);
  validateTree(tree);

  return deriveState({
    ...state,
    tree
  });
}
