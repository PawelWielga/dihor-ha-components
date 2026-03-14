# 🚀 Dihor HA Components

**Dihor HA Components** is a collection of modern, custom UI cards for Home Assistant, built with performance and aesthetics in mind.

> **Note for Users:** Installation instructions, configuration examples, and live previews are available on the **[Demo Page](docs/index.html)**.

## 📦 Components

This library includes the following cards, now built with **Lit** for better performance and security:

1.  **🕐 Dihor Clock Card** - Customizable digital clock.
2.  **🎮 Dihor Minecraft Card** - Server status monitor.
3.  **👤 Dihor Person Card** - Elegant person entity display.
4.  **🖼️ Dihor Dashboard Background Card** - Dynamic view backgrounds (colors, gradients, images).
5.  **🔘 Dihor Toggle Button Card** - Friendly toggle switch.

## 🛠️ Technology Stack

*   **[Lit](https://lit.dev/)**: Lightweight web components library.
*   **[TypeScript](https://www.typescriptlang.org/)**: Static typing for reliability.
*   **[Rollup](https://rollupjs.org/)**: Efficient module bundling.
*   **ESLint & Prettier**: Code quality and formatting.

## �‍💻 Developer Guide

This section is designed to be a future-proof reference for developers (including you, future-self! 👋).

### 🏗️ Architecture & Technology Stack

We chose specific tools to balance **performance**, **maintainability**, and **developer experience**.

*   **[Lit](https://lit.dev/)**:
    *   **Why?** It's a lightweight wrapper around standard Web Components. It provides a declarative reactive state system (like React/Vue) but outputs standard HTML Custom Elements that work natively in Home Assistant.
    *   **Usage**: All cards extend `BaseDihorCard` (which extends `LitElement`). We use `@property` for inputs from HA and `@state` for internal logic.
*   **[TypeScript](https://www.typescriptlang.org/)**:
    *   **Why?** Home Assistant objects (`hass`, `config`) are complex. strict typing prevents "undefined is not a function" errors and provides excellent autocompletion.
*   **[Rollup](https://rollupjs.org/)**:
    *   **Why?** It creates very small, efficient ES module bundles perfect for modern browsers.
    *   **Plugins**: We use `rollup-plugin-string` to import `.css` files as strings, which we then feed into Lit's `unsafeCSS`.

### 🧭 Target Structure (Iteration 1)

The project is organized to keep responsibilities clear:

- `src/cards/*`: feature card implementations (`*.ts`, `*.css`).
- `src/shared/base-card.ts`: shared base class for all cards.
- `src/shared/styles/*`: shared styles loaded by the base card and entrypoint.
- `scripts/*`: operational scripts (docs prep, helpers).
- `docs/*`: preview app and gh-pages artifacts.

### 🔁 Migration Note (Old -> New Paths)

| Old Path | New Path |
| --- | --- |
| `src/cards/base.ts` | `src/shared/base-card.ts` |
| `src/cards/theme.css` | `src/shared/styles/theme.css` |
| `src/cards/core.css` | `src/shared/styles/core.css` |
| `src/cards/font.css` | `src/shared/styles/font.css` |
| `prepare-docs.js` | `scripts/prepare-docs.js` |

### 🚚 Publishing Flow

Dual-output contract:

- **Runtime artifact (Home Assistant):**
  - `npm run build` -> `dist/dihor-ha-components.js`
- **Preview artifact (gh-pages):**
  - `npm run prepare-docs` copies bundle/assets to `docs/`
  - `npm run preview` serves `docs/index.html`

### 🛟 Rollback Checklist (Migration Work)

For structural migration work, keep one safety checkpoint per stage:

1. Run checks in order: `npm run lint` -> `npm run build` -> `npm run prepare-docs`.
2. Verify preview card loading (`npm run preview`).
3. Create a commit checkpoint before starting the next stage.
4. If shared-layer migration fails and quick fix is not obvious, roll back to last stable checkpoint and continue in smaller increments.

### 🧩 Core Patterns

1.  **BaseDihorCard (`src/shared/base-card.ts`)**:
    *   The abstract base class for all cards.
    *   **Handles**: `hass` property updates, `setConfig`, and attaching core styles (`theme.css`, `core.css`).
    *   **You Implement**: `renderCard()` (returns `html`) and `getCardSize()`.

2.  **Styling**:
    *   Styles are written in separate `.css` files.
    *   imported as strings: `import cardCssStr from "./my-card.css";`
    *   Applied via Lit's static styles:
        ```typescript
        static get styles() {
          return [
            super.styles,
            css`${unsafeCSS(cardCssStr)}`
          ];
        }
        ```

### 🆕 How to Add a New Card

Want to add a new card? Follow this copy-pasteable recipe:

1.  **Create Directory**: `src/cards/my-new-feature`
2.  **Create Assets**:
    *   `dihor-my-new-card.ts` (Logic)
    *   `dihor-my-new-card.css` (Styles)
    *   `dihor-my-new-card.html` (Optional preview template, if needed)
3.  **Implement Class (`dihor-my-new-card.ts`)**:
    ```typescript
    import { html, css, unsafeCSS } from "lit";
    import { state } from "lit/decorators.js";
    import { BaseDihorCard } from "../../shared/base-card";
    import cardCssStr from "./dihor-my-new-card.css";

    export interface MyNewCardConfig {
      header?: string;
    }

    export class MyNewCard extends BaseDihorCard<MyNewCardConfig> {
      static get styles() {
        return [super.styles, css`${unsafeCSS(cardCssStr)}`];
      }

      protected renderCard() {
        return html`
          <ha-card header=${this._config.header || "My New Card"}>
            <div class="card-content">
              Hello from Lit!
            </div>
          </ha-card>
        `;
      }
    }

    customElements.define("dihor-my-new-card", MyNewCard);
    
    // Register for HACS/Lovelace Picker
    (window as any).customCards = (window as any).customCards || [];
    (window as any).customCards.push({
      type: "dihor-my-new-card",
      name: "Dihor My New Card",
      description: "A fresh new card",
      preview: true
    });
    ```
4.  **Add Visual Editor**: Create a static `getConfigForm()` method to enable visual UI configuration:
    ```typescript
    static getStubConfig() {
      return { header: "My New Card" };
    }

    static getConfigForm() {
      return {
        schema: [
          { name: "header", selector: { text: {} } }
        ],
        computeLabel: (schema) => {
          if (schema.name === "header") return "Card Header";
        }
      };
    }
    ```
    Available selector types: `text`, `number`, `entity`, `icon`, `ui_color`, `select`. See [HA selectors](https://www.home-assistant.io/docs/blueprint/selectors/).
5.  **Register Export**: Add `export * from "./cards/my-new-feature/dihor-my-new-card";` to `src/index.ts`.
6.  **Build**: Run `npm run build`.

### 🛠️ Build & Commands

*   `npm install`: Install dependencies.
*   `npm run build`: Compiles everything to `dist/dihor-ha-components.js`. Use this before releasing.
*   `npm run prepare-docs`: Copies runtime bundle and card assets into `docs/` for preview/gh-pages.
*   `npm run dev`: Builds, prepares the demo documentation, and serves it locally. Best for visual testing.
*   `npm run lint` / `npm run format`: Keep the code clean!

## 🤝 Contributing

We welcome contributions!
1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes (please follow the existing style).
4.  Push to the branch.
5.  Open a Pull Request.

### Commit Messages & Versioning
This project uses **[Semantic Release](https://github.com/semantic-release/semantic-release)** to automatically generate version numbers and changelogs. Please use **[Conventional Commits](https://www.conventionalcommits.org/)**:

*   `feat: ...` -> Triggers a **Minor** release (e.g., 1.1.0 -> 1.2.0). Used for new features.
*   `fix: ...` -> Triggers a **Patch** release (e.g., 1.1.0 -> 1.1.1). Used for bug fixes.
*   `docs: ...`, `style: ...`, `refactor: ...`, `chore: ...` -> No release trigger (usually). Used for maintenance.
*   `BREAKING CHANGE: ...` in the footer -> Triggers a **Major** release (e.g., 1.0.0 -> 2.0.0).

Example:
```text
feat(minecraft): add new player count sensor
```

## 📜 License

This project is licensed under the **MIT License**.

---
Made with ❤️ by [Pawel Wielga](https://github.com/PawelWielga)
