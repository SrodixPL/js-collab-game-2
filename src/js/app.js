
//YAY nowy branch O_o #2
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


