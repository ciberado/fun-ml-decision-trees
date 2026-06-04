# Delivery Plan

## Overview
This project should be delivered in small phases. Each phase should leave the app in a usable state and reduce uncertainty before the next layer is added.

The plan below assumes the current `DESIGN.md` is the source of truth.

## Phase 0: Foundation

### Goal
Set up the project structure and the static application shell.

### Deliverables
- `index.html`
- `styles.css`
- JavaScript module entry point
- initial Web Component registration
- empty three-panel layout
- placeholder dataset, tree, prediction, and evaluation areas

### Exit Criteria
- the app loads in a browser
- the layout is stable
- components can render basic placeholder content

### Test Gate
- smoke-check that the app loads without console errors
- verify the three-panel layout renders consistently on first load

## Phase 1: Core Data And Tree Engine

### Goal
Implement the data model and the pure decision-tree logic before building richer UI behavior.

### Deliverables
- hard-coded dataset from `DESIGN.md`
- default starter tree
- tree traversal logic
- leaf assignment logic
- majority-vote classification logic
- tie-break behavior using global majority class
- evaluation logic for accuracy, false positives, and false negatives
- baseline comparison logic

### Exit Criteria
- given the dataset and tree, the code computes:
  - row paths
  - leaf assignments
  - row `8` prediction
  - evaluation metrics
- logic can run without the visual layer

### Test Gate
- unit tests for condition evaluation on numeric and categorical features
- unit tests for routing rows through the starter tree
- unit tests for majority vote and tie-break behavior
- unit tests for accuracy, false positives, and false negatives
- unit tests for baseline comparison flags

## Phase 2: Static UI Binding

### Goal
Render the real dataset and tree using the computed state, without complex editing yet.

### Deliverables
- dataset table component
- row-ball rendering
- tree node and leaf bucket rendering
- prediction panel
- evaluation panel
- selected-row highlighting
- structured path display for a selected row

### Exit Criteria
- all rows appear in the UI
- the tree and leaves reflect the computed assignments
- row `8` prediction is visible
- evaluation metrics are visible

### Test Gate
- component tests or manual checks for dataset rendering
- verify row balls match dataset row count
- verify selected-row highlighting updates the prediction panel path
- verify evaluation metrics shown in the UI match the domain-layer outputs

## Phase 3: Editing The Tree

### Goal
Make the tree genuinely interactive within the MVP constraints.

### Deliverables
- edit feature/operator/value on split nodes
- add split to a leaf
- remove split and collapse subtree
- enforce binary structure
- enforce max depth of `4`
- prevent selecting display-only fields as split features
- immediate recomputation after every valid edit

### Exit Criteria
- the user can modify the tree without reloading
- invalid edits are blocked or normalized safely
- the app always recomputes to a consistent state

### Test Gate
- integration tests for edit feature/operator/value flows
- integration tests for add-split and remove-split flows
- tests for maximum depth enforcement
- tests proving disallowed split features never appear in the editor
- tests verifying recomputation happens after every valid edit

## Phase 4: Classroom Feedback Layer

### Goal
Add the teaching-oriented feedback that makes the tool useful as a learning exercise.

### Deliverables
- starter-tree reset action
- explicit tie-break indication
- baseline comparison warnings for:
  - lower accuracy
  - more false positives
  - more false negatives
- display-only treatment for `Price` and `Price per m2`
- compact selected-row path explanation

### Exit Criteria
- users can tell whether their edits improved or worsened the model
- the distinction between input features and display-only fields is clear

### Test Gate
- tests for tie-break indicator visibility
- tests for separate warnings on worse accuracy, more false positives, and more false negatives
- manual check that `Price` and `Price per m2` are visibly marked as display-only
- manual check that path explanations remain compact and readable

## Phase 5: Polish And Robustness

### Goal
Stabilize the app for actual use.

### Deliverables
- keyboard interaction improvements
- reduced-motion handling
- layout cleanup
- empty-state and edge-case handling
- visual refinement for the classroom style
- lightweight manual QA checklist

### Exit Criteria
- the MVP is coherent, accessible enough for initial use, and visually readable

### Test Gate
- keyboard-only manual pass
- reduced-motion manual pass
- visual regression pass on the starter tree and at least two edited trees
- manual exploratory pass focused on classroom readability and confusion points

## Phase 6: Later Enhancements

### Goal
Extend the app after the MVP is stable.

### Candidate Work
- richer animation
- step-by-step playback mode
- dataset editing
- additional features
- responsive/mobile refinements
- automatic split suggestions
- saved trees or state persistence

## Recommended Build Order
1. Foundation
2. Core data and tree engine
3. Static UI binding
4. Tree editing
5. Classroom feedback layer
6. Polish and robustness

## Key Risks
- Mixing rendering logic with evaluation logic too early
- Letting the tree editor create invalid states
- Overcomplicating the UI before the logic is correct
- Making the display-only fields look editable

## Detailed Testing Strategy

### Unit Test Scope
Pure logic should be tested first and kept deterministic:

- evaluate one condition against one row
- route one row through a tree
- route all rows through a tree
- classify one leaf
- predict row `8`
- compute evaluation metrics
- compare current metrics with baseline metrics
- validate tree depth and legal feature/operator combinations

### Integration Test Scope
The recomputation pipeline should be verified end to end:

- edit one split and confirm all derived state updates
- add a split and confirm depth, routing, prediction, and metrics update
- remove a split and confirm subtree collapse and recomputation
- reset to starter tree and confirm baseline state is restored

### Manual Test Scope
Manual passes should cover:

- first-load clarity
- row `8` discoverability
- understanding of display-only fields
- readability of warnings
- keyboard interaction
- reduced-motion behavior

### Recommended Testing Order
1. Unit tests for the domain layer
2. Integration tests for state recomputation
3. UI checks for rendering and constraints
4. Manual exploratory testing before marking a phase complete

## Definition Of MVP Complete
The MVP is complete when a user can load the app, inspect the dataset, edit a constrained binary tree, see rows routed into leaf buckets, get a class prediction for row `8`, and understand through metrics and warnings whether the edited tree is better or worse than the starter tree.
