const gameBoard = document.getElementById("gameBoard");
const gameMenu = document.getElementById("gameMenu");
var X_pattern = [];
var O_pattern = [];
const winnerMark = document.getElementById("winner-mark");
var turn = document.getElementById("turn");
var allBox = document.getElementsByClassName("cell");
const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name")
const cpuBtn = document.getElementById("solo");
const playerBtn = document.getElementById("multiplayer");
const XradioBtn = document.getElementById("X-mark");
const OradioBtn = document.getElementById("O-mark");
const winnerX = false;
const winnerO = false;
const cell0 = document.getElementById("0");
const cell1 = document.getElementById("1");
const cell2 = document.getElementById("2");
const cell3 = document.getElementById("3");
const cell4 = document.getElementById("4");
const cell5 = document.getElementById("5");
const cell6 = document.getElementById("6");
const cell7 = document.getElementById("7");
const cell8 = document.getElementById("8");

var origBoard = Array.from(Array(9).keys());
var human;
var AI;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

var isAgainstCPU = false;

function newGameCPU() {
  gameBoard.style.display = "initial";
  gameMenu.style.display = "none";
  if (XradioBtn.checked === true) {
    human = "X";
    AI = "O";
    player1Name.innerHTML = "X (You)";
    player2Name.innerHTML = "0 (CPU)";
  } else {
    human = "O";
    AI = "X";
    player1Name.innerHTML = "X (CPU)";
    player2Name.innerHTML = "0 (You)";
  }
  cpuBtn.setAttribute("data-value", "active");
  playerBtn.setAttribute("data-value", "");

  isAgainstCPU = true;
  cpuTurn();
}

function newGamePlayer() {
  gameBoard.style.display = "initial";
  gameMenu.style.display = "none";
  player1Name.innerHTML = "X (P1)";
  player2Name.innerHTML = "0 (P2)";
  playerBtn.setAttribute("data-value", "active");
  cpuBtn.setAttribute("data-value", "");

  isAgainstCPU = false;
}

function restartGame() {
  window.location.reload();
}

function hitBox(cell) {
  var boxChoice = document.getElementById(cell);

  if (boxChoice.getAttribute("data-value") !== "") {
    return;
  }

  var img = document.createElement("img");

  if (turn.getAttribute("data-value") === "X") {
    img.src = "./starter-code/assets/icon-x.svg";
    img.setAttribute("class", "boxPlayed");
    boxChoice.appendChild(img);
    boxChoice.classList.remove("hoverClassX");
    boxChoice.setAttribute("data-value", "X");
    boxChoice.setAttribute("onclick", "");
    turn.setAttribute("data-value", "O");
    turn.src = "./starter-code/assets/icon-o.svg";
    X_pattern.push(parseInt(boxChoice.id, 10));
    X_pattern.sort();
    if (XradioBtn.checked === true) {
      origBoard.splice(
        parseInt(boxChoice.id, 10),
        1,
        (parseInt(boxChoice.id, 10), human)
      );
    } else {
      origBoard.splice(
        parseInt(boxChoice.id, 10),
        1,
        (parseInt(boxChoice.id, 10), AI)
      );
    }
    for (empty of allBox) {
      if (empty.getAttribute("data-value") === "") {
        empty.classList.add("hoverClassO");
        empty.classList.remove("hoverClassX");
      }
    }
    checkWin(X_pattern);
  } else {
    img.src = "./starter-code/assets/icon-o.svg";
    img.setAttribute("class", "boxPlayed");
    boxChoice.appendChild(img);
    boxChoice.classList.remove("hoverClassO");
    boxChoice.setAttribute("data-value", "O");
    boxChoice.setAttribute("onclick", "");
    turn.setAttribute("data-value", "X");
    turn.src = "./starter-code/assets/icon-x.svg";
    O_pattern.push(parseInt(boxChoice.id, 10));
    O_pattern.sort();
    if (OradioBtn.checked === true) {
      origBoard.splice(
        parseInt(boxChoice.id, 10),
        1,
        (parseInt(boxChoice.id, 10), human)
      );
    } else {
      origBoard.splice(
        parseInt(boxChoice.id, 10),
        1,
        (parseInt(boxChoice.id, 10), AI)
      );
    }
    for (empty of allBox) {
      if (empty.getAttribute("data-value") === "") {
        empty.classList.add("hoverClassX");
        empty.classList.remove("hoverClassO");
      }
    }
    checkWin(O_pattern);
  }

  if (cpuBtn.getAttribute("data-value") === "active") {
    cpuTurn();
  }
}

function checkWin(currentPlayer) {
  let isThereWinner = false;

  for (some of winningCombinations) {
    const isContainedIn = (a, b) => {
      for (const v of new Set(a)) {
        if (!b.some((e) => e === v)) return false;
      }
      for (empty of allBox) {
        if (empty.getAttribute("data-value") === "") {
          empty.classList.remove("hoverClassX");
          empty.classList.remove("hoverClassO");
          empty.setAttribute("onclick", "");
        }
      }
      isThereWinner = true;
      results();
      return true;
    };
    isContainedIn(some, currentPlayer);
  }

  if (
    isThereWinner === false &&
    X_pattern.length === 5 &&
    O_pattern.length === 4
  ) {
    for (all of allBox) {
      all.classList.remove("hoverClassO");
      all.classList.remove("hoverClassX");
      all.setAttribute("onclick", "");
    }
    draw();
  }
}


async function cpuTurn() {
  if (!isAgainstCPU) {
    return; // If the game is not against CPU, return without doing anything
  }

  const disableCells = () => {
    for (const cell of allBox) {
      cell.setAttribute("onclick", "");
    }
  };

  if (XradioBtn.checked) {
    const promise = new Promise((resolve, reject) => {
      if (turn.getAttribute("data-value") === "O" || winnerX) {
        disableCells();
        resolve();
      }
      if (winnerO) {
        reject();
      }
    });

    await promise;
    setTimeout(cpuPlay, 2000);
  }

  if (OradioBtn.checked) {
    const promise = new Promise((resolve, reject) => {
      if (turn.getAttribute("data-value") === "X" || winnerO) {
        disableCells();
        resolve();
      }
      if (winnerX) {
        reject();
      }
    });

    await promise;
    setTimeout(cpuPlay, 1000);
  }
}


function bestSpot() {
  return minimax(origBoard, AI).index;
}

function cpuPlay() {
  hitBox(bestSpot());

  cell0.setAttribute("onclick", "hitBox('0')");
  cell1.setAttribute("onclick", "hitBox('1')");
  cell2.setAttribute("onclick", "hitBox('2')");
  cell3.setAttribute("onclick", "hitBox('3')");
  cell4.setAttribute("onclick", "hitBox('4')");
  cell5.setAttribute("onclick", "hitBox('5')");
  cell6.setAttribute("onclick", "hitBox('6')");
  cell7.setAttribute("onclick", "hitBox('7')");
  cell8.setAttribute("onclick", "hitBox('8')");
}


const modal = document.getElementById("modal");
const endGame = document.getElementById("endGameModal");
const restartingGame = document.getElementById("restartGame");
const winnerTakes = document.getElementById("winnerTakes");
const winnerName = document.getElementById("winnerName");
const Xscore = document.getElementById("Xscore");
const drawScore = document.getElementById("draw");
const Oscore = document.getElementById("Oscore");

function results() {
  modal.style.display = "initial";
  endGame.style.display = "flex";
  restartingGame.style.display = "none";

  if (turn.getAttribute("data-value") === "O") {
    winnerName.style.display = "initial";

    if (playerBtn.getAttribute("data-value") === "active") {
      if (XradioBtn.checked === true) {
        winnerName.innerHTML = "PLAYER 1 WINS!";
        winnerName.style = "color: #A8BFC9;";
      }
      if (OradioBtn.checked === true) {
        winnerName.innerHTML = "PLAYER 1 WINS!";
        winnerName.style = "color: #A8BFC9;";
      }
    }
    if (cpuBtn.getAttribute("data-value") === "active") {
      if (XradioBtn.checked === true) {
        winnerName.innerHTML = "YOU WON!";
        winnerName.style = "color: #A8BFC9;";
      }
      if (OradioBtn.checked === true) {
        winnerName.innerHTML = "OH NO, YOU LOST...";
        winnerName.style = "color: #A8BFC9;";
      }
    }

    winnerMark.src = "./starter-code/assets/icon-x.svg";
    winnerMark.style.display = "initial";
    winnerTakes.style = "color: hsl( var(--clr-lightBlue) );";
    winnerTakes.innerHTML = "takes the round";
    Xscore.innerHTML++;
    winnerX = true;
  } else {
    winnerName.style.display = "initial";
    if (playerBtn.getAttribute("data-value") === "active") {
      if (OradioBtn.checked === true) {
        winnerName.innerHTML = "PLAYER 2 WINS!";
        winnerName.style = "color: #A8BFC9;";
      }
      if (XradioBtn.checked === true) {
        winnerName.innerHTML = "PLAYER 2 WINS!";
        winnerName.style = "color: #A8BFC9;";
      }
    }
    if (cpuBtn.getAttribute("data-value") === "active") {
      if (OradioBtn.checked === true) {
        winnerName.innerHTML = "YOU WON!";
        winnerName.style = "color: #A8BFC9;";
      }
      if (XradioBtn.checked === true) {
        winnerName.innerHTML = "OH NO, YOU LOST...";
        winnerName.style = "color: #A8BFC9;";
      }
    }
    winnerMark.src = "./starter-code/assets/icon-o.svg";
    winnerMark.style.display = "initial";
    winnerTakes.style = "color: hsl( var(--clr-orange) );";
    winnerTakes.innerHTML = "takes the round";
    Oscore.innerHTML++;
    winnerO = true;
  }
}

function draw() {
  modal.style.display = "initial";
  endGame.style.display = "flex";
  restartingGame.style.display = "none";
  winnerMark.style.display = "none";
  winnerTakes.innerHTML = "round tied";
  winnerTakes.style = "color: hsl( var(--clr-silver) );";
  winnerName.style.display = "none";
  drawScore.innerHTML++;
}

function nextRound() {
  var boxPlayed = document.querySelectorAll(".boxPlayed");

  modal.style.display = "none";
  endGame.style.display = "none";
  restartingGame.style.display = "none";
  for (all of boxPlayed) {
    all.parentNode.removeChild(all);
  }

  for (all of allBox) {
    all.setAttribute("data-value", "");
    all.classList.add("hoverClassX");
  }
  turn.setAttribute("data-value", "X");
  turn.src = "./starter-code/assets/icon-x-turn.svg";
  cell0.setAttribute("onclick", "hitBox('0')");
  cell1.setAttribute("onclick", "hitBox('1')");
  cell2.setAttribute("onclick", "hitBox('2')");
  cell3.setAttribute("onclick", "hitBox('3')");
  cell4.setAttribute("onclick", "hitBox('4')");
  cell5.setAttribute("onclick", "hitBox('5')");
  cell6.setAttribute("onclick", "hitBox('6')");
  cell7.setAttribute("onclick", "hitBox('7')");
  cell8.setAttribute("onclick", "hitBox('8')");
  X_pattern = [];
  O_pattern = [];
  origBoard = Array.from(Array(9).keys());
  cpuTurn();
}

function displayModalRestart() {
  modal.style.display = "initial";
  endGame.style.display = "none";
  restartingGame.style.display = "flex";
}

function cancelReset() {
  modal.style.display = "none";
  checkWin(O_pattern);
  checkWin(X_pattern);
}

//  Smart Computer Moves  //

function emptySquares(board) {
  return board.filter((s) => typeof s == "number");
}

function checkWinner(board, player) {
  const winningCombinations = [    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winningCombinations.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWinner(newBoard, human)) {
    return { score: -10 };
  } else if (checkWinner(newBoard, AI)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];

  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === AI) {
      var result = minimax(newBoard, human);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, AI);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  var bestScore;
  
  if (player === AI) {
    bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
      }
    }
  } else {
    bestScore = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
      }
    }
  }
  
  var bestMoves = moves.filter(move => move.score === bestScore);
  bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

  return bestMove;
}