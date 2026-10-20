
let Mapa = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let Przejscia = {};

function GenerujMape() {
    Mapa = Array.from({ length: 3 }, () => [0, 0, 0]);

    let pola = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!(i === 2 && j === 2)) {
                pola.push([i, j]);
            }
        }
    }

    pola.sort(() => Math.random() - 0.5);

    let liczby = [1, 2, 3, 4, 5, 6, 7];
    liczby.sort(() => Math.random() - 0.5);

    let [r, c] = pola[0];
    Mapa[r][c] = 1;

    let pozostale = liczby.filter(n => n !== 1);

    for (let i = 1; i < 7; i++) {
        [r, c] = pola[i];
        Mapa[r][c] = pozostale[i - 1];
    }

    // Tworzenie losowych, spójnych przejść między sąsiednimi pokojami.
    Przejscia = {};

    const sasiedzi = {};

    for (const id of pozostale.concat(1)) {
        sasiedzi[id] = [];
    }

    const krawedzie = [];

    for (let w = 0; w < 3; w++) {
        for (let k = 0; k < 3; k++) {
            const id = Mapa[w][k];

            if (!id) continue;

            if (k < 2 && Mapa[w][k + 1]) {
                krawedzie.push([id, Mapa[w][k + 1]]);
            }

            if (w < 2 && Mapa[w + 1][k]) {
                krawedzie.push([id, Mapa[w + 1][k]]);
            }
        }
    }

    const odwiedzone = new Set([1]);

    while (odwiedzone.size < 7) {
        const mozliwe = krawedzie.filter(
            ([a, b]) => odwiedzone.has(a) !== odwiedzone.has(b)
        );

        if (mozliwe.length === 0) break;

        const [a, b] = mozliwe[
            Math.floor(Math.random() * mozliwe.length)
        ];

        sasiedzi[a].push(b);
        sasiedzi[b].push(a);

        odwiedzone.add(a);
        odwiedzone.add(b);

        krawedzie.splice(
            krawedzie.findIndex(
                ([x, y]) =>
                    (x === a && y === b) ||
                    (x === b && y === a)
            ),
            1
        );
    }

    // Losowe dodatkowe przejścia.
    for (const [a, b] of krawedzie) {
        if (Math.random() < 0.3) {
            sasiedzi[a].push(b);
            sasiedzi[b].push(a);
        }
    }

    const kierunki = [
        ["gora", -1, 0],
        ["dol", 1, 0],
        ["lewo", 0, -1],
        ["prawo", 0, 1]
    ];

    for (let w = 0; w < 3; w++) {
        for (let k = 0; k < 3; k++) {
            const id = Mapa[w][k];

            if (!id) continue;

            Przejscia[id] = {};

            for (const [nazwa, dw, dk] of kierunki) {
                const nw = w + dw;
                const nk = k + dk;

                if (
                    nw >= 0 &&
                    nw < 3 &&
                    nk >= 0 &&
                    nk < 3 &&
                    sasiedzi[id].includes(Mapa[nw][nk])
                ) {
                    Przejscia[id][nazwa] = Mapa[nw][nk];
                }
            }
        }
    }

    console.table(Mapa);
}

function WyswietlMape() {
    const nazwyPokoi = {
        0: "",
        1: "Start",
        2: "Generatory",
        3: "Kantorek",
        4: "Biuro",
        5: "Lazienka",
        6: "Stolowka",
        7: "Pusty pokoj"
    };

    const ZOLTY = "\x1b[43m\x1b[30m";
    const RESET = "\x1b[0m";

    const szerokosc = 13;

    for (let i = 0; i < Mapa.length; i++) {
        const gora = [];
        const srodek = [];
        const dol = [];

        for (let j = 0; j < Mapa[i].length; j++) {
            const id = Mapa[i][j];
            const nazwa = nazwyPokoi[id];

            const aktywny =
                id !== 0 &&
                typeof GameState !== "undefined" &&
                id === GameState.RoomID;

            const lewaKrawedz = "│ ";
            const prawaKrawedz = " │";

            if (aktywny) {
                gora.push(ZOLTY + "┌" + "─".repeat(13) + "┐" + RESET);

                const tekst = nazwa.padEnd(11);
                srodek.push(
                    "│ " + ZOLTY + tekst + RESET + " │"
                );

                dol.push(ZOLTY + "└" + "─".repeat(13) + "┘" + RESET);
            } else {
                gora.push("┌" + "─".repeat(13) + "┐");

                srodek.push(
                    lewaKrawedz + nazwa.padEnd(11) + prawaKrawedz
                );

                dol.push("└" + "─".repeat(13) + "┘");
            }
        }

        console.log(gora.join("   "));

        let linia = "";

        for (let j = 0; j < 3; j++) {
            const id = Mapa[i][j];
            const nazwa = nazwyPokoi[id];
            const aktywny =
                id !== 0 &&
                typeof GameState !== "undefined" &&
                id === GameState.RoomID;

            linia += "│ ";

            if (aktywny) {
                linia += ZOLTY + nazwa.padEnd(11) + RESET;
            } else {
                linia += nazwa.padEnd(11);
            }

            linia += " │";

            if (j < 2) {
                const sasiedni = Mapa[i][j + 1];

                const otwarte =
                    Przejscia[id] &&
                    Przejscia[id].prawo === sasiedni;

                linia += otwarte ? "───" : "   ";
            }
        }

        console.log(linia);
        console.log(dol.join("   "));

        if (i < 2) {
            let polaczenia = "";

            for (let j = 0; j < 3; j++) {
                const id = Mapa[i][j];
                const sasiedni = Mapa[i + 1][j];

                const otwarte =
                    Przejscia[id] &&
                    Przejscia[id].dol === sasiedni;

                polaczenia += otwarte ? "       │             " : "                     ";
            }

            console.log(polaczenia);
        }
    }

    console.log("\nŻółty pokój = twoja aktualna pozycja.");
}

function idz(kierunek) {
    if (!["prawo", "lewo", "gora", "dol"].includes(kierunek)) {
        console.log(
            'Wpisz idz("prawo"), idz("lewo"), idz("gora") albo idz("dol").'
        );
        return false;
    }

    const cel =
        Przejscia[GameState.RoomID] &&
        Przejscia[GameState.RoomID][kierunek];

    if (!cel) {
        console.log("Nie ma otwartego przejscia w tym kierunku.");
        return false;
    }

    GameState.RoomID = cel;

    console.log("Przechodzisz do pokoju " + cel + ".");

    WyswietlMape();

    return true;
}

function prawo() {
    return idz("prawo");
}

function lewo() {
    return idz("lewo");
}

function gora() {
    return idz("gora");
}

function dol() {
    return idz("dol");
}


GenerujMape();
WyswietlMape();