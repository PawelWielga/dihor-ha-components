# Plan modernizacji paczki customowych komponentów HA

## Cel zadania
Przeanalizuj i zaktualizuj paczkę customowych komponentów Home Assistant, aby:
1. Ułatwić użytkownikom korzystanie z paczki
2. Naprawić problem z błędnymi plikami po instalacji przez HACS
3. Usunąć niepotrzebne narzędzia
4. Skupić się na istotnych funkcjach

## 1. Badanie bieżącego stanu
- [ ] Przeanalizuj package.json - zależności i skrypty
- [ ] Przeanalizuj rollup.config.js - konfigurację budowania
- [ ] Przeanalizuj src/index.ts - główny plik źródłowy
- [ ] Przeanalizuj prepare-docs.js - skrypt generowania dokumentacji
- [ ] Sprawdź GitHub Workflows w .github/

## 2. Analiza problemów
### Problem z plikami po instalacji
- Gdy użytkownik instaluje paczkę przez HACS, widzi prepare-docs.js, prepare-docs.js.gz, rollup.config.js i rollup.config.js.gz zamiast pliku dihor-ha-components.js

### Niepotrzebne narzędzia
- Prettier
- Husky
- Możliwe inne narzędzia pomocnicze

## 3. Planowane działania
1. **Naprawa budowania paczki**
   - Zaktualizuj rollup.config.js, aby generował poprawny plik dihor-ha-components.js
   - Skoryguj package.json, aby zawierał tylko niezbędne zależności i skrypty
   - Usuń pliki husky i inne niepotrzebne narzędzia

2. **Aktualizacja dokumentacji**
   - Zaktualizuj README.md, aby był żartobliwy i użytkownikowy, z emoji i informacjami dla HA
   - Aktualizuj CONTRIBUTING.md i inne pliki md
   - Przeanalizuj prepare-docs.js i sprawdź, czy jest potrzebny

3. **GitHub Workflows**
   - Zostaw tylko niezbędne minimum workflow

## 4. Sprawdzenie poprawności
- Po zmianach sprawdź, czy budowanie działa poprawnie
- Testuj instalację paczki przez HACS
- Upewnij się, że pliki są poprawnie generowane

## 5. Podsumowanie
Po zakończeniu pracy paczka powinna być:
- Łatwa do zainstalowania przez HACS
- Zgodna z oczekiwaniami użytkowników HA
- Wygodna w utrzymaniu
- Dokumentowana w sposób przyjazny i zabawny