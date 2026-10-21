const Version = 0.1
const Authors = ["Srodix", "", ""]

const GameState = {
    RoomID: 1,
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
    GeneratorFire: true,
    Energy: 20,
    Ended: false,
    Won: false,
    OfficeOpen: false,
    Tank: false,
    TankKeyAvailable: false
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
        GeneratorFire: GameState.GeneratorFire,
        Energy: GameState.Energy,
        Ended: GameState.Ended,
        Won: GameState.Won,
        OfficeOpen: GameState.OfficeOpen,
        Tank: GameState.Tank,
        TankKeyAvailable: GameState.TankKeyAvailable,
        Mapa: Mapa,
        Przejscia: Przejscia
    };

    return JSON.stringify({ wersja: 2, stan: stan });
}

function Import(tekst) {
    function Odmow(komunikat) {
        console.log("Import odrzucony: " + komunikat);
        return false;
    }

    if (typeof tekst !== "string" || tekst.trim() === "") {
        return Odmow("nie podano tekstu (lub anulowano okno).");
    }

    let pakiet;
    try {
        pakiet = JSON.parse(tekst);
    } catch (blad) {
        return Odmow("tekst nie jest poprawnym JSON-em.");
    }

    if (pakiet === null || typeof pakiet !== "object" || Array.isArray(pakiet)) {
        return Odmow("pakiet musi być obiektem.");
    }
    if (pakiet.wersja !== 2) {
        return Odmow("nieobsługiwana wersja zapisu.");
    }

    const kandydat = pakiet.stan;
    if (kandydat === null || typeof kandydat !== "object" || Array.isArray(kandydat)) {
        return Odmow("pole stan musi być obiektem.");
    }
    if (!Number.isInteger(kandydat.RoomID) || kandydat.RoomID < 1 || kandydat.RoomID > 7) {
        return Odmow("RoomID musi być liczbą całkowitą od 1 do 7.");
    }
    if (!Number.isInteger(kandydat.Energy) || kandydat.Energy < 0 || kandydat.Energy > 20) {
        return Odmow("Energy musi być liczbą całkowitą od 0 do 20.");
    }
    if (typeof kandydat.Power !== "boolean") {
        return Odmow("Power musi mieć wartość true albo false.");
    }

    const przedmioty = kandydat.Items;
    if (przedmioty === null || typeof przedmioty !== "object" || Array.isArray(przedmioty)) {
        return Odmow("Items musi być obiektem.");
    }
    const nazwyPrzedmiotow = ["Key", "Keycard", "Fuse", "TKey"];
    for (let i = 0; i < nazwyPrzedmiotow.length; i++) {
        if (typeof przedmioty[nazwyPrzedmiotow[i]] !== "boolean") {
            return Odmow("każdy przedmiot w Items musi mieć wartość true albo false.");
        }
    }

    if (!przedmioty.Bucket || typeof przedmioty.Bucket.Has !== "boolean" || typeof przedmioty.Bucket.Filled !== "boolean"
        || (przedmioty.Bucket.Filled && !przedmioty.Bucket.Has)) {
        return Odmow("niepoprawny stan wiadra.");
    }
    // Starsze zapisy nie miały pożaru; działający generator pozostaje ugaszony.
    if (kandydat.GeneratorFire === undefined) kandydat.GeneratorFire = !kandydat.Power;
    const polaLogiczne = ["GeneratorFire", "Ended", "Won", "OfficeOpen", "Tank", "TankKeyAvailable"];
    for (const pole of polaLogiczne) {
        if (typeof kandydat[pole] !== "boolean") return Odmow("niepoprawne pole " + pole);
    }
    if (kandydat.Ended !== (kandydat.Won || kandydat.Energy === 0)
        || (kandydat.Power && przedmioty.Fuse)
        || (kandydat.Power && kandydat.GeneratorFire)
        || ((przedmioty.Keycard || kandydat.RoomID === 4) && !kandydat.OfficeOpen)
        || (przedmioty.TKey && !kandydat.TankKeyAvailable)) return Odmow("sprzeczny stan gry.");
    if (kandydat.Won && !(kandydat.RoomID === 1 && przedmioty.Keycard && kandydat.Power)
        && !(kandydat.RoomID === 7 && kandydat.Tank && przedmioty.TKey)) return Odmow("brak warunków wygranej.");
    if (!CzyMapa(kandydat.Mapa, kandydat.Przejscia)) return Odmow("niepoprawna mapa lub przejścia.");

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

    for (const pole of polaLogiczne) GameState[pole] = kandydat[pole];
    Mapa = kandydat.Mapa;
    Przejscia = kandydat.Przejscia;
    console.log("Import zakończony.");
    return true;
}

function Akcja(akc)
{
    let Bonus = 0;
    if(GameState.Ended || GameState.Energy <= 0)
    {
        console.log("Nie masz energi na tą czynność.");
        return;

    }

    switch(akc){
        case "Ucieknij":
            if(GameState.RoomID === 7 && GameState.Tank && GameState.Items.TKey)
            {
                console.log("Wyjeżdżasz czołgiem przez ścianę!");
                End(true);
            }
            else if(GameState.RoomID === 1 && GameState.Items.Keycard && GameState.Power)
            {
                End(true);
            }
            else
            {
                console.log("Wyjście w Start wymaga karty i zasilania. Czołg w pustym pokoju wymaga kluczyków.");
                return;
            }
            break;
        case "OtworzBiuro":
            if(GameState.OfficeOpen || !Object.values(Przejscia[GameState.RoomID]).includes(4))
            {
                console.log("Nie ma tu zamkniętych drzwi biura do otwarcia.");
                return;
            }
            if(!GameState.Items.Key)
            {
                console.log("Potrzebujesz klucza z kantorka.");
                return;
            }
            GameState.OfficeOpen = true;
            console.log("Otwierasz biuro.");
            break;
        case "PodniesKluczyki":
            if(GameState.RoomID !== 3 || !GameState.TankKeyAvailable || GameState.Items.TKey)
            {
                console.log("Nie ma tu kluczyków do wzięcia.");
                return;
            }
            GameState.Items.TKey = true;
            console.log("Podnosisz kluczyki do czołgu.");
            break;
        case "PodniesKarte":
            if(GameState.RoomID !== 4 || GameState.Items.Keycard)
                {
                    console.log("Posiadasz już kartę.")
                    return;
                }
            GameState.Items.Keycard = true;
            console.log("Podnosisz kartę.")
        break;
        case "PodniesWiadro":
            if(GameState.RoomID !== 3 || GameState.Items.Bucket.Has)
                {
                    console.log("Posiadasz już wiadro.")
                    return;
                }
            GameState.Items.Bucket.Has = true;
            console.log("Podnosisz wiadro.")
            break;
        case "PodniesBezpiecznik":
            if(GameState.RoomID !== 3 || GameState.Items.Fuse || GameState.Power)
                {
                    console.log("Posiadasz już bezpiecznik.")
                    return;
                }
            GameState.Items.Fuse = true;
            console.log("Podnosisz bezpiecznik.")
            break;
        case "PodniesKlucz":
            if(GameState.RoomID != 3 || GameState.Items.Key)
            {
                console.log("Nie ma tutaj klucza do wzięcia.");
                return;
            }
            GameState.Items.Key = true;
            console.log("Podnosisz klucz.")
            break;
        case "WlaczGenerator":
            if(GameState.Power == true || GameState.RoomID != 2)
            {
                console.log("Nie ma tu generatora do włączenia.");
                return;
            }
            if(GameState.GeneratorFire)
            {
                console.log("Najpierw ugaś generatory pełnym wiadrem wody: UzyjWiadro.");
                return;
            }
            if(GameState.Items.Fuse != true)
            {
                console.log("Nie posiadasz bezpiecznika.");
                return;
            }
            GameState.Power = true;
            GameState.Items.Fuse = false;
            console.log("Włączasz generator.");

            break;
        case "UzyjWiadro":
            if(GameState.RoomID !== 2 || !GameState.GeneratorFire)
            {
                console.log("Nie ma tu generatorów do ugaszenia.");
                return;
            }
            if(!GameState.Items.Bucket.Has || !GameState.Items.Bucket.Filled)
            {
                console.log("Potrzebujesz pełnego wiadra wody.");
                return;
            }
            GameState.GeneratorFire = false;
            GameState.Items.Bucket.Filled = false;
            console.log("Gasisz generatory. Możesz teraz włączyć zasilanie z bezpiecznikiem.");
            break;
        case "NapelnijWiadro":
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
            GameState.Items.Bucket.Filled = true;
            console.log("Wypełniłeś wiadro.");
            break;
        case "Zjedz":
            if(GameState.RoomID !== 6)
            {
                console.log("Jedzenie jest tylko w stołówce.");
                return;
            }
            let Dish = Math.floor(Math.random() * 3);
            if(Dish==0)
            {
                Bonus = Math.floor(Math.random() * 6) - 1;
                console.log("Wypiłeś energola.");
            }else if(Dish == 1) {Bonus = Math.floor(Math.random() * 4) - 2; console.log("Zjadłeś ser pleśniowy."); }
            else if(Dish == 2) {Bonus = Math.floor(Math.random() * 2); console.log("Zjadłeś starą kajzerke.");}
            GameState.Energy += Bonus;
            console.log(`Twoja energia zmieniła się o ${Bonus}.`);
            break;
        default:
            console.log("Nieznana akcja. Wpisz pomoc().");
            return;
    }
    ZuzyjEnergie();
    return true;
}


function Start() {
    GameState.RoomID = 1;
    GameState.Items = {
        Key: false,
        Bucket: { Has: false, Filled: false },
        Keycard: false,
        Fuse: false,
        TKey: false
    };
    GameState.Power = false;
    GameState.GeneratorFire = true;
    GameState.Energy = 20;
    GameState.Ended = false;
    GameState.Won = false;
    GameState.OfficeOpen = false;
    GameState.Tank = Math.random() < 0.05;
    GameState.TankKeyAvailable = Math.random() < 0.1;
    GenerujMape();

}

function End(won) {
    GameState.Ended = true;
    GameState.Won = won;
    console.log(won ? "Wygrana! " : "Przegrana! ", "Wpisz start() aby zagrac ponownie!")
}

function Reset() {
    console.log("Gra zrestartowana!")
    Start()
}


function ZuzyjEnergie() {
    GameState.Energy = Math.max(0, Math.min(20, GameState.Energy - 1));
    if(GameState.Energy === 0 && !GameState.Ended) End(false);
}


function DostepneAkcje() {
    const akcje = [];
    const {RoomID: pokoj, Items: rzeczy} = GameState;
    if (GameState.Ended) return akcje;
    if (pokoj === 3) {
        if (!rzeczy.Key) akcje.push(["PodniesKlucz", "klucz"]);
        if (!rzeczy.Bucket.Has) akcje.push(["PodniesWiadro", "wiadro"]);
        if (!rzeczy.Fuse && !GameState.Power) akcje.push(["PodniesBezpiecznik", "bezpiecznik"]);
        if (GameState.TankKeyAvailable && !rzeczy.TKey) akcje.push(["PodniesKluczyki", "kluczyki do czołgu"]);
    }
    if (pokoj === 4 && !rzeczy.Keycard) akcje.push(["PodniesKarte", "karta dostępu"]);
    if (!GameState.OfficeOpen && rzeczy.Key && Object.values(Przejscia[pokoj]).includes(4)) akcje.push(["OtworzBiuro"]);
    if (pokoj === 2 && GameState.GeneratorFire && rzeczy.Bucket.Has && rzeczy.Bucket.Filled) akcje.push(["UzyjWiadro"]);
    if (pokoj === 2 && !GameState.Power && !GameState.GeneratorFire && rzeczy.Fuse) akcje.push(["WlaczGenerator"]);
    if (pokoj === 5 && rzeczy.Bucket.Has && !rzeczy.Bucket.Filled) akcje.push(["NapelnijWiadro"]);
    if (pokoj === 6) akcje.push(["Zjedz"]);
    if ((pokoj === 1 && rzeczy.Keycard && GameState.Power) || (pokoj === 7 && GameState.Tank && rzeczy.TKey)) akcje.push(["Ucieknij"]);
    return akcje;
}

function Rozejrzyj() {
    console.log("Obecny pokój: " + NazwyPokoi[GameState.RoomID] + ".");
    const akcje = DostepneAkcje();
    const przedmioty = akcje.filter(([, przedmiot]) => przedmiot).map(([, przedmiot]) => przedmiot);
    console.log("Przedmioty: " + (przedmioty.join(", ") || "brak") + ".");
    if (GameState.RoomID === 2) console.log(GameState.GeneratorFire ? "Generatory płoną. Ugaś je pełnym wiadrem wody (UzyjWiadro)." : GameState.Power ? "Generator działa." : "Generator wymaga bezpiecznika.");
    if (GameState.RoomID === 5) console.log("Jest tu kran z wodą.");
    if (GameState.RoomID === 6) console.log("Jest tu jedzenie.");
    if (GameState.RoomID === 7 && GameState.Tank) console.log("Stoi tu czołg wymagający kluczyków.");
    console.log("Wyjścia: " + Object.entries(Przejscia[GameState.RoomID]).map(([k, id]) => k + " → " + NazwyPokoi[id] + (id === 4 && !GameState.OfficeOpen ? " (zamknięte)" : "")).join(", "));
    console.log("Możliwe akcje: " + (akcje.map(([nazwa]) => 'akcja("' + nazwa + '")').join(", ") || "brak") + ".");
    if (GameState.Ended) console.log((GameState.Won ? "Wygrana!" : "Przegrana!") + " Wpisz start(), aby zagrać ponownie.");
}

function Wykonaj(polecenie) {
    console.clear();
    polecenie();
    WyswietlMape();
    console.log("Energia: " + GameState.Energy + "/20.");
    Rozejrzyj();
}
function Pomoc() {
    console.log('start(), reset(), mapa(), rozejrzyj(), energia(), status(), pomoc(), eksportuj(), importuj(tekst)');
    console.log('idz("prawo"/"lewo"/"gora"/"dol"), prawo(), lewo(), gora(), dol()');
    console.log('Akcje dostępne w pokoju są wypisane poniżej.');
}
function start() { Wykonaj(() => { Start(); }); }
function reset() { start(); }
function idz(kierunek) { Wykonaj(() => Idz(kierunek)); }
function akcja(nazwa) { Wykonaj(() => Akcja(nazwa)); }
function mapa() { Wykonaj(() => {}); }
function rozejrzyj() { Wykonaj(() => {}); }
function energia() { Wykonaj(() => console.log("Energia: " + GameState.Energy + "/20.")); }
function status() { Wykonaj(() => console.log(JSON.stringify(GameState, null, 2))); }
function pomoc() { Wykonaj(Pomoc); }
function eksportuj() { Wykonaj(() => console.log(Export())); }
function importuj(tekst) { Wykonaj(() => Import(tekst)); }
const gra = { idz, akcja, start, reset, mapa, rozejrzyj, energia, status, pomoc, eksportuj, importuj };
start();
