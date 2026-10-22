# Próby gry „Ucieczka z kompleksu”

Próby wykonuj w konsoli przeglądarki po otwarciu `src/index.html`. Polecenia są globalne, a także dostępne jako `gra.*`. Po każdym poleceniu gra pokazuje mapę, energię i opis bieżącego pokoju. Mapa jest losowana przy `start()`, dlatego wybieraj kierunek z rzeczywistych wyjść pokazanych przez `rozejrzyj()`.

## Scenariusze do wykonania

| # | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|
| 1. Start i mapa | Odśwież stronę albo wpisz `start()` | Wpisz `mapa()` i `status()` | Mapa 3×3 ma siedem pokoi i dwa niedostępne pola; pozycja gracza jest oznaczona `*`; energia wynosi 20, pokój to Start. | PASS |
| 2. Ruch i energia | Wpisz `rozejrzyj()`, wybierz istniejące wyjście, np. `idz("prawo")` tylko jeśli pokazano takie wyjście | Wpisz `energia()` | Gracz przechodzi do sąsiedniego pokoju, a energia spada o 1. | PASS. |
| 3. Odmowa ruchu | Odczytaj wyjścia w `rozejrzyj()` i wybierz niepokazany kierunek; w razie potrzeby użyj `gra.idz("gora")` | Wpisz `status()` i `energia()` przed oraz po odmowie | Komunikat o braku przejścia; pokój i energia bez zmian. | PASS. |
| 4. Przedmioty bez duplikatów | Przejdź do Kantorka (pokój oznaczony na mapie jako `Kantorek`); wpisz `akcja("PodniesWiadro")` | Ponownie wpisz `akcja("PodniesWiadro")` | Drugie pobranie nie dodaje wiadra ani nie zużywa energii. | Automatycznie sprawdzone w `node tests/game.test.cjs` — PASS. |
| 5. Generator wymaga przygotowania | Zbierz w Kantorku wiadro i bezpiecznik, napełnij wiadro w Łazience (`akcja("NapelnijWiadro")`), przejdź do Generatorowni | `akcja("UzyjWiadro")`, następnie `akcja("WlaczGenerator")` | Gaszenie zużywa wodę i 1 energię; uruchomienie zużywa bezpiecznik i 1 energię, a zasilanie zostaje włączone. | PASS. |
| 6. Eksport i import | Wpisz `console.log(gra.eksportuj())`; skopiuj sam JSON do pliku tekstowego. Odśwież stronę, skopiuj JSON z pliku | `gra.importuj(prompt("Wklej JSON z postep.json"))`; wklej sam JSON | Import zwraca `true`, a `status()` pokazuje odtworzony stan, mapę i przejścia. |  PASS. |
| 7. Uszkodzony zapis | Zapisz stan przez `const przed = gra.eksportuj()`; następnie wywołaj `gra.importuj("{")` | Wpisz `gra.eksportuj()` i porównaj wynik z `przed` | Import zwraca `false`, pokazuje komunikat błędu, a stan pozostaje bez zmian. | PASS. |
| 8. Reset po zakończeniu | Po wygranej lub porażce wpisz `start()` | Wpisz `status()` | Nowa gra jest aktywna, wraca energia 20, pozycja Start i nowa losowa mapa. | Do wykonania ręcznie w przeglądarce. |

## Jak uzupełnić wynik próby

Po wykonaniu scenariusza zastąp wpis „Do wykonania ręcznie w przeglądarce” krótkim wynikiem, np. „PASS — energia spadła z 20 do 19” albo „FAIL — …”. Przy imporcie błędu sprawdź stan przed i po bez odświeżania strony.
