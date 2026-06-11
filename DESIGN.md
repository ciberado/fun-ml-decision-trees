# Decision Lessons Teaching App Design

## Summary
Build a small web application in vanilla JavaScript with Web Components that teaches simple prediction models through a tiny housing dataset. The app should feel like a classroom exercise: visual, concrete, easy to manipulate, and easy to understand without advanced math or machine learning background.

The lessons should progress from the simplest possible model toward a manual decision tree, then to a generated decision tree. Lesson 1 uses one crude average price per m2 to extrapolate the target apartment price. The decision-tree lesson then represents each dataset row as a small ball labeled with its row number, lets users create and modify a binary decision tree, and shows how balls flow through branch conditions into leaf buckets. The generated-tree lesson shows how a small training algorithm can choose split rules automatically.

## Problem Statement
Introductory explanations of machine learning often become abstract too early. Learners hear terms like "feature", "split", "leaf", and "prediction" before they see a concrete example they can reason about.

This project should reverse that order:

- start from a tiny visible dataset
- keep every row on screen
- make each branch condition editable
- show how each row ends up in a leaf
- show how the tree classifies the target row

The core teaching question is:

Can we use `size` and `neighborhood` to classify the target row as `Budget` or `Premium` by routing it through a small set of simple binary rules?

## Product Goals
- Introduce the idea of a model before introducing machine learning.
- Make decision trees understandable in a few minutes.
- Keep all data points visible at all times.
- Make the effect of each split immediately visible.
- Let users freely edit the tree structure within safe limits.
- Teach classification intuition before introducing a small training algorithm.
- Keep the implementation simple, modular, and framework-free.
- Let learners switch the interface between English, Spanish, and Catalan.

## Non-Goals
- Supporting large datasets.
- Explaining entropy, pruning, or overfitting in depth.
- Turning the app into a generic ML tool.
- Persisting complex user work across sessions in MVP.

## Intended Audience
- Young learners with no advanced math or ML knowledge.
- Teachers who want a lightweight classroom demo.
- Beginners who can read a table but are new to classification models.

## Success Criteria
The design is successful if a first-time user can:

- explain that a simple calculation can be a prediction model
- create and use a derived `price per m2` feature
- identify the features available to the tree
- explain what a split does
- follow one row through the tree without confusion
- understand why the target row lands in a given leaf
- understand how a leaf produces a class prediction
- notice when changing the tree improves or worsens the classification results

## Dataset
This dataset is intentionally artificial. It is designed for pedagogy, not realism.

For the lesson, `Price` is the known real-world outcome for rows `2` through `15`. The tree predicts a derived class:

- `Budget`: `price <= 250`
- `Premium`: `price > 250`

| ID | Price (€) | Class | Size (m2) | Neighborhood | Price per m2 (€) | Notes |
|---:|---:|:---:|---:|:---:|---:|---|
| 1 | ? | ? | 60 | B | ? | Target row |
| 2 | 180 | Budget | 100 | A | 1.80 | Typical budget flat in A |
| 3 | 220 | Budget | 150 | A | 1.47 | Large but still budget in A |
| 4 | 200 | Budget | 110 | A | 1.82 | Another budget flat in A |
| 5 | 300 | Premium | 70 | A | 4.29 | Small premium outlier in A |
| 6 | 340 | Premium | 110 | B | 3.09 | Premium flat in B |
| 7 | 230 | Budget | 70 | B | 3.29 | Small budget exception in B |
| 8 | 380 | Premium | 130 | B | 2.92 | Larger premium flat in B |
| 9 | 210 | Budget | 95 | A | 2.21 | Medium budget flat in A |
| 10 | 240 | Budget | 125 | A | 1.92 | Larger budget flat in A |
| 11 | 290 | Premium | 85 | A | 3.41 | Another small premium flat in A |
| 12 | 320 | Premium | 100 | B | 3.20 | Mid-size premium flat in B |
| 13 | 410 | Premium | 145 | B | 2.83 | Large premium flat in B |
| 14 | 240 | Budget | 75 | B | 3.20 | Small budget exception in B |
| 15 | 245 | Budget | 80 | B | 3.06 | Edge-case budget flat in B |

### Why This Dataset Works
- Neighborhood is a stronger signal than size on its own.
- Size by itself is misleading because some larger flats are still `Budget` while a smaller flat can still be `Premium`.
- A single neighborhood split helps, but one branch still needs a second split to reach good accuracy.
- The current target row, row `1`, is small and in neighborhood `B`, so it still invites discussion instead of feeling automatic.

### Important Constraint
`price` and `price per m2` are display-only values and must not be used as split features in MVP. Lesson 1 initially hides `price per m2` until the feature-engineering action runs; the decision-tree lesson can show it directly as a display-only field. The target row has unknown price, so allowing those derived values as split inputs would make the tree exercise logically invalid.

## Learning Model
The app teaches classification, not regression.

- Input features for the tree: `size`, `neighborhood`
- Known labels for rows `2` through `15`: `Budget`, `Premium`
- Unknown target: row `1` in the current fixture
- Positive class for evaluation: `Premium`

## Experience Overview
The app should feel like an interactive lesson and a constrained tree editor at the same time.

### Lesson 1: Average Price Model
1. The user sees the same housing dataset table.
2. The user triggers a "Feature engineering" action to create the `price per m2` column from known prices and sizes.
3. The user triggers an "Extrapolate price" action.
4. The app calculates the average `price per m2` from known rows.
5. The app multiplies that average by the target apartment size.
6. The app classifies the estimate using the documented price boundary:
   - `Budget`: `price <= 250`
   - `Premium`: `price > 250`
7. The app explains that this is a prediction model, but not machine learning because nothing is trained or optimized.

### Main Flow
1. The user sees the dataset as both a table and a set of numbered balls.
2. The user sees a root bucket and builds the editable tree from there.
3. The user changes split conditions and optionally adds or removes split nodes.
4. The app recomputes the routing immediately.
5. Balls move or relocate into the corresponding leaf buckets.
6. The app shows the predicted class for the target row.
7. The app evaluates the current tree on the known rows.
8. The app warns if the current tree performs worse than the starter tree baseline.

### Generated Tree Flow
1. The user opens a separate lesson after the manual decision-tree page.
2. The user triggers a `Generate model` action.
3. The app trains a small read-only classification tree from known rows only.
4. The app scores binary candidate splits with Gini impurity reduction.
5. The first generated-model state shows all row balls together before any split is applied.
6. The app reveals the generated tree step by step, one chosen split at a time.
7. The user can play training to preview candidate rules one by one before the best split is committed.
8. During playback, each candidate rule temporarily splits the current row group so learners can see its effect.
9. Unrevealed child groups remain visible as pending row buckets until their split is shown.
10. The target row waits outside the partial tree and only routes into a leaf once the generated model is complete.
11. The app shows the chosen split for the current training step and a compact candidate-score comparison.
12. The generated tree routes the target row and known rows into leaf buckets.
13. The app shows the target prediction and evaluation metrics for the generated model.

### Interaction Principles
- Every edit must produce immediate visible feedback.
- The tree must stay readable for beginners.
- Motion should clarify routing, not slow it down.
- The target row must always be easy to identify.
- The raw dataset should remain visible while editing and evaluating the tree.

## Design Decisions
The following product decisions are now fixed for the first implementation.

### Core Product Shape
- The app is a sequence of lesson pages, with lesson navigation to be added later.
- Lesson 1 introduces a non-ML prediction model through feature engineering and averaging.
- The app is a free-form tree editor with constraints, not only a guided demo.
- The editable tree should start from a single root bucket so learners build the structure themselves.
- The lesson focuses on manual routing and manual tree editing.
- Automatic tree training is explicitly out of scope for MVP and can be introduced later.
- Automatic tree training now belongs to its own follow-up lesson, separate from the manual tree editor.

### Tree Constraints
- The tree is binary only.
- Maximum tree depth is `4` levels.
- Users can add or remove split nodes within that limit.
- Users can edit the `feature`, `operator`, and `value` of each split.

### Default Starter Tree
The app should keep a default starter tree as the evaluation baseline. For MVP, use this baseline:

- root split: `neighborhood = B`
- true branch split: `size <= 80`
- false branch: leaf

This starter tree is simple enough to understand immediately and useful enough to act as the hidden baseline model for evaluation warnings, even though the editable tree now starts from the root only.

### Explanation Strategy
- The explanation panel should favor compact structured explanations over verbose prose.
- For a selected row, the panel should show a path summary such as `Neighborhood = B -> Size <= 80 -> Leaf 2`.
- Short contextual text is allowed, but the UI should not narrate every branch in sentence form by default.

### Animation Strategy
- Rich animation is not required for MVP.
- MVP should support immediate recomputation and clear visual relocation of balls.
- A later phase can add more explicit step-by-step or animated playback.

### Styling Direction
- The visual tone should feel classroom-like rather than technical or corporate.
- It should be playful enough to feel approachable, but still structured and readable.

### Persistence
- MVP is stateless across refreshes.
- No saved sessions are required.
- The selected UI language does not need to persist across refreshes in MVP.

### Dataset Editing
- Users edit the tree only in MVP.
- Dataset editing belongs to a later phase.

## Functional Requirements

### Average Price Lesson
- Provide a separate first lesson page before the decision-tree lesson is wired into navigation.
- Show the full dataset table with the same visual treatment as the decision-tree lesson.
- Provide a prominent intermediate action after the dataset table: `Feature engineering`.
- Hide the calculated `price per m2` values until the feature-engineering action runs.
- Disable `Extrapolate price` until feature engineering has run.
- Provide the next action after feature engineering: `Extrapolate price`.
- On action, compute:
  - average known `price per m2`
  - target estimated price as `average price per m2 * target size`
  - predicted class using the fixed `250` price threshold
- Show the result beside the dataset on desktop and below it on narrow screens.
- When the dataset and result are side by side, keep the result panel the same height as the dataset/action panel.
- Put the verdict as the final block in the result panel.
- Keep the lesson localized in English, Spanish, and Catalan.

### Dataset Presentation
- Show the full dataset in a compact table.
- Show `Price`, `Class`, `Size`, `Neighborhood`, and `Price per m2`.
- Mark `Price` and `Price per m2` as display-only fields in the UI.
- Represent each row as a ball with its row ID centered inside it.
- Use a distinct visual treatment for the target row.
- Allow selecting a row to highlight its path and details.

### Tree Representation
- Represent the tree as binary branch nodes and leaf buckets.
- Each branch condition must contain:
  - one feature
  - one operator
  - one comparison value
- Each branch must clearly indicate its true and false direction.
- Each leaf bucket must visibly contain the rows routed to it.

### Tree Configuration
- Supported features for MVP:
  - `size`
  - `neighborhood`
- Supported operators for MVP:
  - numeric: `<=`, `>`
  - categorical: `=`, `!=`
- The split editor must not offer `price`, `class`, or `price per m2` as selectable split features.
- Users must be able to:
  - edit split conditions
  - add a child split to a leaf, if the depth limit allows it
  - remove a split node and collapse its subtree into a leaf

### Prediction
- The app must support a target row with unknown `price` and unknown `class`.
- Once the target row reaches a leaf, the app must display its predicted class.
- The prediction explanation must show:
  - the path the target row followed
  - the known rows in the same leaf
  - the rule used to assign the leaf label

### Leaf Classification Rule
Each leaf predicts a class using majority vote over the known rows it contains.

- if `Budget` rows are more numerous, predict `Budget`
- if `Premium` rows are more numerous, predict `Premium`
- if there is a tie, predict the global majority class of the training rows
- if a leaf contains no known rows, predict the global majority class of the training rows

For the provided dataset, the global majority is `Budget` because the known rows contain:

- `Budget`: `8`
- `Premium`: `6`

The UI should surface when a global-majority fallback was used, whether due to a tie or an empty leaf.

### Evaluation
- The app must evaluate the current tree on the known rows.
- The app must display:
  - accuracy
  - false positives
  - false negatives
  - which rows were classified correctly
  - which rows were misclassified
- `Premium` is the positive class for evaluation.

### Quality Warning
- The app should treat the starter tree as the baseline model.
- If the current edited tree has lower accuracy than the baseline, the UI should show an accuracy warning.
- If the current edited tree has more false positives than the baseline, the UI should show a false-positive warning.
- If the current edited tree has more false negatives than the baseline, the UI should show a false-negative warning.
- The warning should be informative, not punitive.

### Controls
- Reset tree
- Add split
- Remove split
- Select row
- Switch UI language between English, Spanish, and Catalan

## Non-Functional Requirements

### Simplicity
- Use vanilla JavaScript only.
- Use native Web Components.
- Keep external dependencies at zero unless clearly justified.

### Maintainability
- Keep tree evaluation logic pure and testable.
- Keep rendering separate from decision logic.
- Keep component responsibilities narrow.
- Avoid coupling app state to DOM structure.

### Performance
- The dataset is tiny, so raw speed is not a concern.
- Re-rendering should still be predictable and intentional.

### Accessibility
- The app must not rely on color alone.
- Branch directions and outcomes must have text labels.
- Keyboard interaction should be possible for split editing and selection.
- Any motion must respect reduced-motion preferences.

### Adaptability
- Mobile support is not required for MVP.
- The layout and component structure should still make later responsive adaptation straightforward.

## Quality Assurance And Testing

### Testing Goals
- Verify that tree logic is correct before relying on the UI.
- Prevent invalid editor states.
- Ensure the prediction for the target row is reproducible from the visible rules.
- Ensure evaluation metrics and baseline warnings remain trustworthy after edits.
- Catch regressions in accessibility-critical behavior.

### Required Test Levels
- pure logic tests for routing, classification, and evaluation
- integration tests for recomputation after tree edits
- UI behavior tests for rendering and editor constraints
- manual exploratory tests for classroom usability
- accessibility checks for keyboard use and reduced motion

### Minimum Acceptance Scenarios
The MVP should not be considered complete unless these scenarios pass:

1. The default starter tree routes all rows into deterministic leaves.
2. The target row receives a predicted class from the starter tree.
3. Editing a split condition recomputes row paths, leaf assignments, prediction, and evaluation.
4. Adding a split to an allowed leaf updates the tree without violating the depth limit.
5. Removing a split collapses the subtree into a valid leaf and recomputes correctly.
6. The editor never offers `price`, `class`, or `price per m2` as split features.
7. A tie inside a leaf applies the documented global-majority tie-break rule.
8. Accuracy, false positives, and false negatives match the current tree state.
9. Baseline warnings appear independently for worse accuracy, more false positives, and more false negatives.
10. The app remains usable with keyboard interaction for row selection and split editing.

### Regression Focus Areas
- tree depth validation
- feature and operator validation
- leaf classification correctness
- baseline comparison correctness
- selected-row path rendering
- target-row visual distinction
- display-only treatment of `Price` and `Price per m2`

## Information Architecture

### Default Layout
The decision-tree lesson uses a three-panel layout:

- left: dataset table and selected-row details
- center: tree editor and leaf buckets
- right: prediction and evaluation panel

The average-price lesson uses a two-column layout on wide screens:

- left: dataset table and lesson actions
- right: result panel

On narrow screens, the average-price lesson stacks the result below the dataset and actions.

### Small-Screen Layout
For future responsive adaptation, sections should stack in this order:

1. controls
2. tree
3. prediction and evaluation
4. dataset

### Key Views
- Dataset view
- Tree view
- Prediction view
- Evaluation view

## Visual Design Direction
- Balls should be small, readable, and clearly grouped by leaf.
- The target row should always stand out visually.
- Branch nodes should look like classroom question cards.
- Leaf buckets should look like explicit containers, not abstract labels.
- The palette should feel light and classroom-like.
- Visual hierarchy should favor the tree and the active result, not decorative styling.

## Technical Design

### Suggested Stack
- `index.html`
- `styles.css`
- ES modules
- Web Components

### Suggested Components
- `app-root`
  - owns shared state and orchestration
- `dataset-table`
  - renders the dataset and selected row
- `row-ball-layer`
  - renders row balls
- `tree-editor`
  - renders the tree, edit controls, and branch structure
- `tree-node`
  - renders one split node
- `leaf-bucket`
  - renders one leaf and its assigned rows
- `prediction-panel`
  - shows the target-row path and predicted class
- `evaluation-panel`
  - shows metrics and classification errors
- `control-bar`
  - reset and editing actions

### State Model
Suggested app state:

```js
{
  dataset: [
    { id: 1, price: null, label: null, size: 60, neighborhood: "B", isTarget: true },
    { id: 2, price: 180, label: "Budget", size: 100, neighborhood: "A" },
    { id: 3, price: 220, label: "Budget", size: 150, neighborhood: "A" },
    { id: 4, price: 200, label: "Budget", size: 110, neighborhood: "A" },
    { id: 5, price: 300, label: "Premium", size: 70, neighborhood: "A" },
    { id: 6, price: 340, label: "Premium", size: 110, neighborhood: "B" },
    { id: 7, price: 230, label: "Budget", size: 70, neighborhood: "B" },
    { id: 8, price: 380, label: "Premium", size: 130, neighborhood: "B" },
    { id: 9, price: 210, label: "Budget", size: 95, neighborhood: "A" },
    { id: 10, price: 240, label: "Budget", size: 125, neighborhood: "A" },
    { id: 11, price: 290, label: "Premium", size: 85, neighborhood: "A" },
    { id: 12, price: 320, label: "Premium", size: 100, neighborhood: "B" },
    { id: 13, price: 410, label: "Premium", size: 145, neighborhood: "B" },
    { id: 14, price: 240, label: "Budget", size: 75, neighborhood: "B" },
    { id: 15, price: 245, label: "Budget", size: 80, neighborhood: "B" }
  ],
  baselineTree: { ... },
  tree: { ... },
  routing: {
    rowPaths: {},
    leafAssignments: {}
  },
  prediction: {
    targetRowId: 1,
    predictedLabel: null,
    predictedLeafId: null,
    usedTieBreak: false
  },
  evaluation: {
    positiveClass: "Premium",
    predictedLabels: {},
    accuracy: 0,
    falsePositives: [],
    falseNegatives: [],
    correctRows: [],
    incorrectRows: [],
    baselineAccuracy: 0,
    baselineFalsePositives: [],
    baselineFalseNegatives: [],
    isWorseThanBaseline: false,
    hasAccuracyWarning: false,
    hasFalsePositiveWarning: false,
    hasFalseNegativeWarning: false
  },
  ui: {
    selectedRowId: 1,
    showEvaluation: true
  }
}
```

### Tree Data Shape
Suggested binary node format:

```js
{
  id: "root",
  type: "split",
  condition: {
    feature: "neighborhood",
    operator: "=",
    value: "B"
  },
  trueBranch: {
    id: "node-2",
    type: "split",
    condition: {
      feature: "size",
      operator: "<=",
      value: 80
    },
    trueBranch: { id: "leaf-1", type: "leaf" },
    falseBranch: { id: "leaf-2", type: "leaf" }
  },
  falseBranch: { id: "leaf-3", type: "leaf" }
}
```

For the default starter tree, use this exact shape:

```js
{
  id: "root",
  type: "split",
  condition: {
    feature: "neighborhood",
    operator: "=",
    value: "B"
  },
  trueBranch: {
    id: "node-2",
    type: "split",
    condition: {
      feature: "size",
      operator: "<=",
      value: 80
    },
    trueBranch: { id: "leaf-1", type: "leaf" },
    falseBranch: { id: "leaf-2", type: "leaf" }
  },
  falseBranch: { id: "leaf-3", type: "leaf" }
}
```

### Routing Algorithm
For each row:

1. Start at the root node.
2. Evaluate the current node condition against the row.
3. Move to the true branch or false branch.
4. Repeat until reaching a leaf.
5. Record the path and final leaf assignment.

### Prediction Algorithm
For the target row:

1. Route the target row through the current tree.
2. Identify its leaf.
3. Collect known rows in that leaf.
4. Determine the leaf label using majority vote.
5. Apply the tie-break rule if necessary.
6. Display the predicted class and path summary.

### Evaluation Algorithm
For the known rows:

1. Route each row through the current tree.
2. Determine the predicted label of its leaf.
3. Compare the predicted label with the true label.
4. Compute accuracy.
5. Count false positives and false negatives using `Premium` as the positive class.
6. Compare current accuracy, false positives, and false negatives against the starter tree baseline.

## Teaching Strategy

### MVP Lesson Pattern
Even though the editor is free-form, the experience should still guide the learner.

1. Start with a simple prebuilt tree.
2. Let the learner inspect how the known rows are grouped.
3. Let the learner change a split and immediately see the consequences.
4. Let the learner add one more split to refine a leaf.
5. Show the predicted class for the target row.
6. Show whether the edit improved or worsened accuracy on the known rows.

### Copy Style
- short
- concrete
- non-technical
- visual before abstract
- avoid formula-heavy explanations

## MVP Scope
The first version should include:

- the hard-coded dataset
- the hard-coded starter tree
- row balls for all rows
- editable split conditions
- adding and removing split nodes
- a maximum tree depth of `4`
- immediate rerouting after edits
- visible leaf buckets
- predicted class for the target row
- structured path explanation for the target row
- evaluation metrics for the known rows
- warning when the edited tree performs worse than the starter tree
- stateless behavior across refreshes

## Later-Phase Enhancements
- richer animation and playback controls
- true step-by-step routing mode
- editable dataset rows
- automatic split suggestions
- support for additional features
- comparison between multiple saved trees
- explicit "bad tree" examples for teaching purposes
- responsive/mobile-specific layout refinements

## Risks and Design Tensions
- Too much freedom can make the lesson harder to follow.
- Too little freedom can make the editor feel fake.
- If the tree grows too deep, the layout will become confusing.
- If the warning language is too strong, experimentation may feel discouraged.
- If `price per m2` is visually emphasized too much, learners may assume it is a valid split feature.
- If routing updates are too animated later, clarity may decrease instead of improve.

## Final Recommendation
The right first version is a constrained free-form editor with a classroom tone. Users should start from a sensible example tree, edit it within a depth limit of `4`, immediately see how the data moves, receive a class prediction for the target row, and see whether their edits made the model better or worse on the known rows.
