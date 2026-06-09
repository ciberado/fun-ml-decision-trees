# Aplicació Didàctica de Models de Decisió

[English](./README.md) | [Español](./README.es.md)

Una petita aplicació web que ensenya models de predicció simples fent servir un conjunt de dades d'habitatges molt petit.

L'aplicació és deliberadament simple:
- comença amb una lliçó de preu mitjà i un pas d'enginyeria de característiques
- mostra un conjunt de dades compacte
- permet construir a mà un arbre binari petit
- mou cada fila com una bola numerada a través de l'arbre
- prediu la fila objectiu desconeguda
- mostra precisió, falsos positius i falsos negatius mentre edites

És una eina didàctica, no un entrenador automàtic de models. L'objectiu és que la lògica de predicció sigui visible i fàcil de comentar.

## Demo en Viu

GitHub Pages:

`https://ciberado.github.io/fun-ml-decision-trees/`

## Com Funciona

La lliçó 1 fa servir el mateix conjunt de dades, però comença abans de l'aprenentatge automàtic:
- primer oculta `€/m²`
- després l'usuari crea aquesta característica derivada amb `Enginyeria de característiques`
- després extrapola el preu objectiu fent servir la mitjana de `€/m²`
- finalment classifica l'estimació com a `Econòmic` o `Premium` fent servir la frontera de preu `250`

L'arbre editable comença amb un únic cubell arrel. Hi afegeixes divisions, processes boles una a una i veus com les regles actuals separen el conjunt de dades.

Només hi ha dues característiques disponibles per dividir:
- `size`
- `neighborhood`

En la lliçó de l'arbre, `price`, `class` i `price per m²` es mostren a la taula, però són camps només informatius. No es poden fer servir com a criteris de divisió.

## Desenvolupament Local

Requisits:
- Node.js

Ordres:

```bash
npm test
npm run serve
```

Després obre:

`http://127.0.0.1:8080`

La primera lliçó està disponible a:

`http://127.0.0.1:8080/lesson-average-price.html`

## Estructura del Projecte

```text
src/data/        conjunt de dades i arbre base
src/domain/      lògica pura del model de preu mitjà i de l'arbre
src/state/       estat de l'arbre de decisió i recomputació
src/components/  interfície amb Web Components
src/i18n/        textos en anglès, castellà i català
src/utils/       utilitats i formatadors compartits
tests/           proves de domini, estat i format
```

## Idiomes

La interfície es pot canviar entre:
- anglès
- castellà
- català

Les traduccions viuen en fitxers separats dins de `src/i18n/`.

## Notes

- L'aplicació és estàtica i no fa servir frameworks.
- El conjunt de dades actual és artificial expressament perquè les decisions de l'arbre siguin més fàcils d'entendre.
- La lliçó de preu mitjà deriva `price per m²` com un pas visible d'enginyeria de característiques.
- L'arbre inicial es conserva com a referència d'avaluació, mentre que l'arbre editable comença buit a l'arrel.
