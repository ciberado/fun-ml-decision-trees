# Architecture

## Overview
This application is a client-side educational web app. It should run entirely in the browser, use no frontend framework, and keep the logic simple enough to inspect and maintain.

The architecture should separate:

- decision-tree logic
- application state
- rendering
- user interaction

## Required Technology

### Runtime
- HTML5
- CSS3
- modern browser with ES modules support
- JavaScript

### UI Model
- Web Components
- Custom Elements
- Shadow DOM only where encapsulation helps more than it hurts

### Application Style
- vanilla JavaScript
- zero runtime dependencies for MVP
- no framework
- no server required for MVP beyond a static file host or local static server

## Recommended Development Tooling
These are useful, but not required by the runtime architecture:

- Git for version control
- a simple local static server
- optional formatter or linter if the project grows
- optional test runner for pure logic modules

The architecture should not depend on any of these to function in production.

## Architectural Principles
- Keep the evaluation engine pure.
- Keep UI components dumb where possible.
- Treat the tree and dataset as explicit state, not implicit DOM state.
- Recompute from source state after edits instead of patching many derived values manually.
- Prefer clear data flow over clever abstractions.

## High-Level Architecture

### 1. Domain Layer
Pure logic for:

- evaluating one split against one row
- routing a row through a tree
- assigning all rows to leaves
- computing leaf labels
- predicting the target row
- computing evaluation metrics
- comparing current metrics against baseline metrics

This layer should have no DOM access.

### 2. State Layer
Single application state object containing:

- dataset
- baseline tree
- current tree
- routing results
- prediction results
- evaluation results
- UI selection state

This layer coordinates recomputation after user edits.

### 3. Presentation Layer
Web Components render the current state into:

- dataset table
- row balls
- tree editor
- leaf buckets
- prediction panel
- evaluation panel
- controls

### 4. Interaction Layer
UI events mutate source state only. After any valid mutation:

1. recompute derived state
2. re-render affected components

## Suggested Project Structure

```text
/
  index.html
  styles.css
  src/
    main.js
    state/
      app-state.js
      recompute.js
    data/
      dataset.js
      starter-tree.js
    domain/
      evaluate-condition.js
      route-row.js
      route-all-rows.js
      classify-leaf.js
      evaluate-model.js
      compare-baseline.js
    components/
      app-root.js
      control-bar.js
      dataset-table.js
      row-ball-layer.js
      tree-editor.js
      tree-node.js
      leaf-bucket.js
      prediction-panel.js
      evaluation-panel.js
    utils/
      ids.js
      formatters.js
```

## Data Model

### Dataset Row
Each row should contain:

```js
{
  id: 1,
  price: 100,
  label: "Budget",
  size: 100,
  neighborhood: "A",
  isTarget: false
}
```

For the current target row:

```js
{
  id: 1,
  price: null,
  label: null,
  size: 60,
  neighborhood: "B",
  isTarget: true
}
```

### Tree Node

```js
{
  id: "root",
  type: "split",
  condition: {
    feature: "neighborhood",
    operator: "=",
    value: "B"
  },
  trueBranch: { ... },
  falseBranch: { ... }
}
```

### Leaf Node

```js
{
  id: "leaf-1",
  type: "leaf"
}
```

## State Management

### Source State
Source state is the minimal state the user can change directly:

- current tree
- selected row
- panel visibility

Dataset and baseline tree are fixed in MVP.

### Derived State
Derived state should be recomputed, not manually edited:

- row paths
- leaf assignments
- predicted label for the target row
- tie-break usage
- current accuracy
- current false positives
- current false negatives
- baseline comparison flags

### Recompute Pipeline
After any valid tree edit:

1. validate tree constraints
2. route all rows
3. classify leaves
4. predict the target row
5. evaluate rows `1` through `7`
6. compare current metrics to baseline
7. trigger UI update

## Component Architecture

### `app-root`
- owns top-level state
- wires events to recomputation
- passes state down to child components

### `dataset-table`
- renders rows and display-only fields
- highlights selected row
- emits row selection events

### `row-ball-layer`
- renders visual row tokens
- reflects current leaf assignments
- highlights the target row and selected row

### `tree-editor`
- renders the tree recursively
- owns split editing UI
- emits add/remove/edit events

### `tree-node`
- renders one decision split
- exposes feature/operator/value controls
- shows true/false branches

### `leaf-bucket`
- renders rows assigned to one leaf
- may expose add-split action when depth limit allows

### `prediction-panel`
- renders target-row path
- renders predicted class
- indicates tie-break usage

### `evaluation-panel`
- renders accuracy
- renders false positives and false negatives
- renders baseline warnings

### `control-bar`
- reset to starter tree
- recompute if explicit recompute remains in the UI
- show or hide panels if needed

## Rendering Strategy

### Rendering Model
- Favor full component rerender from current props/state over brittle DOM patching.
- Keep the component tree shallow enough that simple rerenders stay maintainable.
- Because the dataset is tiny, clarity is more important than micro-optimizations.

### Layout Strategy
- Use CSS Grid for the main three-panel layout.
- Use Flexbox within panels for smaller internal arrangements.
- Keep tree layout deterministic so branches do not jump unpredictably.

## Validation Rules
The editor must enforce:

- binary splits only
- maximum depth of `4`
- only `size` and `neighborhood` as selectable split features
- only valid operators for the chosen feature type
- removal of a split collapses the subtree into a leaf

## Evaluation Rules
- Positive class is `Premium`.
- Leaf label is assigned by majority vote.
- Tie-break uses the global majority class from rows `1` through `7`.
- Baseline comparison checks:
  - accuracy
  - false positives
  - false negatives

## Accessibility Requirements
- Do not rely on color alone to distinguish outcomes.
- Ensure tree branches and leaf states have text labels.
- Provide keyboard-operable split controls.
- Respect `prefers-reduced-motion`.

## Testing Strategy

### Testing Principles
- Test pure logic before testing UI interactions.
- Keep domain tests deterministic and independent from the DOM.
- Treat recomputation after edits as the main integration boundary.
- Prefer a small number of reliable manual regression scripts over ad hoc checking.

### Test Layers
- unit tests for pure domain functions
- integration tests for state recomputation and editor flows
- component or DOM-level tests for rendering constraints
- manual regression checks for accessibility and classroom usability

### Unit Test Scope
Priority should go to pure domain functions:

- `evaluate-condition`
- `route-row`
- `route-all-rows`
- `classify-leaf`
- `evaluate-model`
- `compare-baseline`
- tree depth validation helpers
- feature/operator validation helpers

### Required Unit Cases

#### Condition Evaluation
- numeric `<=` with value below threshold
- numeric `<=` with value equal to threshold
- numeric `>` with value above threshold
- categorical `=` match and mismatch
- categorical `!=` match and mismatch

#### Row Routing
- route each known row through the default starter tree
- route the target row through the default starter tree
- verify expected leaf IDs for a known sample tree

#### Leaf Classification
- leaf with `Budget` majority
- leaf with `Premium` majority
- tied leaf uses global-majority tie-break
- empty leaf uses the global-majority fallback and is tested

#### Evaluation Metrics
- perfect-classification case
- case with at least one false positive
- case with at least one false negative
- case where warnings trigger independently for accuracy, false positives, and false negatives

#### Tree Validation
- reject depth greater than `4`
- reject unsupported split feature
- reject unsupported operator for feature type
- allow valid add-split and remove-split transformations

### Integration Test Scope
Integration tests should exercise the recomputation pipeline:

1. mutate source tree state
2. recompute routing
3. recompute prediction
4. recompute evaluation
5. recompute baseline warnings
6. verify final derived state

### Required Integration Cases
- edit root split and verify all derived state updates
- edit nested split and verify path changes for affected rows only
- add a split to a leaf and verify the new subtree is active
- remove a split and verify subtree collapse into a leaf
- reset to starter tree and verify baseline state restoration
- select a row and verify the prediction panel path reflects that row

### UI And Component Testing
At the DOM level, verify:

- dataset table renders all rows
- row balls count matches dataset rows
- the target row has distinct styling and labeling
- split editor shows only `size` and `neighborhood`
- `Price`, `Class`, and `Price per m2` do not appear as split feature options
- baseline warnings render independently
- tie-break indicator appears when required
- leaf buckets reflect current assignments after edits

### Manual Regression Checklist
Before accepting a release candidate, manually verify:

- first load shows the starter tree
- the tree remains readable after several edits
- keyboard-only navigation reaches row selection and split controls
- reduced-motion mode does not rely on animation for comprehension
- display-only fields are visible but clearly not editable inputs
- an intentionally worse tree produces the expected warnings

### Test Data Strategy
- Keep the primary dataset fixed and versioned in source control.
- Reuse the default starter tree as the baseline fixture.
- Add small synthetic tree fixtures for edge cases such as ties and validation failures.

### Test Execution Strategy
- Run unit tests on every logic change.
- Run integration tests on every tree-editor or recomputation change.
- Run the manual regression checklist before committing to MVP-complete status.

### Failure Priorities
These failures should block release:

- incorrect routing
- incorrect class prediction for the target row
- incorrect evaluation metrics
- invalid split features exposed in the editor
- missing or incorrect baseline warnings
- broken keyboard access for critical controls

## Deployment Model
- MVP can be served as static files.
- No backend is required.
- Hosting can be any static site host or a simple local server during development.

## Future Architectural Extensions
If the project grows later, the architecture can absorb:

- persisted state
- richer animation orchestration
- guided lesson modes
- dataset editing
- split suggestion logic

These should remain optional layers on top of the same domain and state core.
