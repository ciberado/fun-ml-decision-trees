import { FEATURE_CONFIG, MAX_TREE_DEPTH } from "./config.js";

export function cloneTree(tree) {
  return structuredClone(tree);
}

export function makeLeaf(id) {
  return {
    id,
    type: "leaf"
  };
}

export function collectNodeIds(node, nodeIds = []) {
  nodeIds.push(node.id);

  if (node.type === "split") {
    collectNodeIds(node.trueBranch, nodeIds);
    collectNodeIds(node.falseBranch, nodeIds);
  }

  return nodeIds;
}

export function makeDefaultSplit(id, trueLeafId, falseLeafId) {
  return {
    id,
    type: "split",
    condition: {
      feature: "size",
      operator: "<=",
      value: FEATURE_CONFIG.size.defaultValue
    },
    trueBranch: makeLeaf(trueLeafId),
    falseBranch: makeLeaf(falseLeafId)
  };
}

export function getNodeAtPath(tree, path) {
  let current = tree;

  for (const branchKey of path) {
    current = current?.[branchKey];
  }

  return current;
}

export function findNodeById(tree, nodeId, path = []) {
  if (tree.id === nodeId) {
    return { node: tree, path };
  }

  if (tree.type !== "split") {
    return null;
  }

  return (
    findNodeById(tree.trueBranch, nodeId, [...path, "trueBranch"]) ||
    findNodeById(tree.falseBranch, nodeId, [...path, "falseBranch"])
  );
}

export function replaceNodeAtPath(tree, path, nextNode) {
  if (path.length === 0) {
    return nextNode;
  }

  const nextTree = cloneTree(tree);
  const parentPath = path.slice(0, -1);
  const branchKey = path[path.length - 1];
  const parentNode = getNodeAtPath(nextTree, parentPath);
  parentNode[branchKey] = nextNode;
  return nextTree;
}

export function normalizeCondition(condition) {
  const feature = FEATURE_CONFIG[condition.feature];

  if (!feature) {
    throw new Error(`Unsupported feature: ${condition.feature}`);
  }

  const operator = feature.operators.includes(condition.operator)
    ? condition.operator
    : feature.operators[0];

  let value = condition.value;

  if (feature.type === "numeric") {
    const parsed = Number(value);
    value = Number.isFinite(parsed) ? parsed : feature.defaultValue;
  } else {
    const normalized = String(value);
    value = feature.options.includes(normalized) ? normalized : feature.defaultValue;
  }

  return {
    feature: condition.feature,
    operator,
    value
  };
}

export function validateCondition(condition) {
  const feature = FEATURE_CONFIG[condition.feature];

  if (!feature) {
    throw new Error(`Feature ${condition.feature} is not allowed`);
  }

  if (!feature.operators.includes(condition.operator)) {
    throw new Error(`Operator ${condition.operator} is not valid for ${condition.feature}`);
  }

  if (feature.type === "numeric" && !Number.isFinite(Number(condition.value))) {
    throw new Error(`Feature ${condition.feature} requires a numeric comparison value`);
  }

  if (feature.type === "categorical" && !feature.options.includes(String(condition.value))) {
    throw new Error(`Feature ${condition.feature} requires one of ${feature.options.join(", ")}`);
  }
}

export function getSplitDepthForLeafPath(path) {
  return path.length;
}

export function getMaxSplitDepth(node, depth = 1) {
  if (node.type !== "split") {
    return depth - 1;
  }

  return Math.max(
    depth,
    getMaxSplitDepth(node.trueBranch, depth + 1),
    getMaxSplitDepth(node.falseBranch, depth + 1)
  );
}

export function validateTree(node, depth = 1) {
  if (!node || !node.id || !node.type) {
    throw new Error("Every tree node must have id and type");
  }

  if (node.type === "leaf") {
    return true;
  }

  if (node.type !== "split") {
    throw new Error(`Unsupported node type ${node.type}`);
  }

  if (depth > MAX_TREE_DEPTH) {
    throw new Error(`Tree depth cannot exceed ${MAX_TREE_DEPTH}`);
  }

  validateCondition(node.condition);

  if (!node.trueBranch || !node.falseBranch) {
    throw new Error("Split nodes must have true and false branches");
  }

  validateTree(node.trueBranch, depth + 1);
  validateTree(node.falseBranch, depth + 1);
  return true;
}
