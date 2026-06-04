import { routeRow } from "./route-row.js";

function collectLeafIds(node, leafIds = []) {
  if (node.type === "leaf") {
    leafIds.push(node.id);
    return leafIds;
  }

  collectLeafIds(node.trueBranch, leafIds);
  collectLeafIds(node.falseBranch, leafIds);
  return leafIds;
}

export function routeAllRows(tree, dataset) {
  const rowPaths = {};
  const rowLeafIds = {};
  const leafAssignments = Object.fromEntries(
    collectLeafIds(tree).map((leafId) => [
      leafId,
      {
        leafId,
        rowIds: [],
        knownRowIds: [],
        targetRowIds: []
      }
    ])
  );

  for (const row of dataset) {
    const routed = routeRow(tree, row);
    rowPaths[row.id] = routed.path;
    rowLeafIds[row.id] = routed.leafId;

    const bucket = leafAssignments[routed.leafId];
    bucket.rowIds.push(row.id);

    if (row.isTarget) {
      bucket.targetRowIds.push(row.id);
    } else {
      bucket.knownRowIds.push(row.id);
    }
  }

  return {
    rowPaths,
    rowLeafIds,
    leafAssignments
  };
}
