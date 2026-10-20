//YAY nowy branch O_o #2
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
    ["ser pleśniowy", -3, 1],
    ["stara kajzerka", 0, 1]
}


