const roomNames = {0: "", 1: "Start", 2: "Generatory", 3: "Kantorek", 4: "Biuro", 5: "Łazienka", 6: "Stołówka", 7: "Pusty pokój"};

let gameMap = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let transitions = {};

function shuffle(list) {
    for (let rowIndex = list.length - 1; rowIndex > 0; rowIndex--) {
        const columnIndex = Math.floor(Math.random() * (rowIndex + 1));
        [list[rowIndex], list[columnIndex]] = [list[columnIndex], list[rowIndex]];
    }
}

function generateMap() {
    gameMap = Array.from({ length: 3 }, () => [0, 0, 0]);

    let cells = [];

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
            if (!(rowIndex === 2 && columnIndex === 2)) {
                cells.push([rowIndex, columnIndex]);
            }
        }
    }

    shuffle(cells);

    let roomIds = [1, 2, 3, 4, 5, 6, 7];
    shuffle(roomIds);

    let [startRow, startColumn] = cells[0];
    gameMap[startRow][startColumn] = 1;

    let remainingRoomIds = roomIds.filter(n => n !== 1);

    for (let cellIndex = 1; cellIndex < 7; cellIndex++) {
        const [rowIndex, columnIndex] = cells[cellIndex];
        gameMap[rowIndex][columnIndex] = remainingRoomIds[cellIndex - 1];
    }

    if (gameMap[1][1] === 4) {
        return generateMap();
    }

    transitions = {};
    const neighbors = {};
    for (const roomId of remainingRoomIds.concat(1)) neighbors[roomId] = [];
    const edges = [];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
            const roomId = gameMap[rowIndex][columnIndex];
            if (!roomId) continue;
            if (columnIndex < 2 && gameMap[rowIndex][columnIndex + 1]) edges.push([roomId, gameMap[rowIndex][columnIndex + 1]]);
            if (rowIndex < 2 && gameMap[rowIndex + 1][columnIndex]) edges.push([roomId, gameMap[rowIndex + 1][columnIndex]]);
        }
    }
    const visited = new Set([1]);
    while (visited.size < 7) {
        const candidates = edges.filter(([a, b]) => visited.has(a) !== visited.has(b));
        const withoutOffice = candidates.filter(([a, b]) => a !== 4 && b !== 4);
        if (visited.size < 6) {
            if (withoutOffice.length === 0) return generateMap();
            candidates.splice(0, candidates.length, ...withoutOffice);
        }
        if (candidates.length === 0) return generateMap();
        const [a, b] = candidates[Math.floor(Math.random() * candidates.length)];
        neighbors[a].push(b);
        neighbors[b].push(a);
        visited.add(a);
        visited.add(b);
        edges.splice(edges.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a)), 1);
    }
    for (const [a, b] of edges) {
        if (Math.random() < 0.3) {
            neighbors[a].push(b);
            neighbors[b].push(a);
        }
    }
    const directions = [["gora", -1, 0], ["dol", 1, 0], ["lewo", 0, -1], ["prawo", 0, 1]];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
            const roomId = gameMap[rowIndex][columnIndex];
            if (!roomId) continue;
            transitions[roomId] = {};
            for (const [name, deltaRow, deltaColumn] of directions) {
                const nextRow = rowIndex + deltaRow, nextColumn = columnIndex + deltaColumn;
                if (nextRow >= 0 && nextRow < 3 && nextColumn >= 0 && nextColumn < 3 && neighbors[roomId].includes(gameMap[nextRow][nextColumn])) {
                    transitions[roomId][name] = gameMap[nextRow][nextColumn];
                }
            }
        }
    }

}

function displayMap() {
    const labels = Object.fromEntries(Object.entries(roomNames).map(([roomId, name]) =>
        [roomId, name + (Number(roomId) === gameState.roomId ? "*" : "")]
    ));
    const labelWidth = Math.max(...Object.values(labels).map(label => label.length));
    const cellWidth = labelWidth + 4;
    const topBorder = "┌" + "─".repeat(labelWidth + 2) + "┐";
    const bottomBorder = "└" + "─".repeat(labelWidth + 2) + "┘";

    for (let rowIndex = 0; rowIndex < gameMap.length; rowIndex++) {
        const row = gameMap[rowIndex];
        console.log(row.map(() => topBorder).join("   "));
        console.log(row.map((roomId, columnIndex) => {
            const cell = "│ " + labels[roomId].padEnd(labelWidth) + " │";
            return cell + (columnIndex < row.length - 1
                ? (transitions[roomId]?.prawo ? "───" : "   ") : "");
        }).join(""));
        console.log(row.map(() => bottomBorder).join("   "));
        if (rowIndex < gameMap.length - 1) {
            console.log(row.map(roomId => {
                const middle = Math.floor(cellWidth / 2);
                return transitions[roomId]?.dol
                    ? " ".repeat(middle) + "│" + " ".repeat(cellWidth - middle - 1)
                    : " ".repeat(cellWidth);
            }).join("   "));
        }
    }
}

function moveTo(direction) {
    if (gameState.ended) {
        console.log("Gra zakończona. Wpisz rozpocznij().");
        return false;
    }
    if (!["prawo", "lewo", "gora", "dol"].includes(direction)) {
        console.log('Wpisz idz("prawo"), idz("lewo"), idz("gora") albo idz("dol").');
        return false;
    }
    const target = transitions[gameState.roomId] && transitions[gameState.roomId][direction];
    if (!target) {
        console.log("Nie ma otwartego przejścia w tym kierunku.");
        return false;
    }
    if (target === 4 && !gameState.officeOpen) {
        console.log('Biuro jest zamknięte. Użyj akcja("otworzBiuro") przy drzwiach.');
        return false;
    }
    gameState.roomId = target;
    console.log("Przechodzisz do pokoju " + roomNames[target] + ".");
    if (target === 7 && gameState.tank) console.log('W pokoju stoi czołg. Ucieczka wymaga kluczyków do czołgu.');
    spendEnergy();
    return true;
}

function isValidMap(map, paths) {
    if (!Array.isArray(map) || map.length !== 3) return false;
    let rooms = [];
    for (const row of map) {
        if (!Array.isArray(row) || row.length !== 3) return false;
        for (const roomId of row) {
            if (!Number.isInteger(roomId) || roomId < 0 || roomId > 7) return false;
            rooms.push(roomId);
        }
    }
    for (let roomId = 1; roomId <= 7; roomId++) {
        if (rooms.filter(p => p === roomId).length !== 1) return false;
    }
    if (map[1][1] === 4 || !paths || typeof paths !== "object" || Array.isArray(paths)) return false;
    const directions = {gora: [-1, 0, "dol"], dol: [1, 0, "gora"], lewo: [0, -1, "prawo"], prawo: [0, 1, "lewo"]};
    for (let roomId = 1; roomId <= 7; roomId++) {
        if (!paths[roomId] || typeof paths[roomId] !== "object" || Array.isArray(paths[roomId])) return false;
    }
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
            const roomId = map[rowIndex][columnIndex];
            if (!roomId) continue;
            for (const direction of Object.keys(paths[roomId])) {
                if (!Object.hasOwn(directions, direction)) return false;
                const [dr, dc, opposite] = directions[direction];
                const target = paths[roomId][direction];
                if (!Number.isInteger(target) || target < 1 || target > 7 || !map[rowIndex + dr]
                    || map[rowIndex + dr][columnIndex + dc] !== target || paths[target][opposite] !== roomId) return false;
            }
        }
    }
    for (const withoutOffice of [false, true]) {
        const visited = [1];
        for (let rowIndex = 0; rowIndex < visited.length; rowIndex++) {
            for (const target of Object.values(paths[visited[rowIndex]])) {
                if (withoutOffice && target === 4) continue;
                if (!visited.includes(target)) visited.push(target);
            }
        }
        if (visited.length !== (withoutOffice ? 6 : 7)) return false;
    }
    return true;
}
