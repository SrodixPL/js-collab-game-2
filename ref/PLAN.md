# Plan gry — Ucieczka z kompleksu

## Założenie

Gracz zaczyna w pokoju Start i próbuje wydostać się z kompleksu. Do zwykłej ucieczki potrzebuje karty dostępu oraz działającego zasilania. Eksploruje układ 3×3, zbiera przedmioty i wykonuje działania w odpowiednich pomieszczeniach. W pustym pokoju może z prawdopodobieństwem 1% pojawić się czołg; jego pojawienie się kończy grę natychmiastową, alternatywną wygraną — czołg wyjeżdża przez ścianę.

## Pomieszczenia i cele

| Pomieszczenie | Zawartość / cel | Status w kodzie (`src/js/app.js`, `src/js/engine.js`) |
|---|---|---|
| Start | Punkt rozpoczęcia i zwykłe wyjście z kompleksu. | ✅ ID 1 jest przypisane do Start, pozycja startu jest losowana. Brakuje kompletnego startu gry i obsługi wyjścia. |
| Generatorownia | Użyć bezpiecznika, aby uruchomić generator i przywrócić zasilanie. | 🟡 ID 2 i `GenOn` istnieją. Warunki sprawdzają pokój i bezpiecznik, ale kod nie ustawia poprawnie zasilania ani nie zużywa bezpiecznika. |
| Kantorek | Zebrać bezpiecznik i wiadro. | 🟡 ID 3 i komendy podnoszenia istnieją, ale pobranie bezpiecznika używa błędnej nazwy pola. Brakuje kontroli dostępności przedmiotów w tym pokoju. |
| Biuro | Zdobyć kartę potrzebną do otwarcia zwykłego wyjścia. | 🟡 ID 4 i `PickUpKeycard` istnieją, ale podnoszenie nie jest ograniczone do biura, a obsługa wyjścia odwołuje się do niezdefiniowanych nazw. |
| Łazienka | Napełnić zabrane wiadro. | 🟡 ID 5 i `FillUp` istnieją. Jest kontrola pokoju, ale stan wiadra ma niespójny typ, a przypisanie nie zmienia jego wartości. |
| Stołówka | Wylosować jedzenie i zmienić poziom energii. | 🟡 ID 6 i `GetFood` są; losuje jedzenie i modyfikuje energię. Należy doprecyzować zakresy losowania i ograniczyć energię do uzgodnionych granic. |
| Pusty pokój | 1% szansy na pojawienie się czołgu i natychmiastową alternatywną wygraną. | 🟡 ID 7 istnieje. Zdarzenie czołgu, szansa 1% i zakończenie gry nie są zaimplementowane. |

Siedem opisanych pomieszczeń zajmuje siedem pól siatki 3×3. Dwa pozostałe pola są puste — nie są pokojami i nie można do nich wejść.

## Losowa mapa i przejścia

- [x] Siatka 3×3 jest tworzona w `src/js/engine.js`.
- [x] Siedem pomieszczeń (ID 1–7) jest rozmieszczanych losowo; dwa pola pozostają puste. Pozycja Startu jest losowa.
- [x] Przejścia są losowane wyłącznie między sąsiednimi polami. Generator najpierw buduje spójny szkielet łączący wszystkie pokoje, potem może dodać kolejne połączenia.
- [x] Mapa jest wypisywana w konsoli, a polecenia ruchu (`idz`, `prawo`, `lewo`, `gora`, `dol`) korzystają z wygenerowanych przejść.
- [ ] Zastąpić `sort(() => Math.random() - 0.5)` poprawnym tasowaniem Fishera–Yatesa.
- [ ] Zmienić rysowanie mapy tak, aby pokazywało rzeczywiste wylosowane przejścia; obecnie wyświetla stałe linie między polami.
- [ ] Powiązać generowanie mapy z rozpoczęciem/resetem gry i ustawiać gracza w Start po każdym losowaniu.

## Plan przebiegu gry

1. Rozpoczęcie/reset: wylosuj rozmieszczenie pomieszczeń i przejścia, ustaw gracza w Start oraz wyzeruj przedmioty, zasilanie i energię.
2. Eksploracja: gracz przechodzi tylko przez istniejące przejścia. Odmowa ruchu nie zmienia stanu ani energii.
3. Kantorek: zbierz bezpiecznik i wiadro.
4. Łazienka: napełnij wiadro. Ustal w regułach, czy napełnione wiadro jest konieczne do uruchomienia generatora; brief bazowy wymaga bezpiecznika, a wiadro wynika z rozszerzonego układu gry.
5. Generatorownia: użyj bezpiecznika, włącz zasilanie i zużyj bezpiecznik.
6. Biuro: zdobądź kartę dostępu.
7. Start/wyjście: przy karcie i włączonym zasilaniu otwórz wyjście i wygraj.
8. Pusty pokój: przy wejściu wykonaj losowanie 1%; trafienie uruchamia czołg, który przebija ścianę i natychmiast wygrywa grę. Pudło pozwala kontynuować.
9. Obsłuż energię, porażkę, blokadę komend po zakończeniu oraz reset zgodnie z kryteriami briefu.

## Status względem briefu i bieżącej implementacji

- [x] Stan gry jest obiektem; zawiera pokój, przedmioty, zasilanie i energię.
- [x] Eksport tworzy tekst JSON z numerem wersji i stanem.
- [x] Import parsuje JSON, sprawdza wersję i podstawowe typy/zakresy, a następnie przypisuje stan.
- [x] Generator losuje układ pokoi i spójne przejścia w siatce 3×3.
- [x] Są polecenia ruchu w czterech kierunkach i odmowa ruchu, gdy przejście nie istnieje.
- [ ] Brief wymaga funkcji reguł przyjmującej stan i komendę oraz zwracającej `{stan, komunikat}` bez mutowania wejścia. Obecne akcje modyfikują globalny `GameState` i wypisują komunikaty bezpośrednio.
- [ ] Naprawić pobieranie przedmiotów, generator, wiadro i wyjście. W akcjach występują m.in. niespójne wielkości liter/nazwy pól, niezdefiniowane identyfikatory i `==` zamiast przypisania.
- [ ] Dokończyć `Start`, `Reset`, warunki zwycięstwa/porażki oraz blokadę ruchu i akcji po zakończeniu.
- [ ] Dodać zdarzenie czołgu z szansą 1% w pustym pokoju i alternatywną wygraną.
- [ ] Zdecydować, czy eksport/import mają zachowywać wygenerowaną mapę i przejścia. Obecny format ich nie zawiera; walidacja `RoomID` dopuszcza 0–7, podczas gdy identyfikatory pomieszczeń to 1–7.
- [ ] Uzupełnić README, udokumentować co najmniej sześć prób i zapisać krótką decyzję techniczną zgodnie z briefem.

## Zgodność z briefem — zakres i odbiór

Zachować wymagania briefu: czysty podział reguł i komunikatów, ruch, przedmioty, akcję wymagającą przedmiotu, wygraną, porażkę i reset; komendy konsolowe zgrupowane w `gra`; ręczny eksport/import tekstu JSON z atomową walidacją; README, co najmniej sześć prób i decyzję techniczną. Rozszerzenie o losową mapę, dodatkowe pokoje i czołg powinno być uwzględnione w modelu stanu oraz walidatorze/importerze, jeżeli ma być przenoszone w zapisie.
