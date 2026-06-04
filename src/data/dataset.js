export const DATASET = [
  { id: 1, price: 100, label: "Budget", size: 100, neighborhood: "A", isTarget: false },
  { id: 2, price: 50, label: "Budget", size: 80, neighborhood: "A", isTarget: false },
  { id: 3, price: 200, label: "Budget", size: 70, neighborhood: "B", isTarget: false },
  { id: 4, price: 300, label: "Premium", size: 180, neighborhood: "A", isTarget: false },
  { id: 5, price: 300, label: "Premium", size: 100, neighborhood: "B", isTarget: false },
  { id: 6, price: 250, label: "Budget", size: 80, neighborhood: "B", isTarget: false },
  { id: 7, price: 400, label: "Premium", size: 120, neighborhood: "B", isTarget: false },
  { id: 8, price: null, label: null, size: 60, neighborhood: "B", isTarget: true }
];

export function getKnownRows(dataset = DATASET) {
  return dataset.filter((row) => !row.isTarget);
}

export function getTargetRow(dataset = DATASET) {
  return dataset.find((row) => row.isTarget);
}
