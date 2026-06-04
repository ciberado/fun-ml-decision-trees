import { POSITIVE_CLASS } from "./config.js";

export function evaluateModel(dataset, rowLeafIds, leafDetails, positiveClass = POSITIVE_CLASS) {
  const predictedLabels = {};
  const correctRows = [];
  const incorrectRows = [];
  const falsePositives = [];
  const falseNegatives = [];
  const knownRows = dataset.filter((row) => !row.isTarget);

  for (const row of knownRows) {
    const leafId = rowLeafIds[row.id];
    const predictedLabel = leafDetails[leafId].predictedLabel;
    predictedLabels[row.id] = predictedLabel;

    if (predictedLabel === row.label) {
      correctRows.push(row.id);
    } else {
      incorrectRows.push(row.id);
    }

    if (predictedLabel === positiveClass && row.label !== positiveClass) {
      falsePositives.push(row.id);
    }

    if (predictedLabel !== positiveClass && row.label === positiveClass) {
      falseNegatives.push(row.id);
    }
  }

  return {
    positiveClass,
    predictedLabels,
    accuracy: correctRows.length / knownRows.length,
    correctRows,
    incorrectRows,
    falsePositives,
    falseNegatives
  };
}
