import test from "node:test";
import assert from "node:assert/strict";
import { createInitialState, setLocale } from "../../src/state/app-state.js";

test("setLocale normalizes supported locales and falls back to english", () => {
  const initialState = createInitialState();
  const spanishState = setLocale(initialState, "es-ES");
  const fallbackState = setLocale(initialState, "fr");

  assert.equal(initialState.ui.locale, "en");
  assert.equal(spanishState.ui.locale, "es");
  assert.equal(fallbackState.ui.locale, "en");
  assert.equal(spanishState.tree.id, initialState.tree.id);
});
