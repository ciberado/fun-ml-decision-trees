import test from "node:test";
import assert from "node:assert/strict";
import { DATASET } from "../../src/data/dataset.js";
import { STARTER_TREE } from "../../src/data/starter-tree.js";
import { routeRow } from "../../src/domain/route-row.js";

test("routeRow routes the target row through the starter tree", () => {
  const targetRow = DATASET.find((row) => row.isTarget);
  const routed = routeRow(STARTER_TREE, targetRow);

  assert.equal(routed.leafId, "leaf-b-small");
  assert.deepEqual(
    routed.path.map((step) => step.nodeId),
    ["root", "split-size-b"]
  );
});
