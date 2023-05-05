let turn = "X";
let wins = 0;
let ties = 0;
let losses = 0;

let cells = document.getElementsByClassName("cell");
let board = ["", "", "", "", "", "", "", "", ""];

function updateScoreboard() {
  document.getElementById("wins").textContent = wins;
  document.getElementById("ties").textContent = ties;
  document.getElementById("losses").textContent = losses;
}

function updateTurnIndicator() {
  const turnText = document.getElementById("turnText");
  if (turn === "X") {
    turnText.innerHTML = `<span style="font-size: 24px; font-weight: bold; color: #65E9E4;">X</span> Turn`;
  } else {
    turnText.innerHTML = `<span style="font-size: 24px; font-weight: bold; color: #FFC860;">O</span> Turn`;
  }
}

function checkWin() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (cells[a].textContent === turn && cells[b].textContent === turn && cells[c].textContent === turn) {
      cells[a].classList.add("winning-cell", turn.toLowerCase());
      cells[b].classList.add("winning-cell", turn.toLowerCase());
      cells[c].classList.add("winning-cell", turn.toLowerCase());
      return true;
    }
  }
  return false;
}

function checkTie() {
  for (const cell of cells) {
    if (cell.textContent === "") {
      return false;
    }
  }
  return true;
}

function endGame(result) {
    const turnText = document.getElementById("turnText");
    turnText.textContent = result;
    for (const cell of cells) {
      cell.removeEventListener("click", handleCellClick);
    }
    if (result === "Tie") {
      ties++;
      document.getElementById("darken").style.display = "block";
      document.querySelector("[data-tie-message-text]");
      document.getElementById("tieMessage").style.display = "block";
    } else if (result === "X wins") {
      wins++;
      document.getElementById("darken").style.display = "block";
      document.querySelector("[data-winning-message-2-text]");
      document.getElementById("winningMessage2").style.display = "block";
    } else if (result === "O wins") {
      losses++;
      document.getElementById("darken").style.display = "block";
      document.querySelector("[data-winning-message-text]");
      document.getElementById("winningMessage").style.display = "block";
    }
    updateScoreboard();
  }

const redoButton = document.getElementById("redo");
const restartMessage = document.getElementById("restartMessage");
const darken = document.getElementById("darken");
const restartMessageText = document.querySelector("[data-restart-message-text]");

redoButton.addEventListener("click", () => {
  restartMessage.style.display = "block";
  darken.style.display = "block";
});

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
  restartMessage.style.display = "none";
  darken.style.display = "none";
});

const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => {
  restartMessage.style.display = "none";
  darken.style.display = "none";
});


  
document.getElementById("nextRoundBtn1").addEventListener("click", function() {
  resetBoard();
  });
  
document.getElementById("nextRoundBtn2").addEventListener("click", function() {
  resetBoard();
  });
  
document.getElementById("nextRoundBtn3").addEventListener("click", function() {
  resetBoard();
  });

function resetBoard() {
  for (const cell of cells) {
    cell.textContent = "";
    cell.classList.remove("x", "o");
    cell.classList.remove("winning-cell");
    cell.addEventListener("click", handleCellClick, { once: true });
  }
    document.getElementById("darken").style.display = "none";
    document.getElementById("winningMessage").style.display = "none";
    document.getElementById("winningMessage2").style.display = "none";
    document.getElementById("tieMessage").style.display = "none";
    turn = "X";
    updateTurnIndicator();
  }  

function checkWinningMove(player) {
  let winningMove = null;
  let availableCells = Array.from(cells).filter(cell => cell.textContent === "");
  for (let i = 0; i < availableCells.length; i++) {
    let cell = availableCells[i];
    cell.textContent = player;
    if (checkWin()) {
      winningMove = cell;
      break;
    }
    cell.textContent = "";
  }
  return winningMove;
}
  
function checkBlockingMove(player) {
  let blockingMove = null;
  let opponent = (player === "X") ? "O" : "X";
  let availableCells = Array.from(cells).filter(cell => cell.textContent === "");
  
  // Check for winning moves by opponent
  for (let i = 0; i < availableCells.length; i++) {
    let cell = availableCells[i];
    cell.textContent = opponent;
    if (checkWin()) {
      blockingMove = cell;
      break;
    }
    cell.textContent = "";
  }
  
  // Check for winning moves by player
  if (!blockingMove) {
    for (let i = 0; i < availableCells.length; i++) {
      let cell = availableCells[i];
      cell.textContent = player;
      if (checkWin()) {
        blockingMove = cell;
        break;
      }
      cell.textContent = "";
    }
  }
    
  // Check for rows with two Xs and an empty cell
  if (!blockingMove) {
    let rows = [      [cells[0], cells[1], cells[2]],
      [cells[3], cells[4], cells[5]],
      [cells[6], cells[7], cells[8]],
    ];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let xCount = row.filter(cell => cell.textContent === "X").length;
      let emptyCount = row.filter(cell => cell.textContent === "").length;
      if (xCount === 2 && emptyCount === 1) {
        blockingMove = row.find(cell => cell.textContent === "");
        break;
      }
    }
  }
    
  // Check for columns with two Xs and an empty cell
  if (!blockingMove) {
    let columns = [      [cells[0], cells[3], cells[6]],
      [cells[1], cells[4], cells[7]],
      [cells[2], cells[5], cells[8]],
    ];
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      let xCount = column.filter(cell => cell.textContent === "X").length;
      let emptyCount = column.filter(cell => cell.textContent === "").length;
      if (xCount === 2 && emptyCount === 1) {
        blockingMove = column.find(cell => cell.textContent === "");
        break;
      }
    }
  }
    
  // Check for diagonals with two Xs and an empty cell
  if (!blockingMove) {
    let diagonals = [      [cells[0], cells[4], cells[8]],
      [cells[2], cells[4], cells[6]],
    ];
    for (let i = 0; i < diagonals.length; i++) {
      let diagonal = diagonals[i];
      let xCount = diagonal.filter(cell => cell.textContent === "X").length;
      let emptyCount = diagonal.filter(cell => cell.textContent === "").length;
      if (xCount === 2 && emptyCount === 1) {
        blockingMove = diagonal.find(cell => cell.textContent === "");
        break;
      }
    }
  }
  
  return blockingMove;
} 
  
function handleCellClick() {
  if (this.textContent === "") {
    this.textContent = turn;
    this.classList.add(turn.toLowerCase());
    if (checkWin()) {
      endGame(turn + " wins");
    } else if (checkTie()) {
      endGame("Tie");
    } else {
      turn = (turn === "X") ? "O" : "X";
      updateTurnIndicator();
      if (turn === "O") { // Computer's turn
        let foundWinningMove = false;
        let foundBlockingMove = false;
        let move;
        let winningMove = checkWinningMove("O");
        if (winningMove) {
          foundWinningMove = true;
          move = winningMove;
        } else {
          let blockingMove = checkBlockingMove("O");
          if (blockingMove) {
            foundBlockingMove = true;
            move = blockingMove;
          } else {
            let availableCells = Array.from(cells).filter(cell => cell.textContent === "");
            let randomIndex = Math.floor(Math.random() * availableCells.length);
            move = availableCells[randomIndex];
          }
        }
        setTimeout(() => {
        move.textContent = "O";
        move.classList.add("o");
        if (checkWin()) {
          endGame("O wins");
        } else if (checkTie()) {
          endGame("Tie");
        } else {
          turn = "X";
          updateTurnIndicator();
        }
      }, 500);
      }
    }
  }
}
  
function init() {
  updateScoreboard();
  updateTurnIndicator();
    for (const cell of cells) {
    cell.addEventListener("click", handleCellClick);
    }
  document.getElementById("resetBtn").addEventListener("click", resetGame);
  document.getElementById("resetBtn").addEventListener("click", resetBoard);  
}
        
init();