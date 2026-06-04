export const es = {
  meta: {
    intlLocale: "es-ES",
    languageName: "Español"
  },
  classes: {
    Budget: "Económico",
    Premium: "Premium"
  },
  features: {
    size: "Tamaño",
    neighborhood: "Barrio"
  },
  common: {
    unknown: "?",
    none: "Ninguna",
    row: (rowId) => `Fila ${rowId}`,
    targetRow: (rowId) => `Fila ${rowId} (objetivo)`,
    leaf: (leafId) => `Hoja ${leafId}`,
    selectRow: (rowId) => `Seleccionar fila ${rowId}`,
    sizeValue: (size) => `${size} m²`
  },
  hero: {
    eyebrow: "Lección interactiva",
    title: (rowId) => `Construye un árbol de decisión pequeño`,
    copy:
      "Edita reglas binarias con tamaño y barrio, lleva cada fila de vivienda a una hoja y observa cómo cambia la predicción."
  },
  controls: {
    reset: "Reiniciar árbol",
    language: "Idioma",
    modelSummary: "Resumen del modelo",
    accuracy: "Precisión",
    falsePositives: "Falsos positivos",
    falseNegatives: "Falsos negativos"
  },
  dataset: {
    title: "Conjunto de datos",
    select: "Seleccionar",
    price: "Precio",
    class: "Clase",
    size: "Tamaño",
    neighborhood: "Barrio",
    pricePerM2: "€/m²"
  },
  treeEditor: {
    title: "Editor del árbol",
    hint: "Añade una división a un cubo y después usa el botón del triángulo para mover la siguiente bola al lado correspondiente.",
    allRows: "Todas las filas",
    addSplit: "Añadir división",
    addSplitTo: (nodeId) => `Añadir división a ${nodeId}`,
    processNextBall: "Procesar la siguiente bola",
    remove: "Eliminar"
  },
  prediction: {
    title: "Predicción",
    selectedRow: "Fila seleccionada",
    currentPrediction: (rowId, label) => `La fila ${rowId} se predice ahora como ${label}`,
    selectedRowLeaf: (rowId, leafId) => `La fila ${rowId} cae en ${leafId}`,
    path: "Ruta",
    pathSummary: "Resumen de la ruta",
    leafPrediction: "Predicción de la hoja",
    sameLeafAsTarget: (rowId) => `Filas en la misma hoja que la fila ${rowId}`,
    sameSelectedLeaf: "Filas que comparten la hoja seleccionada"
  },
  evaluation: {
    title: "Evaluación",
    summary: (firstRowId, lastRowId) => `Las filas conocidas de la ${firstRowId} a la ${lastRowId} puntúan el árbol actual`,
    starterBaseline: "Referencia inicial",
    lowerAccuracyWarning: "La precisión es menor que la referencia del árbol inicial.",
    falsePositiveWarning: "Este árbol editado crea más falsos positivos que el árbol inicial.",
    falseNegativeWarning: "Este árbol editado crea más falsos negativos que el árbol inicial.",
    noWarnings: "No hay avisos de referencia activos para este árbol.",
    correctRows: "Filas correctas",
    incorrectRows: "Filas incorrectas",
    falsePositives: "Falsos positivos",
    falseNegatives: "Falsos negativos"
  },
  leafBucket: {
    depthLimitReached: "Límite de profundidad alcanzado",
    knownRowsSummary: (known, budget, premium) =>
      `Filas conocidas: ${known} | Económico ${budget} | Premium ${premium}`
  },
  fallback: {
    tie: "Se usa la mayoría global porque la hoja está empatada.",
    empty: "Se usa la mayoría global porque la hoja no tiene filas conocidas.",
    majority: "La hoja usa una votación por mayoría directa."
  },
  rowTooltip: {
    class: "Clase",
    price: "Precio",
    size: "Tamaño",
    neighborhood: "Barrio",
    pricePerM2: "Precio por m²"
  },
  status: {
    unknownError: "Error desconocido"
  }
};
