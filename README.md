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
- **Troubleshooting:** If you only see build files like `prepare-docs.js` or `rollup.config.js` in `/config/www/community/dihor-ha-components/` and the `dist/` folder is missing, reinstall the repository in HACS as a **Dashboard** and ensure the resource points to `/hacsfiles/dihor-ha-components/dihor-ha-components.js`.

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
- **Rozwiązywanie problemów:** Jeśli w `/config/www/community/dihor-ha-components/` widzisz tylko pliki budowania (np. `prepare-docs.js`, `rollup.config.js`), a folder `dist/` jest pusty lub nie ma go wcale, usuń repozytorium z HACS i dodaj je ponownie jako **Dashboard**, a następnie upewnij się, że zasób wskazuje na `/hacsfiles/dihor-ha-components/dihor-ha-components.js`.

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

---

For development, CI, release and publishing details see `DEVELOPMENT.md`.

---

Made with care and curiosity by [Pawel Wielga](https://github.com/PawelWielga)
