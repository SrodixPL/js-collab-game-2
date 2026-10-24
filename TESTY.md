# Testy gry „Ucieczka z serwerowni”

Nowa lista scenariuszy ręcznych dla obecnej wersji gry. Wyniki `PASS` zapisano zgodnie z potwierdzeniem zespołu.

## Przygotowanie i zasady wykonywania

- Otwórz `src/index.html` i konsolę przeglądarki. `rozpocznij()` pokazuje tytuł przez 5 sekund, a potem tworzy grę. `resetuj()` tworzy grę bez tytułu. Podczas tytułu inne komendy są blokowane.
- Korzystaj z polskich komend podanych w `pomoc()`. Te same komendy są dostępne w obiekcie `gra`. Nazwy akcji zaczynają się małą literą, np. `akcja("podniesKlucz")`.
- Każdy wiersz wykonuj niezależnie, od opisanego przygotowania. Jeśli nie podano inaczej, gra jest aktywna, energia dodatnia i nie trwa tytuł. Po zakończeniu przygotuj nową sesję.
- Mapa jest losowa. Wybieraj rzeczywiste kierunki z `mapa()` i `rozejrzyj()`; nie zakładaj stałej trasy do Kantorka ani Biura. Pokoje: 1 — Start, 2 — Generatory, 3 — Kantorek, 4 — Biuro, 5 — Łazienka, 6 — Stołówka, 7 — Pusty pokój.
- Rzadkie zdarzenia i granice można przygotować w konsoli po rozpoczęciu gry: np. `gameState.energy = 1`, `gameState.roomId = 3`, `gameState.tank = true`, `gameState.tankKeyAvailable = true`. To przygotowanie scenariusza; właściwą czynność wykonuj komendą gracza. Przy poprawnym stanie w Biurze ustaw również `gameState.officeOpen = true`. Nie zmieniaj innych pól bez potrzeby.
- Do porównania całego stanu służy pomocniczy odczyt `var testBefore = serializeState()` oraz później `serializeState() === testBefore`. W konsoli można ponownie używać zmiennych var bez konfliktów deklaracji.
- Publiczne `eksportuj()` wypisuje JSON, ale nie zwraca go do zmiennej. Publiczne `importuj()` informuje komunikatem; nie oczekuj zwrotu true/false. W scenariuszach importu korzystaj z wypisanego JSON-u albo pomocniczego odczytu `var testSave = serializeState()`.
- Przed uszkadzaniem zapisu przygotuj `var testPackage = JSON.parse(testSave)`. Zmieniaj tylko wskazane pole i używaj `importuj(JSON.stringify(testPackage))`. Przed każdym kolejnym wariantem odtwórz pakiet: `testPackage = JSON.parse(testSave)`. Bazowy testSave musi opisywać poprawną sesję spełniającą warunki danego przypadku.
- Pakiet zachowuje historyczne nazwy pól: `RoomID`, `Energy`, `Items.Key`, `Items.Bucket.Has`, `Items.Bucket.Filled`, `Power`, `GeneratorFire`, `Mapa`, `Przejscia`. Odczyt przez status() używa nazw camelCase. Nazwy z tabel walidacji dotyczą pól w `testPackage.stan`, chyba że wskazano wersja.
- Każda odmowa importu musi zachować cały stan: pozycję, energię, przedmioty, wodę, mapę, przejścia, zdarzenia i wynik. Weryfikuj to również wtedy, gdy wiersz wskazuje tylko jedno uszkodzone pole. Żaden błędny import nie powinien kończyć się nieobsłużonym wyjątkiem.
- Dla jedzenia z określonym bonusem użyj chwilowego kontrolowanego losowania. Przykład napoju z bonusem 4: `var testRandom = Math.random; var testRolls = [0, 0.99]; try { Math.random = () => testRolls.shift(); akcja("zjedz"); } finally { Math.random = testRandom; }`. Pierwszy wynik wybiera napój dla [0, 1/3), ser dla [1/3, 2/3), kajzerkę dla [2/3, 1). Drugi wybiera bonus: napój floor(wynik * 6) - 1, ser floor(wynik * 4) - 2, kajzerka floor(wynik * 2). Zawsze przywracaj Math.random przed ruchem, resetem i generowaniem mapy.
- Testy czasu wykonuj w aktywnej karcie. Przeglądarka może opóźniać timery w tle; wymagane jest zachowanie jednej sesji bez spóźnionego nadpisania postępu.

## Lista przypadków

Liczba przypadków: **520**. Każdy wiersz jest osobną próbą.

### 1. Wczytanie strony i powitanie

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T001 | Otwarcie strony | Zamknięta poprzednia sesja. | Otwórz src/index.html i konsolę. | Oba skrypty wczytują się bez błędów; widoczna instrukcja rozpocznij(). | PASS |
| T002 | Brak samoczynnego startu | Świeża strona. | Poczekaj ponad 5 sekund bez komend. | Gra nadal czeka na rozpoczęcie; nie pojawia się mapa ani tytuł. | PASS |
| T003 | Test ASCII | Świeża strona; szeroka konsola. | Obejrzyj prostokąt ze wzorem. | Równe krawędzie, zamknięte boki i wzór wewnątrz prostokąta; brak placeholdera. | PASS |
| T004 | Zwężenie konsoli | Widoczny test ASCII. | Zwęź konsolę, następnie ją poszerz. | Można rozpoznać zawijanie i dobrać szerokość do całego rysunku. | PASS |
| T005 | Kodowanie | Wczytana strona i uruchomiona gra. | Sprawdź nazwy Łazienka, Stołówka, Pusty pokój i komunikaty. | Polskie znaki są poprawne; brak uszkodzonych sekwencji kodowania. | PASS |
| T006 | Odświeżenie strony | Gra z postępem. | Odśwież stronę bez importu. | Wraca ekran powitalny; poprzednia sesja nie odtwarza się automatycznie. | PASS |
| T007 | Brak niezamówionych plików | Wczytana strona. | Nie wywołuj eksportu ani importu. | Brak samoczynnego tworzenia plików i żądania dostępu do schowka. | PASS |

### 2. Polecenia przed startem i publiczne API

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T008 | Przed startem: mapa() | Świeża strona; gra nieuruchomiona. | `mapa()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T009 | Przed startem: rozejrzyj() | Świeża strona; gra nieuruchomiona. | `rozejrzyj()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T010 | Przed startem: energia() | Świeża strona; gra nieuruchomiona. | `energia()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T011 | Przed startem: status() | Świeża strona; gra nieuruchomiona. | `status()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T012 | Przed startem: eksportuj() | Świeża strona; gra nieuruchomiona. | `eksportuj()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T013 | Przed startem: idz("prawo") | Świeża strona; gra nieuruchomiona. | `idz("prawo")` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T014 | Przed startem: lewo() | Świeża strona; gra nieuruchomiona. | `lewo()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T015 | Przed startem: prawo() | Świeża strona; gra nieuruchomiona. | `prawo()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T016 | Przed startem: gora() | Świeża strona; gra nieuruchomiona. | `gora()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T017 | Przed startem: dol() | Świeża strona; gra nieuruchomiona. | `dol()` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T018 | Przed startem: akcja("otworzBiuro") | Świeża strona; gra nieuruchomiona. | `akcja("otworzBiuro")` | Komunikat nakazuje użyć rozpocznij(); brak wyjątku, mapy, ruchu i kosztu. | PASS |
| T019 | Pomoc przed startem | Świeża strona. | pomoc() | Pomoc działa bez tworzenia mapy i rozpoczynania gry. | PASS |
| T020 | Reset przed startem | Świeża strona. | resetuj() | Powstaje nowa aktywna gra z energią 20 i poprawną mapą. | PASS |
| T021 | Import przed startem | Świeża strona; prawidłowy testSave. | importuj(testSave) | Gra odtwarza zapis i wyświetla jego stan bez wymogu rozpocznij(). | PASS |
| T022 | Błędny import przed startem | Świeża strona. | importuj("{"), następnie mapa(). | Odmowa importu; gra nadal czeka na rozpoczęcie. | PASS |
| T023 | Nazwy poleceń | Dostępna pomoc. | Porównaj pomoc z obiektem gra. | Polecenia gracza są po polsku; brak usuniętych angielskich odpowiedników. | PASS |
| T024 | API obiektu: gra.mapa() | Aktywna gra; zapamiętany stan. | `gra.mapa()` | Efekt odpowiada funkcji wywołanej bezpośrednio; stan rozgrywki i energia bez zmian. | PASS |
| T025 | API obiektu: gra.rozejrzyj() | Aktywna gra; zapamiętany stan. | `gra.rozejrzyj()` | Efekt odpowiada funkcji wywołanej bezpośrednio; stan rozgrywki i energia bez zmian. | PASS |
| T026 | API obiektu: gra.energia() | Aktywna gra; zapamiętany stan. | `gra.energia()` | Efekt odpowiada funkcji wywołanej bezpośrednio; stan rozgrywki i energia bez zmian. | PASS |
| T027 | API obiektu: gra.status() | Aktywna gra; zapamiętany stan. | `gra.status()` | Efekt odpowiada funkcji wywołanej bezpośrednio; stan rozgrywki i energia bez zmian. | PASS |
| T028 | API obiektu: gra.pomoc() | Aktywna gra; zapamiętany stan. | `gra.pomoc()` | Efekt odpowiada funkcji wywołanej bezpośrednio; stan rozgrywki i energia bez zmian. | PASS |
| T029 | API obiektu: gra.eksportuj() | Aktywna gra; zapamiętany stan. | `gra.eksportuj()` | Efekt odpowiada funkcji wywołanej bezpośrednio; stan rozgrywki i energia bez zmian. | PASS |
| T030 | Ruch przez gra | Otwarte zwykłe wyjście; energia co najmniej 2. | gra.idz("kierunek"), podając istniejący kierunek. | Jeden ruch do właściwego pokoju i koszt dokładnie 1. | PASS |
| T031 | Akcja przez gra | Kantorek; klucz niepodniesiony. | gra.akcja("podniesKlucz") | Podniesiony jeden klucz i koszt dokładnie 1. | PASS |
| T032 | Start przez gra | Świeża strona. | gra.rozpocznij() | Tytuł i jedna nowa gra po 5 sekundach. | PASS |
| T033 | Reset przez gra | Aktywna gra z postępem. | gra.resetuj() | Jedna nowa gra bez starego postępu. | PASS |
| T034 | Import przez gra | Aktywna gra; poprawny testSave. | gra.importuj(testSave) | Ten sam efekt odtworzenia jak importuj(testSave). | PASS |

### 3. Tytuł i timer rozpoczęcia

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T035 | Natychmiastowy tytuł | Ekran powitalny. | rozpocznij() | Od razu pojawia się tytuł; generowanie mapy nie poprzedza jego wyświetlenia. | PASS |
| T036 | Litery ASCII | Trwa tytuł. | Odczytaj oba duże napisy. | Znaki tworzą UCIECZKA Z i SERWEROWNI; litery nie są zwykłym tekstem w ramce. | PASS |
| T037 | Odstęp między napisami | Trwa tytuł. | Sprawdź przerwę między częściami napisu. | Odstęp jest wewnątrz rysunku; brak osobnego <empty string>. | PASS |
| T038 | Autorzy | Trwa tytuł. | Odczytaj podpis. | Widoczni Srodix, JakBor3k i DworMat-cmd. | PASS |
| T039 | Gra niewidoczna podczas tytułu | Uruchomiony tytuł. | Obserwuj konsolę przed upływem 5 sekund. | Brak mapy, energii i opisu pokoju. | PASS |
| T040 | Koniec tytułu | Aktywna karta przeglądarki. | Odczekaj około 5 sekund od rozpocznij(). | Konsola czyści tytuł i autorów; pojawia się jeden kompletny widok gry. | PASS |
| T041 | Ponowny start podczas tytułu | Trwa tytuł od około 2 sekund. | rozpocznij() ponownie. | Poprzedni timer zastąpiony; 5 sekund liczone od ostatniego polecenia. | PASS |
| T042 | Brak spóźnionego resetu | Kilka szybkich rozpocznij(). | Po uruchomieniu gry wykonaj ruch i odczekaj dodatkowe 5 sekund. | Nie następuje kolejny start ani utrata postępu. | PASS |
| T043 | Start nowej gry podczas sesji | Aktywna gra z postępem. | rozpocznij() i odczekaj. | Po tytule nowa sesja bez starego ekwipunku, energii i wyniku. | PASS |
| T044 | Karta w tle | Trwa tytuł. | Przełącz kartę i wróć po kilku sekundach. | Ewentualne opóźnienie timera przez przeglądarkę nie tworzy kilku sesji. | PASS |
| T045 | Podczas tytułu: idz("gora") | Trwa tytuł; dla importu przygotowany poprawny zapis. | `idz("gora")` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T046 | Podczas tytułu: akcja("podniesKlucz") | Trwa tytuł; dla importu przygotowany poprawny zapis. | `akcja("podniesKlucz")` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T047 | Podczas tytułu: mapa() | Trwa tytuł; dla importu przygotowany poprawny zapis. | `mapa()` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T048 | Podczas tytułu: rozejrzyj() | Trwa tytuł; dla importu przygotowany poprawny zapis. | `rozejrzyj()` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T049 | Podczas tytułu: energia() | Trwa tytuł; dla importu przygotowany poprawny zapis. | `energia()` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T050 | Podczas tytułu: status() | Trwa tytuł; dla importu przygotowany poprawny zapis. | `status()` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T051 | Podczas tytułu: pomoc() | Trwa tytuł; dla importu przygotowany poprawny zapis. | `pomoc()` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T052 | Podczas tytułu: resetuj() | Trwa tytuł; dla importu przygotowany poprawny zapis. | `resetuj()` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T053 | Podczas tytułu: importuj(testSave) | Trwa tytuł; dla importu przygotowany poprawny zapis. | `importuj(testSave)` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |
| T054 | Podczas tytułu: eksportuj() | Trwa tytuł; dla importu przygotowany poprawny zapis. | `eksportuj()` | Informacja o trwającym tytule; brak zmiany stanu, anulowania timera i ominięcia oczekiwania. | PASS |

### 4. Początek gry i losowane zdarzenia

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T055 | Pozycja na początku | Nowa gra po tytule. | status() | roomId = 1, czyli Start. | PASS |
| T056 | Energia na początku | Nowa gra po tytule. | status() | energy = 20. | PASS |
| T057 | Ekwipunek na początku | Nowa gra po tytule. | status() | key, keycard, fuse, tankKey oraz bucket.has i bucket.filled są false. | PASS |
| T058 | Generator na początku | Nowa gra po tytule. | status() | power = false, generatorFire = true. | PASS |
| T059 | Biuro na początku | Nowa gra po tytule. | status() | officeOpen = false. | PASS |
| T060 | Wynik na początku | Nowa gra po tytule. | status() | ended = false, won = false. | PASS |
| T061 | Stałość losowania | Nowa gra. | Zapamiętaj tank i tankKeyAvailable; używaj podglądów i przemieszczaj się. | Zdarzenia nie są losowane ponownie w tej samej sesji. | PASS |
| T062 | Czołg w kolejnych grach | Kolejne nowe gry. | Porównaj sesje z czołgiem i bez niego. | Czołg nie jest gwarantowany ani przenoszony z poprzedniej gry; próg losowania 5%. | PASS |
| T063 | Kluczyki w kolejnych grach | Kolejne nowe gry. | Porównaj dostępność kluczyków. | Nie są gwarantowane; próg losowania 10%. | PASS |
| T064 | Powtórzenie losowania | Kilka resetów. | Porównaj mapy i zdarzenia. | Każda sesja jest poprawna; przypadkowe powtórzenie układu jest dopuszczalne. | PASS |
| T065 | Zdarzenia: czołg=False, kluczyki=False | Przygotowana wskazana kombinacja zdarzeń. | Sprawdź Kantorek i Pusty pokój. | Opis i akcje odpowiadają obu zdarzeniom niezależnie; brak automatycznego dopisywania brakującego zdarzenia. | PASS |
| T066 | Zdarzenia: czołg=False, kluczyki=True | Przygotowana wskazana kombinacja zdarzeń. | Sprawdź Kantorek i Pusty pokój. | Opis i akcje odpowiadają obu zdarzeniom niezależnie; brak automatycznego dopisywania brakującego zdarzenia. | PASS |
| T067 | Zdarzenia: czołg=True, kluczyki=False | Przygotowana wskazana kombinacja zdarzeń. | Sprawdź Kantorek i Pusty pokój. | Opis i akcje odpowiadają obu zdarzeniom niezależnie; brak automatycznego dopisywania brakującego zdarzenia. | PASS |
| T068 | Zdarzenia: czołg=True, kluczyki=True | Przygotowana wskazana kombinacja zdarzeń. | Sprawdź Kantorek i Pusty pokój. | Opis i akcje odpowiadają obu zdarzeniom niezależnie; brak automatycznego dopisywania brakującego zdarzenia. | PASS |

### 5. Mapa, połączenia i oznaczenie pozycji

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T069 | Wymiary | Nowa gra. | mapa() i podgląd gameMap. | Siatka 3×3, siedem różnych pokoi i dwa pola 0. | PASS |
| T070 | Komplet pokoi | Nowa gra. | Odczytaj mapę. | Pokoje 1–7 występują dokładnie po jednym razie. | PASS |
| T071 | Prawy dolny róg | Nowa wygenerowana mapa. | Sprawdź gameMap[2][2]. | Pole jest puste. | PASS |
| T072 | Biuro poza środkiem | Kolejne nowe mapy. | Sprawdź środek mapy. | Biuro nigdy nie zajmuje środka. | PASS |
| T073 | Dostęp bez Biura | Biuro zamknięte. | Prześledź wyjścia między pozostałymi pokojami. | Wszystkie pozostałe pokoje osiągalne bez przejścia przez Biuro. | PASS |
| T074 | Wejście do Biura | Nowa mapa. | Prześledź połączenia pokoju 4. | Biuro ma przynajmniej jedno rzeczywiste wejście. | PASS |
| T075 | Dwukierunkowe drzwi | Wybrane otwarte wyjście. | Przejdź i sprawdź kierunek powrotny. | Powrót prowadzi do poprzedniego pokoju. | PASS |
| T076 | Brak skosów | Nowa mapa. | Porównaj wyjścia z położeniami pokoi. | Połączenia tylko między sąsiadami pionowymi lub poziomymi. | PASS |
| T077 | Brak drzwi do pustki | Nowa mapa. | Porównaj wyjścia z pustymi polami i brzegiem. | Brak przejścia do 0 i poza siatkę. | PASS |
| T078 | Pojedyncza gwiazdka | Aktywna gra. | mapa() | Dokładnie jeden znacznik aktualnego pokoju. | PASS |
| T079 | Zmiana znacznika | Otwarte wyjście. | Wykonaj ruch, potem mapa(). | Gwiazdka znika z poprzedniego i pojawia się w nowym pokoju. | PASS |
| T080 | Najdłuższa etykieta | Gracz w pokoju 7. | mapa() | Pusty pokój* mieści się w komórce; krawędzie pozostają równe. | PASS |
| T081 | Poziome łączniki | Mapa z poziomymi drzwiami. | Porównaj rysunek z wyjściami. | Każdy łącznik odpowiada rzeczywistemu przejściu i odwrotnie. | PASS |
| T082 | Pionowe łączniki | Mapa z pionowymi drzwiami. | Porównaj rysunek z wyjściami. | Łączniki w odpowiednich kolumnach, bez przesunięć i braków. | PASS |
| T083 | Podgląd nie losuje mapy | Zapamiętany cały stan. | Wielokrotnie mapa() i rozejrzyj(). | Pozycja, energia, układ, przejścia i zdarzenia bez zmian. | PASS |

### 6. Ruch i walidacja kierunków

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T084 | Ruch: lewo | Otwarte wyjście lewo; energia co najmniej 2. | `idz("lewo")` | Właściwy sąsiad, koszt 1, komunikat z nazwą pokoju. | PASS |
| T085 | Skrót: lewo | Te same warunki co dla idz("lewo"). | `lewo()` | Ten sam efekt co idz; brak podwójnego kosztu. | PASS |
| T086 | Brak wyjścia: lewo | Brak przejścia lewo z obecnego pokoju. | `idz("lewo")` | Odmowa bez ruchu, kosztu i zmiany innych danych. | PASS |
| T087 | Ruch: prawo | Otwarte wyjście prawo; energia co najmniej 2. | `idz("prawo")` | Właściwy sąsiad, koszt 1, komunikat z nazwą pokoju. | PASS |
| T088 | Skrót: prawo | Te same warunki co dla idz("prawo"). | `prawo()` | Ten sam efekt co idz; brak podwójnego kosztu. | PASS |
| T089 | Brak wyjścia: prawo | Brak przejścia prawo z obecnego pokoju. | `idz("prawo")` | Odmowa bez ruchu, kosztu i zmiany innych danych. | PASS |
| T090 | Ruch: gora | Otwarte wyjście gora; energia co najmniej 2. | `idz("gora")` | Właściwy sąsiad, koszt 1, komunikat z nazwą pokoju. | PASS |
| T091 | Skrót: gora | Te same warunki co dla idz("gora"). | `gora()` | Ten sam efekt co idz; brak podwójnego kosztu. | PASS |
| T092 | Brak wyjścia: gora | Brak przejścia gora z obecnego pokoju. | `idz("gora")` | Odmowa bez ruchu, kosztu i zmiany innych danych. | PASS |
| T093 | Ruch: dol | Otwarte wyjście dol; energia co najmniej 2. | `idz("dol")` | Właściwy sąsiad, koszt 1, komunikat z nazwą pokoju. | PASS |
| T094 | Skrót: dol | Te same warunki co dla idz("dol"). | `dol()` | Ten sam efekt co idz; brak podwójnego kosztu. | PASS |
| T095 | Brak wyjścia: dol | Brak przejścia dol z obecnego pokoju. | `idz("dol")` | Odmowa bez ruchu, kosztu i zmiany innych danych. | PASS |
| T096 | Niepoprawny kierunek "" | Aktywna gra; zapamiętany stan. | `idz("")` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T097 | Niepoprawny kierunek "GORA" | Aktywna gra; zapamiętany stan. | `idz("GORA")` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T098 | Niepoprawny kierunek "góra" | Aktywna gra; zapamiętany stan. | `idz("góra")` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T099 | Niepoprawny kierunek "gora " | Aktywna gra; zapamiętany stan. | `idz("gora ")` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T100 | Niepoprawny kierunek " gora" | Aktywna gra; zapamiętany stan. | `idz(" gora")` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T101 | Niepoprawny kierunek "north" | Aktywna gra; zapamiętany stan. | `idz("north")` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T102 | Niepoprawny kierunek "ukos" | Aktywna gra; zapamiętany stan. | `idz("ukos")` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T103 | Niepoprawny kierunek null | Aktywna gra; zapamiętany stan. | `idz(null)` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T104 | Niepoprawny kierunek undefined | Aktywna gra; zapamiętany stan. | `idz(undefined)` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T105 | Niepoprawny kierunek 1 | Aktywna gra; zapamiętany stan. | `idz(1)` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T106 | Niepoprawny kierunek true | Aktywna gra; zapamiętany stan. | `idz(true)` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T107 | Niepoprawny kierunek [] | Aktywna gra; zapamiętany stan. | `idz([])` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T108 | Niepoprawny kierunek {} | Aktywna gra; zapamiętany stan. | `idz({})` | Instrukcja poprawnych kierunków; brak kosztu, ruchu i wyjątku. | PASS |
| T109 | Brak kierunku | Aktywna gra. | idz() | Odmowa bez kosztu i wyjątku. | PASS |
| T110 | Powrót | Otwarte wyjście; energia co najmniej 3. | Przejdź do sąsiada i wróć. | Poprzedni pokój i łączny koszt 2. | PASS |
| T111 | Ruch poza brzeg | Gracz przy brzegu. | Spróbuj wyjść poza siatkę. | Odmowa; brak ruchu poza mapę. | PASS |
| T112 | Ruch ostatnią energią | Energia 1; otwarte wyjście. | Wykonaj ruch. | Ruch zachodzi; energia 0 i porażka w pokoju docelowym. | PASS |
| T113 | Odmowa ostatnią energią | Energia 1; brak wskazanego wyjścia. | Wykonaj błędny ruch. | Energia nadal 1; gra nie kończy się. | PASS |

### 7. Akcje: nazwy, odmowy i przedmioty

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T114 | Niepoprawna akcja "" | Aktywna gra; zapamiętany stan. | `akcja("")` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T115 | Niepoprawna akcja "nieznana" | Aktywna gra; zapamiętany stan. | `akcja("nieznana")` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T116 | Niepoprawna akcja "PodniesKlucz" | Aktywna gra; zapamiętany stan. | `akcja("PodniesKlucz")` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T117 | Niepoprawna akcja "podniesklucz" | Aktywna gra; zapamiętany stan. | `akcja("podniesklucz")` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T118 | Niepoprawna akcja "podniesKlucz " | Aktywna gra; zapamiętany stan. | `akcja("podniesKlucz ")` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T119 | Niepoprawna akcja null | Aktywna gra; zapamiętany stan. | `akcja(null)` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T120 | Niepoprawna akcja undefined | Aktywna gra; zapamiętany stan. | `akcja(undefined)` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T121 | Niepoprawna akcja 1 | Aktywna gra; zapamiętany stan. | `akcja(1)` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T122 | Niepoprawna akcja true | Aktywna gra; zapamiętany stan. | `akcja(true)` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T123 | Niepoprawna akcja [] | Aktywna gra; zapamiętany stan. | `akcja([])` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T124 | Niepoprawna akcja {} | Aktywna gra; zapamiętany stan. | `akcja({})` | Informacja o nieznanej akcji; brak kosztu, zmiany stanu i wyjątku. | PASS |
| T125 | Brak nazwy akcji | Aktywna gra. | akcja() | Odmowa bez kosztu i wyjątku. | PASS |
| T126 | Wielokrotna odmowa | Niespełniony warunek wybranej akcji. | Powtórz ją 10 razy. | Żadna odmowa nie zabiera energii ani przedmiotów. | PASS |
| T127 | Podniesienie: podniesKlucz | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. | `akcja("podniesKlucz")` | items.key = true; koszt 1; przedmiot i jego akcja znikają z listy dostępnych. | PASS |
| T128 | Duplikat: podniesKlucz | Przedmiot już podniesiony; właściwy pokój. | Ponownie `akcja("podniesKlucz")`. | Odmowa; brak duplikatu, kosztu i zmiany pozostałego ekwipunku. | PASS |
| T129 | Zły pokój: podniesKlucz | Poza pokojem 3; przedmiot niepodniesiony. | `akcja("podniesKlucz")` | Odmowa niedostępnego przedmiotu; brak podniesienia na odległość i kosztu. | PASS |
| T130 | Ostatnia energia: podniesKlucz | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. Ustaw energię na 1. | `akcja("podniesKlucz")` | Przedmiot zostaje przyznany; energia 0 kończy grę porażką. | PASS |
| T131 | Podniesienie: podniesWiadro | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. | `akcja("podniesWiadro")` | items.bucket.has = true; koszt 1; przedmiot i jego akcja znikają z listy dostępnych. | PASS |
| T132 | Duplikat: podniesWiadro | Przedmiot już podniesiony; właściwy pokój. | Ponownie `akcja("podniesWiadro")`. | Odmowa; brak duplikatu, kosztu i zmiany pozostałego ekwipunku. | PASS |
| T133 | Zły pokój: podniesWiadro | Poza pokojem 3; przedmiot niepodniesiony. | `akcja("podniesWiadro")` | Odmowa niedostępnego przedmiotu; brak podniesienia na odległość i kosztu. | PASS |
| T134 | Ostatnia energia: podniesWiadro | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. Ustaw energię na 1. | `akcja("podniesWiadro")` | Przedmiot zostaje przyznany; energia 0 kończy grę porażką. | PASS |
| T135 | Podniesienie: podniesBezpiecznik | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. | `akcja("podniesBezpiecznik")` | items.fuse = true; koszt 1; przedmiot i jego akcja znikają z listy dostępnych. | PASS |
| T136 | Duplikat: podniesBezpiecznik | Przedmiot już podniesiony; właściwy pokój. | Ponownie `akcja("podniesBezpiecznik")`. | Odmowa; brak duplikatu, kosztu i zmiany pozostałego ekwipunku. | PASS |
| T137 | Zły pokój: podniesBezpiecznik | Poza pokojem 3; przedmiot niepodniesiony. | `akcja("podniesBezpiecznik")` | Odmowa niedostępnego przedmiotu; brak podniesienia na odległość i kosztu. | PASS |
| T138 | Ostatnia energia: podniesBezpiecznik | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. Ustaw energię na 1. | `akcja("podniesBezpiecznik")` | Przedmiot zostaje przyznany; energia 0 kończy grę porażką. | PASS |
| T139 | Podniesienie: podniesKarte | Pokój 4; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. | `akcja("podniesKarte")` | items.keycard = true; koszt 1; przedmiot i jego akcja znikają z listy dostępnych. | PASS |
| T140 | Duplikat: podniesKarte | Przedmiot już podniesiony; właściwy pokój. | Ponownie `akcja("podniesKarte")`. | Odmowa; brak duplikatu, kosztu i zmiany pozostałego ekwipunku. | PASS |
| T141 | Zły pokój: podniesKarte | Poza pokojem 4; przedmiot niepodniesiony. | `akcja("podniesKarte")` | Odmowa niedostępnego przedmiotu; brak podniesienia na odległość i kosztu. | PASS |
| T142 | Ostatnia energia: podniesKarte | Pokój 4; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. Ustaw energię na 1. | `akcja("podniesKarte")` | Przedmiot zostaje przyznany; energia 0 kończy grę porażką. | PASS |
| T143 | Podniesienie: podniesKluczyki | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. | `akcja("podniesKluczyki")` | items.tankKey = true; koszt 1; przedmiot i jego akcja znikają z listy dostępnych. | PASS |
| T144 | Duplikat: podniesKluczyki | Przedmiot już podniesiony; właściwy pokój. | Ponownie `akcja("podniesKluczyki")`. | Odmowa; brak duplikatu, kosztu i zmiany pozostałego ekwipunku. | PASS |
| T145 | Zły pokój: podniesKluczyki | Poza pokojem 3; przedmiot niepodniesiony. | `akcja("podniesKluczyki")` | Odmowa niedostępnego przedmiotu; brak podniesienia na odległość i kosztu. | PASS |
| T146 | Ostatnia energia: podniesKluczyki | Pokój 3; przedmiot niepodniesiony; energia co najmniej 2; kluczyki dostępne, generator wyłączony, Biuro otwarte, jeśli dotyczy. Ustaw energię na 1. | `akcja("podniesKluczyki")` | Przedmiot zostaje przyznany; energia 0 kończy grę porażką. | PASS |
| T147 | Początkowo puste wiadro | Kantorek; brak wiadra. | Podnieś wiadro. | bucket.has = true, bucket.filled = false. | PASS |
| T148 | Kluczyki niewylosowane | Kantorek; tankKeyAvailable = false. | Sprawdź opis i spróbuj podniesKluczyki. | Brak kluczyków w opisie; odmowa bez kosztu. | PASS |
| T149 | Kluczyki bez czołgu | Kantorek; kluczyki dostępne, tank = false. | Podnieś kluczyki. | Kluczyki przyznane; czołg nie pojawia się od ich podniesienia. | PASS |
| T150 | Bezpiecznik po zużyciu | Generator już działa. | W Kantorku spróbuj podnieść bezpiecznik. | Nie odradza się; odmowa bez kosztu. | PASS |
| T151 | Powrót po przedmioty | Zebrane przedmioty w Kantorku lub Biurze. | Wyjdź i wróć. | Zebrane rzeczy nie pojawiają się ponownie. | PASS |

### 8. Biuro i karta

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T152 | Zamknięte wejście | Sąsiedztwo zamkniętego Biura. | Wykonaj ruch do Biura. | Odmowa, bez kosztu i zmiany pozycji; wskazana akcja otworzBiuro. | PASS |
| T153 | Klucz nie otwiera sam | Masz klucz; drzwi zamknięte. | Wykonaj sam ruch do Biura. | Nadal odmowa; potrzebna jawna akcja otwarcia. | PASS |
| T154 | Otwieranie bez klucza | Stoisz przy Biurze; brak klucza. | akcja("otworzBiuro") | Odmowa z informacją o kluczu; energia bez zmian. | PASS |
| T155 | Otwieranie z daleka | Masz klucz; brak przejścia do Biura w tym pokoju. | akcja("otworzBiuro") | Odmowa; drzwi nie otwierają się na odległość. | PASS |
| T156 | Udane otwarcie | Klucz i rzeczywiste przejście do zamkniętego Biura. | akcja("otworzBiuro") | officeOpen = true, koszt 1; klucz pozostaje posiadany. | PASS |
| T157 | Wejście po otwarciu | Otwarte Biuro. | Wykonaj ruch do niego. | Wejście z osobnym kosztem 1. | PASS |
| T158 | Ponowne otwarcie | Biuro otwarte. | akcja("otworzBiuro") | Odmowa bez kosztu; drzwi nie zamykają się. | PASS |
| T159 | Trwałość otwarcia | Biuro otwarte. | Opuść okolicę i wróć. | Nadal otwarte; brak kolejnej opłaty za otwarcie. | PASS |
| T160 | Otwarcie przy energii 1 | Klucz, sąsiedztwo Biura, energia 1. | akcja("otworzBiuro") | Drzwi otwierają się; energia 0 kończy grę bez automatycznego wejścia. | PASS |

### 9. Wiadro, woda i gaszenie

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T161 | Napełnianie bez wiadra | Łazienka; brak wiadra. | akcja("napelnijWiadro") | Odmowa; brak tworzenia wiadra i kosztu. | PASS |
| T162 | Napełnianie poza Łazienką | Puste wiadro; zły pokój. | akcja("napelnijWiadro") | Odmowa; wiadro nadal puste i energia bez zmian. | PASS |
| T163 | Udane napełnienie | Łazienka; puste posiadane wiadro. | akcja("napelnijWiadro") | filled = true, has = true; koszt 1. | PASS |
| T164 | Ponowne napełnianie | Łazienka; pełne wiadro. | akcja("napelnijWiadro") | Odmowa; wiadro pozostaje pełne; brak kosztu. | PASS |
| T165 | Przenoszenie wody | Pełne wiadro. | Dotrzyj do Generatorów. | Woda nie znika podczas ruchu. | PASS |
| T166 | Gaszenie bez wiadra | Płonące Generatory; brak wiadra. | akcja("uzyjWiadro") | Odmowa bez kosztu; pożar trwa. | PASS |
| T167 | Gaszenie pustym wiadrem | Płonące Generatory; wiadro puste. | akcja("uzyjWiadro") | Odmowa bez kosztu i ugaszenia. | PASS |
| T168 | Gaszenie z innego pokoju | Pełne wiadro; poza Generatorami. | akcja("uzyjWiadro") | Odmowa; woda i energia zachowane. | PASS |
| T169 | Udane gaszenie | Płonące Generatory; pełne wiadro. | akcja("uzyjWiadro") | Pożar gaśnie; woda zużyta, wiadro pozostaje; koszt 1. | PASS |
| T170 | Gaszenie bez samoczynnego prądu | Właśnie ugaszony generator. | status() | power pozostaje false; bezpiecznik nie zostaje zużyty. | PASS |
| T171 | Powtórne gaszenie pustym | Generatory ugaszone; puste wiadro. | akcja("uzyjWiadro") | Odmowa bez kosztu. | PASS |
| T172 | Powtórne gaszenie pełnym | Generatory ugaszone; ponownie pełne wiadro. | akcja("uzyjWiadro") | Odmowa; woda nie znika. | PASS |
| T173 | Gaszenie działającego generatora | Prąd działa; pełne wiadro. | akcja("uzyjWiadro") | Odmowa; prąd i woda bez zmian. | PASS |
| T174 | Ponowne napełnienie po gaszeniu | Zużyta woda; wróć do Łazienki. | akcja("napelnijWiadro") | To samo wiadro napełnione z kosztem 1; pożar nie wraca. | PASS |
| T175 | Napełnienie ostatnią energią | Łazienka; puste wiadro; energia 1. | Napełnij wiadro. | Wiadro pełne, energia 0 i porażka. | PASS |
| T176 | Gaszenie ostatnią energią | Płonące Generatory; pełne wiadro; energia 1. | Ugaś generatory. | Ogień gaśnie, woda zużyta, energia 0 i porażka. | PASS |

### 10. Generator i zasilanie

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T177 | Włączenie z daleka | Masz bezpiecznik; zły pokój. | akcja("wlaczGenerator") | Odmowa; bezpiecznik i energia zachowane. | PASS |
| T178 | Włączenie podczas pożaru | Płonące Generatory; brak wyposażenia. | akcja("wlaczGenerator") | Odmowa; prąd pozostaje wyłączony. | PASS |
| T179 | Pożar i bezpiecznik | Płonące Generatory; bezpiecznik posiadany. | akcja("wlaczGenerator") | Odmowa; bezpiecznik nie zostaje zużyty. | PASS |
| T180 | Pożar i pełne wyposażenie | Bezpiecznik i pełne wiadro; pożar trwa. | Włącz bez wcześniejszego gaszenia. | Odmowa; samo posiadanie wody nie gasi ognia. | PASS |
| T181 | Brak bezpiecznika po ugaszeniu | Ugaszone Generatory; brak bezpiecznika. | akcja("wlaczGenerator") | Odmowa bez kosztu; prąd wyłączony. | PASS |
| T182 | Udane włączenie | Ugaszone Generatory; bezpiecznik. | akcja("wlaczGenerator") | power = true, fuse = false, generatorFire = false; koszt 1. | PASS |
| T183 | Ponowne włączenie | Generator działa. | akcja("wlaczGenerator") | Odmowa bez kosztu; prąd nie znika. | PASS |
| T184 | Trwałość prądu | Generator działa. | Wyjdź, wróć i sprawdź stan. | Zasilanie nadal działa, pożar nie wraca. | PASS |
| T185 | Karta nie jest wymagana | Ugaszone Generatory; bezpiecznik; brak karty. | Włącz generator. | Sukces; karta nie jest warunkiem włączenia. | PASS |
| T186 | Ostatnia energia na włączenie | Ugaszony generator; bezpiecznik; energia 1. | Włącz generator. | Prąd włączony i bezpiecznik zużyty, ale energia 0 kończy grę porażką. | PASS |

### 11. Jedzenie, losowania i energia

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T187 | Jedzenie poza Stołówką | Pokój inny niż 6. | akcja("zjedz") | Odmowa; bez kosztu i bonusu. | PASS |
| T188 | Napój | Stołówka; kontrolowane losowanie napoju. | Zjedz i odczytaj bonus. | Całkowity bonus od -1 do 4; oprócz niego koszt akcji 1. | PASS |
| T189 | Ser | Stołówka; kontrolowane losowanie sera. | Zjedz i odczytaj bonus. | Całkowity bonus od -2 do 1; oprócz niego koszt 1. | PASS |
| T190 | Kajzerka | Stołówka; kontrolowane losowanie kajzerki. | Zjedz i odczytaj bonus. | Bonus 0 lub 1; oprócz niego koszt 1. | PASS |
| T191 | Bilans | Stołówka; energia E i bonus B. | Zjedz, porównaj stan. | Energia = max(0, min(20, E + B - 1)); informacja o bonusie nie usuwa kosztu. | PASS |
| T192 | Jedzenie nie zmienia przedmiotów | Stołówka; ekwipunek z przedmiotami. | Zjedz. | Ekwipunek, woda, prąd i mapa bez zmian. | PASS |
| T193 | Jedzenie wielokrotne | Stołówka; dodatnia energia. | Zjedz kilka razy. | Każde jedzenie ma własne losowanie i koszt; jedzenie nie znika na stałe. | PASS |
| T194 | Podgląd bez leczenia | Stołówka; energia poniżej 20. | mapa(), rozejrzyj(), pomoc(), energia(), status(). | Brak samoczynnego bonusu i zmiany energii. | PASS |
| T195 | Jedzenie: energia 1, bonus -2 | Stołówka; energia 1; przygotuj właściwe danie i bonus -2. | akcja("zjedz") | Energia końcowa 0; porażka przy 0, brak wartości ujemnych. | PASS |
| T196 | Jedzenie: energia 1, bonus -1 | Stołówka; energia 1; przygotuj właściwe danie i bonus -1. | akcja("zjedz") | Energia końcowa 0; porażka przy 0, brak wartości ujemnych. | PASS |
| T197 | Jedzenie: energia 1, bonus 0 | Stołówka; energia 1; przygotuj właściwe danie i bonus 0. | akcja("zjedz") | Energia końcowa 0; porażka przy 0, brak wartości ujemnych. | PASS |
| T198 | Jedzenie: energia 1, bonus 1 | Stołówka; energia 1; przygotuj właściwe danie i bonus 1. | akcja("zjedz") | Energia końcowa 1; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T199 | Jedzenie: energia 1, bonus 4 | Stołówka; energia 1; przygotuj właściwe danie i bonus 4. | akcja("zjedz") | Energia końcowa 4; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T200 | Jedzenie: energia 2, bonus -2 | Stołówka; energia 2; przygotuj właściwe danie i bonus -2. | akcja("zjedz") | Energia końcowa 0; porażka przy 0, brak wartości ujemnych. | PASS |
| T201 | Jedzenie: energia 2, bonus -1 | Stołówka; energia 2; przygotuj właściwe danie i bonus -1. | akcja("zjedz") | Energia końcowa 0; porażka przy 0, brak wartości ujemnych. | PASS |
| T202 | Jedzenie: energia 2, bonus 0 | Stołówka; energia 2; przygotuj właściwe danie i bonus 0. | akcja("zjedz") | Energia końcowa 1; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T203 | Jedzenie: energia 2, bonus 1 | Stołówka; energia 2; przygotuj właściwe danie i bonus 1. | akcja("zjedz") | Energia końcowa 2; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T204 | Jedzenie: energia 2, bonus 4 | Stołówka; energia 2; przygotuj właściwe danie i bonus 4. | akcja("zjedz") | Energia końcowa 5; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T205 | Jedzenie: energia 19, bonus -2 | Stołówka; energia 19; przygotuj właściwe danie i bonus -2. | akcja("zjedz") | Energia końcowa 16; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T206 | Jedzenie: energia 19, bonus -1 | Stołówka; energia 19; przygotuj właściwe danie i bonus -1. | akcja("zjedz") | Energia końcowa 17; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T207 | Jedzenie: energia 19, bonus 0 | Stołówka; energia 19; przygotuj właściwe danie i bonus 0. | akcja("zjedz") | Energia końcowa 18; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T208 | Jedzenie: energia 19, bonus 1 | Stołówka; energia 19; przygotuj właściwe danie i bonus 1. | akcja("zjedz") | Energia końcowa 19; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T209 | Jedzenie: energia 19, bonus 4 | Stołówka; energia 19; przygotuj właściwe danie i bonus 4. | akcja("zjedz") | Energia końcowa 20; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T210 | Jedzenie: energia 20, bonus -2 | Stołówka; energia 20; przygotuj właściwe danie i bonus -2. | akcja("zjedz") | Energia końcowa 17; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T211 | Jedzenie: energia 20, bonus -1 | Stołówka; energia 20; przygotuj właściwe danie i bonus -1. | akcja("zjedz") | Energia końcowa 18; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T212 | Jedzenie: energia 20, bonus 0 | Stołówka; energia 20; przygotuj właściwe danie i bonus 0. | akcja("zjedz") | Energia końcowa 19; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T213 | Jedzenie: energia 20, bonus 1 | Stołówka; energia 20; przygotuj właściwe danie i bonus 1. | akcja("zjedz") | Energia końcowa 20; gra nadal aktywna, brak przekroczenia 20. | PASS |
| T214 | Jedzenie: energia 20, bonus 4 | Stołówka; energia 20; przygotuj właściwe danie i bonus 4. | akcja("zjedz") | Energia końcowa 20; gra nadal aktywna, brak przekroczenia 20. | PASS |

### 12. Opis pokoju i wyniki komend

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T215 | Aktualny opis | Dowolny pokój. | rozejrzyj() | Nazwa zgadza się z pozycją i gwiazdką na mapie. | PASS |
| T216 | Przedmioty Kantorka | Kantorek przed podnoszeniem. | Odczytaj opis. | Klucz, wiadro, bezpiecznik i ewentualne kluczyki; brak przedmiotów z innych pokoi. | PASS |
| T217 | Opis po podniesieniu | Właśnie podniesiony przedmiot. | Odczytaj nowy opis. | Przedmiot i akcja podniesienia znikają z listy dostępnych. | PASS |
| T218 | Karta w Biurze | Biuro przed i po pobraniu karty. | Porównaj opisy. | Karta i akcja widoczne tylko przed pobraniem. | PASS |
| T219 | Opis pożaru | Płonące Generatory. | rozejrzyj() | Informacja o pożarze i poprawna komenda akcja("uzyjWiadro"). | PASS |
| T220 | Opis po ugaszeniu | Ugaszone Generatory bez prądu. | rozejrzyj() | Brak twierdzenia o pożarze; informacja o bezpieczniku. | PASS |
| T221 | Opis prądu | Generator działa. | rozejrzyj() | Informacja o działającym generatorze. | PASS |
| T222 | Opis Łazienki | Pokój 5. | rozejrzyj() | Informacja o wodzie; napełnienie proponowane tylko dla pustego posiadanego wiadra. | PASS |
| T223 | Opis Stołówki | Pokój 6; gra aktywna. | rozejrzyj() | Jedzenie i akcja zjedz dostępne. | PASS |
| T224 | Opis czołgu | Osobno sesja z tank = true i tank = false. | Wejdź do pokoju 7. | Informacja o czołgu tylko wtedy, gdy jest obecny. | PASS |
| T225 | Wyjścia w opisie | Dowolny pokój. | Porównaj opis z mapą i przejściami. | Poprawne kierunki i nazwy; zamknięte Biuro oznaczone. | PASS |
| T226 | Dostępne akcje | Zmieniane pokoje i wyposażenie. | Czytaj opis po każdej zmianie. | Lista proponuje akcje spełniające warunki, bez action() i starych wielkich liter. | PASS |
| T227 | Pomoc | Aktywna gra. | pomoc() | Aktualne polecenia i 11 nazw akcji; brak start() i reset(). | PASS |
| T228 | Widoczny sukces | Udany ruch albo akcja. | Odczytaj konsolę po komendzie. | Wynik działania pozostaje widoczny razem z aktualnym stanem gry. | PASS |
| T229 | Widoczna odmowa | Odrzucony ruch albo akcja. | Odczytaj konsolę. | Przyczyna odmowy nie znika podczas czyszczenia konsoli. | PASS |
| T230 | Brak wyników technicznych | Ruchy, akcje, odmowy i podglądy. | Odczytaj wyniki. | Brak true, false lub undefined zamiast komunikatu gracza. | PASS |
| T231 | Podglądy nie kosztują | Zapamiętany stan. | Wielokrotnie status(), pomoc(), mapa(), rozejrzyj(), energia(). | Brak zmiany energii i pozostałego stanu. | PASS |

### 13. Wygrana zwykłym wyjściem

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T232 | Bez karty i prądu | Start; oba warunki niespełnione. | akcja("ucieknij") | Odmowa bez kosztu i zakończenia. | PASS |
| T233 | Tylko karta | Start; karta, brak prądu. | akcja("ucieknij") | Odmowa bez kosztu. | PASS |
| T234 | Tylko prąd | Start; prąd, brak karty. | akcja("ucieknij") | Odmowa bez kosztu. | PASS |
| T235 | Zły pokój | Karta i prąd; pokój 2–6. | Spróbuj uciec; sprawdź każdy pokój oddzielnie. | Odmowa; warunki nie pozwalają uciec z dowolnego miejsca. | PASS |
| T236 | Samo wejście do Startu | Karta i prąd. | Przejdź do Startu. | Sam ruch nie przyznaje wygranej; potrzebna akcja ucieknij. | PASS |
| T237 | Wygrana | Start; karta i prąd; energia co najmniej 2. | akcja("ucieknij") | won = ended = true, koszt 1, komunikat wygranej. | PASS |
| T238 | Wygrana ostatnią energią | Start; karta i prąd; energia 1. | akcja("ucieknij") | Energia 0 i wygrana; wynik nie nadpisany porażką. | PASS |
| T239 | Odmowa ostatnią energią | Start; brak jednego warunku; energia 1. | akcja("ucieknij") | Energia nadal 1; brak końca gry. | PASS |
| T240 | Bez zdarzeń czołgowych | Start; karta i prąd; brak czołgu i kluczyków. | Ucieknij. | Zwykła wygrana nie wymaga alternatywnych zdarzeń. | PASS |

### 14. Wygrana czołgiem

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T241 | Brak czołgu | Pusty pokój; tank = false. | akcja("ucieknij") | Odmowa bez kosztu. | PASS |
| T242 | Czołg bez kluczyków | Pusty pokój; czołg, brak kluczyków. | akcja("ucieknij") | Odmowa bez kosztu. | PASS |
| T243 | Kluczyki bez czołgu | Pusty pokój; kluczyki, tank = false. | akcja("ucieknij") | Odmowa; kluczyki nie tworzą czołgu. | PASS |
| T244 | Czołg z daleka | Czołg i kluczyki; pokój inny niż 7, bez warunków zwykłego wyjścia. | Spróbuj uciec. | Odmowa; brak ucieczki na odległość. | PASS |
| T245 | Samo wejście do pokoju 7 | Czołg i kluczyki. | Wejdź do Pustego pokoju. | Brak samoczynnej wygranej. | PASS |
| T246 | Wygrana czołgiem | Pusty pokój; czołg i kluczyki; energia co najmniej 2. | akcja("ucieknij") | Wyjazd przez ścianę; won = ended = true; koszt 1. | PASS |
| T247 | Czołg ostatnią energią | Pełne warunki czołgu; energia 1. | Ucieknij. | Wygrana przy energii 0; brak nadpisania porażką. | PASS |
| T248 | Bez karty i prądu | Pełne warunki czołgu; brak karty, power = false. | Ucieknij w pokoju 7. | Alternatywna wygrana nie wymaga zwykłej drogi. | PASS |
| T249 | Przy pożarze | Czołg i kluczyki; generator nadal płonie. | Ucieknij w pokoju 7. | Pożar nie blokuje czołgowej drogi zakończenia. | PASS |
| T250 | Odmowa ostatnią energią | Czołg bez kluczyków; energia 1. | Spróbuj uciec. | Energia pozostaje 1; brak zakończenia. | PASS |

### 15. Porażka i blokady zakończonej sesji

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T251 | Porażka po ruchu | Energia 1; otwarte wyjście. | Przejdź do sąsiada. | Ruch zachodzi; energia 0, ended = true, won = false. | PASS |
| T252 | Porażka po akcji | Energia 1; akcja niebędąca wygraną. | Wykonaj dostępną akcję. | Efekt zachodzi, potem porażka przy energii 0. | PASS |
| T253 | Porażka po jedzeniu | Stołówka; bonus i koszt wyczerpują energię. | Zjedz. | Energia ograniczona do 0 i jedno zakończenie porażką. | PASS |
| T254 | Opis po końcu | Wygrana albo porażka. | rozejrzyj() | Właściwy wynik i wskazówka rozpocznij(); lista dostępnych akcji pusta. | PASS |
| T255 | Podgląd po końcu | Zakończona gra; zapamiętany stan. | mapa(), status(), energia(), pomoc(), rozejrzyj(). | Podglądy działają; wynik i cały stan pozostają bez zmian. | PASS |
| T256 | Eksport po końcu | Zakończona gra. | eksportuj() | Można zapisać zakończenie; brak samoczynnego restartu. | PASS |
| T257 | Po wygranej: idz("prawo") | Gra po wygranej; zapamiętany stan. | `idz("prawo")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T258 | Po wygranej: lewo() | Gra po wygranej; zapamiętany stan. | `lewo()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T259 | Po wygranej: prawo() | Gra po wygranej; zapamiętany stan. | `prawo()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T260 | Po wygranej: gora() | Gra po wygranej; zapamiętany stan. | `gora()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T261 | Po wygranej: dol() | Gra po wygranej; zapamiętany stan. | `dol()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T262 | Po wygranej: akcja("podniesKlucz") | Gra po wygranej; zapamiętany stan. | `akcja("podniesKlucz")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T263 | Po wygranej: akcja("zjedz") | Gra po wygranej; zapamiętany stan. | `akcja("zjedz")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T264 | Po wygranej: akcja("ucieknij") | Gra po wygranej; zapamiętany stan. | `akcja("ucieknij")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T265 | Po porażce: idz("prawo") | Gra po porażce; zapamiętany stan. | `idz("prawo")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T266 | Po porażce: lewo() | Gra po porażce; zapamiętany stan. | `lewo()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T267 | Po porażce: prawo() | Gra po porażce; zapamiętany stan. | `prawo()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T268 | Po porażce: gora() | Gra po porażce; zapamiętany stan. | `gora()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T269 | Po porażce: dol() | Gra po porażce; zapamiętany stan. | `dol()` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T270 | Po porażce: akcja("podniesKlucz") | Gra po porażce; zapamiętany stan. | `akcja("podniesKlucz")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T271 | Po porażce: akcja("zjedz") | Gra po porażce; zapamiętany stan. | `akcja("zjedz")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |
| T272 | Po porażce: akcja("ucieknij") | Gra po porażce; zapamiętany stan. | `akcja("ucieknij")` | Odmowa; energia, pozycja, wynik i ekwipunek bez zmian. | PASS |

### 16. Reset i następna rozgrywka

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T273 | Reset przed pierwszym startem | Przed pierwszym startem. | resetuj() | Nowa kompletna gra: Start, energia 20, pusty ekwipunek, pożar, brak prądu, zamknięte Biuro, ended = won = false; mapa i zdarzenia losowane od nowa. | PASS |
| T274 | Reset w aktywnej grze | W aktywnej grze. | resetuj() | Nowa kompletna gra: Start, energia 20, pusty ekwipunek, pożar, brak prądu, zamknięte Biuro, ended = won = false; mapa i zdarzenia losowane od nowa. | PASS |
| T275 | Reset po zwykłej wygranej | Po zwykłej wygranej. | resetuj() | Nowa kompletna gra: Start, energia 20, pusty ekwipunek, pożar, brak prądu, zamknięte Biuro, ended = won = false; mapa i zdarzenia losowane od nowa. | PASS |
| T276 | Reset po czołgowej wygranej | Po czołgowej wygranej. | resetuj() | Nowa kompletna gra: Start, energia 20, pusty ekwipunek, pożar, brak prądu, zamknięte Biuro, ended = won = false; mapa i zdarzenia losowane od nowa. | PASS |
| T277 | Reset po porażce | Po porażce. | resetuj() | Nowa kompletna gra: Start, energia 20, pusty ekwipunek, pożar, brak prądu, zamknięte Biuro, ended = won = false; mapa i zdarzenia losowane od nowa. | PASS |
| T278 | Reset po imporcie zapisu | Po imporcie zapisu. | resetuj() | Nowa kompletna gra: Start, energia 20, pusty ekwipunek, pożar, brak prądu, zamknięte Biuro, ended = won = false; mapa i zdarzenia losowane od nowa. | PASS |
| T279 | Reset pełnego wiadra | Pełne wiadro. | resetuj() | has = filled = false; brak przeniesienia wody. | PASS |
| T280 | Reset działającego generatora | power = true, generatorFire = false. | resetuj() | power = false, generatorFire = true. | PASS |
| T281 | Reset otwartego Biura | Biuro otwarte; karta podniesiona. | resetuj() | Biuro zamknięte, karta nieposiadana. | PASS |
| T282 | Wielokrotny reset | Aktywna gra. | resetuj() kilka razy, potem wykonaj ruch. | Jedna aktywna sesja; brak spóźnionych resetów. | PASS |
| T283 | Rozpoczęcie po końcu | Wygrana lub porażka. | rozpocznij() i odczekaj 5 sekund. | Nowa gra nie dziedziczy blokady, energii i wyniku starej sesji. | PASS |

### 17. Eksport i poprawne odtwarzanie

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T284 | Format eksportu | Aktywna gra. | eksportuj() | Poprawny JSON z wersja i stan; brak [object Object]. | PASS |
| T285 | Ręczny plik | Aktywna gra. | Wyeksportuj, skopiuj JSON i zapisz jako postep.json. | Plik zawiera same dane; eksport sam nie tworzy pliku. | PASS |
| T286 | Wartość eksportu | Aktywna gra. | Skopiuj tekst wypisany przez eksportuj(). | Źródłem zapisu jest wypisany JSON; wynik const zapis = eksportuj() nie jest traktowany jako zapis. | PASS |
| T287 | Bez kosztu eksportu | Zapamiętany stan. | Eksportuj wielokrotnie. | Stan i energia bez zmian. | PASS |
| T288 | Komplet danych | Gra z postępem. | Porównaj JSON ze stanem i mapą. | Zapis obejmuje pozycję, ekwipunek, wodę, pożar, prąd, energię, drzwi, zdarzenia, wynik, mapę i przejścia. | PASS |
| T289 | Powtarzalny eksport | Nie zmieniaj stanu. | Porównaj dwa kolejne eksporty. | Identyczne dane; brak losowania w eksporcie. | PASS |
| T290 | Odtworzenie mapy | Zapis jednej mapy; potem reset do innej. | Importuj pierwszy zapis. | Powracają dokładnie zapisane komórki i przejścia. | PASS |
| T291 | Import po odświeżeniu | Zapis w pliku; świeża strona. | importuj(prompt("Wklej JSON")) i wklej same dane. | Sesja odtworzona bez konieczności rozpocznij(). | PASS |
| T292 | Whitespace | Prawidłowy JSON otoczony spacjami i nowymi liniami. | Importuj go. | Import przyjęty. | PASS |
| T293 | Ponowny import | Prawidłowy testSave. | Importuj ten sam zapis dwa razy. | Ten sam stan; brak duplikatów, kosztu i nowych zdarzeń. | PASS |
| T294 | Ruch po imporcie | Aktywny zapis odtworzony. | Wykonaj dozwolony ruch. | Właściwy pokój i koszt 1 na odtworzonej mapie. | PASS |
| T295 | Akcja po imporcie | Aktywny zapis odtworzony; dostępny przedmiot. | Wykonaj akcję. | Właściwy efekt i koszt 1 bez odrodzenia zebranych rzeczy. | PASS |
| T296 | Dodatkowe pole | Poprawny testPackage z dodatkowym nieużywanym polem stanu. | Importuj. | Dodatkowe pole nie staje się polem gameState i nie jest wykonywanym kodem. | PASS |
| T297 | Import pustego wiadra | Masz puste wiadro. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | has = true, filled = false. | PASS |
| T298 | Import pełnego wiadra | Masz pełne wiadro. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | has = filled = true. | PASS |
| T299 | Import ugaszonego generatora | Ogień ugaszony; prąd wyłączony. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | generatorFire = power = false. | PASS |
| T300 | Import działającego generatora | Prąd włączony. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | power = true, generatorFire = false, fuse = false. | PASS |
| T301 | Import otwartego Biura | Drzwi otwarte; karta niepodniesiona. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | officeOpen = true, keycard = false. | PASS |
| T302 | Import karty | Karta podniesiona. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | officeOpen = true, keycard = true. | PASS |
| T303 | Import zdarzeń | Wybrana kombinacja tank i tankKeyAvailable. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | Oba zdarzenia zachowane bez ponownego losowania. | PASS |
| T304 | Import kluczyków | Kluczyki podniesione. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | tankKey = true, tankKeyAvailable = true. | PASS |
| T305 | Import wygranej w Starcie | Zwykła wygrana. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | ended = won = true, pokój 1, karta i prąd. | PASS |
| T306 | Import wygranej czołgiem | Alternatywna wygrana. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | ended = won = true, pokój 7, czołg i kluczyki. | PASS |
| T307 | Import wygranej z energią 0 | Wygrana ostatnią energią. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | Wygrana zachowana przy energy = 0. | PASS |
| T308 | Import porażki | Przegrana przy energii 0. Zapisz sesję i zmień bieżący stan. | Importuj zachowany testSave. | ended = true, won = false, energy = 0; ruch zablokowany. | PASS |

### 18. Wersje i starsze zapisy

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T309 | Wersja 1 | Prawidłowy testPackage. | Ustaw wersja = 1 i importuj. | Import przyjęty; stan odtworzony. | PASS |
| T310 | Wersja 2 | Prawidłowy testPackage. | Ustaw wersja = 2 i importuj. | Import przyjęty; stan odtworzony. | PASS |
| T311 | Błędna wersja 0 | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = 0` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T312 | Błędna wersja -1 | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = -1` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T313 | Błędna wersja 3 | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = 3` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T314 | Błędna wersja 99 | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = 99` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T315 | Błędna wersja 1.5 | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = 1.5` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T316 | Błędna wersja "1" | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = "1"` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T317 | Błędna wersja "2" | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = "2"` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T318 | Błędna wersja null | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = null` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T319 | Błędna wersja true | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = true` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T320 | Błędna wersja [] | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = []` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T321 | Błędna wersja {} | Prawidłowy testPackage; zapamiętany stan. | Ustaw `testPackage.wersja = {}` i importuj. | Odmowa nieobsługiwanej wersji; cały stan bez zmian. | PASS |
| T322 | Brak wersji | Prawidłowy testPackage. | Usuń wersja i importuj. | Odmowa bez zmiany gry. | PASS |
| T323 | Starszy zapis bez prądu | Poprawny zapis z Power = false. | Usuń GeneratorFire i importuj. | generatorFire domyślnie true; prąd wyłączony. | PASS |
| T324 | Starszy zapis z prądem | Poprawny zapis działającego generatora. | Usuń GeneratorFire i importuj. | generatorFire domyślnie false; generator nie zaczyna płonąć. | PASS |

### 19. Błędny tekst i opakowanie importu

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T325 | Wejście null | Aktywna gra; zapamiętany testBefore. | `importuj(null)` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T326 | Wejście undefined | Aktywna gra; zapamiętany testBefore. | `importuj(undefined)` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T327 | Wejście "" | Aktywna gra; zapamiętany testBefore. | `importuj("")` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T328 | Wejście "   " | Aktywna gra; zapamiętany testBefore. | `importuj("   ")` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T329 | Wejście "\n\t" | Aktywna gra; zapamiętany testBefore. | `importuj("\n\t")` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T330 | Wejście 123 | Aktywna gra; zapamiętany testBefore. | `importuj(123)` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T331 | Wejście true | Aktywna gra; zapamiętany testBefore. | `importuj(true)` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T332 | Wejście {} | Aktywna gra; zapamiętany testBefore. | `importuj({})` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T333 | Wejście [] | Aktywna gra; zapamiętany testBefore. | `importuj([])` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T334 | Wejście "{" | Aktywna gra; zapamiętany testBefore. | `importuj("{")` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T335 | Wejście "nie jest JSON" | Aktywna gra; zapamiętany testBefore. | `importuj("nie jest JSON")` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T336 | Wejście "undefined" | Aktywna gra; zapamiętany testBefore. | `importuj("undefined")` | Czytelna odmowa bez wyjątku i zmiany jakiegokolwiek pola stanu. | PASS |
| T337 | Pakiet JSON null | Aktywna gra; zapamiętany testBefore. | Zaimportuj tekst JSON `null`. | Pakiet odrzucony; poprzedni stan i mapa zachowane. | PASS |
| T338 | Pakiet JSON [] | Aktywna gra; zapamiętany testBefore. | Zaimportuj tekst JSON `[]`. | Pakiet odrzucony; poprzedni stan i mapa zachowane. | PASS |
| T339 | Pakiet JSON true | Aktywna gra; zapamiętany testBefore. | Zaimportuj tekst JSON `true`. | Pakiet odrzucony; poprzedni stan i mapa zachowane. | PASS |
| T340 | Pakiet JSON 123 | Aktywna gra; zapamiętany testBefore. | Zaimportuj tekst JSON `123`. | Pakiet odrzucony; poprzedni stan i mapa zachowane. | PASS |
| T341 | Pakiet JSON "tekst" | Aktywna gra; zapamiętany testBefore. | Zaimportuj tekst JSON `"tekst"`. | Pakiet odrzucony; poprzedni stan i mapa zachowane. | PASS |
| T342 | Pakiet JSON {} | Aktywna gra; zapamiętany testBefore. | Zaimportuj tekst JSON `{}`. | Pakiet odrzucony; poprzedni stan i mapa zachowane. | PASS |
| T343 | Niepoprawny stan null | Prawidłowy testPackage. | Ustaw `testPackage.stan = null` i importuj. | Odmowa niepoprawnego stanu bez utraty bieżącej sesji. | PASS |
| T344 | Niepoprawny stan [] | Prawidłowy testPackage. | Ustaw `testPackage.stan = []` i importuj. | Odmowa niepoprawnego stanu bez utraty bieżącej sesji. | PASS |
| T345 | Niepoprawny stan true | Prawidłowy testPackage. | Ustaw `testPackage.stan = true` i importuj. | Odmowa niepoprawnego stanu bez utraty bieżącej sesji. | PASS |
| T346 | Niepoprawny stan 123 | Prawidłowy testPackage. | Ustaw `testPackage.stan = 123` i importuj. | Odmowa niepoprawnego stanu bez utraty bieżącej sesji. | PASS |
| T347 | Niepoprawny stan "tekst" | Prawidłowy testPackage. | Ustaw `testPackage.stan = "tekst"` i importuj. | Odmowa niepoprawnego stanu bez utraty bieżącej sesji. | PASS |
| T348 | Brak stan | Pakiet z poprawną wersją. | Usuń stan i importuj. | Odmowa bez zmiany sesji. | PASS |
| T349 | Anulowanie prompt | Aktywna gra. | W oknie importu wybierz Anuluj. | Odmowa anulowanego wejścia; gra zachowana. | PASS |
| T350 | Pusty prompt | Aktywna gra. | Zatwierdź puste okno importu. | Odmowa; brak resetu stanu. | PASS |
| T351 | Komenda zamiast danych | Aktywna gra. | Do okna importu wklej importuj(...) zamiast JSON-u. | Tekst nie jest wykonywany; parser odmawia. | PASS |
| T352 | Kod zamiast JSON | Aktywna gra. | Wklej tekst przypisania lub wywołania JavaScript. | Brak wykonania kodu; import odrzucony. | PASS |
| T353 | Ucięty zapis | Poprawny zapis skrócony wewnątrz obiektu. | Importuj. | Odmowa składni; brak częściowego przyjęcia. | PASS |
| T354 | Końcowy przecinek | JSON z przecinkiem po ostatnim polu. | Importuj. | Odmowa składni JSON. | PASS |
| T355 | Komentarz w JSON | Dane poprzedzone komentarzem JavaScript. | Importuj. | Odmowa; komentarz nie jest traktowany jako składnia JSON. | PASS |

### 20. Typy i zakresy pól zapisu

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T356 | RoomID = 0 | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.RoomID = 0`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T357 | RoomID = 8 | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.RoomID = 8`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T358 | RoomID = -1 | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.RoomID = -1`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T359 | RoomID = 1.5 | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.RoomID = 1.5`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T360 | RoomID = "1" | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.RoomID = "1"`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T361 | RoomID = null | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.RoomID = null`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T362 | RoomID = true | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.RoomID = true`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T363 | Brak RoomID | Prawidłowy testPackage. | Usuń `testPackage.stan.RoomID` i importuj. | Odmowa niekompletnego zapisu. | PASS |
| T364 | Energy = -1 | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.Energy = -1`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T365 | Energy = 21 | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.Energy = 21`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T366 | Energy = 1.5 | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.Energy = 1.5`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T367 | Energy = "20" | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.Energy = "20"`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T368 | Energy = null | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.Energy = null`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T369 | Energy = true | Prawidłowy testPackage; zmień tylko wskazane pole. | `testPackage.stan.Energy = true`; importuj. | Odmowa niepoprawnego typu lub zakresu; brak częściowego importu. | PASS |
| T370 | Brak Energy | Prawidłowy testPackage. | Usuń `testPackage.stan.Energy` i importuj. | Odmowa niekompletnego zapisu. | PASS |
| T371 | Power = "false" | Prawidłowy testPackage. | `testPackage.stan.Power = "false"`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T372 | Power = 0 | Prawidłowy testPackage. | `testPackage.stan.Power = 0`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T373 | Power = null | Prawidłowy testPackage. | `testPackage.stan.Power = null`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T374 | Power = [] | Prawidłowy testPackage. | `testPackage.stan.Power = []`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T375 | Brak Power | Prawidłowy testPackage. | Usuń `testPackage.stan.Power` i importuj. | Odmowa niekompletnego stanu. | PASS |
| T376 | GeneratorFire = "false" | Prawidłowy testPackage. | `testPackage.stan.GeneratorFire = "false"`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T377 | GeneratorFire = 0 | Prawidłowy testPackage. | `testPackage.stan.GeneratorFire = 0`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T378 | GeneratorFire = null | Prawidłowy testPackage. | `testPackage.stan.GeneratorFire = null`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T379 | GeneratorFire = [] | Prawidłowy testPackage. | `testPackage.stan.GeneratorFire = []`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T380 | Ended = "false" | Prawidłowy testPackage. | `testPackage.stan.Ended = "false"`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T381 | Ended = 0 | Prawidłowy testPackage. | `testPackage.stan.Ended = 0`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T382 | Ended = null | Prawidłowy testPackage. | `testPackage.stan.Ended = null`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T383 | Ended = [] | Prawidłowy testPackage. | `testPackage.stan.Ended = []`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T384 | Brak Ended | Prawidłowy testPackage. | Usuń `testPackage.stan.Ended` i importuj. | Odmowa niekompletnego stanu. | PASS |
| T385 | Won = "false" | Prawidłowy testPackage. | `testPackage.stan.Won = "false"`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T386 | Won = 0 | Prawidłowy testPackage. | `testPackage.stan.Won = 0`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T387 | Won = null | Prawidłowy testPackage. | `testPackage.stan.Won = null`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T388 | Won = [] | Prawidłowy testPackage. | `testPackage.stan.Won = []`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T389 | Brak Won | Prawidłowy testPackage. | Usuń `testPackage.stan.Won` i importuj. | Odmowa niekompletnego stanu. | PASS |
| T390 | OfficeOpen = "false" | Prawidłowy testPackage. | `testPackage.stan.OfficeOpen = "false"`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T391 | OfficeOpen = 0 | Prawidłowy testPackage. | `testPackage.stan.OfficeOpen = 0`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T392 | OfficeOpen = null | Prawidłowy testPackage. | `testPackage.stan.OfficeOpen = null`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T393 | OfficeOpen = [] | Prawidłowy testPackage. | `testPackage.stan.OfficeOpen = []`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T394 | Brak OfficeOpen | Prawidłowy testPackage. | Usuń `testPackage.stan.OfficeOpen` i importuj. | Odmowa niekompletnego stanu. | PASS |
| T395 | Tank = "false" | Prawidłowy testPackage. | `testPackage.stan.Tank = "false"`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T396 | Tank = 0 | Prawidłowy testPackage. | `testPackage.stan.Tank = 0`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T397 | Tank = null | Prawidłowy testPackage. | `testPackage.stan.Tank = null`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T398 | Tank = [] | Prawidłowy testPackage. | `testPackage.stan.Tank = []`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T399 | Brak Tank | Prawidłowy testPackage. | Usuń `testPackage.stan.Tank` i importuj. | Odmowa niekompletnego stanu. | PASS |
| T400 | TankKeyAvailable = "false" | Prawidłowy testPackage. | `testPackage.stan.TankKeyAvailable = "false"`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T401 | TankKeyAvailable = 0 | Prawidłowy testPackage. | `testPackage.stan.TankKeyAvailable = 0`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T402 | TankKeyAvailable = null | Prawidłowy testPackage. | `testPackage.stan.TankKeyAvailable = null`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T403 | TankKeyAvailable = [] | Prawidłowy testPackage. | `testPackage.stan.TankKeyAvailable = []`; importuj. | Odmowa; brak konwersji na boolean i zmian bieżącego stanu. | PASS |
| T404 | Brak TankKeyAvailable | Prawidłowy testPackage. | Usuń `testPackage.stan.TankKeyAvailable` i importuj. | Odmowa niekompletnego stanu. | PASS |
| T405 | Items = null | Prawidłowy testPackage. | `testPackage.stan.Items = null`; importuj. | Odmowa niepoprawnego ekwipunku bez wyjątku. | PASS |
| T406 | Items = [] | Prawidłowy testPackage. | `testPackage.stan.Items = []`; importuj. | Odmowa niepoprawnego ekwipunku bez wyjątku. | PASS |
| T407 | Items = true | Prawidłowy testPackage. | `testPackage.stan.Items = true`; importuj. | Odmowa niepoprawnego ekwipunku bez wyjątku. | PASS |
| T408 | Items = "tekst" | Prawidłowy testPackage. | `testPackage.stan.Items = "tekst"`; importuj. | Odmowa niepoprawnego ekwipunku bez wyjątku. | PASS |
| T409 | Items.Key = "true" | Prawidłowy testPackage. | `testPackage.stan.Items.Key = "true"`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T410 | Items.Key = 1 | Prawidłowy testPackage. | `testPackage.stan.Items.Key = 1`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T411 | Items.Key = null | Prawidłowy testPackage. | `testPackage.stan.Items.Key = null`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T412 | Brak Items.Key | Prawidłowy testPackage. | Usuń `testPackage.stan.Items.Key` i importuj. | Odmowa niekompletnego ekwipunku. | PASS |
| T413 | Items.Keycard = "true" | Prawidłowy testPackage. | `testPackage.stan.Items.Keycard = "true"`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T414 | Items.Keycard = 1 | Prawidłowy testPackage. | `testPackage.stan.Items.Keycard = 1`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T415 | Items.Keycard = null | Prawidłowy testPackage. | `testPackage.stan.Items.Keycard = null`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T416 | Brak Items.Keycard | Prawidłowy testPackage. | Usuń `testPackage.stan.Items.Keycard` i importuj. | Odmowa niekompletnego ekwipunku. | PASS |
| T417 | Items.Fuse = "true" | Prawidłowy testPackage. | `testPackage.stan.Items.Fuse = "true"`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T418 | Items.Fuse = 1 | Prawidłowy testPackage. | `testPackage.stan.Items.Fuse = 1`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T419 | Items.Fuse = null | Prawidłowy testPackage. | `testPackage.stan.Items.Fuse = null`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T420 | Brak Items.Fuse | Prawidłowy testPackage. | Usuń `testPackage.stan.Items.Fuse` i importuj. | Odmowa niekompletnego ekwipunku. | PASS |
| T421 | Items.TKey = "true" | Prawidłowy testPackage. | `testPackage.stan.Items.TKey = "true"`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T422 | Items.TKey = 1 | Prawidłowy testPackage. | `testPackage.stan.Items.TKey = 1`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T423 | Items.TKey = null | Prawidłowy testPackage. | `testPackage.stan.Items.TKey = null`; importuj. | Odmowa; przedmiot nie jest przyznawany ani odbierany. | PASS |
| T424 | Brak Items.TKey | Prawidłowy testPackage. | Usuń `testPackage.stan.Items.TKey` i importuj. | Odmowa niekompletnego ekwipunku. | PASS |
| T425 | Bucket = null | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket = null`; importuj. | Odmowa niepoprawnego wiadra bez wyjątku i zmiany gry. | PASS |
| T426 | Bucket = true | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket = true`; importuj. | Odmowa niepoprawnego wiadra bez wyjątku i zmiany gry. | PASS |
| T427 | Bucket = [] | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket = []`; importuj. | Odmowa niepoprawnego wiadra bez wyjątku i zmiany gry. | PASS |
| T428 | Bucket = {} | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket = {}`; importuj. | Odmowa niepoprawnego wiadra bez wyjątku i zmiany gry. | PASS |
| T429 | Bucket.Has = "false" | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket.Has = "false"`; importuj. | Odmowa zamiast konwersji typu. | PASS |
| T430 | Bucket.Has = 0 | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket.Has = 0`; importuj. | Odmowa zamiast konwersji typu. | PASS |
| T431 | Bucket.Has = null | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket.Has = null`; importuj. | Odmowa zamiast konwersji typu. | PASS |
| T432 | Brak Bucket.Has | Prawidłowy testPackage. | Usuń `testPackage.stan.Items.Bucket.Has` i importuj. | Odmowa niekompletnego wiadra. | PASS |
| T433 | Bucket.Filled = "false" | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket.Filled = "false"`; importuj. | Odmowa zamiast konwersji typu. | PASS |
| T434 | Bucket.Filled = 0 | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket.Filled = 0`; importuj. | Odmowa zamiast konwersji typu. | PASS |
| T435 | Bucket.Filled = null | Prawidłowy testPackage. | `testPackage.stan.Items.Bucket.Filled = null`; importuj. | Odmowa zamiast konwersji typu. | PASS |
| T436 | Brak Bucket.Filled | Prawidłowy testPackage. | Usuń `testPackage.stan.Items.Bucket.Filled` i importuj. | Odmowa niekompletnego wiadra. | PASS |

### 21. Sprzeczne stany i zakończenia w imporcie

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T437 | Woda bez wiadra | Prawidłowy testPackage. | Bucket.Has = false, Bucket.Filled = true; importuj. | Odmowa sprzecznego wiadra. | PASS |
| T438 | Prąd i bezpiecznik | Prawidłowy testPackage. | Power = true, GeneratorFire = false, Items.Fuse = true; importuj. | Odmowa; działający generator wymaga zużytego bezpiecznika. | PASS |
| T439 | Prąd podczas pożaru | Prawidłowy testPackage. | Power = GeneratorFire = true; importuj. | Odmowa sprzecznego generatora. | PASS |
| T440 | Karta przy zamkniętym Biurze | Prawidłowy testPackage. | Items.Keycard = true, OfficeOpen = false; importuj. | Odmowa sprzecznego stanu Biura. | PASS |
| T441 | Gracz w zamkniętym Biurze | Prawidłowy testPackage. | RoomID = 4, OfficeOpen = false; importuj. | Odmowa umieszczenia gracza za zamkniętymi drzwiami. | PASS |
| T442 | Kluczyki bez zdarzenia | Prawidłowy testPackage. | Items.TKey = true, TankKeyAvailable = false; importuj. | Odmowa sprzecznego stanu kluczyków. | PASS |
| T443 | Aktywna gra z zerem | Prawidłowy testPackage. | Energy = 0, Ended = Won = false; importuj. | Odmowa aktywnej sesji bez energii. | PASS |
| T444 | Koniec bez przyczyny | Prawidłowy testPackage. | Energy = 10, Ended = true, Won = false; importuj. | Odmowa; porażka wymaga zera energii. | PASS |
| T445 | Wygrana bez końca | Poprawny zapis wygranej. | Won = true, Ended = false; importuj. | Odmowa niespójnych flag. | PASS |
| T446 | Wygrana bez karty | Zapis wygranej w Start. | Items.Keycard = false; importuj. | Odmowa braku warunków zwykłej wygranej. | PASS |
| T447 | Wygrana bez prądu | Zapis wygranej w Start. | Power = false; importuj. | Odmowa braku warunków zwykłej wygranej. | PASS |
| T448 | Wygrana czołgiem bez czołgu | Zapis wygranej w pokoju 7. | Tank = false; importuj. | Odmowa braku warunków wygranej. | PASS |
| T449 | Wygrana czołgiem bez kluczyków | Zapis wygranej w pokoju 7. | Items.TKey = false; importuj. | Odmowa braku warunków wygranej. | PASS |
| T450 | Poprawna porażka | Poprawne pozostałe pola. | Energy = 0, Ended = true, Won = false; importuj. | Zapis przyjęty i pozostaje przegrany. | PASS |
| T451 | Poprawna wygrana przy zerze | Spełniona droga zwykła lub czołgowa. | Energy = 0, Ended = Won = true; importuj. | Zapis przyjęty jako wygrana. | PASS |
| T452 | Gotowość do ucieczki | Poprawny aktywny zapis: Start, karta i prąd. | Importuj, następnie akcja("ucieknij"). | Import sam nie daje wygranej; dopiero akcja kończy sesję. | PASS |
| T453 | Wygrana w pokoju 2 | Zapis z Won = Ended = true; Biuro otwarte, jeśli dotyczy. | Ustaw RoomID = 2 i importuj. | Odmowa braku warunków wygranej w tym pokoju. | PASS |
| T454 | Wygrana w pokoju 3 | Zapis z Won = Ended = true; Biuro otwarte, jeśli dotyczy. | Ustaw RoomID = 3 i importuj. | Odmowa braku warunków wygranej w tym pokoju. | PASS |
| T455 | Wygrana w pokoju 4 | Zapis z Won = Ended = true; Biuro otwarte, jeśli dotyczy. | Ustaw RoomID = 4 i importuj. | Odmowa braku warunków wygranej w tym pokoju. | PASS |
| T456 | Wygrana w pokoju 5 | Zapis z Won = Ended = true; Biuro otwarte, jeśli dotyczy. | Ustaw RoomID = 5 i importuj. | Odmowa braku warunków wygranej w tym pokoju. | PASS |
| T457 | Wygrana w pokoju 6 | Zapis z Won = Ended = true; Biuro otwarte, jeśli dotyczy. | Ustaw RoomID = 6 i importuj. | Odmowa braku warunków wygranej w tym pokoju. | PASS |

### 22. Błędna mapa i przejścia w imporcie

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T458 | Mapa = null | Prawidłowy testPackage. | `testPackage.stan.Mapa = null`; importuj. | Odmowa niepoprawnych wymiarów lub typu mapy. | PASS |
| T459 | Mapa = {} | Prawidłowy testPackage. | `testPackage.stan.Mapa = {}`; importuj. | Odmowa niepoprawnych wymiarów lub typu mapy. | PASS |
| T460 | Mapa = [] | Prawidłowy testPackage. | `testPackage.stan.Mapa = []`; importuj. | Odmowa niepoprawnych wymiarów lub typu mapy. | PASS |
| T461 | Mapa = [[],[],[]] | Prawidłowy testPackage. | `testPackage.stan.Mapa = [[],[],[]]`; importuj. | Odmowa niepoprawnych wymiarów lub typu mapy. | PASS |
| T462 | Mapa = [[1,2,3],[4,5,6]] | Prawidłowy testPackage. | `testPackage.stan.Mapa = [[1,2,3],[4,5,6]]`; importuj. | Odmowa niepoprawnych wymiarów lub typu mapy. | PASS |
| T463 | Mapa = [[1,2,3],[4,5,6],[7,0,0],[0,0,0]] | Prawidłowy testPackage. | `testPackage.stan.Mapa = [[1,2,3],[4,5,6],[7,0,0],[0,0,0]]`; importuj. | Odmowa niepoprawnych wymiarów lub typu mapy. | PASS |
| T464 | Komórka mapy = -1 | Prawidłowy testPackage; wybierz zajętą komórkę. | Wstaw `-1` do komórki i importuj. | Odmowa niepoprawnego identyfikatora lub typu. | PASS |
| T465 | Komórka mapy = 8 | Prawidłowy testPackage; wybierz zajętą komórkę. | Wstaw `8` do komórki i importuj. | Odmowa niepoprawnego identyfikatora lub typu. | PASS |
| T466 | Komórka mapy = 1.5 | Prawidłowy testPackage; wybierz zajętą komórkę. | Wstaw `1.5` do komórki i importuj. | Odmowa niepoprawnego identyfikatora lub typu. | PASS |
| T467 | Komórka mapy = "1" | Prawidłowy testPackage; wybierz zajętą komórkę. | Wstaw `"1"` do komórki i importuj. | Odmowa niepoprawnego identyfikatora lub typu. | PASS |
| T468 | Komórka mapy = null | Prawidłowy testPackage; wybierz zajętą komórkę. | Wstaw `null` do komórki i importuj. | Odmowa niepoprawnego identyfikatora lub typu. | PASS |
| T469 | Komórka mapy = true | Prawidłowy testPackage; wybierz zajętą komórkę. | Wstaw `true` do komórki i importuj. | Odmowa niepoprawnego identyfikatora lub typu. | PASS |
| T470 | Brak pokoju | Prawidłowy testPackage. | Zastąp jeden pokój polem 0. | Odmowa braku jednego z pokoi 1–7. | PASS |
| T471 | Duplikat pokoju | Prawidłowy testPackage. | Zastąp jeden pokój identyfikatorem innego. | Odmowa powtórzenia i brakującego pokoju. | PASS |
| T472 | Biuro w środku | Przygotowana mapa z Biurem w centrum. | Importuj. | Odmowa naruszenia położenia Biura. | PASS |
| T473 | Brak Mapa | Prawidłowy testPackage. | Usuń Mapa i importuj. | Odmowa bez zmiany bieżącej mapy. | PASS |
| T474 | Brak Przejscia | Prawidłowy testPackage. | Usuń Przejscia i importuj. | Odmowa bez zmiany przejść. | PASS |
| T475 | Brak wpisu pokoju | Prawidłowy testPackage. | Usuń wpis jednego pokoju z Przejscia. | Odmowa niekompletnych przejść. | PASS |
| T476 | Nieznany kierunek | Prawidłowy testPackage. | Dodaj kierunek north w jednym pokoju. | Odmowa nieznanego kierunku. | PASS |
| T477 | Jednostronne drzwi | Prawidłowy testPackage. | Usuń przejście powrotne wybranych drzwi. | Odmowa niesymetrycznego połączenia. | PASS |
| T478 | Drzwi do siebie | Prawidłowy testPackage. | Ustaw cel drzwi na pokój źródłowy. | Odmowa niezgodności z geometrią. | PASS |
| T479 | Drzwi poza siatkę | Pokój przy brzegu w testPackage. | Dodaj przejście poza mapę. | Odmowa bez wyjątku indeksowania. | PASS |
| T480 | Drzwi do pustki | Prawidłowy testPackage. | Dodaj przejście do komórki 0. | Odmowa niepoprawnego celu. | PASS |
| T481 | Odległy cel | Prawidłowy testPackage. | Ustaw cel przejścia na niesąsiadujący pokój. | Odmowa mimo istnienia identyfikatora celu. | PASS |
| T482 | Odłączony pokój | Mapa z odłączonym pokojem; reszta połączeń dwukierunkowa. | Importuj. | Odmowa niespójnej mapy. | PASS |
| T483 | Biuro jedynym mostem | Do jednego z pozostałych pokoi da się dojść tylko przez Biuro. | Importuj. | Odmowa; sześć pozostałych pokoi musi łączyć się bez Biura. | PASS |
| T484 | Odłączone Biuro | Pozostałe pokoje połączone; Biuro bez drzwi. | Importuj. | Odmowa braku spójności wszystkich siedmiu pokoi. | PASS |
| T485 | Przejscia = null | Prawidłowy testPackage. | `testPackage.stan.Przejscia = null`; importuj. | Odmowa niepoprawnego obiektu przejść. | PASS |
| T486 | Przejscia = [] | Prawidłowy testPackage. | `testPackage.stan.Przejscia = []`; importuj. | Odmowa niepoprawnego obiektu przejść. | PASS |
| T487 | Przejscia = true | Prawidłowy testPackage. | `testPackage.stan.Przejscia = true`; importuj. | Odmowa niepoprawnego obiektu przejść. | PASS |
| T488 | Przejscia = "tekst" | Prawidłowy testPackage. | `testPackage.stan.Przejscia = "tekst"`; importuj. | Odmowa niepoprawnego obiektu przejść. | PASS |
| T489 | Wpis pokoju = null | Prawidłowy testPackage. | Zastąp wpis przejść jednego pokoju wartością `null`. | Odmowa niepoprawnego wpisu bez wyjątku. | PASS |
| T490 | Wpis pokoju = [] | Prawidłowy testPackage. | Zastąp wpis przejść jednego pokoju wartością `[]`. | Odmowa niepoprawnego wpisu bez wyjątku. | PASS |
| T491 | Wpis pokoju = 1 | Prawidłowy testPackage. | Zastąp wpis przejść jednego pokoju wartością `1`. | Odmowa niepoprawnego wpisu bez wyjątku. | PASS |
| T492 | Cel przejścia = 0 | Prawidłowy testPackage. | Zmień cel istniejącego przejścia na `0` i importuj. | Odmowa niepoprawnego celu lub typu. | PASS |
| T493 | Cel przejścia = 8 | Prawidłowy testPackage. | Zmień cel istniejącego przejścia na `8` i importuj. | Odmowa niepoprawnego celu lub typu. | PASS |
| T494 | Cel przejścia = -1 | Prawidłowy testPackage. | Zmień cel istniejącego przejścia na `-1` i importuj. | Odmowa niepoprawnego celu lub typu. | PASS |
| T495 | Cel przejścia = 1.5 | Prawidłowy testPackage. | Zmień cel istniejącego przejścia na `1.5` i importuj. | Odmowa niepoprawnego celu lub typu. | PASS |
| T496 | Cel przejścia = "2" | Prawidłowy testPackage. | Zmień cel istniejącego przejścia na `"2"` i importuj. | Odmowa niepoprawnego celu lub typu. | PASS |
| T497 | Cel przejścia = null | Prawidłowy testPackage. | Zmień cel istniejącego przejścia na `null` i importuj. | Odmowa niepoprawnego celu lub typu. | PASS |
| T498 | Cel przejścia = true | Prawidłowy testPackage. | Zmień cel istniejącego przejścia na `true` i importuj. | Odmowa niepoprawnego celu lub typu. | PASS |

### 23. Atomowość importu i dalsza gra

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T499 | Pozycja po odmowie | Aktywna gra; zapamiętany testBefore. | Importuj inny pokój w pakiecie z błędem w mapie. | Gracz nie zmienia pokoju; wcześniejsze poprawne pola nie są przyjęte częściowo. | PASS |
| T500 | Przedmioty po odmowie | Masz przedmioty i wodę. | Błędny import z pustym ekwipunkiem. | Nie tracisz ekwipunku ani wody. | PASS |
| T501 | Energia po odmowie | Energia poniżej 20. | Błędny zapis próbuje ustawić Energy = 20. | Energia nie resetuje się. | PASS |
| T502 | Drzwi i prąd po odmowie | Biuro otwarte, generator działa. | Błędny zapis próbuje oba wyłączyć. | Stan drzwi i zasilania zachowany. | PASS |
| T503 | Mapa po odmowie | Inna mapa w błędnym zapisie. | Importuj, następnie mapa(). | Nadal poprzednia mapa i przejścia. | PASS |
| T504 | Odmowa po wygranej | Wygrana sesja. | Błędny import aktywnej gry, potem ruch. | Wygrana i blokada ruchu zachowane. | PASS |
| T505 | Odmowa po porażce | Przegrana sesja. | Błędny import z dodatnią energią. | Porażka i energia 0 zachowane. | PASS |
| T506 | Przyjęcie po odmowach | Kilka błędnych importów. | Importuj poprawny testSave. | Parser i konsola nadal działają; poprawny zapis przyjęty. | PASS |
| T507 | Gra po odmowie | Aktywna sesja; błędny import odrzucony. | Wykonaj dostępny ruch lub akcję. | Kontynuacja starego stanu z prawidłowym kosztem. | PASS |
| T508 | Porównanie całości | var testBefore = serializeState(). | Po odmowie sprawdź serializeState() === testBefore. | true; zachowane wszystkie pola wraz z mapą i przejściami. | PASS |
| T509 | Aktywny zapis po porażce | Bieżąca gra przegrana; testSave aktywny. | Importuj testSave i wykonaj ruch. | Stara porażka usunięta; odtworzona gra pozwala działać. | PASS |
| T510 | Zakończony zapis po aktywnej grze | Bieżąca gra aktywna; testSave zakończony. | Importuj testSave i spróbuj ruchu. | Obowiązuje zapisany koniec; import nie odblokowuje sesji. | PASS |

### 24. Pełne przebiegi od początku do końca

| ID | Przypadek | Stan / przygotowanie | Czynność | Oczekiwany wynik | Rzeczywisty wynik |
|---|---|---|---|---|---|
| T511 | Pełna zwykła wygrana | Nowa gra; planuj trasę z mapy, w razie potrzeby jedz. | Kantorek: klucz, wiadro, bezpiecznik; Łazienka: woda; Generatory: gaszenie i prąd; Biuro: otwarcie i karta; Start: ucieczka. | Każdy etap ma właściwe wymagania i koszty; finał to wygrana w Starcie. | PASS |
| T512 | Inna kolejność przygotowań | Nowa gra; wystarczająca energia na wybraną trasę. | Najpierw otwórz Biuro i weź kartę, następnie ugaś i uruchom generator, wróć do Startu. | Alternatywna poprawna kolejność nie blokuje gry; karta nie zastępuje warunków generatora. | PASS |
| T513 | Pełna wygrana czołgiem | Sesja z czołgiem i kluczykami. | Kantorek: kluczyki; Pusty pokój: ucieczka. | Wygrana bez Biura, karty i prądu. | PASS |
| T514 | Pełna porażka ruchem | Nowa gra z energią 20. | Przemieszczaj się po otwartych pokojach bez jedzenia i akcji. | Po dokładnie 20 udanych ruchach porażka; odmowy i podglądy nie wliczają się do kosztu. | PASS |
| T515 | Odmowy w pełnej trasie | Nowa gra. | Między poprawnymi etapami próbuj złych kierunków, akcji z daleka i duplikatów. | Odmowy nie zabierają zasobów; po spełnieniu warunków można dokończyć grę. | PASS |
| T516 | Przerwana droga standardowa | Postęp po gaszeniu albo otwarciu Biura. | Eksport do pliku, odświeżenie, import, dokończenie ucieczki. | Brak potrzeby powtarzania wykonanych etapów i pobierania zużytych przedmiotów. | PASS |
| T517 | Przerwana droga czołgowa | Czołg obecny; kluczyki podniesione. | Eksport, odświeżenie, import, ucieczka w pokoju 7. | Zdarzenia i kluczyki zachowane bez ponownego losowania. | PASS |
| T518 | Druga próba po porażce | Gra przegrana. | Rozpocznij ponownie i doprowadź do wygranej. | Brak dziedziczenia starej blokady, energii i flag porażki. | PASS |
| T519 | Druga próba po wygranej | Gra wygrana. | Resetuj i zagraj ponownie. | Brak automatycznej wygranej; ponownie obowiązują wymagania. | PASS |
| T520 | Wiele sesji | Kolejne gry z resetami, importami i rozpocznij(). | Rozegraj kilka pełnych sesji. | Nie kumulują się timery, przedmioty, przejścia, koszty ani stare wyniki. | PASS |
