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
PL: Przycisk toggle dla pojedynczej encji, z akcjami `tap_action`, `hold_action` i `double_tap_action`.  
EN: Toggle button for a single entity, with `tap_action`, `hold_action`, and `double_tap_action`.

```yaml
type: custom:dihor-toggle-button-card
entity: light.bedroom
icon: mdi:lightbulb-on-outline
show_label: false
tap_action:
  action: toggle
hold_action:
  action: more-info
```

## Shared Options / Wspolne opcje

PL: Wszystkie karty wspieraja `density`, czyli gestosc wizualna kontrolujaca odstepy, rozmycie szkla, cien i rozmiary elementow pomocniczych.

EN: All cards support `density`, a visual density option that controls spacing, glass blur, shadow, and supporting element sizes.

```yaml
type: custom:dihor-minecraft-card
entity_prefix: server_minecraft
density: s # s | m | l
```

- `s` - PL: kompaktowo, mniej swiatla i mniejsze odstepy. EN: compact, less light and tighter spacing.
- `m` - PL: wariant zbalansowany, domyslny. EN: balanced default.
- `l` - PL: wiecej swiatla i przestrzeni. EN: more light and spacing.

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
