import { PRICE_CLASS_THRESHOLD } from "./config.js";

function getRowsWithKnownPrices(dataset) {
  return dataset.filter(
    (row) => !row.isTarget && Number.isFinite(row.price) && Number.isFinite(row.size) && row.size > 0
  );
}

function getTargetRow(dataset) {
  return dataset.find((row) => row.isTarget);
}

export function classifyEstimatedPrice(price, threshold = PRICE_CLASS_THRESHOLD) {
  return price > threshold ? "Premium" : "Budget";
}

export function calculateAveragePricePerM2(dataset) {
  const knownRows = getRowsWithKnownPrices(dataset);

  if (knownRows.length === 0) {
    throw new Error("Cannot calculate average price per m2 without known prices");
  }

  return knownRows.reduce((total, row) => total + row.price / row.size, 0) / knownRows.length;
}

export function buildAveragePriceModel(dataset, threshold = PRICE_CLASS_THRESHOLD) {
  const targetRow = getTargetRow(dataset);
  const knownRows = getRowsWithKnownPrices(dataset);

  if (!targetRow) {
    throw new Error("Cannot extrapolate price without a target row");
  }

  if (!Number.isFinite(targetRow.size)) {
    throw new Error("Cannot extrapolate price without a numeric target size");
  }

  const averagePricePerM2 = calculateAveragePricePerM2(dataset);
  const estimatedPrice = averagePricePerM2 * targetRow.size;

  return {
    knownRowCount: knownRows.length,
    targetRowId: targetRow.id,
    targetSize: targetRow.size,
    averagePricePerM2,
    estimatedPrice,
    threshold,
    predictedLabel: classifyEstimatedPrice(estimatedPrice, threshold)
  };
}
