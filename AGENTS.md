# AGENTS.md

Podstawowe zasady pracy agentów w repozytorium `dihor-ha-components`.

## 1) Kontekst projektu
- Projekt: `dihor-ha-components`
- Stack: TypeScript + Lit + Rollup
- Główne artefakty:
  - runtime: `dist/dihor-ha-components.js`
  - preview/docs: `docs/`
- BMAD output: `_bmad-output/`

## 2) Język i styl komunikacji
- Komunikacja z użytkownikiem: **Polski**
- Styl: konkretny, krótki, techniczny
- Zmiany w dokumentach mogą być po angielsku, jeśli wynika to z kontekstu pliku

## 2a) Standard dokumentacji (PL + EN)
- Dokumentacja user-facing (minimum: `README.md`, instrukcje instalacji, konfiguracji i migracji) ma być prowadzona dwujęzycznie: **Polski + English**.
- Przy dodawaniu nowej sekcji należy dodać obie wersje językowe tej samej treści.
- Przy edycji istniejącej sekcji należy zsynchronizować obie wersje, aby nie rozjeżdżały się merytorycznie.

## 3) Szybki start BMAD
1. Uruchom: `bmad-init`
2. Gdy nie wiesz co dalej: użyj `bmad-help` z pytaniem o następny krok
3. Do zmian implementacyjnych (kod/refactor/fix): preferuj `bmad-quick-dev-new-preview`

## 4) Zakres odpowiedzialności agenta
- Wprowadzaj zmiany minimalne, celowane i zgodne z istniejącą strukturą projektu
- Nie przebudowuj architektury bez wyraźnej prośby
- Nie cofaj zmian użytkownika bez zgody
- Weryfikuj rezultat komendami projektu przed zakończeniem zadania

## 5) Standard weryfikacji zmian
Po zmianach uruchom (jeśli dotyczy):
1. `npm run lint`
2. `npm run build`
3. `npm run prepare-docs`

## 6) Gdzie pracować
- Kod kart: `src/cards/*`
- Warstwa współdzielona: `src/shared/*`
- Skrypty operacyjne: `scripts/*`
- Dokumentacja i preview: `docs/*`
- Konfiguracja BMAD: `_bmad/*` i `.agents/skills/*`

## 7) Definition of Done (minimum)
- Zmiana działa i nie łamie builda
- README/dokumentacja zaktualizowane, jeśli zmiana wpływa na użycie
- Zmiany są czytelne i gotowe do review
