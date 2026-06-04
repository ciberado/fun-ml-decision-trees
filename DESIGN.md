# Decision Tree Teaching App Design

## Summary
Build a small web application in vanilla JavaScript with Web Components that teaches the basic idea of a decision tree through a tiny housing dataset. The app should feel like a classroom exercise: visual, concrete, easy to manipulate, and easy to understand without advanced math or machine learning background.

Each dataset row is represented as a small ball labeled with its row number. Users create and modify a binary decision tree, then watch the balls flow through its branch conditions into leaf buckets. The main learning objective is to understand how a decision tree classifies an unknown row by repeatedly applying simple human-readable rules.

## Problem Statement
Introductory explanations of machine learning often become abstract too early. Learners hear terms like "feature", "split", "leaf", and "prediction" before they see a concrete example they can reason about.

This project should reverse that order:

- start from a tiny visible dataset
- keep every row on screen
- make each branch condition editable
- show how each row ends up in a leaf
- show how the tree classifies the unknown row `8`

The core teaching question is:

Can we use `size` and `neighborhood` to classify row `8` as `Budget` or `Premium` by routing it through a small set of simple binary rules?

## Product Goals
- Make decision trees understandable in a few minutes.
- Keep all data points visible at all times.
- Make the effect of each split immediately visible.
- Let users freely edit the tree structure within safe limits.
- Teach classification intuition, not training algorithms.
- Keep the implementation simple, modular, and framework-free.

## Non-Goals
- Training a real decision tree automatically.
- Supporting large datasets.
- Explaining entropy, Gini impurity, pruning, or overfitting in depth.
- Turning the app into a generic ML tool.
- Persisting complex user work across sessions in MVP.

## Intended Audience
- Young learners with no advanced math or ML knowledge.
- Teachers who want a lightweight classroom demo.
- Beginners who can read a table but are new to classification models.

## Success Criteria
The design is successful if a first-time user can:

- identify the features available to the tree
- explain what a split does
- follow one row through the tree without confusion
- understand why row `8` lands in a given leaf
- understand how a leaf produces a class prediction
- notice when changing the tree improves or worsens the classification results

## Dataset
This dataset is intentionally artificial. It is designed for pedagogy, not realism.

For the lesson, `Price` is the known real-world outcome for rows `1` through `7`. The tree predicts a derived class:

- `Budget`: `price <= 250`
- `Premium`: `price > 250`

| ID | Price (€) | Class | Size (m2) | Neighborhood | Price per m2 (€) | Notes |
|---:|---:|:---:|---:|:---:|---:|---|
| 1 | 180 | Budget | 100 | A | 1.80 | Typical budget flat in A |
| 2 | 220 | Budget | 150 | A | 1.47 | Large but still budget in A |
| 3 | 200 | Budget | 110 | A | 1.82 | Another budget flat in A |
| 4 | 300 | Premium | 70 | A | 4.29 | Small premium outlier in A |
| 5 | 340 | Premium | 110 | B | 3.09 | Premium flat in B |
| 6 | 230 | Budget | 70 | B | 3.29 | Small budget exception in B |
| 7 | 380 | Premium | 130 | B | 2.92 | Larger premium flat in B |
| 8 | ? | ? | 60 | B | ? | Target row |

### Why This Dataset Works
- Neighborhood is a stronger signal than size on its own.
- Size by itself is misleading because some larger flats are still `Budget` while a smaller flat can still be `Premium`.
- A single neighborhood split helps, but one branch still needs a second split to reach good accuracy.
- Row `8` is small and in neighborhood `B`, so it still invites discussion instead of feeling automatic.

### Important Constraint
`price` and `price per m2` are visible in the table, but they must not be used as split features in MVP. Row `8` has unknown price, so allowing those derived values as split inputs would make the exercise logically invalid.

## Learning Model
The app teaches classification, not regression.

- Input features for the tree: `size`, `neighborhood`
- Known labels for rows `1` through `7`: `Budget`, `Premium`
- Unknown target: row `8`
- Positive class for evaluation: `Premium`

## Experience Overview
The app should feel like an interactive lesson and a constrained tree editor at the same time.

### Main Flow
1. The user sees the dataset as both a table and a set of numbered balls.
2. The user sees a starter tree that can be edited.
3. The user changes split conditions and optionally adds or removes split nodes.
4. The app recomputes the routing immediately.
5. Balls move or relocate into the corresponding leaf buckets.
6. The app shows the predicted class for row `8`.
7. The app evaluates the current tree on rows `1` through `7`.
8. The app warns if the current tree performs worse than the starter tree baseline.

### Interaction Principles
- Every edit must produce immediate visible feedback.
- The tree must stay readable for beginners.
- Motion should clarify routing, not slow it down.
- Row `8` must always be easy to identify.
- The raw dataset should remain visible while editing and evaluating the tree.

## Design Decisions
The following product decisions are now fixed for the first implementation.

### Core Product Shape
- The app is a free-form tree editor with constraints, not only a guided demo.
- It should still start with a prebuilt example tree so users are not dropped into an empty state.
- The lesson focuses on manual routing and manual tree editing.
- Automatic tree training is explicitly out of scope for MVP and can be introduced later.

### Tree Constraints
- The tree is binary only.
- Maximum tree depth is `4` levels.
- Users can add or remove split nodes within that limit.
- Users can edit the `feature`, `operator`, and `value` of each split.

### Default Starter Tree
The app should load with a default starter tree rather than an empty canvas. For MVP, use this baseline:

- root split: `neighborhood = B`
- true branch split: `size <= 80`
- false branch: leaf

This starter tree is simple enough to understand immediately and useful enough to act as the baseline model for evaluation warnings.

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

### Dataset Editing
- Users edit the tree only in MVP.
- Dataset editing belongs to a later phase.

## Functional Requirements

### Dataset Presentation
- Show the full dataset in a compact table.
- Show `Price`, `Class`, `Size`, `Neighborhood`, and `Price per m2`.
- Mark `Price` and `Price per m2` as display-only fields in the UI.
- Represent each row as a ball with its row ID centered inside it.
- Use a distinct visual treatment for row `8`.
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
- The app must support row `8` with unknown `price` and unknown `class`.
- Once row `8` reaches a leaf, the app must display its predicted class.
- The prediction explanation must show:
  - the path row `8` followed
  - the known rows in the same leaf
  - the rule used to assign the leaf label

### Leaf Classification Rule
Each leaf predicts a class using majority vote over the known rows it contains.

- if `Budget` rows are more numerous, predict `Budget`
- if `Premium` rows are more numerous, predict `Premium`
- if there is a tie, predict the global majority class of the training rows
- if a leaf contains no known rows, predict the global majority class of the training rows

For the provided dataset, the global majority is `Budget` because rows `1` through `7` contain:

- `Budget`: `4`
- `Premium`: `3`

The UI should surface when a global-majority fallback was used, whether due to a tie or an empty leaf.

### Evaluation
- The app must evaluate the current tree on rows `1` through `7`.
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
- Reset tree to starter version
- Recompute current tree
- Add split
- Remove split
- Select row
- Toggle visibility of the evaluation panel if needed

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
- Ensure the prediction for row `8` is reproducible from the visible rules.
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
2. Row `8` receives a predicted class from the starter tree.
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
- row `8` visual distinction
- display-only treatment of `Price` and `Price per m2`

## Information Architecture

### Default Layout
Use a three-panel layout:

- left: dataset table and selected-row details
- center: tree editor and leaf buckets
- right: prediction and evaluation panel

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
- Row `8` should always stand out visually.
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
  - shows row `8` path and predicted class
- `evaluation-panel`
  - shows metrics and classification errors
- `control-bar`
  - reset and editing actions

### State Model
Suggested app state:

```js
{
  dataset: [
    { id: 1, price: 100, label: "Budget", size: 100, neighborhood: "A" },
    { id: 2, price: 50, label: "Budget", size: 80, neighborhood: "A" },
    { id: 3, price: 200, label: "Budget", size: 70, neighborhood: "B" },
    { id: 4, price: 300, label: "Premium", size: 180, neighborhood: "A" },
    { id: 5, price: 300, label: "Premium", size: 100, neighborhood: "B" },
    { id: 6, price: 250, label: "Budget", size: 80, neighborhood: "B" },
    { id: 7, price: 400, label: "Premium", size: 120, neighborhood: "B" },
    { id: 8, price: null, label: null, size: 60, neighborhood: "B", isTarget: true }
  ],
  baselineTree: { ... },
  tree: { ... },
  routing: {
    rowPaths: {},
    leafAssignments: {}
  },
  prediction: {
    targetRowId: 8,
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
    selectedRowId: 8,
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
For row `8`:

1. Route row `8` through the current tree.
2. Identify its leaf.
3. Collect known rows in that leaf.
4. Determine the leaf label using majority vote.
5. Apply the tie-break rule if necessary.
6. Display the predicted class and path summary.

### Evaluation Algorithm
For rows `1` through `7`:

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
5. Show the predicted class for row `8`.
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
- predicted class for row `8`
- structured path explanation for row `8`
- evaluation metrics for rows `1` through `7`
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
The right first version is a constrained free-form editor with a classroom tone. Users should start from a sensible example tree, edit it within a depth limit of `4`, immediately see how the data moves, receive a class prediction for row `8`, and see whether their edits made the model better or worse on the known rows.
