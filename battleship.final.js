let addedRowNumber = 3;
let addedColumnNumber = 3;

let addRow = document.getElementById("addRow");
addRow.onclick = function () {
    if (addedRowNumber === 9) {
        return;
    }
    removeInstructions();
    let rows = document.getElementsByTagName("tr");
    let lastRow = rows[rows.length - 1];

    lastRow.removeAttribute("class");

    let lastRowColumns = lastRow.getElementsByTagName("td");

    lastRowColumns[0].setAttribute("class", "letter");
    let br = document.createElement("br");
    lastRowColumns[0].appendChild(br);
    let char = String.fromCharCode(addedRowNumber + 65);
    lastRowColumns[0].appendChild(document.createTextNode(char));

    for (let i = 1; i < lastRowColumns.length - 1; i++) {
        lastRowColumns[i].setAttribute("id", `${addedRowNumber}` + "" + `${i - 1}`);
        lastRowColumns[i].setAttribute("class", "gameBoard");
        lastRowColumns[i].addEventListener("click", clickShot);
    }

    let addedRow = document.createElement("tr");
    addedRow.setAttribute("class", "borderRow");
    let addedColumns = [];
    for (i = 0; i < addedColumnNumber + 2; i++) {
        addedColumns[i] = document.createElement("td");
        addedRow.appendChild(addedColumns[i]);
    }
    let tbody = document.getElementById("tbody");
    tbody.appendChild(addedRow);
    tbody.style.height = `${(addedRowNumber + 3) * 75}` + "px";
    table.style.height = `${(addedRowNumber + 3) * 75}` + "px";
    addedRowNumber++;
}

let addColumn = document.getElementById("addColumn");
addColumn.onclick = function () {
    if (addedColumnNumber === 9) {
        return;
    }
    removeInstructions();
    let rows = document.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        if (i === 0) {
            let span = document.createElement("span");
            rows[i].children[addedColumnNumber + 1].setAttribute("class", "number");
            rows[i].children[addedColumnNumber + 1].appendChild(span);
            span.appendChild(document.createTextNode(`${addedColumnNumber + 1}`));
        }
        if (i > 0 && i < rows.length - 1) {
            rows[i].children[addedColumnNumber + 1].setAttribute("id", `${i - 1}` + "" + `${addedColumnNumber}`);
            rows[i].children[addedColumnNumber + 1].setAttribute("class", "gameBoard");
            rows[i].children[addedColumnNumber + 1].addEventListener("click", clickShot);
        }
        let addedRow = document.createElement("td");
        rows[i].appendChild(addedRow);
    }
    let tbody = document.getElementById("tbody");
    tbody.style.width = `${(addedColumnNumber + 3) * 75}` + "px";
    table.style.width = `${(addedColumnNumber + 3) * 75}` + "px";
    addedColumnNumber++;
}

let atSea = {
    numShips: 0,
    ships: [],
    misses: 0,
    hits: 0,
    numSunk: 0
}

let addShip = document.getElementById("addShip");
addShip.onclick = function () {
    removeInstructions();
    let check;
    let k = 0;

    let gameBoard = document.getElementsByClassName("gameBoard");
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i].classList.contains("done") && !gameBoard[i].classList.contains("ship")) {
            gameBoard[i].classList.remove("done");
            gameBoard[i].style.backgroundColor = "lightblue";
        }
    }

    do {
        let vrtOrHrz = Math.floor(Math.random() * 2);

        let Clm1, Clm2, Clm3, Rw0,
            Rw1, Rw2, Rw3, Clm0,
            location;

        if (vrtOrHrz === 0) {
            Rw0 = Math.floor(Math.random() * addedRowNumber);
            Clm1 = Math.floor(Math.random() * (addedColumnNumber - 2));
            Clm2 = Clm1 + 1;
            Clm3 = Clm2 + 1;
            location = [Rw0 + "" + Clm1, Rw0 + "" + Clm2, Rw0 + "" + Clm3];
        } else {
            Clm0 = Math.floor(Math.random() * addedColumnNumber);
            Rw1 = Math.floor(Math.random() * (addedRowNumber - 2));
            Rw2 = Rw1 + 1;
            Rw3 = Rw2 + 1;
            location = [Rw1 + "" + Clm0, Rw2 + "" + Clm0, Rw3 + "" + Clm0];
        }

        check = false;
        for (let i = 0; i < 3; i++) {
            let shipSection = document.getElementById(location[i]);
            if (shipSection.classList.contains("ship")) {
                check = true;
                k++;
            }
        }
        if (!check) {
            for (let i = 0; i < 3; i++) {
                let shipSection = document.getElementById(location[i]);
                shipSection.classList.add("ship");
            }
            atSea.ships.push({ at: location, destroyed: ["", "", ""], sunk: false });
            atSea.numShips++;
            k = 0;
            check = false;
        }
    }
    while (check === true && k < 10000);

    let shipsOn = document.getElementById("shipsOn");
    shipsOn.innerHTML = `${atSea.numShips}` + " battleship(s) at sea. Three cells long (each)."
    console.log(atSea.ships);
}

let tbody = document.getElementById("tbody");
let missed = document.getElementById("misses");
let hit = document.getElementById("hits");
let shipsLeft = document.getElementById("shipsLeft");

let shoot = document.getElementById("shoot");
shoot.onclick = textShot;
document.onkeydown = function () {
    if (window.event.keyCode == "13") {
        textShot();
    }
}
function textShot() {
    removeInstructions();
    let input = document.getElementById("guess");
    let inputTxt = input.value.toUpperCase().trim();

    let capAlph = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    for (let i = 0; i < 9; i++) {
        if (inputTxt[0] == capAlph[i]) {
            inputTxt = `${i}` + `${parseInt(inputTxt[1]) - 1}`;
        }
    }

    let guess = document.getElementById(inputTxt);

    if (input.value === "") {
        alert("TAKE AIM FIRST: input your target code...")
    }
    if (input.value != "" && guess === null) {
        alert("INVALID SHOT...would miss the whole battle-zone...TRY AGAIN")
    }

    let shipsSunk = document.getElementById("shipsSunk");
    if (guess.classList.contains("ship") && !guess.classList.contains("done")) {
        guess.style.backgroundImage = "url(battleship2.jpg)";
        guess.style.backgroundColor = "red";
        guess.classList.add("done");
        atSea.hits++;
        hit.innerHTML = `Hits: ${atSea.hits}`
        for (let i = 0; i < atSea.ships.length; i++) {
            for (let j = 0; j < 3; j++) {
                if (atSea.ships[i].at[j] === guess.id) {
                    atSea.ships[i].destroyed[j] = "ouch";
                    if (isSunk(atSea.ships[i].destroyed)) {
                        atSea.ships[i].sunk = true;
                        atSea.numSunk++;
                        shipsSunk.innerHTML = `Ships sunk: ${atSea.numSunk}`;
                        shipsLeft.innerHTML = `Ships still afloat: ${atSea.numShips - atSea.numSunk}`;
                        sunkBlue(atSea.ships[i].at);
                        shipsSunk.innerHTML = `Ships sunk: ${numSunk}`;
                        alert(`You sunk ship #${i + 1}! Way to go.`);
                    }
                }
            }
        }
    }
    console.log(atSea.ships);

    if (atSea.numShips != 0 && atSea.hits === atSea.numShips * 3) {
        alert(`Game Complete: your success rate is ${atSea.hits / (atSea.hits + atSea.misses)}` + ". Misses: " + atSea.misses);
        for (j = 0; j < tbody.querySelectorAll("*").length; j++) {
            if (!tbody.querySelectorAll("*")[j].classList.contains("ship")) {
                tbody.querySelectorAll("*")[j].style.backgroundColor = "#06d6a0";
            }
        }
        setTimeout(function () { location.reload(); }, 1500);
    }

    if (!guess.classList.contains("ship") && !guess.classList.contains("done")) {
        guess.style.backgroundColor = "#e63946";
        guess.classList.add("done");
        atSea.misses++;

        missed.innerHTML = `Misses: ${atSea.misses}`
    }

    input.value = "";
}

function clickShot(event) {
    removeInstructions();

    let guess = document.getElementById(event.target.id);

    let shipsSunk = document.getElementById("shipsSunk");
    if (guess.classList.contains("ship") && !guess.classList.contains("done")) {
        guess.style.backgroundImage = "url(battleship2.jpg)";
        guess.style.backgroundColor = "red";
        guess.classList.add("done");
        atSea.hits++;
        hit.innerHTML = `Hits: ${atSea.hits}`
        for (let i = 0; i < atSea.ships.length; i++) {
            for (let j = 0; j < 3; j++) {
                if (atSea.ships[i].at[j] === guess.id) {
                    atSea.ships[i].destroyed[j] = "ouch";
                    if (isSunk(atSea.ships[i].destroyed)) {
                        atSea.ships[i].sunk = true;
                        atSea.numSunk++;
                        shipsSunk.innerHTML = `Ships sunk: ${atSea.numSunk}`;
                        shipsLeft.innerHTML = `Ships still afloat: ${atSea.numShips - atSea.numSunk}`;
                        sunkBlue(atSea.ships[i].at);
                        alert(`You sunk ship #${i + 1}! Way to go.`);
                    }
                }
            }
        }
    }
    console.log(atSea.ships);

    if (atSea.numShips != 0 && atSea.hits === atSea.numShips * 3) {
        alert(`Game Complete: your success rate is ${atSea.hits / (atSea.hits + atSea.misses)}` + ". Misses: " + atSea.misses);
        for (j = 0; j < tbody.querySelectorAll("*").length; j++) {
            if (!tbody.querySelectorAll("*")[j].classList.contains("ship")) {
                tbody.querySelectorAll("*")[j].style.backgroundColor = "#06d6a0";
            }
        }
        setTimeout(function () { location.reload(); }, 2000);
    }


    if (!guess.classList.contains("ship") && !guess.classList.contains("done")) {
        guess.style.backgroundColor = "#e63946";
        guess.classList.add("done");
        atSea.misses++;

        missed.innerHTML = `Misses: ${atSea.misses}`
    }
}

let instructions = document.getElementById("instructions");
let instructionsRemoved = false;
function removeInstructions() {
    if (!instructionsRemoved) {
        instructions.parentNode.removeChild(instructions);
        instructionsRemoved = true;
    }
}

function isSunk(list) {
    if (list[0] == "ouch" && list[1] == "ouch" && list[2] == "ouch") {
        return true;
    }
    return false;
}

function sunkBlue(list) {
    for (let i = 0; i < 3; i++) {
        document.getElementById(list[i]).style.backgroundColor = "darkblue";
    }
}

let reload = document.getElementById("reload");
reload.onclick = function () {
    location.reload();
}



