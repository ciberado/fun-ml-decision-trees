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
    title: (rowId) => `Build a tiny decision tree`,
    copy:
      "Edit binary rules with size and neighborhood, route every housing row into a leaf, and watch how the prediction changes.",
    qrAlt: "QR code for the live demo",
    qrButtonLabel: "Open QR code",
    qrDialogLabel: "QR code modal"
  },
  averageLesson: {
    eyebrow: "Lesson 1",
    title: "Guess with one average",
    copy:
      "Start with the simplest possible model: average the known prices per m², extrapolate the target apartment price, then apply the Budget/Premium boundary.",
    summaryLabel: "Average price model summary",
    target: "Target",
    knownRows: (count) => `${count} known rows`,
    notCalculated: "No estimate yet",
    featureMissing: "Feature not engineered",
    featureReady: "€/m² feature ready",
    averagePricePerM2: "Average €/m²",
    verdict: "Verdict",
    resultTitle: "Result",
    placeholderTitle: "Awaiting estimate",
    placeholderCopy: "Use the extrapolate action to calculate a price estimate for the target apartment.",
    featurePlaceholderCopy: "Start by engineering a €/m² feature from each known apartment's price and size.",
    predictedAs: (rowId, label) => `Row ${rowId}: ${label}`,
    thresholdRule: (threshold) => `Premium if the estimate is above ${threshold}; otherwise Budget.`,
    calculation: "Calculation",
    formula: (average, size, price) => `${average} x ${size} = ${price}`,
    targetSize: "Target size",
    estimatedPrice: "Estimated price",
    modelNote:
      "This is a model because it makes a prediction, but it is not machine learning: nothing is trained or optimized.",
    actionEyebrow: "One-step model",
    engineeringHint:
      "Create a new feature by dividing each known apartment price by its size.",
    extrapolateHint:
      "Now average the engineered €/m² feature and multiply it by the target apartment size.",
    featureEngineering: "Feature engineering",
    extrapolate: "Extrapolate price",
    clear: "Clear estimate"
  },
  trainedLesson: {
    eyebrow: "Lesson 3",
    title: "Let the computer build the tree",
    copy:
      "Generate a decision tree automatically by scoring possible splits, keeping the best ones, and routing the target row through the trained model.",
    summaryLabel: "Generated decision tree summary",
    trainingRows: (count) => `${count} training rows`,
    depthLimit: (depth) => `Max depth ${depth}`,
    notGenerated: "No generated model yet",
    targetPrediction: "Target prediction",
    generateModel: "Generate model",
    clearModel: "Clear model",
    previousStep: "Previous",
    nextStep: "Next split",
    showFinal: "Show final",
    stepProgress: (current, total) => `Step ${current} of ${total}`,
    beforeFirstSplit: "Before the first split",
    allRowsWaiting: "All rows are still together",
    firstSplitHint: "Move to the next step to let the algorithm apply the first selected split.",
    placeholderCopy:
      "Press generate model to let the algorithm compare splits and build a read-only decision tree.",
    trainingTitle: "Training",
    trainingSubtitle: "Split candidates",
    candidateRule: "Rule",
    purity: "Purity",
    purityValue: "Gain",
    nodeRows: (rowIds) => `Rows ${rowIds}`,
    chosenSplit: (condition) => `Chosen split: ${condition}`,
    bestSplit: "Best",
    modelTitle: "Generated model",
    predictedAs: (rowId, label) => `Row ${rowId}: ${label}`,
    splitRule: "Split rule",
    pendingSplit: "Waiting",
    pendingGroup: "Group not split yet",
    pendingRows: (rowIds) => `Rows waiting here: ${rowIds}`,
    targetWaiting: "Target waits",
    trueBranch: "True",
    falseBranch: "False",
    leaves: "Leaves"
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
