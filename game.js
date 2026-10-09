const size = 20;
let speed = 120;

const board = document.getElementById("board");
const scoreEL = document.getElementById("score");
const bestEL = document.getElementById("best");
const messageEL = document.getElementById("message");
const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");

const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");
const levelSection = document.querySelector(".choose-level");
const gameSection = document.querySelector(".game-board");

const cells = [];
for (let i = 0; i < size * size; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);
  cells.push(cell);
}

const index = (x, y) => y * size + x;

let snake, dir, nextDir, food, score, timer;
let best = 0;

function setLevel(ms, name) {
  speed = ms;
  levelSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  messageEL.textContent = `Màn ${name}. Nhấn Bắt đầu hoặc Space`;
}

easyBtn.addEventListener("click", () => setLevel(150, "Dễ"));
mediumBtn.addEventListener("click", () => setLevel(120, "Trung bình"));
hardBtn.addEventListener("click", () => setLevel(80, "Khó"));

function init() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  dir = { x: 1, y: 0 };
  nextDir = dir;
  score = 0;
  scoreEL.textContent = score;
  placeFood();
  draw();
}

function placeFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function draw() {
  cells.forEach((cell) => (cell.className = "cell"));
  snake.forEach((part, i) => {
    cells[index(part.x, part.y)].className =
      "cell " + (i === 0 ? "head" : "body");
  });
  cells[index(food.x, food.y)].className = "cell food";
}

function step() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  // đụng tường
  if (head.x < 0 || head.x >= size || head.y < 0 || head.y >= size) {
    return gameOver();
  }

  const ateFood = head.x === food.x && head.y === food.y;

  // đụng thân
  const body = ateFood ? snake : snake.slice(0, -1);
  if (body.some((s) => s.x === head.x && s.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);
  if (ateFood) {
    score++;
    scoreEL.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
  draw();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    startGame();
  }
  if (e.code === "ArrowUp" && dir.y === 0) {
    nextDir = { x: 0, y: -1 };
  }
  if (e.code === "ArrowDown" && dir.y === 0) {
    nextDir = { x: 0, y: 1 };
  }
  if (e.code === "ArrowLeft" && dir.x === 0) {
    nextDir = { x: -1, y: 0 };
  }
  if (e.code === "ArrowRight" && dir.x === 0) {
    nextDir = { x: 1, y: 0 };
  }
  if (e.code.startsWith("Arrow") || e.code === "Space") {
    e.preventDefault();
  }
});

function startGame() {
  if (timer) return;
  if (gameSection.classList.contains("hidden")) return;
  init();
  messageEL.textContent = "Dùng phím mũi tên để di chuyển";
  timer = setInterval(step, speed);
}

function gameOver() {
  clearInterval(timer);
  timer = null;
  if (score > best) {
    best = score;
    bestEL.textContent = best;
  }
  messageEL.textContent =
    "Game Over! Nhấn nút Bắt đầu hoặc phím Space để chơi lại";
}

startBtn.addEventListener("click", startGame);

backBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  init();
  gameSection.classList.add("hidden");
  levelSection.classList.remove("hidden");
});

init();
