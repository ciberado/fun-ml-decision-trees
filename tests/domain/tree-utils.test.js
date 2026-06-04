import test from "node:test";
import assert from "node:assert/strict";
import { validateTree } from "../../src/domain/tree-utils.js";

test("validateTree rejects unsupported split features", () => {
  assert.throws(
    () =>
      validateTree({
        id: "root",
        type: "split",
        condition: {
          feature: "price",
          operator: "<=",
          value: 100
        },
        trueBranch: { id: "left", type: "leaf" },
        falseBranch: { id: "right", type: "leaf" }
      }),
    /not allowed/
  );
});

test("validateTree rejects split depth greater than four", () => {
  assert.throws(
    () =>
      validateTree({
        id: "s1",
        type: "split",
        condition: { feature: "size", operator: "<=", value: 10 },
        trueBranch: {
          id: "s2",
          type: "split",
          condition: { feature: "size", operator: "<=", value: 20 },
          trueBranch: {
            id: "s3",
            type: "split",
            condition: { feature: "size", operator: "<=", value: 30 },
            trueBranch: {
              id: "s4",
              type: "split",
              condition: { feature: "size", operator: "<=", value: 40 },
              trueBranch: {
                id: "s5",
                type: "split",
                condition: { feature: "size", operator: "<=", value: 50 },
                trueBranch: { id: "leaf-a", type: "leaf" },
                falseBranch: { id: "leaf-b", type: "leaf" }
              },
              falseBranch: { id: "leaf-c", type: "leaf" }
            },
            falseBranch: { id: "leaf-d", type: "leaf" }
          },
          falseBranch: { id: "leaf-e", type: "leaf" }
        },
        falseBranch: { id: "leaf-f", type: "leaf" }
      }),
    /cannot exceed 4/
  );
});
