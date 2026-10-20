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