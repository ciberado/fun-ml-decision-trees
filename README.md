# Decision Lessons Teaching App

[Español](./README.es.md) | [Català](./README.ca.md)

A small browser app that teaches simple prediction models with a tiny housing dataset.

The app is intentionally simple:
- it starts with a crude average-price lesson and a feature-engineering step
- it shows a compact dataset
- it lets you build a small binary tree by hand
- it routes each row as a numbered ball through the tree
- it predicts the unknown target row
- it shows accuracy, false positives, and false negatives while you edit

This is a teaching tool, not an automatic ML trainer. The goal is to make prediction logic visible and easy to discuss.

## Live Demo

GitHub Pages:

`https://ciberado.github.io/fun-ml-decision-trees/`

## How It Works

Lesson 1 uses the same dataset but starts before machine learning:
- first, it hides `€/m²`
- then the user creates that derived feature with `Feature engineering`
- then the user extrapolates the target price from the average `€/m²`
- finally, it classifies the estimate as `Budget` or `Premium` using the `250` price boundary

The editable tree starts from a single root bucket. You add splits, process balls one by one, and see how the current rules separate the dataset.

Only two features are available for splitting:
- `size`
- `neighborhood`

In the tree lesson, `price`, `class`, and `price per m²` are visible in the table, but they are display-only. They are not allowed as split features.

## Local Development

Requirements:
- Node.js

Commands:

```bash
npm test
npm run serve
```

Then open:

`http://127.0.0.1:8080`

The first lesson is available at:

`http://127.0.0.1:8080/lesson-average-price.html`

## Project Structure

```text
src/data/        dataset and baseline tree
src/domain/      pure average-price and decision-tree logic
src/state/       decision-tree app state and recomputation
src/components/  Web Components UI
src/i18n/        English, Spanish, and Catalan strings
src/utils/       shared helpers and formatters
tests/           domain, state, and formatter tests
```

## Languages

The interface can be switched between:
- English
- Spanish
- Catalan

Translations live in separate files under `src/i18n/`.

## Notes

- The app is static and framework-free.
- The current dataset is deliberately artificial so the tree decisions are easier to understand.
- The average-price lesson derives `price per m²` as a visible feature-engineering step.
- The starter tree is kept as an evaluation baseline, while the editable tree starts empty at the root.
