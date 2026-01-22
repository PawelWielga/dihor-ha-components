# Development & Publishing Guide

This document collects all development, build, CI and publishing details for the project. If you're looking for usage and installation for end users, see `README.md`.

---

## Building the bundle

Run the build script to compile all TypeScript sources using Rollup:

```bash
npm run build
```

The compiled bundle will be written to `dist/dihor-ha-components.js`.

---

## Preparing documentation assets

The documentation site served from the `docs` directory requires the card examples. To generate them run:

```bash
npm run prepare-docs
```

This command copies each card's static HTML and CSS from `src/cards/` into `docs/cards/` and creates a `.nojekyll` file for GitHub Pages. After running it you'll find folders like `docs/cards/clock`, `docs/cards/minecraft` etc.

---

## Adding new cards

1. Create a new folder inside `src/cards/` for your card.
2. Implement a custom element class that extends `HTMLElement` (see existing cards for reference).
3. Import shared styles from `src/cards/theme.css` and `src/cards/core.css` in your TypeScript file.
4. Register the element with `customElements.define` and export it from `src/index.ts`.

Additionally, to enable the Lovelace card picker and HACS previews, register card metadata by pushing to `window.customCards`. Example:

```ts
;(window as any).customCards = (window as any).customCards || [];
;(window as any).customCards.push({
  type: 'dihor-example-card',
  name: 'Dihor Example Card',
  preview: true,
  description: 'Short card description'
});
```

5. If you provide accompanying HTML/CSS files, they will be included in `docs/cards/` when running `npm run prepare-docs`.
6. Ensure your class implements `LovelaceCard` and validates configuration in `setConfig`.

---

## Publishing to HACS

- HACS picks releases from GitHub releases. To publish a new version:
  1. Ensure `hacs.json` contains the updated `version` (semantic versioning recommended).
  2. Create a GitHub release tagged `vX.Y.Z` matching that version.
  3. Attach `dist/dihor-ha-components.js` as a release asset (the CI will do this automatically when using the workflows in this repository).

Notes:
- The `hacs.json` file should point to `dist/dihor-ha-components.js` as the module entry. When HACS detects a new release, it will make the updated bundle available to users.

---

## CI / Auto-release workflows

This repository includes multiple GitHub Actions to automate builds, releases and documentation deploys:

- `CI` (`.github/workflows/ci.yml`) — typechecks, builds the project and prepares docs on PRs and pushes to `main`.
- `Semantic Release` (`.github/workflows/semantic-release.yml`) — runs `semantic-release` on `push` to `main` to create semantic releases, update `package.json` and `hacs.json`, and update `CHANGELOG.md`.
- `Attach Build Asset on Release` (`.github/workflows/release.yml`) — runs on `release: published`, builds `dist/` and uploads `dist/dihor-ha-components.js` to the release as an asset for HACS.
- `Deploy docs to GitHub Pages` (`.github/workflows/pages.yml`) — publishes `docs/` to the `gh-pages` branch on push to `main`.
- `Manual Build-number Release` (`.github/workflows/build-number-release.yml`) — manually triggered workflow that creates a `0.0.<github.run_number>` release, updates `package.json` and `hacs.json`, commits, and creates the release.

---

## Semantic-release & commit conventions

This project uses `semantic-release` to automate versioning and releases. To make this reliable:

- Follow Conventional Commits for commit messages (e.g., `feat(minecraft): add players_count`, `fix(clock): handle timezone`).
- Pull Requests should contain commits following the convention — use the PR template and `CONTRIBUTING.md` for guidance.
- Commit linting is enforced via `@commitlint` in CI.

If you prefer to use a CI build-number as your version (e.g., `0.0.<build_number>`), use the `Manual Build-number Release` workflow.

---

## Local testing and release flow

- To run a local build and verify the result:
  - `npm ci`
  - `npm run build`
  - Confirm `dist/dihor-ha-components.js` exists.
- To create a release using semantic-release, merge PRs to `main` using Conventional Commits; the `semantic-release` workflow will create a release automatically.
- When a release is published, the `Attach Build Asset on Release` workflow will upload the built bundle.

---

## Contributing & PRs

See `CONTRIBUTING.md` for contributing guidelines and `PULL_REQUEST_TEMPLATE.md` for a PR template.

---

Made with care and curiosity by [Pawel Wielga](https://github.com/PawelWielga)
