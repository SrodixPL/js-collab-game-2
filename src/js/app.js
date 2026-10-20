
function akcja(akc)
{
    switch(akc){
        case "Escape":
            if(Keycard && Power)
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

/* Items

- Bezpiecznik
- Klucz do biura
- Wiadro
- Karta
- Kluczyki do czolgu (zamiast jedzenia w stolowce)

*/

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
    ["napój energetyczny", -1, 4],
    ["ser pleśniowy", -2, 1],
    ["stara kajzerka", 0, 1]
}


