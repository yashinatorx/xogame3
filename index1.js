const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");

let currentPlayer;
let gameGrid;

const winningPositions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function initGame() {
    currentPlayer = "X";
    gameGrid = ["","","","","","","","",""];

    boxes.forEach((box, index) => {
        box.innerText = "";
        boxes[index].style.pointerEvents = "all";
        box.classList = `box box${index+1}`;
    });

    newGameBtn.classList.remove("active");
    gameInfo.innerText = `Current Player - ${currentPlayer}`;

    // If the computer starts the game, make the first move
    if (currentPlayer === "O") {
        computerMove();
    }
}

initGame();

function swapTurn() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameInfo.innerText = `Current Player - ${currentPlayer}`;
}

function checkGameOver() {
    let winner = "";

    winningPositions.forEach((position) => {
        if (gameGrid[position[0]] !== "" &&
            gameGrid[position[0]] === gameGrid[position[1]] &&
            gameGrid[position[1]] === gameGrid[position[2]]) {

            winner = gameGrid[position[0]];
            boxes.forEach((box) => {
                box.style.pointerEvents = "none";
            });

            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");
        }
    });

    if (winner !== "") {
        gameInfo.innerText = `Winner Player - ${winner}`;
        newGameBtn.classList.add("active");
        return;
    }

    let fillCount = gameGrid.filter(box => box !== "").length;

    if (fillCount === 9) {
        gameInfo.innerText = "Game Tied !";
        newGameBtn.classList.add("active");
    }
}

function handleClick(index) {
    if (gameGrid[index] === "") {
        boxes[index].innerText = currentPlayer;
        gameGrid[index] = currentPlayer;
        boxes[index].style.pointerEvents = "none";
        swapTurn();
        checkGameOver();

        // If it's the computer's turn and the game is still active, let the computer make a move
        if (currentPlayer === "O" && !document.querySelector(".active")) {
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove() {
    let emptyCells = gameGrid.reduce((acc, val, idx) => {
        if (val === "") {
            acc.push(idx);
        }
        return acc;
    }, []);

    // Function to check for winning or blocking moves
    function findMove(marker) {
        for (let position of winningPositions) {
            let [a, b, c] = position;
            // Check for winning move
            if ((gameGrid[a] === marker && gameGrid[b] === marker && gameGrid[c] === "") ||
                (gameGrid[a] === marker && gameGrid[c] === marker && gameGrid[b] === "") ||
                (gameGrid[b] === marker && gameGrid[c] === marker && gameGrid[a] === "")) {
                return [a, b, c];
            }
        }
        return null; // Return null if no winning or blocking move is found
    }

    // Check for winning move
    let winningMove = findMove("O");
    if (winningMove) {
        // Make winning move
        for (let index of winningMove) {
            if (gameGrid[index] === "") {
                handleClick(index);
                return;
            }
        }
    }

    // Check for blocking move
    let blockingMove = findMove("X");
    if (blockingMove) {
        // Make blocking move
        for (let index of blockingMove) {
            if (gameGrid[index] === "") {
                handleClick(index);
                return;
            }
        }
    }

    // If no winning or blocking move, proceed with a random move
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let computerMoveIndex = emptyCells[randomIndex];

    handleClick(computerMoveIndex);
}



boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        handleClick(index);
    });
});

newGameBtn.addEventListener("click", initGame);
