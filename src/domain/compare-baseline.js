export function compareBaseline(currentEvaluation, baselineEvaluation) {
  return {
    hasAccuracyWarning: currentEvaluation.accuracy < baselineEvaluation.accuracy,
    hasFalsePositiveWarning:
      currentEvaluation.falsePositives.length > baselineEvaluation.falsePositives.length,
    hasFalseNegativeWarning:
      currentEvaluation.falseNegatives.length > baselineEvaluation.falseNegatives.length
  };
}
