# Development Guide

This short guide explains how to build the project, prepare the documentation files and add new cards.

## Building the bundle

Run the build script to compile all TypeScript sources using Rollup:

```bash
npm run build
```

The compiled bundle will be written to `dist/dihor-ha-components.js`.

## Preparing documentation assets

The documentation site served from the `docs` directory requires the card examples. To generate them run:

```bash
npm run prepare-docs
```

This command copies each card's static HTML and CSS from `src/cards/` into `docs/cards/` and creates a `.nojekyll` file for GitHub Pages. After running it you'll find folders like `docs/cards/clock`, `docs/cards/minecraft` etc.

## Adding new cards

1. Create a new folder inside `src/cards/` for your card.
2. Implement a custom element class that extends `HTMLElement` (see existing cards for reference).
3. Import shared styles from `src/cards/theme.css` and `src/cards/core.css` in your TypeScript file.
4. Register the element with `customElements.define` and export it from `src/index.ts`.
5. If you provide accompanying HTML/CSS files, they will be included in `docs/cards/` when running `npm run prepare-docs`.

Following this pattern allows the card to be compiled into the main bundle and showcased in the documentation.
