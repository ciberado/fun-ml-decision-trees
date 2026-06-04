import { FEATURE_CONFIG } from "./config.js";

export function evaluateCondition(condition, row) {
  const feature = FEATURE_CONFIG[condition.feature];

  if (!feature) {
    throw new Error(`Unsupported feature: ${condition.feature}`);
  }

  const rowValue = row[condition.feature];

  if (feature.type === "numeric") {
    const threshold = Number(condition.value);

    if (!Number.isFinite(threshold)) {
      throw new Error(`Numeric condition requires a finite value for ${condition.feature}`);
    }

    if (condition.operator === "<=") {
      return rowValue <= threshold;
    }

    if (condition.operator === ">") {
      return rowValue > threshold;
    }
  }

  if (feature.type === "categorical") {
    const expected = String(condition.value);

    if (condition.operator === "=") {
      return rowValue === expected;
    }

    if (condition.operator === "!=") {
      return rowValue !== expected;
    }
  }

  throw new Error(`Unsupported operator ${condition.operator} for ${condition.feature}`);
}
