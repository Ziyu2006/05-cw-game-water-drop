// Game state
let gameRunning = false;
let dropMaker;
let countdown;
let score = 0;
let timeLeft = 30;

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");

const winningMessages = [
  "Amazing work! You brought clean water to more communities!",
  "You did it! Every drop counts, and you crushed it.",
  "Big win! You collected enough water drops to make a difference.",
  "Hydration hero unlocked. You won!"
];

const losingMessages = [
  "Nice try! Every drop matters. Give it another shot!",
  "So close! Jump back in and catch more drops.",
  "Keep going! Clean water needs a few more drops from you.",
  "Almost there! Try again and beat your score."
];

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  clearEndMessage();
  clearConfetti();
  gameContainer.innerHTML = "";

  startBtn.textContent = "Game Running...";
  startBtn.disabled = true;

  dropMaker = setInterval(createDrop, 700);

  countdown = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdown);

  // remove remaining drops before showing result
  const drops = gameContainer.querySelectorAll(".water-drop, .bad-drop");
  drops.forEach(drop => drop.remove());

  startBtn.disabled = false;
  startBtn.textContent = "Play Again";

  const message = document.createElement("div");
  message.className = "end-message";

  if (score >= 20) {
    const randomWin =
      winningMessages[Math.floor(Math.random() * winningMessages.length)];
    message.textContent = randomWin;
    message.classList.add("win");
    launchConfetti();
  } else {
    const randomLose =
      losingMessages[Math.floor(Math.random() * losingMessages.length)];
    message.textContent = randomLose;
    message.classList.add("lose");
  }

  gameContainer.appendChild(message);
}

function resetGame() {
  gameRunning = false;

  clearInterval(dropMaker);
  clearInterval(countdown);

  score = 0;
  timeLeft = 30;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  gameContainer.innerHTML = "";
  clearConfetti();

  startBtn.disabled = false;
  startBtn.textContent = "Start Game";
}

function createDrop() {
  if (!gameRunning) return;

  const drop = document.createElement("div");

  // 25% chance of bad drop
  const isBadDrop = Math.random() < 0.25;
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;

  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;

  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = `${xPosition}px`;

  const duration = (Math.random() * 1.5 + 2.2).toFixed(2);
  drop.style.animationDuration = `${duration}s`;

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (isBadDrop) {
      score = Math.max(0, score - 2);
    } else {
      score += 1;
    }

    scoreDisplay.textContent = score;
    drop.remove();
  });

  gameContainer.appendChild(drop);

  drop.addEventListener("animationend", () => {
    drop.remove();
  });
}

function clearEndMessage() {
  const oldMessage = document.querySelector(".end-message");
  if (oldMessage) oldMessage.remove();
}

function launchConfetti() {
  clearConfetti();

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-piece";

    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    gameContainer.appendChild(confetti);
  }
}

function clearConfetti() {
  const confettiPieces = gameContainer.querySelectorAll(".confetti-piece");
  confettiPieces.forEach(piece => piece.remove());
}