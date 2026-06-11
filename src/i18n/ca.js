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
  navigation: {
    label: "Navegació principal",
    brand: "Lliçons de decisió",
    links: {
      home: "Inici",
      average: "Lliçó 1",
      decisionTree: "Lliçó 2",
      trainedTree: "Lliçó 3"
    }
  },
  home: {
    eyebrow: "Tres lliçons petites",
    title: "Aprèn com els models simples prenen decisions",
    copy:
      "Un conjunt de dades d'habitatges es converteix en un espai de joc per a prediccions, regles manuals i un arbre entrenat automàticament.",
    valueTitle: "Per a què serveix",
    valueCopy:
      "Les lliçons connecten idees de models amb accions visibles: crear una característica, fer una predicció, dividir files en grups i comparar el resultat amb el que diuen les dades.",
    conceptsTitle: "Conceptes principals",
    concepts: [
      {
        kicker: "Característiques",
        title: "Converteix dades en senyals útils",
        copy: "El preu per m² mostra com una columna nova pot fer possible una predicció simple."
      },
      {
        kicker: "Regles",
        title: "Envia exemples per un arbre",
        copy: "Les preguntes binàries separen files en fulles, on la majoria local es converteix en la predicció."
      },
      {
        kicker: "Entrenament",
        title: "Tria divisions puntuant-les",
        copy: "L'arbre generat compara candidates, conserva la divisió més forta i repeteix amb un límit de profunditat."
      }
    ],
    lessonsEyebrow: "Comença on vulguis",
    lessonsTitle: "Lliçons",
    lessons: [
      {
        href: "./lesson-average-price.html",
        label: "Lliçó 1",
        title: "Endevina amb una mitjana",
        copy: "Enginyeria de característiques i una predicció de referència."
      },
      {
        href: "./lesson-decision-tree.html",
        label: "Lliçó 2",
        title: "Construeix un arbre de decisió petit",
        copy: "Divisions manuals, fulles, rutes i avaluació."
      },
      {
        href: "./lesson-trained-tree.html",
        label: "Lliçó 3",
        title: "Deixa que l'ordinador construeixi l'arbre",
        copy: "Divisions candidates, guany i un model entrenat."
      }
    ]
  },
  hero: {
    eyebrow: "Lliçó interactiva",
    title: (rowId) => `Construeix un arbre de decisió petit`,
    copy:
      "Edita regles binàries amb mida i barri, envia cada fila d'habitatge a una fulla i observa com canvia la predicció.",
    qrAlt: "Codi QR per a la demo en viu",
    qrButtonLabel: "Obre el codi QR",
    qrDialogLabel: "Modal del codi QR"
  },
  averageLesson: {
    eyebrow: "Lliçó 1",
    title: "Endevina amb una mitjana",
    copy:
      "Comença amb el model més simple possible: calcula la mitjana dels preus coneguts per m², extrapola el preu de l'habitatge objectiu i aplica la frontera Econòmic/Premium.",
    summaryLabel: "Resum del model de preu mitjà",
    target: "Objectiu",
    knownRows: (count) => `${count} files conegudes`,
    notCalculated: "Encara no hi ha estimació",
    featureMissing: "Característica sense crear",
    featureReady: "Característica €/m² a punt",
    averagePricePerM2: "Mitjana €/m²",
    verdict: "Veredicte",
    resultTitle: "Resultat",
    placeholderTitle: "Esperant estimació",
    placeholderCopy: "Usa l'acció d'extrapolar per calcular una estimació de preu per a l'habitatge objectiu.",
    featurePlaceholderCopy: "Comença creant una característica €/m² a partir del preu i la mida de cada habitatge conegut.",
    predictedAs: (rowId, label) => `Fila ${rowId}: ${label}`,
    thresholdRule: (threshold) => `Premium si l'estimació és superior a ${threshold}; si no, Econòmic.`,
    calculation: "Càlcul",
    formula: (average, size, price) => `${average} x ${size} = ${price}`,
    targetSize: "Mida objectiu",
    estimatedPrice: "Preu estimat",
    modelNote:
      "Això és un model perquè produeix una predicció, però no és aprenentatge automàtic: no s'entrena ni s'optimitza res.",
    actionEyebrow: "Model d'un pas",
    engineeringHint:
      "Crea una característica nova dividint el preu de cada habitatge conegut per la seva mida.",
    extrapolateHint:
      "Ara calcula la mitjana de la característica €/m² i multiplica-la per la mida de l'habitatge objectiu.",
    featureEngineering: "Enginyeria de característiques",
    extrapolate: "Extrapola preu",
    clear: "Esborra estimació"
  },
  trainedLesson: {
    eyebrow: "Lliçó 3",
    title: "Deixa que l'ordinador construeixi l'arbre",
    copy:
      "Genera automàticament un arbre de decisió puntuant possibles divisions, conservant les millors i enviant la fila objectiu pel model entrenat.",
    summaryLabel: "Resum de l'arbre de decisió generat",
    trainingRows: (count) => `${count} files d'entrenament`,
    depthLimit: (depth) => `Profunditat màxima ${depth}`,
    notGenerated: "Encara no hi ha cap model generat",
    targetPrediction: "Predicció objectiu",
    generateModel: "Genera model",
    clearModel: "Esborra model",
    previousStep: "Anterior",
    nextStep: "Següent",
    showFinal: "Mostra final",
    playTraining: "Animació",
    stopTraining: "Atura",
    stepProgress: (current, total) => `Pas ${current} de ${total}`,
    beforeFirstSplit: "Abans de la primera divisió",
    allRowsWaiting: "Totes les files continuen juntes",
    firstSplitHint: "Avança al pas següent perquè l'algorisme apliqui la primera divisió triada.",
    placeholderCopy:
      "Prem genera model perquè l'algorisme compari divisions i construeixi un arbre de decisió de només lectura.",
    trainingTitle: "Entrenament",
    trainingSubtitle: "Divisions candidates",
    candidateRule: "Regla",
    purity: "Puresa",
    purityValue: "Guany",
    nodeRows: (rowIds) => `Files ${rowIds}`,
    chosenSplit: (condition) => `Divisió triada: ${condition}`,
    previewingSplit: (condition) => `Provant divisió: ${condition}`,
    selectedBestSplit: (condition) => `Millor divisió seleccionada: ${condition}`,
    previewing: "Vista prèvia",
    selectedBest: "Seleccionada",
    bestSplit: "Millor",
    modelTitle: "Model generat",
    predictedAs: (rowId, label) => `Fila ${rowId}: ${label}`,
    splitRule: "Regla de divisió",
    previewRule: "Regla en prova",
    selectedRule: "Regla seleccionada",
    pendingSplit: "Esperant",
    pendingGroup: "Grup encara sense dividir",
    pendingRows: (rowIds) => `Files esperant aquí: ${rowIds}`,
    targetWaiting: "L'objectiu espera",
    trueBranch: "Cert",
    falseBranch: "Fals",
    leaves: "Fulles"
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
