export const DATASET = [
  { id: 1, price: null, label: null, size: 60, neighborhood: "B", isTarget: true },
  { id: 2, price: 180, label: "Budget", size: 100, neighborhood: "A", isTarget: false },
  { id: 3, price: 220, label: "Budget", size: 150, neighborhood: "A", isTarget: false },
  { id: 4, price: 200, label: "Budget", size: 110, neighborhood: "A", isTarget: false },
  { id: 5, price: 300, label: "Premium", size: 70, neighborhood: "A", isTarget: false },
  { id: 6, price: 340, label: "Premium", size: 110, neighborhood: "B", isTarget: false },
  { id: 7, price: 230, label: "Budget", size: 70, neighborhood: "B", isTarget: false },
  { id: 8, price: 380, label: "Premium", size: 130, neighborhood: "B", isTarget: false }
  ,
  { id: 9, price: 210, label: "Budget", size: 95, neighborhood: "A", isTarget: false },
  { id: 10, price: 240, label: "Budget", size: 125, neighborhood: "A", isTarget: false },
  { id: 11, price: 290, label: "Premium", size: 85, neighborhood: "A", isTarget: false },
  { id: 12, price: 320, label: "Premium", size: 100, neighborhood: "B", isTarget: false },
  { id: 13, price: 410, label: "Premium", size: 145, neighborhood: "B", isTarget: false },
  { id: 14, price: 240, label: "Budget", size: 75, neighborhood: "B", isTarget: false },
  { id: 15, price: 245, label: "Budget", size: 80, neighborhood: "B", isTarget: false }
];

export function getKnownRows(dataset = DATASET) {
  return dataset.filter((row) => !row.isTarget);
}

export function getTargetRow(dataset = DATASET) {
  return dataset.find((row) => row.isTarget);
}

export function getTargetRowId(dataset = DATASET) {
  return getTargetRow(dataset)?.id;
}
