# js-collab-game-2
Second collab

Otwórz src/index.html i konsolę (F12). Polecenia: pomoc(), mapa(), idz("prawo") (także lewo/gora/dol), akcja("nazwa"), start(), reset(). Dostępne jest też gra.idz(), gra.akcja(), gra.status() i gra.mapa().

Kantorek: PodniesKlucz, PodniesBezpiecznik, PodniesWiadro, czasem PodniesKluczyki. Przy drzwiach biura: OtworzBiuro; w biurze PodniesKarte. W generatorowni: WlaczGenerator z bezpiecznikiem. W łazience: NapelnijWiadro z wiadrem. W stołówce: Zjedz. W start: Ucieknij z kartą i zasilaniem. W pustym pokoju: Ucieknij z czołgiem i kluczyki do czołgu. Udana czynność kosztuje 1 energii; odmowa nic. Biuro nie zajmuje środka mapy. Czołg: 5%, kluczyki do czołgu: 10%, losowane raz na nową grę.

Zapis: console.log(eksportuj()), skopiuj sam JSON do edytora i zapisz jako postep.json. Po odświeżeniu otwórz plik, skopiuj tekst i wpisz importuj(prompt("Wklej JSON")), następnie wklej sam JSON. Eksport sam nie tworzy pliku. Format 2 zachowuje mapę i postęp; błędny import nie zmienia gry.

Opcjonalne testy dla osoby mającej Node: node tests/game.test.cjs. Do gry Node nie jest potrzebny.

Komendy czyszczą konsolę i automatycznie pokazują obecny pokój, przedmioty, wyjścia oraz dostępne wywołania akcja("Nazwa"). rozejrzyj() odświeża opis, energia() pokazuje zapas energii, a mapa() oznacza pozycję gwiazdką (*). Publiczne komendy zaczynają się małą literą, funkcje wewnętrzne dużą. Konsola przeglądarki może nadal pokazać undefined jako wynik polecenia — gra nie wypisuje tej wartości.
