export const MAX_TREE_DEPTH = 4;
export const POSITIVE_CLASS = "Premium";
export const PRICE_CLASS_THRESHOLD = 250;
export const GLOBAL_FALLBACK_REASON = {
  EMPTY: "empty",
  TIE: "tie",
  MAJORITY: "majority"
};

export const FEATURE_CONFIG = {
  size: {
    label: "Size",
    type: "numeric",
    operators: ["<=", ">"],
    defaultValue: 80
  },
  neighborhood: {
    label: "Neighborhood",
    type: "categorical",
    operators: ["=", "!="],
    options: ["A", "B"],
    defaultValue: "B"
  }
};

export const FEATURE_OPTIONS = Object.entries(FEATURE_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
  ...config
}));
