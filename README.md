# Dihor HA Components

PL: Kolekcja nowoczesnych kart customowych dla Home Assistant, zbudowana na Lit + TypeScript.  
EN: A collection of modern custom cards for Home Assistant, built with Lit + TypeScript.

## Demo

PL: Instalacja, przyklady konfiguracji i podglad kart: [Demo Page](docs/index.html)  
EN: Installation, configuration examples, and live preview: [Demo Page](docs/index.html)

## Components / Komponenty

1. `dihor-clock-card`  
PL: Konfigurowalny zegar cyfrowy.  
EN: Configurable digital clock.

2. `dihor-minecraft-card`  
PL: Monitor statusu serwera Minecraft.  
EN: Minecraft server status monitor.

3. `dihor-person-card`  
PL: Karta encji `person` z Home Assistant.  
EN: Home Assistant `person` entity card.

4. `dihor-toggle-button-card`  
PL: Przycisk toggle dla pojedynczej encji.  
EN: Toggle button for a single entity.

## Tech Stack

PL:
- `Lit` - web components i reaktywne renderowanie
- `TypeScript` - typowanie i bezpieczenstwo zmian
- `Rollup` - bundling do `dist/dihor-ha-components.js`
- `ESLint` + `Prettier` - jakosc i format kodu

EN:
- `Lit` - web components and reactive rendering
- `TypeScript` - typing and safer refactors
- `Rollup` - bundling into `dist/dihor-ha-components.js`
- `ESLint` + `Prettier` - code quality and formatting

## Project Structure / Struktura projektu

- `src/cards/*` - implementacje kart
- `src/shared/base-card.ts` - wspolna baza kart
- `src/shared/styles/*` - wspolne style
- `scripts/*` - skrypty pomocnicze
- `docs/*` - preview i artefakty dla docs

## Build and Preview / Build i podglad

- `npm install`
- `npm run lint`
- `npm run build`
- `npm run prepare-docs`
- `npm run preview`

PL: `npm run dev` uruchamia przygotowanie docs i preview lokalnie.  
EN: `npm run dev` prepares docs and starts local preview.

## Dashboard Background (Supported)

PL: Ten projekt nie ustawia juz tla dashboardu z poziomu konfiguracji karty. Uzywamy oficjalnych mechanizmow Home Assistant.  
EN: This project no longer sets dashboard background from card config. Use official Home Assistant mechanisms.

### Method 1: View background / Tlo widoku

```yaml
views:
  - title: Home
    path: home
    background: center / cover no-repeat fixed url("/local/backgrounds/home.jpg")
    cards:
      - type: custom:dihor-clock-card
        size: 2
```

### Method 2: Global theme background / Tlo globalne przez motyw

```yaml
frontend:
  themes:
    Dihor Theme:
      lovelace-background: 'center / cover no-repeat fixed url("/local/backgrounds/global.jpg")'
```

### Migration / Migracja

PL:
1. Przenies obraz do `config/www/backgrounds/`.
2. Zmien stare `background:` z konfiguracji karty na `views[].background` albo `lovelace-background`.
3. Odswiez frontend Home Assistant.

EN:
1. Put image into `config/www/backgrounds/`.
2. Replace old card-level `background:` with `views[].background` or `lovelace-background`.
3. Refresh Home Assistant frontend.

## Add New Card / Dodawanie nowej karty

1. Utworz katalog `src/cards/my-card`
2. Dodaj pliki:
   - `dihor-my-card.ts`
   - `dihor-my-card.css`
3. Rozszerz `BaseDihorCard`
4. Dodaj eksport w `src/index.ts`
5. Zbuduj projekt `npm run build`

Minimal template:

```ts
import { html, css, unsafeCSS } from "lit";
import { BaseDihorCard } from "../../shared/base-card";
import cardCssStr from "./dihor-my-card.css";

interface MyCardConfig {
  title?: string;
}

export class MyCard extends BaseDihorCard<MyCardConfig> {
  static get styles() {
    return [super.styles, css`${unsafeCSS(cardCssStr)}`];
  }

  static getStubConfig() {
    return { title: "My Card" };
  }

  static getConfigForm() {
    return {
      schema: [{ name: "title", selector: { text: {} } }],
    };
  }

  protected renderCard() {
    return html`<ha-card>${this._config?.title ?? "My Card"}</ha-card>`;
  }
}

if (!customElements.get("dihor-my-card")) {
  customElements.define("dihor-my-card", MyCard);
}
```

## Publishing Flow

PL:
- Runtime artifact: `dist/dihor-ha-components.js`
- Preview artifact: `docs/` po `npm run prepare-docs`

EN:
- Runtime artifact: `dist/dihor-ha-components.js`
- Preview artifact: `docs/` after `npm run prepare-docs`

## Contributing

PL:
1. Fork repozytorium
2. Stworz branch
3. Wprowadz zmiany
4. Push
5. Otworz PR

EN:
1. Fork repository
2. Create branch
3. Commit changes
4. Push branch
5. Open PR

### Commit Messages / Komunikaty commitow

Use Conventional Commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:`, `refactor:`, `chore:` maintenance changes
- `BREAKING CHANGE:` major release trigger

## License

MIT
