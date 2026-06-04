export const DATASET = [
  { id: 1, price: 180, label: "Budget", size: 100, neighborhood: "A", isTarget: false },
  { id: 2, price: 220, label: "Budget", size: 150, neighborhood: "A", isTarget: false },
  { id: 3, price: 200, label: "Budget", size: 110, neighborhood: "A", isTarget: false },
  { id: 4, price: 300, label: "Premium", size: 70, neighborhood: "A", isTarget: false },
  { id: 5, price: 340, label: "Premium", size: 110, neighborhood: "B", isTarget: false },
  { id: 6, price: 230, label: "Budget", size: 70, neighborhood: "B", isTarget: false },
  { id: 7, price: 380, label: "Premium", size: 130, neighborhood: "B", isTarget: false },
  { id: 8, price: null, label: null, size: 60, neighborhood: "B", isTarget: true }
];

export function getKnownRows(dataset = DATASET) {
  return dataset.filter((row) => !row.isTarget);
}

export function getTargetRow(dataset = DATASET) {
  return dataset.find((row) => row.isTarget);
}
