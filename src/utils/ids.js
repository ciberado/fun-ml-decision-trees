let nextId = 1;

export function createNodeId(prefix = "node") {
  nextId += 1;
  return `${prefix}-${nextId}`;
}
