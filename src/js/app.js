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

