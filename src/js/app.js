let Mapa = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

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


GenerujMape();

WyswietlMape();