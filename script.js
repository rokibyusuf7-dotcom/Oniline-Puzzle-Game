const allEmojis = ["😀","😎","😍","🤖","🐱","🐶","🍕","⚽","🚗","👾","🌟","🎵","🔥","🍔","🎮","🐸"];
const game = document.getElementById("game");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeBtn = document.getElementById("closeBtn");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const levelDisplay = document.getElementById("levelDisplay");
const timerToggle = document.getElementById("timerToggle");
const soundToggle = document.getElementById("soundToggle");
const themeSelect = document.getElementById("themeSelect");
const matchSound = document.getElementById("matchSound");
const winOverlay = document.getElementById("winOverlay");
const winStats = document.getElementById("winStats");
const nextLevelBtn = document.getElementById("nextLevelBtn");

let firstCard, secondCard, lock = false;
let timer = 0;
let timerInterval;
let moves = 0;
let level = 1;

/* ✅ Open Modal */
settingsBtn.addEventListener("click", () => {
  settingsModal.style.display = "block";
});

/* ✅ Close Modal */
closeBtn.addEventListener("click", () => {
  settingsModal.style.display = "none";
});

/* ✅ Close modal by clicking outside */
window.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = "none";
  }
});

/* ✅ Start Game */
startBtn.addEventListener("click", () => {
  settingsModal.style.display = "none";
  level = 1;
  updateLevelDisplay();
  startGame();
});

/* ✅ Theme Change */
themeSelect.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme", themeSelect.value === "dark");
});

/* ✅ Next Level */
nextLevelBtn.addEventListener("click", () => {
  winOverlay.style.display = "none";
  if (level < 100) {
    level++;
    updateLevelDisplay();
    startGame();
  } else {
    alert("You've completed all 100 levels!");
  }
});

function updateLevelDisplay() {
  levelDisplay.textContent = "Level: " + level;
}

function startGame() {
  game.innerHTML = "";
  firstCard = secondCard = null;
  moves = 0;
  movesDisplay.textContent = "Moves: 0";
  timer = 0;
  timerDisplay.textContent = "Time: 0s";

  if (timerToggle.checked) {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = "Time: " + timer + "s";
    }, 1000);
  } else {
    clearInterval(timerInterval);
  }

  let difficulty = difficultySelect.value;
  let cardCount = difficulty === "easy" ? 8 : difficulty === "normal" ? 12 : 16;

  let selected = allEmojis.slice(0, cardCount / 2);
  let cards = [...selected, ...selected].sort(() => 0.5 - Math.random());

  cards.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.textContent = "";
    card.addEventListener("click", flipCard);
    game.appendChild(card);
  });
}

function flipCard() {
  if (lock || this === firstCard) return;
  this.textContent = this.dataset.emoji;
  this.classList.add("flipped");
  moves++;
  movesDisplay.textContent = "Moves: " + moves;

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

function checkMatch() {
  lock = true;
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    if (soundToggle.checked) matchSound.play();
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetCards();
    checkWin();
  } else {
    setTimeout(() => {
      firstCard.textContent = "";
      secondCard.textContent = "";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetCards();
    }, 1000);
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function checkWin() {
  const allFlipped = [...document.querySelectorAll(".card")].every(
    card => card.textContent !== ""
  );
  if (allFlipped) {
    clearInterval(timerInterval);
    winStats.textContent = "Time: " + timer + "s | Moves: " + moves;
    winOverlay.style.display = "flex";
  }
}
