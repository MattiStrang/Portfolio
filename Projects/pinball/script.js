const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");
const gameFPS = 50;
let pointsPlayer = 0;
let pointsComputer = 0;
const paddleWidth = 100;
const paddleHeight = 10;
let leftArrowHit = false;
let rightArrowHit = false;
const ball = {
  x: 160,
  y: 240,
  xSpeed: 1.5,
  ySpeed: 3.5,
  radius: 10,
};
const topPaddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: 10,
};
const bottomPaddle = {
  x: canvas.width / 2 - paddleWidth / 2 + 50,
  y: canvas.height - 20,
};

window.addEventListener("keydown", keydownHandler, false);

function keydownHandler(evt) {
  // console.log(evt.keyCode);
  if (evt.keyCode === 39) {
    rightArrowHit = true;
  }
  if (evt.keyCode === 37) {
    leftArrowHit = true;
  }
}

function drawBackground() {
  ctx.fillStyle = "#dbdbdb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTopPaddle() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(topPaddle.x, topPaddle.y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ball.x += ball.xSpeed;
  ball.y += ball.ySpeed;
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = "#ffff00";
  ctx.fill();
}

function drawBottomPaddle() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(bottomPaddle.x, bottomPaddle.y, paddleWidth, paddleHeight);
}

function hitDetection() {
  if (ball.y + ball.radius >= bottomPaddle.y) {
    if (bottomPaddle.x <= ball.x && ball.x <= bottomPaddle.x + paddleWidth) {
      console.log(
        "bottomPaddle hit",
        ball.x,
        ball.y,
        bottomPaddle.x,
        bottomPaddle.y,
      );
      ball.ySpeed = ball.ySpeed * -1;
      ball.y = bottomPaddle.y - ball.radius;
      return;
    }
  }
  if (ball.y - ball.radius <= topPaddle.y + paddleHeight) {
    if (topPaddle.x <= ball.x && ball.x <= topPaddle.x + paddleWidth) {
      console.log("topPaddle hit", ball.x, ball.y, topPaddle.x, topPaddle.y);
      ball.ySpeed = ball.ySpeed * -1;
      ball.y = topPaddle.y + ball.radius + paddleHeight;
      return;
    }
  }
  if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
    ball.xSpeed = ball.xSpeed * -1;
  }
  if (ball.y > canvas.height + ball.radius) {
    pointsComputer++;
    initGameObjects(); // a new ball in the game
    console.log("point for computer", pointsComputer);
  }
  if (ball.y < 0 - ball.radius) {
    pointsPlayer++;
    initGameObjects(); // a new ball in the game
    console.log("point for player", pointsPlayer);
  }
}

function initGameObjects() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  topPaddle.x = canvas.width / 2 - paddleWidth / 2;
  bottomPaddle.x = canvas.width / 2 - paddleWidth / 2;
}

function keyboardEvents() {
  if (leftArrowHit) {
    bottomPaddle.x -= 3;
    leftArrowHit = false;
  }
  if (rightArrowHit) {
    bottomPaddle.x += 3;
    rightArrowHit = false;
  }
  if (bottomPaddle.x <= 0) {
    bottomPaddle.x = 0;
  }
  if (bottomPaddle.x >= canvas.width - paddleWidth) {
    bottomPaddle.x = canvas.width - paddleWidth;
  }
}

function computerAI() {
  if (ball.ySpeed < 0) {
    if (ball.x < topPaddle.x + paddleWidth / 2) {
      topPaddle.x--;
    } else {
      topPaddle.x++;
    }
  }
}

function pongGame() {
  drawBackground();
  drawTopPaddle();
  drawBall();
  drawBottomPaddle();
  hitDetection();
  keyboardEvents();
  computerAI();
}

window.setInterval(pongGame, 1000 / gameFPS);
