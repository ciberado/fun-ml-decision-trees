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
      "Edita reglas binarias con tamaño y barrio, lleva cada fila de vivienda a una hoja y observa cómo cambia la predicción.",
    qrAlt: "Código QR para la demo en vivo",
    qrButtonLabel: "Abrir código QR",
    qrDialogLabel: "Modal del código QR"
  },
  averageLesson: {
    eyebrow: "Lección 1",
    title: "Adivina con una media",
    copy:
      "Empieza con el modelo más simple posible: calcula la media de los precios conocidos por m², extrapola el precio de la vivienda objetivo y aplica la frontera Económico/Premium.",
    summaryLabel: "Resumen del modelo de precio medio",
    target: "Objetivo",
    knownRows: (count) => `${count} filas conocidas`,
    notCalculated: "Sin estimación todavía",
    featureMissing: "Característica sin crear",
    featureReady: "Característica €/m² lista",
    averagePricePerM2: "Media €/m²",
    verdict: "Veredicto",
    resultTitle: "Resultado",
    placeholderTitle: "Esperando estimación",
    placeholderCopy: "Usa la acción de extrapolar para calcular una estimación de precio para la vivienda objetivo.",
    featurePlaceholderCopy: "Empieza creando una característica €/m² a partir del precio y el tamaño de cada vivienda conocida.",
    predictedAs: (rowId, label) => `Fila ${rowId}: ${label}`,
    thresholdRule: (threshold) => `Premium si la estimación está por encima de ${threshold}; si no, Económico.`,
    calculation: "Cálculo",
    formula: (average, size, price) => `${average} x ${size} = ${price}`,
    targetSize: "Tamaño objetivo",
    estimatedPrice: "Precio estimado",
    modelNote:
      "Esto es un modelo porque produce una predicción, pero no es aprendizaje automático: no se entrena ni se optimiza nada.",
    actionEyebrow: "Modelo de un paso",
    engineeringHint:
      "Crea una característica nueva dividiendo el precio de cada vivienda conocida por su tamaño.",
    extrapolateHint:
      "Ahora calcula la media de la característica €/m² y multiplícala por el tamaño de la vivienda objetivo.",
    featureEngineering: "Ingeniería de características",
    extrapolate: "Extrapolar precio",
    clear: "Borrar estimación"
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
