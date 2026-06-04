import { evaluateCondition } from "./evaluate-condition.js";

export function routeRow(tree, row) {
  const path = [];
  let current = tree;

  while (current.type === "split") {
    const decision = evaluateCondition(current.condition, row);
    path.push({
      nodeId: current.id,
      condition: structuredClone(current.condition),
      decision,
      branchKey: decision ? "trueBranch" : "falseBranch"
    });
    current = decision ? current.trueBranch : current.falseBranch;
  }

  return {
    rowId: row.id,
    leafId: current.id,
    path
  };
}
