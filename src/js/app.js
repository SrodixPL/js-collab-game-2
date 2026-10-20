const Version = 0.1
const Authors = ["Srodix", "", ""]

const GameState = {
    RoomID: 0,
    Items: {
        Key: false,
        Bucket: {
            Has: false,
            Filled: false
        },
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
    let Bonus = 0;
    if(GameState.Energy <= 0)
    {
        console.log("Nie masz energi na tą czynność.");
        return;

    }

    switch(akc){
        case "Escape":
            if((GameState.Items.Keycard && GameState.Power && GameState.RoomID == 1) || GameState.Items.TKey)
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
            if(GameState.RoomID != 3 || GameState.Items.key)
            {
                console.log("Nie ma tutaj klucza do wzięcia.");
                return;
            }
            GameState.Items.Key = true;
            console.log("Podnosisz klucz.")
            break;
        case "GenOn":
            if(GameState.Power == true || GameState.RoomID != 2)
            {
                console.log("Nie ma tu generatora do włączenia.");
                return;
            }
            if(GameState.Items.fuse != true)
            {
                console.log("Nie posiadasz bezpiecznika.");
                return;
            }
            GameState.Power == true;
            GameState.Items.fuse == false;
           
            break;
        case "FillUp":
            if(GameState.RoomID != 5)
            {
                console.log("Nie masz tutaj dostepu do wody.");
                return;
            }
            if(GameState.Items.Bucket.Has == false || GameState.Items.Bucket.Filled)
            {
                console.log("Co ty chcesz wypełnić? Nie masz pustego wiadra.");
                return;
            }
            GameState.Items.Bucket.Filled == true;
            console.log("Wypełniłeś wiadro.");
            break;
        case "GetFood":
            let Dish = Math.floor(Math.random() * 3);
            if(Dish==0)
            {
                Bonus = Math.floor(Math.random() * 5) - 1;
                console.log("Wypiłeś energola.");
            }else if(Dish == 1) {Bonus = Math.floor(Math.random() * 5) - 3; console.log("Zjadłeś ser pleśniowy."); }
            else if(Dish == 2) {Bonus = Math.floor(Math.random() * 1); console.log("Zjadłeś starą kajzerke.");} 
            GameState.Energy += Bonus;
            console.log(`Twoja energia zmieniła się o ${Bonus}.`);
            break;
            
    }
}


function Start() {

}

function End(won) {
    console.log(won ? "Wygrana! " : "Przegrana! ", "Wpisz start() aby zagrac ponownie!")
}

function Reset() {
    console.log("Gra zrestartowana!")
    Start()
}

