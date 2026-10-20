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

    // Tworzy losowe, ale spojne przejscia tylko miedzy pokojami obok siebie.
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

    console.table(Mapa);
}

function WyswietlMape() {
    let nazwyPokoi = {
        0: "",
        1: "Start",
        2: "Generatory",
        3: "Kantorek",
        4: "Biuro",
        5: "Lazienka",
        6: "Stolowka",
        7: "Pusty pokoj"
    };

    for (let i = 0; i < Mapa.length; i++) {
        console.log("┌─────────────┐   ┌─────────────┐   ┌─────────────┐");
        console.log(
            "│ " + nazwyPokoi[Mapa[i][0]].padEnd(11) + " │───│ " +
            nazwyPokoi[Mapa[i][1]].padEnd(11) + " │───│ " +
            nazwyPokoi[Mapa[i][2]].padEnd(11) + " │"
        );
        console.log("└─────────────┘   └─────────────┘   └─────────────┘");
        if (i < Mapa.length - 1) {
            console.log("       │                 │                 │       ");
        }
    }
}

function idz(kierunek) {
    if (!["prawo", "lewo", "gora", "dol"].includes(kierunek)) {
        console.log('Wpisz idz("prawo"), idz("lewo"), idz("gora") albo idz("dol").');
        return false;
    }
    const cel = Przejscia[GameState.RoomID] && Przejscia[GameState.RoomID][kierunek];
    if (!cel) {
        console.log("Nie ma otwartego przejscia w tym kierunku.");
        return false;
    }
    GameState.RoomID = cel;
    console.log("Przechodzisz do pokoju " + cel + ".");
    return true;
}
function prawo() { return idz("prawo"); }
function lewo() { return idz("lewo"); }
function gora() { return idz("gora"); }
function dol() { return idz("dol"); }

GenerujMape();
WyswietlMape();