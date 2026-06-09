# Aplicación Didáctica de Modelos de Decisión

[English](./README.md) | [Català](./README.ca.md)

Una pequeña aplicación web que enseña modelos de predicción simples usando un conjunto de datos de viviendas muy pequeño.

La aplicación es intencionadamente simple:
- empieza con una lección de precio medio y un paso de ingeniería de características
- muestra un conjunto de datos compacto
- permite construir a mano un árbol binario pequeño
- mueve cada fila como una bola numerada a través del árbol
- predice la fila objetivo desconocida
- muestra precisión, falsos positivos y falsos negativos mientras editas

Es una herramienta didáctica, no un entrenador automático de modelos. La idea es que la lógica de predicción sea visible y fácil de comentar.

## Demo en Vivo

GitHub Pages:

`https://ciberado.github.io/fun-ml-decision-trees/`

## Cómo Funciona

La lección 1 usa el mismo conjunto de datos, pero empieza antes del aprendizaje automático:
- primero oculta `€/m²`
- después el usuario crea esa característica derivada con `Ingeniería de características`
- después extrapola el precio objetivo usando la media de `€/m²`
- finalmente clasifica la estimación como `Económico` o `Premium` usando la frontera de precio `250`

El árbol editable empieza con un único cubo raíz. Añades divisiones, procesas bolas una a una y ves cómo las reglas actuales separan el conjunto de datos.

Solo hay dos características disponibles para dividir:
- `size`
- `neighborhood`

En la lección del árbol, `price`, `class` y `price per m²` se muestran en la tabla, pero son campos solo informativos. No se pueden usar como criterios de división.

## Desarrollo Local

Requisitos:
- Node.js

Comandos:

```bash
npm test
npm run serve
```

Después abre:

`http://127.0.0.1:8080`

La primera lección está disponible en:

`http://127.0.0.1:8080/lesson-average-price.html`

## Estructura del Proyecto

```text
src/data/        conjunto de datos y árbol base
src/domain/      lógica pura del modelo de precio medio y del árbol
src/state/       estado del árbol de decisión y recomputación
src/components/  interfaz con Web Components
src/i18n/        textos en inglés, español y catalán
src/utils/       utilidades y formateadores compartidos
tests/           pruebas de dominio, estado y formato
```

## Idiomas

La interfaz puede cambiarse entre:
- inglés
- español
- catalán

Las traducciones viven en archivos separados dentro de `src/i18n/`.

## Notas

- La aplicación es estática y no usa frameworks.
- El conjunto de datos actual es artificial a propósito para que las decisiones del árbol se entiendan mejor.
- La lección de precio medio deriva `price per m²` como un paso visible de ingeniería de características.
- El árbol inicial se conserva como referencia de evaluación, mientras que el árbol editable empieza vacío en la raíz.
