# Repository Guidelines

## Project Structure & Module Organization
This repository is a static, framework-free teaching app with documentation kept as the source of truth:

- `DESIGN.md`: product and UX requirements
- `PLAN.md`: delivery phases and test gates
- `ARCHITECTURE.md`: technical shape, module boundaries, and testing strategy

The app now contains multiple lesson entry points:

- `lesson-average-price.html`: first lesson, a feature-engineering and average-price model
- `index.html`: decision-tree lesson

Follow the structure defined in `ARCHITECTURE.md`:

- `src/data/`: dataset and starter tree fixtures
- `src/domain/`: pure model and decision-tree logic
- `src/state/`: recomputation and app state
- `src/components/`: Web Components
- `src/i18n/`: English, Spanish, and Catalan strings
- `src/utils/`: small shared helpers

Keep tests separate from runtime code, ideally under `tests/` with domain and UI split by concern.

## Build, Test, and Development Commands
No build pipeline is checked in. Keep the app runnable as static files.

- `npm run serve`
  Starts `http-server` on port `8080` with CORS from the repo root.
- `npm test`
  Runs the Node test suite.
- `rg --files`
  Fast way to inspect repository contents.
- `git status --short`
  Review local changes before committing.

If port `8080` is already running, it means there is already a server with the appliction behind it. Just use it.

You are running in a tmux session. Feel free to make use of it if needed to spawn new processes, check their outputs, etc.

## Coding Style & Naming Conventions
Use vanilla JavaScript and Web Components only. Prefer:

- 2-space indentation
- ES modules
- kebab-case file names such as `tree-editor.js`
- clear, small functions in `src/domain/`
- no framework-specific patterns

Keep domain logic pure and DOM-free. Lesson-specific state belongs in lesson components unless it needs shared recomputation.

Do not expose `price`, `class`, or `price per m2` as selectable split features in the decision-tree editor. The average-price lesson may derive and display `price per m2` only after its feature-engineering action.

When adding visible text, update all locale files under `src/i18n/`.

## Testing Guidelines
Follow the detailed strategy in `ARCHITECTURE.md`.

- Test pure logic first: average-price model, routing, leaf classification, tie-breaks, metrics, baseline warnings
- Add integration tests for recomputation after edits
- Add DOM/UI checks for lesson flows, editor constraints, and row `8` behavior

Use descriptive test names, for example: `route-row routes row-8 through starter tree`.

Regularly check that everything works as expected using your playwright MCP. For UI changes, verify desktop and mobile viewports, the relevant language switch, and the browser console.

## Commit & Pull Request Guidelines
Current history uses short imperative commit messages, for example: `Add final design document`. Continue that style.

Pull requests should include:

- a short summary of the change
- affected docs or modules
- test evidence or manual verification notes
- screenshots for UI changes

If implementation diverges from the docs, update the docs in the same change.
