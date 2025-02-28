const categories = {
  fruits: ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍑"],
  icons: [
    "https://cdn-icons-png.flaticon.com/128/1051/1051277.png",
    "https://cdn-icons-png.flaticon.com/128/1199/1199124.png",
    "https://cdn-icons-png.flaticon.com/128/226/226777.png",
    "https://cdn-icons-png.flaticon.com/128/732/732190.png",
    "https://cdn-icons-png.flaticon.com/128/5968/5968350.png",
    "https://cdn-icons-png.flaticon.com/128/16781/16781152.png",
    "https://cdn-icons-png.flaticon.com/128/919/919825.png",
    "https://cdn-icons-png.flaticon.com/128/10832/10832170.png",
  ],
  emojis: ["😀", "😂", "😍", "😎", "🥶", "🤯", "🤡", "👽"],
  logos: [
    "https://cdn-icons-png.flaticon.com/128/3621/3621435.png",
    "https://cdn-icons-png.flaticon.com/128/733/733547.png",
    "https://cdn-icons-png.flaticon.com/128/145/145807.png",
    "https://cdn-icons-png.flaticon.com/128/2504/2504941.png",
    "https://cdn-icons-png.flaticon.com/128/5969/5969020.png",
    "https://cdn-icons-png.flaticon.com/128/3670/3670051.png",
    "https://cdn-icons-png.flaticon.com/128/3670/3670147.png",
    "https://cdn-icons-png.flaticon.com/128/145/145808.png",
  ],
};

let flippedCards = [];
let lockBoard = false;
let score = 0;
let timer;
let timeLeft = 60;

const flipSound = new Audio("flipcard-91468.mp3");
const matchSound = new Audio("success-1-6297.mp3");
const gameOverSound = new Audio("game-over-arcade-6435.mp3");
const gamewin=new Audio("tada-fanfare-a-6313.mp3");

function startGame(category) {
  const gameContainer = document.getElementById("game-container");
  const gameBoard = document.getElementById("game-board");
  const landingPage = document.getElementById("landing");
  const scoreBoard = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const gameOverMessage = document.getElementById("game-over-message");


  gameOverMessage.classList.add("hidden");
  gameOverMessage.innerHTML = "";

  score = 0;
  timeLeft = 60;
  scoreBoard.innerText = `${score}`;
  timerDisplay.innerText = `${timeLeft}`;

  landingPage.style.display = "none";
  gameContainer.style.display = "block";

  gameBoard.style.pointerEvents = "auto"; 

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameOverSound.currentTime = 0;
      gameOverSound.play();
      showGameOverMessage();
    }
  }, 1000);

  let items = categories[category];
  let cardItems = [...items, ...items];

 
  for (let i = cardItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardItems[i], cardItems[j]] = [cardItems[j], cardItems[i]];
  }

  gameBoard.innerHTML = "";
  cardItems.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.item = item;

    if (item.startsWith("http")) {
      card.innerHTML = `<img src="${item}" class="hidden"/>`;
    } else {
      card.innerText = "?";
    }

    card.addEventListener("click", () => handleCardClick(card));
    gameBoard.appendChild(card);
  });

  flippedCards = [];
}

function handleCardClick(card) {
  if (lockBoard || flippedCards.includes(card)) return;

  flipSound.currentTime = 0;
  flipSound.play();

  if (card.dataset.item.startsWith("http")) {
    card.querySelector("img").classList.remove("hidden");
  } else {
    card.innerText = card.dataset.item;
  }

  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    setTimeout(checkForMatch, 800);
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.item === card2.dataset.item) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    card1.style.pointerEvents = "none";
    card2.style.pointerEvents = "none";
    score += 10;

    matchSound.currentTime = 0;
    matchSound.play();
  } else {
    setTimeout(() => {
      if (card1.dataset.item.startsWith("http")) {
        card1.querySelector("img").classList.add("hidden");
        card2.querySelector("img").classList.add("hidden");
      } else {
        card1.innerText = "?";
        card2.innerText = "?";
      }
    }, 500);
  }

  document.getElementById("score").innerText = `${score}`;
  flippedCards = [];
  lockBoard = false;
  if (document.querySelectorAll(".matched").length === document.querySelectorAll(".card").length) {
    clearInterval(timer);
    showWinMessage();
  }
}

function showWinMessage() {
  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.innerHTML = `🎉 Congratulations! You won with a score of ${score} 🎉`;
  gameOverMessage.classList.remove("hidden");
  gamewin.play();
  

  document.getElementById("game-board").style.pointerEvents = "none";
  gameOverMessage.addEventListener("click", (event) => event.stopPropagation());
  setTimeout(resetGame, 2000);
}

function showGameOverMessage() {
  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.innerHTML = `⏳ Time's Up! Final Score: ${score} 🎉`;
  gameOverMessage.classList.remove("hidden");

  
  document.getElementById("game-board").style.pointerEvents = "none";
 
  setTimeout(resetGame, 2000);
}

function resetGame() {
  document.getElementById("game-container").style.display = "none";
  document.getElementById("landing").style.display = "block";
  clearInterval(timer);
}

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    startGame(button.dataset.category);
  });
});

document.getElementById("restart-btn").addEventListener("click", resetGame);
