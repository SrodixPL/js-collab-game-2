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
const Version = 0.1
const Authors = ["Srodix", "", ""]

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

function Export() {
    const stan = {
        RoomID: GameState.RoomID,
        Items: {
            Key: GameState.Items.Key,
            Bucket: GameState.Items.Bucket,
            Keycard: GameState.Items.Keycard,
            Fuse: GameState.Items.Fuse,
            TKey: GameState.Items.TKey
        },
        Power: GameState.Power,
        Energy: GameState.Energy
    };

    return JSON.stringify({ wersja: 1, stan: stan });
}

function Import(tekst) {
    function odmow(komunikat) {
        console.log("Import odrzucony: " + komunikat);
        return false;
    }

    if (typeof tekst !== "string" || tekst.trim() === "") {
        return odmow("nie podano tekstu (lub anulowano okno).");
    }

    let pakiet;
    try {
        pakiet = JSON.parse(tekst);
    } catch (blad) {
        return odmow("tekst nie jest poprawnym JSON-em.");
    }

    if (pakiet === null || typeof pakiet !== "object" || Array.isArray(pakiet)) {
        return odmow("pakiet musi być obiektem.");
    }
    if (pakiet.wersja !== 1) {
        return odmow("nieobsługiwana wersja zapisu.");
    }

    const kandydat = pakiet.stan;
    if (kandydat === null || typeof kandydat !== "object" || Array.isArray(kandydat)) {
        return odmow("pole stan musi być obiektem.");
    }
    if (!Number.isInteger(kandydat.RoomID) || kandydat.RoomID < 0 || kandydat.RoomID > 7) {
        return odmow("RoomID musi być liczbą całkowitą od 0 do 7.");
    }
    if (!Number.isInteger(kandydat.Energy) || kandydat.Energy < 0 || kandydat.Energy > 20) {
        return odmow("Energy musi być liczbą całkowitą od 0 do 20.");
    }
    if (typeof kandydat.Power !== "boolean") {
        return odmow("Power musi mieć wartość true albo false.");
    }

    const przedmioty = kandydat.Items;
    if (przedmioty === null || typeof przedmioty !== "object" || Array.isArray(przedmioty)) {
        return odmow("Items musi być obiektem.");
    }
    const nazwyPrzedmiotow = ["Key", "Bucket", "Keycard", "Fuse", "TKey"];
    for (let i = 0; i < nazwyPrzedmiotow.length; i++) {
        if (typeof przedmioty[nazwyPrzedmiotow[i]] !== "boolean") {
            return odmow("każdy przedmiot w Items musi mieć wartość true albo false.");
        }
    }

    const nowyStan = {
        RoomID: kandydat.RoomID,
        Items: {
            Key: przedmioty.Key,
            Bucket: przedmioty.Bucket,
            Keycard: przedmioty.Keycard,
            Fuse: przedmioty.Fuse,
            TKey: przedmioty.TKey
        },
        Power: kandydat.Power,
        Energy: kandydat.Energy
    };

    GameState.RoomID = nowyStan.RoomID;
    GameState.Items = nowyStan.Items;
    GameState.Power = nowyStan.Power;
    GameState.Energy = nowyStan.Energy;

    console.log("Import zakończony.");
    return true;
}

function akcja(akc)
{
    switch(akc){
        case "Escape":
            if(Keycard && Power)
            {
                //Wygrana();
            }
            if((GameState.Items.Keycard && GameState.Power) || GameState.Items.TKey)
            {
                //Wygrana();
            }

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
            //Keycard = true;
            console.log("Podnosisz kartę.")
        break;
    }
}
