const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");
const gameFPS = 30;
let pointsPlayer = 0;
let pointsComputer = 0;
const paddleWidth = 100;
const paddleHeight = 10;
const ball = {
  x: 160,
  y: 240,
  xSpeed: 1,
  ySpeed: 3,
  radius: 10,
};
const topPaddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: 10,
};
const bottomPaddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - 20,
};

function drawBackround() {
  ctx.fillStyle = "#dbdbdb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTopPaddle() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(100, 10, 100, 10);
}
function drawBall() {
  ctx.strokeStyle = "000000";
  ctx.beginPath();
  ball.x += ball.xSpeed;
  ball.y += ball.ySpeed;
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = "#ffff00";
  ctx.fill();
  if (ball.x >= canvas.width || ball.x <= 0) {
    ball.xSpeed *= -1;
  }
  if (ball.y >= canvas.height || ball.y <= 0) {
    ball.ySpeed *= -1;
  }
}

function drawBottomPaddle() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(bottomPaddle.x, bottomPaddle.y, paddleWidth, paddleHeight);
}
function hitDetection() {
  if (ball.y + ball.radius >= bottomPaddle.y) {
    if (bottomPaddle.x <= ball.x && ball.x <= bottomPaddle.x + paddleWidth) {
      ball.ySpeed *= -1;
      ball.y = bottomPaddle.y - ball.radius;
      return;
    }
  }
}

function pongGame() {
  drawBackround();
  drawTopPaddle();
  drawBall();
  drawBottomPaddle();
  hitDetection();
}

window.setInterval(pongGame, 1000 / gameFPS);
