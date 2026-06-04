export const en = {
  meta: {
    intlLocale: "en-US",
    languageName: "English"
  },
  classes: {
    Budget: "Budget",
    Premium: "Premium"
  },
  features: {
    size: "Size",
    neighborhood: "Neighborhood"
  },
  common: {
    unknown: "?",
    none: "None",
    row: (rowId) => `Row ${rowId}`,
    targetRow: (rowId) => `Row ${rowId} (target)`,
    leaf: (leafId) => `Leaf ${leafId}`,
    selectRow: (rowId) => `Select row ${rowId}`,
    sizeValue: (size) => `${size} m²`
  },
  hero: {
    eyebrow: "Interactive Lesson",
    title: (rowId) => `Build a tiny decision tree for row ${rowId}`,
    copy:
      "Edit binary rules with size and neighborhood, route every housing row into a leaf, and watch how the prediction changes."
  },
  controls: {
    reset: "Reset Tree",
    language: "Language",
    modelSummary: "Model summary",
    accuracy: "Accuracy",
    falsePositives: "False Positives",
    falseNegatives: "False Negatives"
  },
  dataset: {
    title: "Dataset",
    select: "Select",
    price: "Price",
    class: "Class",
    size: "Size",
    neighborhood: "Neighborhood",
    pricePerM2: "€/m²"
  },
  treeEditor: {
    title: "Tree Editor",
    hint: "Add a split to a bucket, then use the triangle button to move the next ball into the matching side.",
    allRows: "All rows",
    addSplit: "Add split",
    addSplitTo: (nodeId) => `Add split to ${nodeId}`,
    processNextBall: "Process next ball",
    remove: "Remove"
  },
  prediction: {
    title: "Prediction",
    selectedRow: "Selected Row",
    currentPrediction: (rowId, label) => `Row ${rowId} is currently predicted as ${label}`,
    selectedRowLeaf: (rowId, leafId) => `Row ${rowId} lands in ${leafId}`,
    path: "Path",
    pathSummary: "Path summary",
    leafPrediction: "Leaf prediction",
    sameLeafAsTarget: (rowId) => `Rows in the same leaf as row ${rowId}`,
    sameSelectedLeaf: "Rows sharing the selected leaf"
  },
  evaluation: {
    title: "Evaluation",
    summary: (firstRowId, lastRowId) => `Known rows ${firstRowId} to ${lastRowId} score the current tree`,
    starterBaseline: "Starter baseline",
    lowerAccuracyWarning: "Accuracy is lower than the starter tree baseline.",
    falsePositiveWarning: "This edited tree creates more false positives than the starter tree.",
    falseNegativeWarning: "This edited tree creates more false negatives than the starter tree.",
    noWarnings: "No baseline warnings are active for this tree.",
    correctRows: "Correct rows",
    incorrectRows: "Incorrect rows",
    falsePositives: "False positives",
    falseNegatives: "False negatives"
  },
  leafBucket: {
    depthLimitReached: "Depth limit reached",
    knownRowsSummary: (known, budget, premium) =>
      `Known rows: ${known} | Budget ${budget} | Premium ${premium}`
  },
  fallback: {
    tie: "Global majority fallback used because the leaf is tied.",
    empty: "Global majority fallback used because the leaf has no known rows.",
    majority: "Leaf uses a direct majority vote."
  },
  rowTooltip: {
    class: "Class",
    price: "Price",
    size: "Size",
    neighborhood: "Neighborhood",
    pricePerM2: "Price per m²"
  },
  status: {
    unknownError: "Unknown error"
  }
};
