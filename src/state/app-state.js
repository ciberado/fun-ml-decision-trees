import { DATASET, getTargetRowId } from "../data/dataset.js";
import { STARTER_TREE } from "../data/starter-tree.js";
import { makeDefaultSplit, makeLeaf, findNodeById, getSplitDepthForLeafPath, normalizeCondition, replaceNodeAtPath, validateTree, cloneTree, collectNodeIds } from "../domain/tree-utils.js";
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
  const dataset = structuredClone(DATASET);

  return deriveState({
    dataset,
    baselineTree: structuredClone(STARTER_TREE),
    tree: makeLeaf("root"),
    ui: {
      selectedRowId: getTargetRowId(dataset),
      showEvaluation: true,
      splitProgress: {}
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
    tree: makeLeaf("root"),
    ui: {
      ...state.ui,
      selectedRowId: getTargetRowId(state.dataset),
      splitProgress: {}
    }
  });
}

export function forceRecompute(state) {
  return deriveState(state);
}

export function previewNodeCondition(state, nodeId, patch) {
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

export function playSplitNode(state, nodeId) {
  const nodeFlow = state.editor.nodesById[nodeId];

  if (!nodeFlow || nodeFlow.type !== "split") {
    throw new Error(`Split node ${nodeId} was not found`);
  }

  if (!nodeFlow.canPlay) {
    return state;
  }

  return deriveState({
    ...state,
    ui: {
      ...state.ui,
      splitProgress: {
        ...state.ui.splitProgress,
        [nodeId]: (state.ui.splitProgress[nodeId] ?? 0) + 1
      }
    }
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
    leafId,
    createNodeId("leaf"),
    createNodeId("leaf")
  );

  const tree = replaceNodeAtPath(state.tree, found.path, replacement);
  validateTree(tree);

  return deriveState({
    ...state,
    tree,
    ui: {
      ...state.ui,
      splitProgress: {
        ...state.ui.splitProgress,
        [replacement.id]: 0
      }
    }
  });
}

export function removeSplitNode(state, nodeId) {
  const found = findNodeById(state.tree, nodeId);

  if (!found || found.node.type !== "split") {
    throw new Error(`Split node ${nodeId} was not found`);
  }

  const replacement = makeLeaf(nodeId);

  const tree = replaceNodeAtPath(state.tree, found.path, replacement);
  validateTree(tree);
  const removedIds = new Set(collectNodeIds(found.node));
  const nextSplitProgress = Object.fromEntries(
    Object.entries(state.ui.splitProgress).filter(([id]) => !removedIds.has(id))
  );

  return deriveState({
    ...state,
    tree,
    ui: {
      ...state.ui,
      splitProgress: nextSplitProgress
    }
  });
}
