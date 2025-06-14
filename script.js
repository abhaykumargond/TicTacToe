const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const boardDiv = document.getElementById('board');
const resultDiv = document.getElementById('result');
const giftcardContainer = document.getElementById('giftcard-container');
const redeemCodeDiv = document.getElementById('redeem-code');
const tryAgainDiv = document.getElementById('try-again');

let board, currentPlayer, gameActive, winnerLineDiv;

startBtn.onclick = () => {
  homeScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  startGame();
};

restartBtn.onclick = startGame;

function startGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  resultDiv.textContent = '';
  restartBtn.style.display = 'none';
  renderBoard();
  if (winnerLineDiv) winnerLineDiv.remove();
  // Hide gift card and try again
  giftcardContainer.style.display = 'none';
  tryAgainDiv.style.display = 'none';
}

function renderBoard() {
  boardDiv.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell' + (board[i] ? ' ' + board[i].toLowerCase() : '');
    cell.dataset.index = i;
    cell.onclick = () => handleCellClick(i);
    cell.textContent = board[i];
    boardDiv.appendChild(cell);
  }
}

function handleCellClick(i) {
  if (!gameActive || board[i] || currentPlayer !== 'X') return;
  board[i] = 'X';
  renderBoard();
  const win = checkWinner();
  if (win) {
    gameActive = false;
    resultDiv.textContent = 'X wins!';
    showWinnerLine(win);
    restartBtn.style.display = 'block';
    // Show gift card and code
    giftcardContainer.style.display = 'block';
    redeemCodeDiv.style.display = 'block';
    redeemCodeDiv.innerHTML = 'You won a Google Play gift card <b>TY67-OI09-JHTY-87UY</b>';
    tryAgainDiv.style.display = 'none';
  } else if (board.every(cell => cell)) {
    resultDiv.textContent = "It's a draw!";
    restartBtn.style.display = 'block';
    giftcardContainer.style.display = 'none';
    tryAgainDiv.style.display = 'none';
  } else {
    currentPlayer = 'O';
    setTimeout(computerMove, 500); // Small delay for realism
  }
}

function computerMove() {
  if (!gameActive) return;
  // Find all empty cells
  const emptyIndices = board.map((cell, idx) => cell === '' ? idx : null).filter(idx => idx !== null);
  if (emptyIndices.length === 0) return;
  // Pick a random empty cell
  const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[move] = 'O';
  renderBoard();
  const win = checkWinner();
  if (win) {
    gameActive = false;
    resultDiv.textContent = `O wins!`;
    showWinnerLine(win);
    restartBtn.style.display = 'block';
    // Show TRY AGAIN
    giftcardContainer.style.display = 'none';
    tryAgainDiv.style.display = 'block';
  } else if (board.every(cell => cell)) {
    resultDiv.textContent = "It's a draw!";
    restartBtn.style.display = 'block';
    giftcardContainer.style.display = 'none';
    tryAgainDiv.style.display = 'none';
  } else {
    currentPlayer = 'X';
  }
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];
  for (const [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a,b,c];
    }
  }
  return null;
}

function showWinnerLine(indices) {
  if (winnerLineDiv) winnerLineDiv.remove();
  winnerLineDiv = document.createElement('div');
  winnerLineDiv.id = 'winner-line';
  boardDiv.appendChild(winnerLineDiv);

  // Calculate line position
  const rects = [...boardDiv.children].map(cell => cell.getBoundingClientRect());
  const boardRect = boardDiv.getBoundingClientRect();
  const [a, , c] = indices;
  const start = {
    x: rects[a].left + rects[a].width/2 - boardRect.left,
    y: rects[a].top + rects[a].height/2 - boardRect.top
  };
  const end = {
    x: rects[c].left + rects[c].width/2 - boardRect.left,
    y: rects[c].top + rects[c].height/2 - boardRect.top
  };
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
  winnerLineDiv.style.width = length + 'px';
  winnerLineDiv.style.left = start.x + 'px';
  winnerLineDiv.style.top = start.y + 'px';
  winnerLineDiv.style.transform = `rotate(${angle}deg)`;
} 