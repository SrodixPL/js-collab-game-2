const NazwyPokoi = {0: "", 1: "Start", 2: "Generatory", 3: "Kantorek", 4: "Biuro", 5: "Łazienka", 6: "Stołówka", 7: "Pusty pokój"};

let Mapa = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let Przejscia = {};

function Tasuj(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
}

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

    Tasuj(pola);

    let liczby = [1, 2, 3, 4, 5, 6, 7];
    Tasuj(liczby);

    let [r, c] = pola[0];
    Mapa[r][c] = 1;

    let pozostale = liczby.filter(n => n !== 1);

    for (let i = 1; i < 7; i++) {
        [r, c] = pola[i];
        Mapa[r][c] = pozostale[i - 1];
    }

    if (Mapa[1][1] === 4) {
        return GenerujMape();
    }

    Przejscia = {};
    const sasiedzi = {};
    for (const id of pozostale.concat(1)) sasiedzi[id] = [];
    const krawedzie = [];
    for (let w = 0; w < 3; w++) {
        for (let k = 0; k < 3; k++) {
            const id = Mapa[w][k];
            if (!id) continue;
            if (k < 2 && Mapa[w][k + 1]) krawedzie.push([id, Mapa[w][k + 1]]);
            if (w < 2 && Mapa[w + 1][k]) krawedzie.push([id, Mapa[w + 1][k]]);
        }
    }
    const odwiedzone = new Set([1]);
    while (odwiedzone.size < 7) {
        const mozliwe = krawedzie.filter(([a, b]) => odwiedzone.has(a) !== odwiedzone.has(b));
        const bezBiura = mozliwe.filter(([a, b]) => a !== 4 && b !== 4);
        if (odwiedzone.size < 6) {
            if (bezBiura.length === 0) return GenerujMape();
            mozliwe.splice(0, mozliwe.length, ...bezBiura);
        }
        if (mozliwe.length === 0) return GenerujMape();
        const [a, b] = mozliwe[Math.floor(Math.random() * mozliwe.length)];
        sasiedzi[a].push(b);
        sasiedzi[b].push(a);
        odwiedzone.add(a);
        odwiedzone.add(b);
        krawedzie.splice(krawedzie.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a)), 1);
    }
    for (const [a, b] of krawedzie) {
        if (Math.random() < 0.3) {
            sasiedzi[a].push(b);
            sasiedzi[b].push(a);
        }
    }
    const kierunki = [["gora", -1, 0], ["dol", 1, 0], ["lewo", 0, -1], ["prawo", 0, 1]];
    for (let w = 0; w < 3; w++) {
        for (let k = 0; k < 3; k++) {
            const id = Mapa[w][k];
            if (!id) continue;
            Przejscia[id] = {};
            for (const [nazwa, dw, dk] of kierunki) {
                const nw = w + dw, nk = k + dk;
                if (nw >= 0 && nw < 3 && nk >= 0 && nk < 3 && sasiedzi[id].includes(Mapa[nw][nk])) {
                    Przejscia[id][nazwa] = Mapa[nw][nk];
                }
            }
        }
    }

}

function WyswietlMape() {
    const nazwyPokoi = Object.fromEntries(Object.entries(NazwyPokoi).map(([id, nazwa]) => [id, nazwa + (Number(id) === GameState.RoomID ? "*" : "")]));

    for (let i = 0; i < Mapa.length; i++) {
        console.log("┌─────────────┐   ┌─────────────┐   ┌─────────────┐");
        console.log(
            "│ " + nazwyPokoi[Mapa[i][0]].padEnd(11) + " │" + (Przejscia[Mapa[i][0]] && Przejscia[Mapa[i][0]].prawo ? "───" : "   ") + "│ " +
            nazwyPokoi[Mapa[i][1]].padEnd(11) + " │" + (Przejscia[Mapa[i][1]] && Przejscia[Mapa[i][1]].prawo ? "───" : "   ") + "│ " +
            nazwyPokoi[Mapa[i][2]].padEnd(11) + " │"
        );
        console.log("└─────────────┘   └─────────────┘   └─────────────┘");
        if (i < Mapa.length - 1) {
            let linia = "";
            for (let j = 0; j < 3; j++) {
                linia += Przejscia[Mapa[i][j]] && Przejscia[Mapa[i][j]].dol ? "       │       " : "               ";
                if (j < 2) linia += "   ";
            }
            console.log(linia);
        }
    }
}

function Idz(kierunek) {
    if (GameState.Ended) {
        console.log("Gra zakończona. Wpisz start().");
        return false;
    }
    if (!["prawo", "lewo", "gora", "dol"].includes(kierunek)) {
        console.log('Wpisz idz("prawo"), idz("lewo"), idz("gora") albo idz("dol").');
        return false;
    }
    const cel = Przejscia[GameState.RoomID] && Przejscia[GameState.RoomID][kierunek];
    if (!cel) {
        console.log("Nie ma otwartego przejscia w tym kierunku.");
        return false;
    }
    if (cel === 4 && !GameState.OfficeOpen) {
        console.log('Biuro jest zamknięte. Użyj akcja("OtworzBiuro") przy drzwiach.');
        return false;
    }
    GameState.RoomID = cel;
    console.log("Przechodzisz do pokoju " + NazwyPokoi[cel] + ".");
    if (cel === 7 && GameState.Tank) console.log('W pokoju stoi czołg. Ucieczka wymaga kluczyków do czołgu.');
    ZuzyjEnergie();
    return true;
}
function prawo() { idz("prawo"); }
function lewo() { idz("lewo"); }
function gora() { idz("gora"); }
function dol() { idz("dol"); }

function CzyMapa(mapa, przejscia) {
    if (!Array.isArray(mapa) || mapa.length !== 3) return false;
    let pokoje = [];
    for (const wiersz of mapa) {
        if (!Array.isArray(wiersz) || wiersz.length !== 3) return false;
        for (const id of wiersz) {
            if (!Number.isInteger(id) || id < 0 || id > 7) return false;
            pokoje.push(id);
        }
    }
    for (let id = 1; id <= 7; id++) {
        if (pokoje.filter(p => p === id).length !== 1) return false;
    }
    if (mapa[1][1] === 4 || !przejscia || typeof przejscia !== "object" || Array.isArray(przejscia)) return false;
    const kierunki = {gora: [-1, 0, "dol"], dol: [1, 0, "gora"], lewo: [0, -1, "prawo"], prawo: [0, 1, "lewo"]};
    for (let id = 1; id <= 7; id++) {
        if (!przejscia[id] || typeof przejscia[id] !== "object" || Array.isArray(przejscia[id])) return false;
    }
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const id = mapa[r][c];
            if (!id) continue;
            for (const kierunek of Object.keys(przejscia[id])) {
                if (!Object.hasOwn(kierunki, kierunek)) return false;
                const [dr, dc, odwrotny] = kierunki[kierunek];
                const cel = przejscia[id][kierunek];
                if (!Number.isInteger(cel) || cel < 1 || cel > 7 || !mapa[r + dr]
                    || mapa[r + dr][c + dc] !== cel || przejscia[cel][odwrotny] !== id) return false;
            }
        }
    }
    for (const bezBiura of [false, true]) {
        const odwiedzone = [1];
        for (let i = 0; i < odwiedzone.length; i++) {
            for (const cel of Object.values(przejscia[odwiedzone[i]])) {
                if (bezBiura && cel === 4) continue;
                if (!odwiedzone.includes(cel)) odwiedzone.push(cel);
            }
        }
        if (odwiedzone.length !== (bezBiura ? 6 : 7)) return false;
    }
    return true;
}
