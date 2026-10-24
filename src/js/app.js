const version = 0.1
const authors = ["Srodix", "JakBor3k", "DworMat-cmd"]

const gameState = {
    roomId: 1,
    items: {
        key: false,
        bucket: {
            has: false,
            filled: false
        },
        keycard: false,
        fuse: false,
        tankKey: false
    },
    power: false,
    generatorFire: true,
    energy: 20,
    ended: false,
    won: false,
    officeOpen: false,
    tank: false,
    tankKeyAvailable: false
}

const foodItems = {
    1: ["napój energetyczny", -1, 4],
    2: ["ser pleśniowy", -2, 1],
    3: ["stara kajzerka", 0, 1]
}

let titleTimeout = null;
let gameStarted = false;

function serializeState() {
    // Klucze zapisu pozostają historyczne, aby stare pliki postep.json nadal działały.
    const state = {
        RoomID: gameState.roomId,
        Items: {
            Key: gameState.items.key,
            Bucket: {
                Has: gameState.items.bucket.has,
                Filled: gameState.items.bucket.filled
            },
            Keycard: gameState.items.keycard,
            Fuse: gameState.items.fuse,
            TKey: gameState.items.tankKey
        },
        Power: gameState.power,
        GeneratorFire: gameState.generatorFire,
        Energy: gameState.energy,
        Ended: gameState.ended,
        Won: gameState.won,
        OfficeOpen: gameState.officeOpen,
        Tank: gameState.tank,
        TankKeyAvailable: gameState.tankKeyAvailable,
        Mapa: gameMap,
        Przejscia: transitions
    };

    return JSON.stringify({ wersja: 1, stan: state });
}

function importState(text) {
    function reject(message) {
        console.log("Import odrzucony: " + message);
        return false;
    }

    if (typeof text !== "string" || text.trim() === "") {
        return reject("nie podano tekstu (lub anulowano okno).");
    }

    let savePackage;
    try {
        savePackage = JSON.parse(text);
    } catch (error) {
        return reject("tekst nie jest poprawnym JSON-em.");
    }

    if (savePackage === null || typeof savePackage !== "object" || Array.isArray(savePackage)) {
        return reject("pakiet musi być obiektem.");
    }
    if (![1, 2].includes(savePackage.wersja)) {
        return reject("nieobsługiwana wersja zapisu.");
    }

    const candidate = savePackage.stan;
    if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
        return reject("pole stan musi być obiektem.");
    }
    if (!Number.isInteger(candidate.RoomID) || candidate.RoomID < 1 || candidate.RoomID > 7) {
        return reject("RoomID musi być liczbą całkowitą od 1 do 7.");
    }
    if (!Number.isInteger(candidate.Energy) || candidate.Energy < 0 || candidate.Energy > 20) {
        return reject("Energy musi być liczbą całkowitą od 0 do 20.");
    }
    if (typeof candidate.Power !== "boolean") {
        return reject("Power musi mieć wartość true albo false.");
    }

    const items = candidate.Items;
    if (items === null || typeof items !== "object" || Array.isArray(items)) {
        return reject("Items musi być obiektem.");
    }
    const itemNames = ["Key", "Keycard", "Fuse", "TKey"];
    for (let i = 0; i < itemNames.length; i++) {
        if (typeof items[itemNames[i]] !== "boolean") {
            return reject("każdy przedmiot w Items musi mieć wartość true albo false.");
        }
    }

    if (!items.Bucket || typeof items.Bucket.Has !== "boolean" || typeof items.Bucket.Filled !== "boolean"
        || (items.Bucket.Filled && !items.Bucket.Has)) {
        return reject("niepoprawny stan wiadra.");
    }
    // Starsze zapisy nie miały pożaru; działający generator pozostaje ugaszony.
    if (candidate.GeneratorFire === undefined) candidate.GeneratorFire = !candidate.Power;
    const booleanFields = {
        GeneratorFire: "generatorFire",
        Ended: "ended",
        Won: "won",
        OfficeOpen: "officeOpen",
        Tank: "tank",
        TankKeyAvailable: "tankKeyAvailable"
    };
    for (const field of Object.keys(booleanFields)) {
        if (typeof candidate[field] !== "boolean") return reject("niepoprawne pole " + field);
    }
    if (candidate.Ended !== (candidate.Won || candidate.Energy === 0)
        || (candidate.Power && items.Fuse)
        || (candidate.Power && candidate.GeneratorFire)
        || ((items.Keycard || candidate.RoomID === 4) && !candidate.OfficeOpen)
        || (items.TKey && !candidate.TankKeyAvailable)) return reject("sprzeczny stan gry.");
    if (candidate.Won && !(candidate.RoomID === 1 && items.Keycard && candidate.Power)
        && !(candidate.RoomID === 7 && candidate.Tank && items.TKey)) return reject("brak warunków wygranej.");
    if (!isValidMap(candidate.Mapa, candidate.Przejscia)) return reject("niepoprawna mapa lub przejścia.");

    const newState = {
        roomId: candidate.RoomID,
        items: {
            key: items.Key,
            bucket: {
                has: items.Bucket.Has,
                filled: items.Bucket.Filled
            },
            keycard: items.Keycard,
            fuse: items.Fuse,
            tankKey: items.TKey
        },
        power: candidate.Power,
        energy: candidate.Energy
    };

    gameState.roomId = newState.roomId;
    gameState.items = newState.items;
    gameState.power = newState.power;
    gameState.energy = newState.energy;

    for (const [field, stateField] of Object.entries(booleanFields)) gameState[stateField] = candidate[field];
    gameMap = candidate.Mapa;
    transitions = candidate.Przejscia;
    gameStarted = true;
    console.log("Import zakończony.");
    return true;
}

function performAction(actionName)
{
    let bonus = 0;
    if(gameState.ended || gameState.energy <= 0)
    {
        console.log("Nie masz energi na tą czynność.");
        return;

    }

    switch(actionName){
        case "ucieknij":
            if(gameState.roomId === 7 && gameState.tank && gameState.items.tankKey)
            {
                console.log("Wyjeżdżasz czołgiem przez ścianę!");
                endGame(true);
            }
            else if(gameState.roomId === 1 && gameState.items.keycard && gameState.power)
            {
                endGame(true);
            }
            else
            {
                console.log("Wyjście w Start wymaga karty i zasilania. Czołg w pustym pokoju wymaga kluczyków.");
                return;
            }
            break;
        case "otworzBiuro":
            if(gameState.officeOpen || !Object.values(transitions[gameState.roomId]).includes(4))
            {
                console.log("Nie ma tu zamkniętych drzwi biura do otwarcia.");
                return;
            }
            if(!gameState.items.key)
            {
                console.log("Potrzebujesz klucza z kantorka.");
                return;
            }
            gameState.officeOpen = true;
            console.log("Otwierasz biuro.");
            break;
        case "podniesKluczyki":
            if(gameState.roomId !== 3 || !gameState.tankKeyAvailable || gameState.items.tankKey)
            {
                console.log("Nie ma tu kluczyków do wzięcia.");
                return;
            }
            gameState.items.tankKey = true;
            console.log("Podnosisz kluczyki do czołgu.");
            break;
        case "podniesKarte":
            if(gameState.roomId !== 4 || gameState.items.keycard)
                {
                    console.log("Nie ma tu karty do podniesienia.")
                    return;
                }
            gameState.items.keycard = true;
            console.log("Podnosisz kartę.")
        break;
        case "podniesWiadro":
            if(gameState.roomId !== 3 || gameState.items.bucket.has)
                {
                    console.log("Nie ma tu wiadra do podniesienia.")
                    return;
                }
            gameState.items.bucket.has = true;
            console.log("Podnosisz wiadro.")
            break;
        case "podniesBezpiecznik":
            if(gameState.roomId !== 3 || gameState.items.fuse || gameState.power)
                {
                    console.log("Nie ma tu bezpiecznika do podniesienia.")
                    return;
                }
            gameState.items.fuse = true;
            console.log("Podnosisz bezpiecznik.")
            break;
        case "podniesKlucz":
            if(gameState.roomId != 3 || gameState.items.key)
            {
                console.log("Nie ma tutaj klucza do wzięcia.");
                return;
            }
            gameState.items.key = true;
            console.log("Podnosisz klucz.")
            break;
        case "wlaczGenerator":
            if(gameState.power == true || gameState.roomId != 2)
            {
                console.log("Nie ma tu generatora do włączenia.");
                return;
            }
            if(gameState.generatorFire)
            {
                console.log("Najpierw ugaś generatory pełnym wiadrem wody: akcja(\"uzyjWiadro\").");
                return;
            }
            if(gameState.items.fuse != true)
            {
                console.log("Nie posiadasz bezpiecznika.");
                return;
            }
            gameState.power = true;
            gameState.items.fuse = false;
            console.log("Włączasz generator.");

            break;
        case "uzyjWiadro":
            if(gameState.roomId !== 2 || !gameState.generatorFire)
            {
                console.log("Nie ma tu generatorów do ugaszenia.");
                return;
            }
            if(!gameState.items.bucket.has || !gameState.items.bucket.filled)
            {
                console.log("Potrzebujesz pełnego wiadra wody.");
                return;
            }
            gameState.generatorFire = false;
            gameState.items.bucket.filled = false;
            console.log("Gasisz generatory. Możesz teraz włączyć zasilanie z bezpiecznikiem.");
            break;
        case "napelnijWiadro":
            if(gameState.roomId != 5)
            {
                console.log("Nie masz tutaj dostępu do wody.");
                return;
            }
            if(gameState.items.bucket.has == false || gameState.items.bucket.filled)
            {
                console.log("Co ty chcesz wypełnić? Nie masz pustego wiadra.");
                return;
            }
            gameState.items.bucket.filled = true;
            console.log("Wypełniłeś wiadro.");
            break;
        case "zjedz":
            if(gameState.roomId !== 6)
            {
                console.log("Jedzenie jest tylko w stołówce.");
                return;
            }
            let dish = Math.floor(Math.random() * 3);
            if(dish==0)
            {
                bonus = Math.floor(Math.random() * 6) - 1;
                console.log("Wypiłeś energola.");
            }else if(dish == 1) {bonus = Math.floor(Math.random() * 4) - 2; console.log("Zjadłeś ser pleśniowy."); }
            else if(dish == 2) {bonus = Math.floor(Math.random() * 2); console.log("Zjadłeś starą kajzerke.");}
            gameState.energy += bonus;
            console.log(`Twoja energia zmieniła się o ${bonus}.`);
            break;
        default:
            console.log("Nieznana akcja. Wpisz pomoc().");
            return;
    }
    spendEnergy();
    return true;
}


function startGame() {
    gameState.roomId = 1;
    gameState.items = {
        key: false,
        bucket: { has: false, filled: false },
        keycard: false,
        fuse: false,
        tankKey: false
    };
    gameState.power = false;
    gameState.generatorFire = true;
    gameState.energy = 20;
    gameState.ended = false;
    gameState.won = false;
    gameState.officeOpen = false;
    gameState.tank = Math.random() < 0.05;
    gameState.tankKeyAvailable = Math.random() < 0.1;
    generateMap();
    gameStarted = true;
}

function renderAsciiText(text) {
    const font = {
        A: [" ### ", "#   #", "#####", "#   #", "#   #"],
        C: [" ####", "#    ", "#    ", "#    ", " ####"],
        E: ["#####", "#    ", "#### ", "#    ", "#####"],
        I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
        K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
        N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
        O: [" ### ", "#   #", "#   #", "#   #", " ### "],
        R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
        S: [" ####", "#    ", " ### ", "    #", "#### "],
        U: ["#   #", "#   #", "#   #", "#   #", " ### "],
        W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
        Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
        " ": ["     ", "     ", "     ", "     ", "     "]
    };
    return Array.from({ length: 5 }, (_, row) =>
        Array.from(text, letter => font[letter][row]).join(" ")
    ).join("\n");
}

function displayTitle() {
    console.log(renderAsciiText("UCIECZKA Z") + "\n\n" + renderAsciiText("SERWEROWNI"));
    console.log(`A game by: ${authors.join(", ")}`);
}

function renderAsciiBox(lines, width) {
    const border = "+" + "-".repeat(width) + "+";
    const content = lines.map(line => "|" + line.padEnd(width, " ").slice(0, width) + "|");
    return [border, ...content, border].join("\n");
}

function displayAsciiTest() {
    console.log(renderAsciiBox([
        "  .:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:.  ",
        "  *   ASCII RENDER CHECK - 0123456789 - ABCXYZ - <> [] {}   *  ",
        "  .:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:..:*:.  "
    ], 68));
}

function endGame(won) {
    gameState.ended = true;
    gameState.won = won;
    console.log(won ? "Wygrana! " : "Przegrana! ", "Wpisz rozpocznij(), aby zagrać ponownie!")
}

function resetGame() {
    console.log("Gra zrestartowana!")
    startGame()
}


function spendEnergy() {
    gameState.energy = Math.max(0, Math.min(20, gameState.energy - 1));
    if(gameState.energy === 0 && !gameState.ended) endGame(false);
}


function getAvailableActions() {
    const actions = [];
    const { roomId, items } = gameState;
    if (gameState.ended) return actions;
    if (roomId === 3) {
        if (!items.key) actions.push(["podniesKlucz", "klucz"]);
        if (!items.bucket.has) actions.push(["podniesWiadro", "wiadro"]);
        if (!items.fuse && !gameState.power) actions.push(["podniesBezpiecznik", "bezpiecznik"]);
        if (gameState.tankKeyAvailable && !items.tankKey) actions.push(["podniesKluczyki", "kluczyki do czołgu"]);
    }
    if (roomId === 4 && !items.keycard) actions.push(["podniesKarte", "karta dostępu"]);
    if (!gameState.officeOpen && items.key && Object.values(transitions[roomId]).includes(4)) actions.push(["otworzBiuro"]);
    if (roomId === 2 && gameState.generatorFire && items.bucket.has && items.bucket.filled) actions.push(["uzyjWiadro"]);
    if (roomId === 2 && !gameState.power && !gameState.generatorFire && items.fuse) actions.push(["wlaczGenerator"]);
    if (roomId === 5 && items.bucket.has && !items.bucket.filled) actions.push(["napelnijWiadro"]);
    if (roomId === 6) actions.push(["zjedz"]);
    if ((roomId === 1 && items.keycard && gameState.power) || (roomId === 7 && gameState.tank && items.tankKey)) actions.push(["ucieknij"]);
    return actions;
}

function describeRoom() {
    console.log("Obecny pokój: " + roomNames[gameState.roomId] + ".");
    const actions = getAvailableActions();
    const itemNames = actions.filter(([, item]) => item).map(([, item]) => item);
    console.log("Przedmioty: " + (itemNames.join(", ") || "brak") + ".");
    if (gameState.roomId === 2) console.log(gameState.generatorFire ? "Generatory płoną. Ugaś je pełnym wiadrem wody (akcja(\"uzyjWiadro\"))." : gameState.power ? "Generator działa." : "Generator wymaga bezpiecznika.");
    if (gameState.roomId === 5) console.log("Jest tu kran z wodą.");
    if (gameState.roomId === 6) console.log("Jest tu jedzenie.");
    if (gameState.roomId === 7 && gameState.tank) console.log("Stoi tu czołg wymagający kluczyków.");
    console.log("Wyjścia: " + Object.entries(transitions[gameState.roomId]).map(([direction, id]) => direction + " → " + roomNames[id] + (id === 4 && !gameState.officeOpen ? " (zamknięte)" : "")).join(", "));
    console.log("Możliwe akcje: " + (actions.map(([name]) => 'akcja("' + name + '")').join(", ") || "brak") + ".");
    if (gameState.ended) console.log((gameState.won ? "Wygrana!" : "Przegrana!") + " Wpisz rozpocznij(), aby zagrać ponownie.");
}

function renderGame() {
    displayMap();
    console.log("\n\n");
    console.log("Energia: " + gameState.energy + "/20.");
    describeRoom();
}

function runCommand(command, allowBeforeStart = false) {
    if (titleTimeout !== null) {
        console.log("Trwa ekran tytułowy. Gra rozpocznie się za chwilę.");
        return;
    }
    if (!gameStarted && !allowBeforeStart) {
        console.log("Najpierw wpisz rozpocznij(). Pomoc: pomoc().");
        return;
    }

    const output = [];
    const originalLog = console.log;
    let result;
    console.log = (...values) => output.push(values.map(value => typeof value === "string" ? value : String(value)).join(" "));
    try {
        result = command();
    } finally {
        console.log = originalLog;
    }

    console.clear();
    const tmp = output.length ? output.join("\n") : result;
    if (tmp !== undefined && tmp !== true && tmp !== false) console.log(tmp);
    if (gameStarted) renderGame();
}

function printHelp() {
    console.log("Rozpocznij: rozpocznij() | resetuj()")
    console.log("Ruch: idz(\"lewo|prawo|gora|dol\") | lewo(), prawo(), gora(), dol()")
    console.log("Akcja: akcja(\"{NAZWA}\") | Opcje: " + ["ucieknij", "otworzBiuro", "podniesKluczyki", "podniesKarte", "podniesWiadro", "podniesBezpiecznik", "podniesKlucz", "wlaczGenerator", "uzyjWiadro", "napelnijWiadro", "zjedz"].map(name => `'${name}'`).join(", "));
    console.log("Pozostałe: mapa(), rozejrzyj(), energia(), status(), pomoc(), eksportuj(), importuj(\"{ZAPIS}\")")
}

function rozpocznij() {
    if (titleTimeout !== null) clearTimeout(titleTimeout);
    console.clear();
    displayTitle();
    titleTimeout = setTimeout(() => {
        titleTimeout = null;
        startGame();
        console.clear();
        renderGame();
    }, 5000);
}
function resetuj() { runCommand(resetGame, true); }

function idz(direction) { runCommand(() => moveTo(direction)); }
function lewo() { runCommand(() => moveTo("lewo")); }
function prawo() { runCommand(() => moveTo("prawo")); }
function gora() { runCommand(() => moveTo("gora")); }
function dol() { runCommand(() => moveTo("dol")); }

function akcja(actionName) { runCommand(() => performAction(actionName)); }
function mapa() { runCommand(() => {}); }
function rozejrzyj() { runCommand(() => {}); }
function energia() { runCommand(() => {}); }
function status() { runCommand(() => console.log(JSON.stringify(gameState, null, 2))); }
function pomoc() { runCommand(printHelp, true); }
function eksportuj() { runCommand(() => console.log(serializeState())); }
function importuj(text) { runCommand(() => importState(text), true); }
const gra = { rozpocznij, resetuj, idz, lewo, prawo, gora, dol, akcja, mapa, rozejrzyj, energia, status, pomoc, eksportuj, importuj };


// Pierwszy start:
console.log("Ucieczka z serwerowni")
console.log("Aby rozpocząć, wpisz 'rozpocznij()'!\n")
console.log("Gra wymaga szerokiego okna konsoli. Sprawdź szerokość i wygląd znaków w wierszu ASCII poniżej:")
displayAsciiTest();
