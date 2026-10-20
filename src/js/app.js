const GameState = {
    RoomID: 0,
    Items: {
        Key: false,
        Bucket: false,
        Keycard: false,
        Fuse: false,
        TKey: false
    },
    Power: false,
    Energy: 20
}

const FoodItems = { // Do rozwiniecia
    1: ["napój energetyczny", -1, 4],
    2: ["ser pleśniowy", -2, 1],
    3: ["stara kajzerka", 0, 1]
}

function Export() { // JSON Export

}

function Import() { // JSON Import

}



//YAY nowy branch O_o
function akcja(akc)
{
    switch(akc){
        case "Escape":
            if((GameState.Items.Keycard && GameState.Power) || GameState.Items.TKey)
            {
                //Wygrana();
            }

            if()
            if(Keycard == false)
            {
                console.log("Nie posiadasz karty.");
                return;
            }
            if(Power == false)
            {
                console.log("Drzwi bez energii się ruszą.");
                return;
            }
        break;
        case "PickUpKeycard":
            if(Keycard)
                {
                    console.log("Posiadasz już kartę.")
                    return;
                }    
            GameState.Items.Keycard = true;
            console.log("Podnosisz kartę.")
        break;
        case "PickUpBucket":
            if(GameState.Items.Bucket)
                {
                    console.log("Posiadasz już wiadro.")
                    return;
                }    
            GameState.Items.Bucket = true;
            console.log("Podnosisz wiadro.")
            break;
        case "PickUpFuse":
            if(GameState.Items.Fuse)
                {
                    console.log("Posiadasz już bezpiecznik.")
                    return;
                }    
            GameState.Items.fuse = true;
            console.log("Podnosisz bezpiecznik.")
            break;    
        case "PickUpKey":
            if(GameState.Items.Bucket)
                {
                    console.log("Posiadasz już klucz.")
                    return;
                }    
            GameState.Items.Key = true;
            console.log("Podnosisz klucz.")
            break;
    }
}let Mapa = [
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