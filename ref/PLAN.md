# Plan gry — Ucieczka z kompleksu

## Założenie

Gracz zaczyna w pokoju Start i próbuje wydostać się z kompleksu. Do zwykłej ucieczki potrzebuje karty dostępu oraz działającego zasilania. Eksploruje układ 3×3, zbiera przedmioty i wykonuje działania w odpowiednich pomieszczeniach. W pustym pokoju może z prawdopodobieństwem 5% pojawić się czołg; do alternatywnej wygranej przez ścianę potrzebne są kluczyki TKey (10% szansy w kantorku). Czołg i kluczyki są losowane raz przy rozpoczęciu gry.

## Pomieszczenia i cele

| Pomieszczenie | Zawartość / cel | Status w kodzie (`src/js/app.js`, `src/js/engine.js`) |
|---|---|---|
| Start | Punkt rozpoczęcia i zwykłe wyjście z kompleksu. | ✅ Start ustawia gracza w pokoju 1; Escape wymaga karty i zasilania. |
| Generatorownia | Użyć bezpiecznika, aby uruchomić generator i przywrócić zasilanie. | ✅ GenOn wymaga bezpiecznika, zużywa go i włącza zasilanie. |
| Kantorek | Zebrać bezpiecznik i wiadro. | ✅ Klucz, bezpiecznik i wiadro pobierane tylko tutaj, bez duplikatów; 10% szansy na TKey. |
| Biuro | Zdobyć kartę potrzebną do otwarcia zwykłego wyjścia. | ✅ Poza środkiem; OpenOffice przy drzwiach wymaga klucza. Karta tylko w biurze. Zamek nie odcina innych pokojów. |
| Łazienka | Napełnić zabrane wiadro. | ✅ FillUp napełnia posiadane puste wiadro. |
| Stołówka | Wylosować jedzenie i zmienić poziom energii. | ✅ GetFood tylko tutaj; poprawione zakresy i limit energii 0–20. |
| Pusty pokój | 5% szansy na pojawienie się czołgu i natychmiastową alternatywną wygraną. | ✅ 5% szansy na czołg przy starcie; Escape z TKey daje wygraną. |

Siedem opisanych pomieszczeń zajmuje siedem pól siatki 3×3. Dwa pozostałe pola są puste — nie są pokojami i nie można do nich wejść.

## Losowa mapa i przejścia

- [x] Siatka 3×3 jest tworzona w `src/js/engine.js`.
- [x] Siedem pomieszczeń (ID 1–7) jest rozmieszczanych losowo; dwa pola pozostają puste. Pozycja Startu jest losowa.
- [x] Przejścia są losowane wyłącznie między sąsiednimi polami. Generator najpierw buduje spójny szkielet łączący wszystkie pokoje, potem może dodać kolejne połączenia.
- [x] Mapa jest wypisywana w konsoli, a polecenia ruchu (`idz`, `prawo`, `lewo`, `gora`, `dol`) korzystają z wygenerowanych przejść.
- [x] Zastąpiono losowe sortowanie tasowaniem Fishera–Yatesa.
- [x] Zachowano mapę z ramkami; linie pokazują rzeczywiste przejścia.
- [x] Start i Reset losują mapę i ustawiają gracza w Start.

## Plan przebiegu gry

1. Rozpoczęcie/reset: wylosuj rozmieszczenie pomieszczeń i przejścia, ustaw gracza w Start oraz wyzeruj przedmioty, zasilanie i energię.
2. Eksploracja: gracz przechodzi tylko przez istniejące przejścia. Odmowa ruchu nie zmienia stanu ani energii.
3. Kantorek: zbierz bezpiecznik i wiadro.
4. Łazienka: napełnij wiadro. Ustal w regułach, czy napełnione wiadro jest konieczne do uruchomienia generatora; brief bazowy wymaga bezpiecznika, a wiadro wynika z rozszerzonego układu gry.
5. Generatorownia: użyj bezpiecznika, włącz zasilanie i zużyj bezpiecznik.
6. Biuro: zdobądź kartę dostępu.
7. Start/wyjście: przy karcie i włączonym zasilaniu otwórz wyjście i wygraj.
8. Pusty pokój: czołg jest dostępny, jeżeli został wylosowany przy starcie. Escape wymaga TKey z kantorka.
9. Obsłuż energię, porażkę, blokadę komend po zakończeniu oraz reset zgodnie z kryteriami briefu.

## Status względem briefu i bieżącej implementacji

- [x] Stan gry jest obiektem; zawiera pokój, przedmioty, zasilanie i energię.
- [x] Eksport tworzy tekst JSON z numerem wersji i stanem.
- [x] Import parsuje JSON, sprawdza wersję i podstawowe typy/zakresy, a następnie przypisuje stan.
- [x] Generator losuje układ pokoi i spójne przejścia w siatce 3×3.
- [x] Są polecenia ruchu w czterech kierunkach i odmowa ruchu, gdy przejście nie istnieje.
- [ ] Brief wymaga funkcji reguł przyjmującej stan i komendę oraz zwracającej `{stan, komunikat}` bez mutowania wejścia. Obecne akcje modyfikują globalny `GameState` i wypisują komunikaty bezpośrednio.
- [x] Naprawiono pobieranie przedmiotów, generator, napełnianie wiadra i wyjście w dotychczasowym switch w akcja().
- [x] Dokończono Start, Reset, wygraną, porażkę i blokadę komend po zakończeniu.
- [x] Czołg: 5%, TKey w kantorku: 10%; Escape wymaga obu i obecności w pustym pokoju.
- [x] Zapis wersji 2 zachowuje mapę, przejścia i cały postęp. Poprawiono walidację wiadra i RoomID (1–7).
- [ ] Uzupełnić README, udokumentować co najmniej sześć prób i zapisać krótką decyzję techniczną zgodnie z briefem.

## Zgodność z briefem — zakres i odbiór

Zachować wymagania briefu: czysty podział reguł i komunikatów, ruch, przedmioty, akcję wymagającą przedmiotu, wygraną, porażkę i reset; komendy konsolowe zgrupowane w `gra`; ręczny eksport/import tekstu JSON z atomową walidacją; README, co najmniej sześć prób i decyzję techniczną. Rozszerzenie o losową mapę, dodatkowe pokoje i czołg powinno być uwzględnione w modelu stanu oraz walidatorze/importerze, jeżeli ma być przenoszone w zapisie.

## Poprawki w dotychczasowym stylu kodu

Zachowano globalny GameState, osobne przypadki switch w akcja(akc), nazwy funkcji i mapę z ramkami. Generator wymaga wyłącznie bezpiecznika; nie dodano wymogu chłodzenia wodą. Wiadro można zabrać i napełnić; jego dalsze zastosowanie pozostaje do ustalenia. Klucz do biura jest wielorazowy.

- [x] Biuro poza środkiem i dostęp do innych pokojów bez otwierania biura.
- [x] Automatyczne próby dotychczasowych funkcji: node tests/game.test.cjs.
- [ ] Ręczny odbiór w przeglądarce i przeniesienie zapisu przez plik.

Rozdzielenie reguł od komunikatów pozostaje niezrealizowanym punktem briefu; nie przebudowywano ponownie kodu.
