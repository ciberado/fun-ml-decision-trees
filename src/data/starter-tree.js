export const STARTER_TREE = {
  id: "root",
  type: "split",
  condition: {
    feature: "neighborhood",
    operator: "=",
    value: "B"
  },
  trueBranch: {
    id: "split-size-b",
    type: "split",
    condition: {
      feature: "size",
      operator: "<=",
      value: 80
    },
    trueBranch: {
      id: "leaf-b-small",
      type: "leaf"
    },
    falseBranch: {
      id: "leaf-b-large",
      type: "leaf"
    }
  },
  falseBranch: {
    id: "leaf-not-b",
    type: "leaf"
  }
};
