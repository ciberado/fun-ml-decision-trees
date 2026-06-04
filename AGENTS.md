# Repository Guidelines

## Project Structure & Module Organization
This repository is currently documentation-first. The source of truth is:

- `DESIGN.md`: product and UX requirements
- `PLAN.md`: delivery phases and test gates
- `ARCHITECTURE.md`: technical shape, module boundaries, and testing strategy

When implementation starts, follow the structure defined in `ARCHITECTURE.md`:

- `src/data/`: dataset and starter tree fixtures
- `src/domain/`: pure decision-tree logic
- `src/state/`: recomputation and app state
- `src/components/`: Web Components
- `src/utils/`: small shared helpers

Keep tests separate from runtime code, ideally under `tests/` with domain and UI split by concern.

## Build, Test, and Development Commands
No build pipeline is checked in yet. Keep the app runnable as static files.

- `npx http-server --port 8080 --cors`
  Starts a simple local server from the repo root once `index.html` exists.
- `rg --files`
  Fast way to inspect repository contents.
- `git status --short`
  Review local changes before committing.

When tests are added, document the exact commands here and keep them aligned with `PLAN.md` and `ARCHITECTURE.md`.

## Coding Style & Naming Conventions
Use vanilla JavaScript and Web Components only. Prefer:

- 2-space indentation
- ES modules
- kebab-case file names such as `tree-editor.js`
- clear, small functions in `src/domain/`
- no framework-specific patterns

Keep domain logic pure and DOM-free. Do not expose `price`, `class`, or `price per m2` as selectable split features in the editor.

## Testing Guidelines
Follow the detailed strategy in `ARCHITECTURE.md`.

- Test pure logic first: routing, leaf classification, tie-breaks, metrics, baseline warnings
- Add integration tests for recomputation after edits
- Add DOM/UI checks for editor constraints and row `8` behavior

Use descriptive test names, for example: `route-row routes row-8 through starter tree`.

Regularly check that everything works as expected using your playwright mcp.

## Commit & Pull Request Guidelines
Current history uses short imperative commit messages, for example: `Add final design document`. Continue that style.

Pull requests should include:

- a short summary of the change
- affected docs or modules
- test evidence or manual verification notes
- screenshots for UI changes

If implementation diverges from the docs, update the docs in the same change.
