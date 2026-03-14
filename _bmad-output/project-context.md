---
project_name: 'dihor-ha-components'
user_name: 'Pawel'
date: '2026-03-14T22:37:03+01:00'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
existing_patterns_found: 8
status: 'complete'
rule_count: 101
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- TypeScript 5.8.3
  - Config constraints: `strict: true`, `experimentalDecorators: true`, `useDefineForClassFields: false`
- Lit 3.3.2 (custom cards as Web Components)
- Rollup 2.79.2
  - Entry: `src/index.ts`
  - Output: `dist/dihor-ha-components.js` (ES module)
  - Plugins:
    - `@rollup/plugin-typescript` 12.1.4
    - `@rollup/plugin-node-resolve` 16.0.1
    - `@rollup/plugin-terser` 0.4.4
    - `rollup-plugin-string` 3.0.0 (required for `.css`/`.html` string imports used by Lit + `unsafeCSS`)
- ESLint 8.57.1 (`@typescript-eslint`, `eslint-plugin-lit`)
- Prettier 3.8.1 (`singleQuote: true`, `semi: true`, `printWidth: 100`)
- Semantic Release 24.2.9 (Conventional Commits)
- Testing status: no dedicated test framework config detected (`jest`/`vitest` not configured in repository)

Agent action hints:
- Validate build: `npm run build`
- Validate lint: `npm run lint`
- Apply format: `npm run format`
- If stack/tooling changes: update `README.md` and `_bmad-output/project-context.md`

## Critical Implementation Rules

### Language-Specific Rules

- Keep TypeScript strict-safe code (`strict: true`); do not relax tsconfig strictness.
- Keep Lit decorator compatibility: `experimentalDecorators: true` and `useDefineForClassFields: false` are required.
- Define explicit config interfaces per card and validate required fields in `setConfig()` (throw early for invalid config).
- In `renderCard()`, always guard runtime context first (`!this.hass` / `!this._config`) before reading HA state.
- Read entity state defensively from `this.hass.states[...]` with fallback handling (`?? "unavailable"` or explicit fallback UI).
- Use typed HA contracts from `types/home-assistant.d.ts`; avoid `any` unless HA typing gaps force it (current tolerated case: form schema callbacks).
- Preserve style composition pattern in cards: append card CSS with `return [super.styles, css\`${unsafeCSS(cardCssStr)}\`]`.
- Register custom elements only with guard: `if (!customElements.get(tag)) customElements.define(tag, Class)`.
- Keep naming/file layout convention for cards: `src/cards/<feature>/dihor-<feature>-card.ts` + sibling CSS file.
- Keep ESM import/export flow for Rollup: side-effect imports for registration in `src/index.ts` plus named exports for card classes.
- Do not introduce CommonJS patterns or runtime `require`.
- Do not rename public custom-element tags (e.g. `dihor-person-card`) without explicit migration + release notes.

Agent validation hints:
- Run `npm run lint`
- Run `npm run build`

### Framework-Specific Rules

- Every card must extend `BaseDihorCard<ConfigType>` and implement `renderCard()`.
- Keep `setConfig()` as the validation boundary (reject invalid config early with clear errors).
- Keep `renderCard()` non-throwing for runtime data issues; render fallback UI for missing entities/states.
- Keep card UI wrapped in `<ha-card>` to stay compatible with Lovelace rendering conventions.
- Fallback UI must be explicit and user-readable (short message inside `ha-card`), not empty content.
- Use concise English fallback/status copy for consistency (`not found`, `offline`, `unavailable`).
- Compute display values deterministically from HA state with explicit fallback values.
- Register custom element and HA picker metadata together in the card module:
  - guarded `customElements.define(...)`
  - `(window as any).customCards.push({ type, name, description, preview })`
- Keep `customCards.type` aligned with actual custom-element tag name.
- Provide `getStubConfig()` and `getConfigForm()` for cards intended for visual editor support.
- Keep feature-local styling: card-specific CSS stays in card folder and is injected via Lit `css` + `unsafeCSS`.
- Use Lit templating (`html```) only; avoid manual DOM mutation and legacy template syntax.
- Keep card size behavior explicit via `getCardSize()` (default `1`, override only with clear dashboard need).
- Do not bypass `BaseDihorCard` lifecycle for `hass`/`_config` handling.

Agent framework checklist:
- Tag is defined with guard.
- `customCards` entry exists and `type` matches tag.
- Required config fields are present in `getConfigForm()`/validation path.

### Testing Rules

- No dedicated automated test framework is currently configured; do not introduce Jest/Vitest/Cypress (or similar) without explicit decision.
- Smoke checks required for every change:
  - `npm run lint`
  - `npm run build`
- If lint/build fails after a change, do not mark work as complete until fixed (or risk is explicitly accepted).
- Manual regression checks are required when touching card render/config/styles:
  - validate changed card behavior in local preview (`npm run dev`)
  - validate fallback states (`not found`, `offline`, `unavailable`)
  - validate Lovelace registration metadata (`customCards`) remains correct
  - validate at least one non-modified card to catch shared-style/base regressions
- For config-related changes, verify invalid config path still fails fast in `setConfig()` with clear error.
- Do not add test dependencies or test scripts in `package.json` without explicit approval.
- If/when automated testing is adopted, update `README.md` and `_bmad-output/project-context.md` in the same change.
- Include a short validation summary in each PR/change note.

Validation summary template:
- `lint`: pass/fail
- `build`: pass/fail
- `manual preview`: pass/fail + which cards checked
- `fallback states`: verified/not verified

### Code Quality & Style Rules

- Follow repository formatter/linter as source of truth:
  - Prettier: `singleQuote: true`, `semi: true`, `printWidth: 100`, `trailingComma: es5`
  - ESLint with `@typescript-eslint` + `eslint-plugin-lit`
- Use `npm run format` for style normalization and `npm run lint` for quality checks before completion.
- Keep file/folder conventions:
  - card logic: `src/cards/<feature>/dihor-<feature>-card.ts`
  - card styles: sibling CSS file in same folder
  - central registration/exports: `src/index.ts`
- Keep naming consistent with current codebase:
  - classes/interfaces in PascalCase
  - custom-element tags in kebab-case prefixed with `dihor-`
- Prefer small, readable methods and explicit guard clauses over nested conditionals in render paths.
- Keep comments concise and only where intent is non-obvious; avoid noise comments.
- Preserve existing project language for user-facing strings in cards (currently concise English status/fallback copy).
- Do not silently change formatting/lint baselines or disable lint rules without explicit approval.

### Development Workflow Rules

- Use Conventional Commits for all changes:
  - `feat:` for features
  - `fix:` for bug fixes
  - `docs:`, `style:`, `refactor:`, `chore:` for maintenance
  - use `BREAKING CHANGE:` footer for major changes
- Treat semantic-release as authoritative release mechanism; do not manually version bump without explicit process decision.
- For non-trivial changes, follow execution order:
  1. short implementation plan
  2. implementation
  3. validation (`lint`/`build` + manual preview when needed)
  4. concise delivery summary
- Before finalizing a change, run required checks:
  - `npm run lint`
  - `npm run build`
- For UI-impacting changes, include manual preview verification context (`npm run dev`) in change notes.
- Keep change notes concise and include:
  - `Validation summary` (`lint/build/manual`)
  - `Impact` (affected cards/files/user-visible behavior)
- Record durable technical decisions in `_bmad-output/project-context.md` (not only in chat/PR text).
- If changing shared layers (`BaseDihorCard`, shared CSS, `src/index.ts`), validate at least 2 cards for regression.
- If impact is unclear, classify change as high-risk and expand manual validation scope before completion.
- If changing architecture/tooling/rules, update both:
  - `README.md`
  - `_bmad-output/project-context.md`
- Do not introduce new dependencies, scripts, or workflow steps without explicit approval for repo standards impact.
- Any breaking change requires migration guidance for Home Assistant users (what to update in Lovelace config).

### Critical Don't-Miss Rules

- Do not remove or bypass guard checks for `hass`/`_config` in render path.
- Do not read HA entities without fallback handling; missing states must not crash card rendering.
- Do not silently mask invalid configuration with runtime fallback; enforce config correctness in `setConfig()`.
- Do not call `customElements.define(...)` without `customElements.get(...)` guard.
- Do not break tag identity consistency between:
  - custom element tag (e.g., `dihor-person-card`)
  - `customCards.type`
- Do not skip `setConfig()` validation for required fields.
- Do not remove/alter `src/index.ts` side-effect imports or named exports without impact verification.
- Do not modify Rollup entry/output/module format without explicit architecture decision.
- Do not modify shared base/styles (`BaseDihorCard`, `theme.css`, `core.css`, `font.css`) without regression checks on multiple cards.
- Do not add new tooling/dependencies/test framework without explicit repo-level decision.
- Do not ship changes without passing `npm run lint` and `npm run build` (unless risk is explicitly accepted).
- Do not introduce breaking behavior without migration guidance in release/change notes.
- Do not leave durable standards only in chat; persist them in `_bmad-output/project-context.md`.

Red flag stop conditions (must pause and report):
- lint/build failure after change
- mismatch between custom element tag and `customCards.type`
- missing validation for required config fields
- unclear impact on shared layers (`BaseDihorCard`, shared CSS, `src/index.ts`)

Risk report format:
- `issue`: what is wrong
- `impact`: what can break
- `recommended fix`: shortest safe correction path

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow all rules exactly as documented.
- When in doubt, choose the more restrictive/safe option.
- Update this file when new durable patterns emerge.

**For Humans:**

- Keep this file lean and focused on non-obvious agent guidance.
- Update when stack, workflow, or architecture standards change.
- Review periodically and prune rules that became obsolete.

Last Updated: 2026-03-14
