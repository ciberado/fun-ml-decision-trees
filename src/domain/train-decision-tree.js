import { classifyLeaf } from "./classify-leaf.js";
import { FEATURE_CONFIG } from "./config.js";
import { evaluateCondition } from "./evaluate-condition.js";

const CLASS_LABELS = ["Budget", "Premium"];
const DEFAULT_MAX_DEPTH = 2;

function getKnownRows(rows) {
  return rows.filter((row) => !row.isTarget);
}

function countLabels(rows) {
  return rows.reduce(
    (counts, row) => {
      counts[row.label] += 1;
      return counts;
    },
    { Budget: 0, Premium: 0 }
  );
}

function calculateGini(rows) {
  if (rows.length === 0) {
    return 0;
  }

  const counts = countLabels(rows);
  return (
    1 -
    CLASS_LABELS.reduce((total, label) => {
      const proportion = counts[label] / rows.length;
      return total + proportion * proportion;
    }, 0)
  );
}

function getGlobalMajorityLabel(rows) {
  const counts = countLabels(getKnownRows(rows));
  return counts.Budget >= counts.Premium ? "Budget" : "Premium";
}

function orderCategoricalValues(config) {
  const values = config.options ?? [];

  if (!config.defaultValue || !values.includes(config.defaultValue)) {
    return values;
  }

  return [config.defaultValue, ...values.filter((value) => value !== config.defaultValue)];
}

function buildCandidateConditions(rows) {
  const candidates = [];

  for (const [feature, config] of Object.entries(FEATURE_CONFIG)) {
    if (config.type === "categorical") {
      for (const value of orderCategoricalValues(config)) {
        candidates.push({
          feature,
          operator: "=",
          value
        });
      }
      continue;
    }

    const thresholds = [...new Set(rows.map((row) => Number(row[feature])).filter(Number.isFinite))]
      .sort((left, right) => left - right)
      .slice(0, -1);

    for (const value of thresholds) {
      candidates.push({
        feature,
        operator: "<=",
        value
      });
    }
  }

  return candidates;
}

function scoreCandidate(rows, condition) {
  const trueRows = [];
  const falseRows = [];

  for (const row of rows) {
    if (evaluateCondition(condition, row)) {
      trueRows.push(row);
    } else {
      falseRows.push(row);
    }
  }

  if (trueRows.length === 0 || falseRows.length === 0) {
    return null;
  }

  const beforeGini = calculateGini(rows);
  const trueWeight = trueRows.length / rows.length;
  const falseWeight = falseRows.length / rows.length;
  const afterGini = trueWeight * calculateGini(trueRows) + falseWeight * calculateGini(falseRows);

  return {
    condition,
    gain: beforeGini - afterGini,
    beforeGini,
    afterGini,
    trueRows,
    falseRows,
    trueCounts: countLabels(trueRows),
    falseCounts: countLabels(falseRows)
  };
}

function findBestSplit(rows) {
  const candidates = buildCandidateConditions(rows)
    .map((condition) => scoreCandidate(rows, condition))
    .filter(Boolean);

  return {
    candidates,
    best: candidates.reduce((best, candidate) => {
      if (!best || candidate.gain > best.gain) {
        return candidate;
      }

      return best;
    }, null)
  };
}

function createLeaf(rows, context) {
  return {
    id: `trained-leaf-${context.nextLeafId++}`,
    type: "leaf",
    trainingRows: rows,
    classification: classifyLeaf(rows, context.globalMajorityLabel)
  };
}

function trainNode(rows, context, depth = 0) {
  if (depth >= context.maxDepth || calculateGini(rows) === 0) {
    return createLeaf(rows, context);
  }

  const split = findBestSplit(rows);

  if (!split.best || split.best.gain <= 0) {
    return createLeaf(rows, context);
  }

  const nodeId = depth === 0 ? "trained-root" : `trained-split-${context.nextSplitId++}`;
  context.trainingSteps.push({
    nodeId,
    depth: depth + 1,
    rowIds: rows.map((row) => row.id),
    candidates: split.candidates,
    bestCondition: split.best.condition
  });

  return {
    id: nodeId,
    type: "split",
    condition: split.best.condition,
    trueBranch: trainNode(split.best.trueRows, context, depth + 1),
    falseBranch: trainNode(split.best.falseRows, context, depth + 1)
  };
}

export function trainDecisionTree(dataset, options = {}) {
  const knownRows = getKnownRows(dataset);
  const context = {
    maxDepth: options.maxDepth ?? DEFAULT_MAX_DEPTH,
    globalMajorityLabel: getGlobalMajorityLabel(dataset),
    nextSplitId: 1,
    nextLeafId: 1,
    trainingSteps: []
  };

  const tree = trainNode(knownRows, context);

  return {
    tree,
    trainingRows: knownRows,
    trainingSteps: context.trainingSteps,
    maxDepth: context.maxDepth,
    globalMajorityLabel: context.globalMajorityLabel
  };
}

export const __testing = {
  calculateGini,
  buildCandidateConditions,
  scoreCandidate
};
