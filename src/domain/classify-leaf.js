import { GLOBAL_FALLBACK_REASON } from "./config.js";

export function classifyLeaf(rows, globalMajorityLabel) {
  const knownRows = rows.filter((row) => !row.isTarget);
  const counts = {
    Budget: 0,
    Premium: 0
  };

  for (const row of knownRows) {
    counts[row.label] += 1;
  }

  if (knownRows.length === 0) {
    return {
      predictedLabel: globalMajorityLabel,
      usedTieBreak: true,
      fallbackReason: GLOBAL_FALLBACK_REASON.EMPTY,
      counts
    };
  }

  if (counts.Budget === counts.Premium) {
    return {
      predictedLabel: globalMajorityLabel,
      usedTieBreak: true,
      fallbackReason: GLOBAL_FALLBACK_REASON.TIE,
      counts
    };
  }

  return {
    predictedLabel: counts.Budget > counts.Premium ? "Budget" : "Premium",
    usedTieBreak: false,
    fallbackReason: GLOBAL_FALLBACK_REASON.MAJORITY,
    counts
  };
}
