# Raport techniczny i plan refaktoru
## Temat
Stabilna zmiana tła dashboardu Home Assistant z poziomu custom card.

Data: 2026-03-15

## 1. Stan obecny w repo
Aktualna implementacja wstrzykuje style bezpośrednio do globalnego elementu widoku (`hui-view`) z poziomu karty:

- wyszukiwanie w drzewie shadow DOM: `queryDeep('hui-view')`
- nadpisywanie inline style: `element.style.setProperty(...)`
- utrzymanie stanu przez `MutationObserver`

Główne miejsca:
- `src/shared/base-card.ts`
  - `waitForView()` (szukanie `hui-view`)
  - `applyBackgroundStyle()` (ustawianie stylów globalnych)
  - `observeView()` (ponowne wymuszanie stylów)

## 2. Diagnoza problemu
Podejście działa tylko tak długo, jak długo internale frontendu HA pozostają kompatybilne z:
- nazwą elementu (`hui-view`),
- aktualnym układem shadow DOM,
- kolejnością renderu.

To jest kontrakt niepubliczny, więc po aktualizacjach HA może się psuć bez zmian po stronie tej biblioteki.

## 3. Wnioski z dokumentacji HA
Oficjalnie wspierane ścieżki ustawiania tła:

1. Tło per widok: `views[].background` (konfiguracja dashboardu)
2. Tło globalne: motyw frontendu przez `lovelace-background`

Dokumentacja custom card skupia się na renderowaniu samej karty i nie daje stabilnego API do modyfikacji globalnego kontenera widoku.

## 4. Rekomendacja architektoniczna
### Decyzja
Wycofać logikę modyfikacji globalnego `hui-view` z custom card i przejść na model:

1. karta może emitować "intencję tła" (opcjonalnie),
2. faktyczne ustawienie tła odbywa się:
   - albo przez natywną konfigurację `views[].background`,
   - albo przez motyw (`lovelace-background`),
   - albo przez osobny, świadomy mechanizm integracyjny (jeżeli wymagacie dynamicznego sterowania).

### Uzasadnienie
- zgodność z oficjalnym modelem HA,
- mniejsze ryzyko regresji przy aktualizacjach frontendu,
- prostszy maintenance i mniej hacków shadow DOM.

## 5. Plan refaktoru (iteracyjny)
## Faza 0: Safeguard
1. Dodać feature-flag w kodzie: `background.mode = legacy | disabled` (domyślnie `disabled`).
2. W trybie `legacy` zostawić obecną logikę tylko tymczasowo (deprecacja).
3. Dodać ostrzeżenie w konsoli przy `legacy`.

## Faza 1: API i kontrakt
1. Usunąć z formularzy kart sekcję "Dashboard Background" jako funkcję domyślną.
2. Zostawić jedynie dokumentowane wsparcie dla:
   - `views[].background` (YAML dashboardu),
   - `lovelace-background` (motyw).
3. W README dodać sekcję "Supported ways to set dashboard background".

## Faza 2: Usunięcie haków globalnych
1. Usunąć z `BaseDihorCard`:
   - `_viewElement`, `_viewObserver`, `_lastBackgroundStyle`, `_backgroundOwnerId`
   - `syncDashboardBackground()`, `waitForView()`, `queryDeep()`, `observeView()`, `applyBackgroundStyle()`, `clearOwnedBackgroundStyles()`, `isBackgroundApplied()`
2. Uprościć `BaseCardConfig` i schema helpery o pola związane z dashboard background (lub oznaczyć jako deprecated, jeśli wymagacie kompatybilności).

## Faza 3: Migracja użytkowników
1. Przygotować "migration notes":
   - "było: `background.*` w karcie"
   - "jest: `views[].background` lub motyw `lovelace-background`"
2. Dodać przykłady YAML:
   - widok z `background: center / cover no-repeat fixed url(...)`
   - motyw z `lovelace-background: ...`

## Faza 4: Walidacja
1. Test manualny na aktualnym HA:
   - desktop + mobile app,
   - przełączanie widoków,
   - restart frontendu.
2. Weryfikacja repo:
   - `npm run lint`
   - `npm run build`
   - `npm run prepare-docs`

## 6. Ryzyka i mitigacje
1. Ryzyko: użytkownicy polegają na `background.*` w kartach.
   Mitigacja: okres przejściowy `legacy` + komunikat deprecacji + migracja w README.
2. Ryzyko: oczekiwanie dynamicznej zmiany tła "z akcji karty".
   Mitigacja: osobny mechanizm integracyjny poza kartą (np. automatyzacja + kontrolowany stan/dashboard config), zamiast hakowania DOM.

## 7. Definition of Done refaktoru
1. Brak bezpośrednich odwołań do `hui-view` i deep shadow query w kodzie kart.
2. README opisuje wyłącznie wspierane ścieżki tła.
3. Build i docs przechodzą bez błędów.
4. Co najmniej jeden przykład konfiguracji per-view i jeden przez motyw.

## Źródła
- Home Assistant Dashboards / Views: https://www.home-assistant.io/dashboards/views/
- Home Assistant Frontend integration (themes, `lovelace-background`): https://www.home-assistant.io/integrations/frontend/
- Home Assistant Developer Docs - Custom Card: https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card
- Home Assistant Developer Docs - Custom View: https://developers.home-assistant.io/docs/frontend/custom-ui/custom-view

