import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCondition } from "../../src/domain/evaluate-condition.js";

test("evaluateCondition handles numeric operators", () => {
  const row = { size: 80, neighborhood: "A" };

  assert.equal(
    evaluateCondition({ feature: "size", operator: "<=", value: 80 }, row),
    true
  );
  assert.equal(
    evaluateCondition({ feature: "size", operator: ">", value: 80 }, row),
    false
  );
});

test("evaluateCondition handles categorical operators", () => {
  const row = { size: 80, neighborhood: "B" };

  assert.equal(
    evaluateCondition({ feature: "neighborhood", operator: "=", value: "B" }, row),
    true
  );
  assert.equal(
    evaluateCondition({ feature: "neighborhood", operator: "!=", value: "B" }, row),
    false
  );
});
