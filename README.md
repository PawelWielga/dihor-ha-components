# Dihor HA Components

**EN 🇬🇧**  
This repository contains custom UI components for Home Assistant, designed to make your dashboard more functional – and just a little more fun.  
The project is still under development, and this README is currently being written. Stay tuned for full documentation, usage examples, and setup instructions.

**PL 🇵🇱**  
To repozytorium zawiera niestandardowe komponenty UI do Home Assistanta, stworzone po to, by Twój dashboard był bardziej funkcjonalny – i trochę przyjemniejszy w użyciu.  
Projekt jest nadal w fazie rozwoju, a ten plik README jest w trakcie przygotowywania. Wkrótce pojawi się pełna dokumentacja, przykłady użycia i instrukcja instalacji.

---

## 🌐 Live Demo

Check out the preview of available cards here:
🔗 [DEMO](https://pawelwielga.github.io/dihor-ha-components/)

### Available cards

- **dihor-minecraft-card** – monitor your Minecraft server
- **dihor-person-card** – display Home Assistant person entity
- **dihor-clock-card** – simple digital clock with adjustable size

---

## 📦 Status

- Work in progress 🛠️
- Ready for experimentation 🧪
- Not quite production-ready (yet) 🚧

---

## 🧭 What to expect (soon)

- Installation instructions via HACS or manual method
- Component demos and screenshots
- YAML examples for each card
- Versioning and changelog

---

## 🚀 Installation & Usage (EN / PL)

**Install via HACS (recommended)**

- Add this repository to HACS (Community > Frontend) or search for "Dihor HA Components" and install.
- After installation, HACS will add `dist/dihor-ha-components.js` to your installation. In Lovelace Resources (Settings → Dashboards → Resources) add the file if HACS did not add it automatically: `/hacsfiles/dihor-ha-components/dihor-ha-components.js` (type: module).

**Manual installation**

1. Build the bundle locally: `npm run build` (produces `dist/dihor-ha-components.js`).
2. Copy `dist/dihor-ha-components.js` to your Home Assistant `www/` folder (e.g., `config/www/dihor-ha-components.js`).
3. Add a Lovelace resource: `/local/dihor-ha-components.js` (type: module).

**Basic YAML examples**

- dihor-clock-card

```yaml
type: 'custom:dihor-clock-card'
size: 2
```

- dihor-minecraft-card

```yaml
type: 'custom:dihor-minecraft-card'
title: My Minecraft Server
entity_prefix: server_minecraft
```

- dihor-person-card

```yaml
type: 'custom:dihor-person-card'
entity: person.my_account
```

> 🔧 Note: The bundle registers card metadata in `window.customCards`, so the Lovelace card picker should show these cards (preview enabled) once the resource is loaded.

---

**PL — Instalacja i użycie**

**Instalacja przez HACS (zalecane)**

- Zainstaluj repozytorium z poziomu HACS (Frontend). Po instalacji HACS powinien dodać `dist/dihor-ha-components.js` do Twojej instancji. Jeśli to nie nastąpi, dodaj zasób: `/hacsfiles/dihor-ha-components/dihor-ha-components.js` (typ: module).

**Instalacja ręczna**

1. Zbuduj paczkę: `npm run build` (wyjście: `dist/dihor-ha-components.js`).
2. Skopiuj plik do folderu `www/` w Home Assistant (np. `config/www/dihor-ha-components.js`).
3. Dodaj zasób do Lovelace: `/local/dihor-ha-components.js` (typ: module).

**Przykłady YAML**

- dihor-clock-card

```yaml
type: 'custom:dihor-clock-card'
size: 2
```

- dihor-minecraft-card

```yaml
type: 'custom:dihor-minecraft-card'
title: Moj serwer Minecraft
entity_prefix: server_minecraft
```

- dihor-person-card

```yaml
type: 'custom:dihor-person-card'
entity: person.my_account
```

**Tip:** Po dodaniu zasobu, w edytorze kart Lovelace wyszukaj kartę po nazwie (np. "Dihor Clock Card").

---

## 📣 Publishing to HACS

- Before creating a release, update `hacs.json` -> `version` to the new release version (semantic versioning recommended).
- Create a GitHub release and tag it with the same version. HACS will pick up new releases automatically.
- After release, confirm the new version appears in HACS and that `dist/dihor-ha-components.js` is available under the release assets or the repository's `hacsfiles` path.

---

## 🔁 CI / Auto-release

This repository includes multiple GitHub Actions to fully automate builds, releases and documentation deploys.

- `CI` (`.github/workflows/ci.yml`) — builds the project on pull requests and pushes to `main` (sanity build + docs generation).
- `Semantic Release` (`.github/workflows/semantic-release.yml`) — runs on `push` to `main`, analyzes commits and automatically creates a GitHub Release with a semantic version (tags, changelog). It also updates `package.json`, `hacs.json` and `CHANGELOG.md` using the configured plugins.
- `Attach Build Asset on Release` (`.github/workflows/release.yml`) — runs on `release: published`, builds `dist/` and uploads `dist/dihor-ha-components.js` as an asset to the release so HACS can detect the new release.
- `Deploy docs to GitHub Pages` (`.github/workflows/pages.yml`) — publishes `docs/` to the `gh-pages` branch on every push to `main`.

How to trigger an automated release using semantic-release:

1. Follow conventional commit messages in your PRs (feat/fix/chore with proper scopes) so `semantic-release` can determine the next version automatically.
2. Merge commits to `main`. The `semantic-release` job will:
   - Create a new release tag (`vX.Y.Z`) and release notes.
   - Update `package.json` and `hacs.json` with the new version and commit that change.
   - Generate/update `CHANGELOG.md`.
3. When the release is published, the `Attach Build Asset on Release` workflow will build and upload `dist/dihor-ha-components.js` to the release.

If you prefer `build number` as the version (e.g., `0.0.<build_number>`), there is a workflow (`.github/workflows/build-number-release.yml`) that can be triggered manually from the Actions UI (`Run workflow`) and will:

- set the version to `0.0.<github.run_number>`
- update `package.json` and `hacs.json`
- commit and push the change to `main`
- create a GitHub release `v0.0.<build_number>` (which triggers the asset upload workflow)

Use this workflow when you prefer to use CI build number as the release version rather than semantic versioning.

Notes:
- `semantic-release` uses the `GITHUB_TOKEN` to push commits and create releases. Ensure that merges to `main` include conventional commit messages for proper versioning.
- If you need `npm` publishing in the future, we can add npm auth tokens and enable `@semantic-release/npm` publishing.



---

Made with care and curiosity by [Pawel Wielga](https://github.com/PawelWielga)
