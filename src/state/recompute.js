import { compareBaseline } from "../domain/compare-baseline.js";
import { classifyLeaf } from "../domain/classify-leaf.js";
import { MAX_TREE_DEPTH } from "../domain/config.js";
import { evaluateCondition } from "../domain/evaluate-condition.js";
import { evaluateModel } from "../domain/evaluate-model.js";
import { routeAllRows } from "../domain/route-all-rows.js";
import { validateTree } from "../domain/tree-utils.js";

function computeGlobalMajority(dataset) {
  const knownRows = dataset.filter((row) => !row.isTarget);
  const counts = knownRows.reduce(
    (summary, row) => {
      summary[row.label] += 1;
      return summary;
    },
    { Budget: 0, Premium: 0 }
  );

  return {
    counts,
    label: counts.Budget >= counts.Premium ? "Budget" : "Premium"
  };
}

function buildLeafDetails(dataset, routing, globalMajority) {
  const rowsById = Object.fromEntries(dataset.map((row) => [row.id, row]));
  const details = {};

  for (const [leafId, assignment] of Object.entries(routing.leafAssignments)) {
    const rows = assignment.rowIds.map((rowId) => rowsById[rowId]);
    const classification = classifyLeaf(rows, globalMajority.label);
    details[leafId] = {
      leafId,
      rowIds: assignment.rowIds,
      knownRowIds: assignment.knownRowIds,
      targetRowIds: assignment.targetRowIds,
      rows,
      ...classification
    };
  }

  return details;
}

function summarizePath(path, targetLeafId) {
  const steps = path.map((step) => {
    const operatorText = `${step.condition.feature} ${step.condition.operator} ${step.condition.value}`;
    return `${operatorText} -> ${step.decision ? "true" : "false"}`;
  });

  return [...steps, `Leaf ${targetLeafId}`];
}

export function buildEditorFlow(node, rows, splitProgress, nodesById = {}, depth = 1, isSettled = true) {
  if (node.type === "leaf") {
    const knownRows = rows.filter((row) => !row.isTarget && row.label);
    const counts = knownRows.reduce(
      (summary, row) => {
        summary[row.label] += 1;
        return summary;
      },
      { Budget: 0, Premium: 0 }
    );
    const majorityLabel =
      counts.Budget === counts.Premium || knownRows.length === 0
        ? null
        : counts.Budget > counts.Premium
          ? "Budget"
          : "Premium";

    const leafFlow = {
      nodeId: node.id,
      type: "leaf",
      depth,
      rowIds: rows.map((row) => row.id),
      rows,
      isSettled,
      majorityLabel,
      majorityCounts: counts,
      canAddSplit: depth <= MAX_TREE_DEPTH,
      canPlay: false,
      processedCount: 0,
      remainingRowIds: rows.map((row) => row.id),
      trueBranch: null,
      falseBranch: null
    };

    nodesById[node.id] = leafFlow;
    return leafFlow;
  }

  const processedCount = Math.max(
    0,
    Math.min(splitProgress[node.id] ?? 0, rows.length)
  );
  const processedRows = rows.slice(0, processedCount);
  const remainingRows = rows.slice(processedCount);
  const trueRows = [];
  const falseRows = [];

  for (const row of processedRows) {
    if (evaluateCondition(node.condition, row)) {
      trueRows.push(row);
    } else {
      falseRows.push(row);
    }
  }

  const splitFlow = {
    nodeId: node.id,
    type: "split",
    depth,
    isSettled,
    rowIds: rows.map((row) => row.id),
    rows,
    processedCount,
    canPlay: processedCount < rows.length,
    canAddSplit: false,
    remainingRowIds: remainingRows.map((row) => row.id),
    remainingRows,
    trueRowIds: trueRows.map((row) => row.id),
    falseRowIds: falseRows.map((row) => row.id),
    trueBranch: buildEditorFlow(
      node.trueBranch,
      trueRows,
      splitProgress,
      nodesById,
      depth + 1,
      isSettled && processedCount === rows.length
    ),
    falseBranch: buildEditorFlow(
      node.falseBranch,
      falseRows,
      splitProgress,
      nodesById,
      depth + 1,
      isSettled && processedCount === rows.length
    )
  };

  nodesById[node.id] = splitFlow;
  return splitFlow;
}

export function recomputeDerivedState({ dataset, tree, baselineTree, ui }) {
  validateTree(tree);
  validateTree(baselineTree);

  const globalMajority = computeGlobalMajority(dataset);
  const routing = routeAllRows(tree, dataset);
  const leafDetails = buildLeafDetails(dataset, routing, globalMajority);
  const evaluationCore = evaluateModel(dataset, routing.rowLeafIds, leafDetails);
  const baselineRouting = routeAllRows(baselineTree, dataset);
  const baselineLeafDetails = buildLeafDetails(dataset, baselineRouting, globalMajority);
  const baselineEvaluation = evaluateModel(dataset, baselineRouting.rowLeafIds, baselineLeafDetails);
  const warnings = compareBaseline(evaluationCore, baselineEvaluation);

  const targetRowId = dataset.find((row) => row.isTarget)?.id;
  const targetLeafId = routing.rowLeafIds[targetRowId];
  const targetLeaf = leafDetails[targetLeafId];
  const selectedRowId = ui.selectedRowId ?? targetRowId;
  const selectedLeafId = routing.rowLeafIds[selectedRowId];
  const selectedLeaf = leafDetails[selectedLeafId];
  const selectedPath = routing.rowPaths[selectedRowId] ?? [];
  const editorNodesById = {};
  const editorFlow = buildEditorFlow(tree, dataset, ui.splitProgress ?? {}, editorNodesById);

  return {
    globalMajority,
    routing: {
      ...routing,
      leafDetails
    },
    prediction: {
      targetRowId,
      predictedLabel: targetLeaf.predictedLabel,
      predictedLeafId: targetLeafId,
      usedTieBreak: targetLeaf.usedTieBreak,
      fallbackReason: targetLeaf.fallbackReason,
      leafRowIds: targetLeaf.rowIds,
      knownLeafRowIds: targetLeaf.knownRowIds,
      path: routing.rowPaths[targetRowId],
      pathSummary: summarizePath(routing.rowPaths[targetRowId], targetLeafId)
    },
    evaluation: {
      ...evaluationCore,
      baselineAccuracy: baselineEvaluation.accuracy,
      baselineFalsePositives: baselineEvaluation.falsePositives,
      baselineFalseNegatives: baselineEvaluation.falseNegatives,
      ...warnings
    },
    selectedRow: {
      rowId: selectedRowId,
      leafId: selectedLeafId,
      path: selectedPath,
      pathSummary: summarizePath(selectedPath, selectedLeafId),
      leafPrediction: selectedLeaf.predictedLabel,
      leafRowIds: selectedLeaf.rowIds,
      usedTieBreak: selectedLeaf.usedTieBreak,
      fallbackReason: selectedLeaf.fallbackReason
    },
    editor: {
      flow: editorFlow,
      nodesById: editorNodesById
    }
  };
}
