# js-collab-game-2
Second collab

Otwórz src/index.html i konsolę (F12). Polecenia: pomoc(), mapa(), idz("prawo") (także lewo/gora/dol), akcja("nazwa"), rozpocznij(), resetuj(). Dostępne jest też gra.idz(), gra.akcja(), gra.status() i gra.mapa().

Kantorek: podniesKlucz, podniesBezpiecznik, podniesWiadro, czasem podniesKluczyki. Przy drzwiach biura: otworzBiuro; w biurze podniesKarte. W generatorowni: uzyjWiadro z pełnym wiadrem gasi pożar (GeneratorFire) i zużywa wodę. Dopiero po ugaszeniu: wlaczGenerator z bezpiecznikiem. W łazience: napelnijWiadro z wiadrem. W stołówce: zjedz. W start: ucieknij z kartą i zasilaniem. W pustym pokoju: ucieknij z czołgiem i kluczyki do czołgu. Udana czynność kosztuje 1 energii; odmowa nic. Biuro nie zajmuje środka mapy. Czołg: 5%, kluczyki do czołgu: 10%, losowane raz na nową grę.

Zapis: console.log(eksportuj()), skopiuj sam JSON do edytora i zapisz jako postep.json. Po odświeżeniu otwórz plik, skopiuj tekst i wpisz importuj(prompt("Wklej JSON")), następnie wklej sam JSON. Eksport sam nie tworzy pliku. Format 1 zachowuje mapę i postęp; błędny import nie zmienia gry.

Komendy czyszczą konsolę i automatycznie pokazują obecny pokój, przedmioty, wyjścia oraz dostępne wywołania akcja("Nazwa"). rozejrzyj() odświeża opis, energia() pokazuje zapas energii, a mapa() oznacza pozycję gwiazdką (*). Komendy gracza mają polskie nazwy, a funkcje wewnętrzne angielskie nazwy w camelCase. Po rozpocznij() tytuł jest widoczny przez 5 sekund; dopiero potem pojawia się gra.