import test from "node:test";
import assert from "node:assert/strict";
import { DATASET } from "../../src/data/dataset.js";
import { STARTER_TREE } from "../../src/data/starter-tree.js";
import { routeRow } from "../../src/domain/route-row.js";

test("routeRow routes row 8 through the starter tree", () => {
  const row8 = DATASET.find((row) => row.id === 8);
  const routed = routeRow(STARTER_TREE, row8);

  assert.equal(routed.leafId, "leaf-b-small");
  assert.deepEqual(
    routed.path.map((step) => step.nodeId),
    ["root", "split-size-b"]
  );
});
