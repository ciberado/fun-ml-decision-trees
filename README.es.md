# Aplicación Didáctica de Árboles de Decisión

[English](./README.md) | [Català](./README.ca.md)

Una pequeña aplicación web que explica cómo funciona un árbol de decisión usando un conjunto de datos de viviendas muy pequeño.

La aplicación es intencionadamente simple:
- muestra un conjunto de datos compacto
- permite construir a mano un árbol binario pequeño
- mueve cada fila como una bola numerada a través del árbol
- predice la fila objetivo desconocida
- muestra precisión, falsos positivos y falsos negativos mientras editas

Es una herramienta didáctica, no un entrenador automático de modelos. La idea es que la lógica sea visible y fácil de comentar.

## Demo en Vivo

GitHub Pages:

`https://ciberado.github.io/fun-ml-decision-trees/`

## Cómo Funciona

El árbol editable empieza con un único cubo raíz. Añades divisiones, procesas bolas una a una y ves cómo las reglas actuales separan el conjunto de datos.

Solo hay dos características disponibles para dividir:
- `size`
- `neighborhood`

`price`, `class` y `price per m²` se muestran en la tabla, pero son campos solo informativos. No se pueden usar como criterios de división.

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

## Estructura del Proyecto

```text
src/data/        conjunto de datos y árbol base
src/domain/      lógica pura del árbol de decisión
src/state/       estado de la aplicación y recomputación
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
- El árbol inicial se conserva como referencia de evaluación, mientras que el árbol editable empieza vacío en la raíz.
