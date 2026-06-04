export const ca = {
  meta: {
    intlLocale: "ca-ES",
    languageName: "Català"
  },
  classes: {
    Budget: "Econòmic",
    Premium: "Premium"
  },
  features: {
    size: "Mida",
    neighborhood: "Barri"
  },
  common: {
    unknown: "?",
    none: "Cap",
    row: (rowId) => `Fila ${rowId}`,
    targetRow: (rowId) => `Fila ${rowId} (objectiu)`,
    leaf: (leafId) => `Fulla ${leafId}`,
    selectRow: (rowId) => `Selecciona la fila ${rowId}`,
    sizeValue: (size) => `${size} m²`
  },
  hero: {
    eyebrow: "Lliçó interactiva",
    title: (rowId) => `Construeix un arbre de decisió petit`,
    copy:
      "Edita regles binàries amb mida i barri, envia cada fila d'habitatge a una fulla i observa com canvia la predicció."
  },
  controls: {
    reset: "Reinicia l'arbre",
    language: "Idioma",
    modelSummary: "Resum del model",
    accuracy: "Precisió",
    falsePositives: "Falsos positius",
    falseNegatives: "Falsos negatius"
  },
  dataset: {
    title: "Conjunt de dades",
    select: "Selecciona",
    price: "Preu",
    class: "Classe",
    size: "Mida",
    neighborhood: "Barri",
    pricePerM2: "€/m²"
  },
  treeEditor: {
    title: "Editor de l'arbre",
    hint: "Afegeix una divisió a un cubell i després usa el botó del triangle per moure la bola següent cap al costat corresponent.",
    allRows: "Totes les files",
    addSplit: "Afegeix divisió",
    addSplitTo: (nodeId) => `Afegeix divisió a ${nodeId}`,
    processNextBall: "Processa la bola següent",
    remove: "Elimina"
  },
  prediction: {
    title: "Predicció",
    selectedRow: "Fila seleccionada",
    currentPrediction: (rowId, label) => `La fila ${rowId} ara es prediu com a ${label}`,
    selectedRowLeaf: (rowId, leafId) => `La fila ${rowId} cau a ${leafId}`,
    path: "Camí",
    pathSummary: "Resum del camí",
    leafPrediction: "Predicció de la fulla",
    sameLeafAsTarget: (rowId) => `Files a la mateixa fulla que la fila ${rowId}`,
    sameSelectedLeaf: "Files que comparteixen la fulla seleccionada"
  },
  evaluation: {
    title: "Avaluació",
    summary: (firstRowId, lastRowId) => `Les files conegudes de la ${firstRowId} a la ${lastRowId} puntuen l'arbre actual`,
    starterBaseline: "Referència inicial",
    lowerAccuracyWarning: "La precisió és més baixa que la referència de l'arbre inicial.",
    falsePositiveWarning: "Aquest arbre editat crea més falsos positius que l'arbre inicial.",
    falseNegativeWarning: "Aquest arbre editat crea més falsos negatius que l'arbre inicial.",
    noWarnings: "No hi ha avisos de referència actius per a aquest arbre.",
    correctRows: "Files correctes",
    incorrectRows: "Files incorrectes",
    falsePositives: "Falsos positius",
    falseNegatives: "Falsos negatius"
  },
  leafBucket: {
    depthLimitReached: "S'ha assolit el límit de profunditat",
    knownRowsSummary: (known, budget, premium) =>
      `Files conegudes: ${known} | Econòmic ${budget} | Premium ${premium}`
  },
  fallback: {
    tie: "S'usa la majoria global perquè la fulla està empatada.",
    empty: "S'usa la majoria global perquè la fulla no té files conegudes.",
    majority: "La fulla usa una votació per majoria directa."
  },
  rowTooltip: {
    class: "Classe",
    price: "Preu",
    size: "Mida",
    neighborhood: "Barri",
    pricePerM2: "Preu per m²"
  },
  status: {
    unknownError: "Error desconegut"
  }
};
