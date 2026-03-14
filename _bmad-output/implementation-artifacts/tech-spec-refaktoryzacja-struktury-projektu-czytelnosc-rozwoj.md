---
title: 'Refaktoryzacja struktury projektu pod czytelność i dalszy rozwój'
slug: 'refaktoryzacja-struktury-projektu-czytelnosc-rozwoj'
created: '2026-03-14T22:41:06+01:00'
status: 'Completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['TypeScript 5.8.3', 'Lit 3.3.2', 'Rollup 2.79.2', 'Home Assistant Lovelace custom cards', 'ESLint + Prettier']
files_to_modify: ['src/index.ts', 'src/cards/base.ts', 'src/cards/cards-docs.json', 'src/cards/core.css', 'src/cards/font.css', 'src/cards/theme.css', 'src/cards/clock/dihor-clock-card.ts', 'src/cards/dashboard-background/dihor-dashboard-background-card.ts', 'src/cards/minecraft/dihor-minecraft-card.ts', 'src/cards/person/dihor-person-card.ts', 'src/cards/toggle-button/dihor-toggle-button-card.ts', 'rollup.config.js', 'prepare-docs.js', 'package.json', 'README.md']
code_patterns: ['BaseDihorCard inheritance', 'per-card folder structure', 'customElements guard registration', 'window.customCards registration', 'Lit css+unsafeCSS style composition', 'central exports in src/index.ts']
test_patterns: ['No automated test framework configured', 'lint and build as mandatory smoke checks', 'manual preview validation via docs/serve flow']
---

# Tech-Spec: Refaktoryzacja struktury projektu pod czytelność i dalszy rozwój

**Created:** 2026-03-14T22:41:06+01:00

## Overview

### Problem Statement

Obecna struktura repo jest funkcjonalna, ale rozproszona i trudniejsza do dalszego utrzymania: logika kart, zasoby demo oraz skrypty build/dev są ułożone w sposób, który utrudnia szybkie odnalezienie odpowiedzialności i bezpieczne rozwijanie projektu brownfield.

### Solution

Przeprowadzić refaktoryzację strukturalną całego repo (kod, skrypty, docs, build/dev flow) z zachowaniem kompatybilności publicznego API kart Home Assistant (`dihor-...`), aby uzyskać spójny, czytelny i łatwy do rozwijania układ projektu.

Cel mierzalny: nowy developer powinien umieć zidentyfikować miejsce zmiany dowolnej karty i uruchomić preview lokalnie w czasie <= 5 minut, korzystając wyłącznie z README.

Outcome goals:
- skrócenie czasu dodania nowej karty przez jednoznaczny i spójny flow developerski,
- ograniczenie ryzyka błędów onboardingowych wynikających z nieczytelnej struktury,
- uproszczenie codziennej pracy maintainerów bez zmiany publicznego API kart.

### Scope

**In Scope:**
- reorganizacja struktury katalogów i plików w `src`, `docs`, `scripts` oraz plikach konfiguracyjnych,
- uporządkowanie punktów wejścia i przepływu build/dev,
- centralizacja skryptów pomocniczych,
- ujednolicenie zasad organizacji komponentów i artefaktów demo,
- aktualizacja dokumentacji developerskiej (`README`, kontekst projektu),
- zachowanie obecnych tagów i kontraktów kart Home Assistant.

**Out of Scope:**
- dodawanie nowych funkcjonalności biznesowych kart,
- celowa zmiana zachowania UI poza zmianami wynikającymi z porządkowania,
- migracja na nowy framework lub zmianę stacku buildowego.

## Context for Development

### Codebase Patterns

- Każda karta ma własny katalog `src/cards/<feature>/` z plikiem `*.ts` i `*.css`, a wspólna baza siedzi w `src/cards/base.ts`.
- `BaseDihorCard` dostarcza wspólny lifecycle (`hass`, `setConfig`, `render` guard) oraz style globalne (`theme.css`, `core.css`, `font.css`).
- Każda karta rejestruje się w dwóch miejscach: `customElements.define` (z guardem) i `window.customCards.push(...)` dla UI Lovelace.
- `src/index.ts` łączy side-effect importy rejestrujące karty oraz named exports klas; to główny punkt integracyjny bundla.
- Występują drobne niespójności stylu kodu (miks `'` i `"` oraz komentarze legacy), ale ogólny wzorzec implementacyjny kart jest spójny.
- Istnieje dodatkowa zależność dokumentacyjna: `src/cards/cards-docs.json` zawiera metadane kart wykorzystywane przez warstwę docs/demo.
- Projekt ma już zdefiniowane reguły jakości i workflow w `_bmad-output/project-context.md`.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/index.ts` | Centralny punkt importów side-effect i eksportów klas kart |
| `src/cards/base.ts` | Wspólna baza kart i globalny lifecycle Lit/HA |
| `src/cards/cards-docs.json` | Manifest metadanych kart dla warstwy docs |
| `src/cards/core.css` | Wspólne style bazowe |
| `src/cards/theme.css` | Zmienne i motywy globalne kart |
| `src/cards/font.css` | Fonty i typografia współdzielona |
| `src/cards/clock/dihor-clock-card.ts` | Wzorzec karty z lokalnym stanem i timerem |
| `src/cards/person/dihor-person-card.ts` | Wzorzec walidacji encji i fallback UI |
| `src/cards/minecraft/dihor-minecraft-card.ts` | Wzorzec parsowania wielu sensorów i fallback danych |
| `src/cards/toggle-button/dihor-toggle-button-card.ts` | Wzorzec akcji serwisowej HA (`callService`) |
| `src/cards/dashboard-background/dihor-dashboard-background-card.ts` | Najbardziej złożona karta (DOM traversal + MutationObserver) |
| `rollup.config.js` | Konfiguracja bundla i reguł importu zasobów |
| `prepare-docs.js` | Przygotowanie artefaktów demo do katalogu `docs/` |
| `package.json` | Definicje skryptów build/dev/lint/format |
| `_bmad-output/project-context.md` | Obowiązujące reguły implementacyjne i quality gates |

### Technical Decisions

- Refaktoryzacja obejmuje całe repo, ale bez breaking changes dla nazw tagów kart i kontraktu publicznego.
- Preferowana centralizacja skryptów i uproszczenie przepływu dev.
- Utrzymanie istniejącego stacku (Lit + TypeScript + Rollup) i obecnych quality gates (`lint`, `build`).
- Dokumentacja ma zostać zsynchronizowana z nową strukturą po refaktorze.
- Migracja struktury będzie etapowa:
  1. przygotowanie nowego układu katalogów,
  2. przenoszenie plików z zachowaniem kompatybilności importów/rejestracji,
  3. cleanup i finalizacja dokumentacji.
  - po każdym etapie wykonania wymagany commit checkpoint dla bezpiecznego rollbacku.
- Guardrails non-breaking:
  - brak zmiany nazw tagów `dihor-*`,
  - brak zmiany kontraktu konfiguracji kart bez osobnej decyzji,
  - brak zmiany formatu bundla i ścieżki wyjściowej bez jawnej zgody.
- Dual-output contract (nienegocjowalny):
  - Output A (runtime HA): `dist/dihor-ha-components.js`,
  - Output B (preview GH Pages): `docs/` zawierające `index.html`, bundle i wymagane assety.
- Hipoteza docelowej struktury (do weryfikacji w Step 2):
  - `src/cards/*` - komponenty kart,
  - `src/shared/*` - baza kart, style współdzielone, utilsy,
  - `scripts/*` - wszystkie skrypty operacyjne,
  - `docs/*` - artefakty preview i zasoby statyczne,
  - pliki konfiguracyjne zachowane spójnie i możliwie uproszczone.
- Ograniczenia ujawnione przez analizę `src/*`:
  - `src/index.ts` oraz `BaseDihorCard` są krytycznymi punktami sprzęgającymi wszystkie karty,
  - `dashboard-background` używa głębokiej nawigacji DOM + `MutationObserver`, więc wymaga ostrożnej migracji bez zmiany zachowania,
  - `cards-docs.json` powinien pozostać skoordynowany z realną strukturą kart i preview.
- Wymagana kolejność migracji zależności (do użycia w planie implementacji):
  1. przygotowanie nowej struktury katalogów i ścieżek importów,
  2. migracja warstwy współdzielonej (`BaseDihorCard`, style globalne),
  3. migracja kart i ich rejestracji,
  4. migracja docs/pipeline (`prepare-docs`, preview assets),
  5. cleanup i finalizacja dokumentacji.
- Ograniczenie iteracji 1:
  - celem jest uporządkowanie struktury i pipeline bez refaktoru logiki biznesowej kart,
  - zmiany logiki kart (poza niezbędnymi korektami migracyjnymi) są poza zakresem tego speca.
- High-risk files do szczególnego monitoringu:
  - `src/index.ts`,
  - `src/cards/base.ts`,
  - `src/cards/dashboard-background/dihor-dashboard-background-card.ts`,
  - `prepare-docs.js`,
  - `rollup.config.js`.
- Checkpoint rollback:
  - jeśli po migracji warstwy współdzielonej `lint`/`build` failuje i fix nie jest szybki, wrócić do ostatniego stabilnego etapu i kontynuować mniejszym krokiem.

## Implementation Plan

### Tasks

- [x] Task 1: Prepare target structure and migration map (no behavior changes)
  - File: `_bmad-output/implementation-artifacts/tech-spec-refaktoryzacja-struktury-projektu-czytelnosc-rozwoj.md` (final spec artifact)
  - Action: Define and maintain old->new path mapping plus migration sequence notes as internal implementation artifact.
  - Notes: Do not update public README at this stage; docs update stays in Task 15 after migration completion.
- [x] Task 2: Centralize operational scripts under `scripts/`
  - File: `prepare-docs.js` -> `scripts/prepare-docs.js`
  - Action: Move docs preparation script to `scripts/` and keep the same behavior (copy bundle + assets to `docs`).
  - Notes: Preserve current side effects (`version.json`, `.nojekyll`, recursive cards copy).
- [x] Task 3: Update npm scripts to new script location
  - File: `package.json`
  - Action: Update `prepare-docs` command to run `node scripts/prepare-docs.js`; keep `build`, `preview`, `dev`, `lint`, `format`.
  - Notes: Do not add new dependencies or remove existing quality gates.
- [x] Task 4: Extract shared layer into dedicated module path
  - File: `src/cards/base.ts` -> `src/shared/base-card.ts`
  - Action: Move base card class and update imports in all card files.
  - Notes: Keep class name and behavior unchanged; this is a structural move only. Avoid introducing new import alias complexity in Iteration 1.
- [x] Task 5: Move shared styles into `src/shared/styles/`
  - File: `src/cards/theme.css`, `src/cards/core.css`, `src/cards/font.css`
  - Action: Relocate shared CSS files to `src/shared/styles/` and update all import paths (`src/index.ts`, `src/shared/base-card.ts`, cards where needed).
  - Notes: Preserve CSS content and loading order. Prefer direct relative imports; avoid new tsconfig/build alias changes unless strictly required.
- [x] Task 6: Migrate card modules to consume new shared paths
  - File: `src/cards/clock/dihor-clock-card.ts`
  - Action: Update `BaseDihorCard` import path and verify timer card still compiles with new layout.
  - Notes: No logic refactor.
- [x] Task 7: Migrate card modules to consume new shared paths
  - File: `src/cards/person/dihor-person-card.ts`
  - Action: Update `BaseDihorCard` import path and ensure fallback rendering path remains unchanged.
  - Notes: Keep `setConfig` validation unchanged.
- [x] Task 8: Migrate card modules to consume new shared paths
  - File: `src/cards/minecraft/dihor-minecraft-card.ts`
  - Action: Update `BaseDihorCard` and `core.css` import paths after shared-style move.
  - Notes: Preserve sensor fallback behavior and status mapping.
- [x] Task 9: Migrate card modules to consume new shared paths
  - File: `src/cards/toggle-button/dihor-toggle-button-card.ts`
  - Action: Update `BaseDihorCard` import path only.
  - Notes: Keep service call behavior unchanged.
- [x] Task 10: Migrate card modules to consume new shared paths
  - File: `src/cards/dashboard-background/dihor-dashboard-background-card.ts`
  - Action: Update `BaseDihorCard` import path and verify no DOM observer behavior changes.
  - Notes: High-risk file; move only imports/paths.
- [x] Task 11: Update central registration entry point
  - File: `src/index.ts`
  - Action: Point shared style imports to new `src/shared/styles/*` paths; keep card imports/exports and tag contracts unchanged.
  - Notes: High-risk integration file; validate all exports still present.
- [x] Task 12: Keep docs metadata aligned with migrated structure
  - File: `src/cards/cards-docs.json`
  - Action: Verify preview metadata still points to valid assets after migration (or adjust paths if needed).
  - Notes: No schema changes in manifest.
- [x] Task 13: Validate build configuration against new paths
  - File: `rollup.config.js`
  - Action: Confirm input/output and plugin rules remain compatible with moved files.
  - Notes: Do not change output file contract (`dist/dihor-ha-components.js`).
- [x] Task 14: Validate docs publishing flow after script relocation
  - File: `scripts/prepare-docs.js`
  - Action: Ensure docs artifact generation still includes `dihor-ha-components.js`, cards assets, `version.json`, `.nojekyll`.
  - Notes: This task verifies dual-output contract.
- [x] Task 15: Update developer documentation for new structure
  - File: `README.md`
  - Action: Update developer sections with new folder layout, "how to add card" flow, and publishing flow.
  - Notes: Include migration note and old->new path mapping table.
- [x] Task 16: Final validation and rollback checkpoint handling
  - File: `package.json` (commands), repo outputs (`dist/`, `docs/`)
  - Action: Run validation commands in strict order: `npm run lint` -> `npm run build` -> `npm run prepare-docs` -> preview check (`npm run preview`).
  - Notes: If shared-layer migration breaks lint/build and fix is not quick, roll back to last stable migration checkpoint and continue in smaller increments.

### Acceptance Criteria

- [ ] AC 1: Given the refactor branch is checked out, when a developer opens the repository, then the folder layout clearly separates feature cards, shared layer, scripts, and docs artifacts.
- [ ] AC 2: Given existing Home Assistant dashboards use `dihor-*` card tags, when loading the updated bundle, then all existing tags remain valid and functional without configuration migration.
- [ ] AC 3: Given the project is built, when `npm run build` executes, then `dist/dihor-ha-components.js` is generated successfully (runtime HA artifact).
- [ ] AC 4: Given docs preparation runs, when `npm run prepare-docs` and `npm run preview` execute, then `docs/index.html` serves correctly and loads the updated bundle/assets (preview gh-pages artifact).
- [ ] AC 5: Given card registration metadata is consumed by Lovelace, when cards are discovered, then each existing card remains visible in picker via `window.customCards`.
- [ ] AC 6: Given shared files are migrated, when cards compile and render, then behavior of existing cards is unchanged (`zero behavior drift`) outside structural updates.
- [ ] AC 7: Given lint/build are quality gates, when migration is complete, then `npm run lint` and `npm run build` both pass.
- [ ] AC 8: Given manual regression is executed, when at least two cards are validated (including one untouched card) with one simple card (`clock` or `person`) and one complex card (`dashboard-background` or `minecraft`), then no regression in rendering or interaction is observed.
- [ ] AC 9: Given high-risk files are changed, when review is performed, then `src/index.ts`, `src/shared/base-card.ts`, dashboard-background card, script migration, and rollup config are explicitly verified.
- [ ] AC 10: Given documentation is updated, when maintainers read README, then it includes migration note, publishing flow, and a path mapping table (`old path -> new path`).
- [ ] AC 11: Given shared-layer migration introduces lint/build failure, when quick fix is not feasible, then implementation rolls back to the last stable checkpoint and resumes in smaller migration increments.
- [ ] AC 12: Given a developer unfamiliar with this repository follows updated README, when they perform the "add new card" recipe, then they can complete setup without blocking clarification questions.
- [ ] AC 13: Given `src/cards/cards-docs.json` is used for preview metadata, when docs artifacts are generated, then each metadata entry maps to an actually available card and corresponding assets in `docs/cards`.

## Additional Context

### Dependencies

- Runtime: `lit`
- Build: `rollup`, `@rollup/plugin-typescript`, `@rollup/plugin-node-resolve`, `@rollup/plugin-terser`, `rollup-plugin-string`
- Quality: `eslint`, `@typescript-eslint/*`, `eslint-plugin-lit`, `prettier`
- Release: `semantic-release` + plugins

### Testing Strategy

- Brak frameworka testów automatycznych (stan obecny potwierdzony).
- Obowiązkowe smoke checks po zmianach strukturalnych:
  - `npm run lint`
  - `npm run build`
- Walidacja manualna po refaktorze:
  - uruchomienie preview (`npm run dev` / `npm run preview`),
  - sprawdzenie minimum 2 kart (w tym jednej nieedytowanej),
  - potwierdzenie `zero behavior drift` i poprawnej rejestracji `customCards`.

### Notes

Założenia potwierdzone przez użytkownika: centralizacja skryptów = tak, porządki dokumentacji = tak, dopuszczalność zmian szerokich = tak, przy zachowaniu kompatybilności publicznego API kart.

Kryterium jakości refaktoryzacji: zero behavior drift dla istniejących kart (brak intencjonalnej zmiany zachowania funkcjonalnego).

Wymóg dokumentacyjny do finalnego specu: tabela mapowania `stara ścieżka -> nowa ścieżka` dla kluczowych przenosin.

Definition of Done (quick spec execution target):
- struktura projektu uproszczona i spójna,
- dokumentacja developerska zaktualizowana,
- `npm run lint` i `npm run build` zakończone sukcesem,
- ręczna walidacja co najmniej 2 kart wykonana,
- mapa przenosin plików dostarczona,
- migration note dla maintainera dostarczony (co przeniesiono, gdzie szukać, jak dodać nową kartę po nowemu),
- sekcja "Publishing flow" dostarczona (co buduje runtime artifact, co przygotowuje docs artifact pod gh-pages).

Edge checks wymagane w Acceptance Criteria:
- każda karta nadal widoczna w pickerze (`window.customCards`),
- output bundla pozostaje `dist/dihor-ha-components.js` i jest kopiowany do `docs/`.
- walidacja dual-output wykonywana rozdzielnie:
  1. runtime artifact check (`dist/dihor-ha-components.js`),
  2. preview artifact check (`docs/index.html` + poprawny load bundle).

Known limitations (accepted in this spec):
- Iteration 1 does not include deeper business-logic cleanup inside card implementations.
- No automated test framework is introduced in this scope.

Future considerations (out of current scope):
- Optional second-pass cleanup for card internals after structural stabilization.
- Optional introduction of automated tests once structure and flow are stable.

## Review Notes

- Adversarial review completed
- Findings: 12 total, 8 fixed, 4 skipped
- Resolution approach: auto-fix



