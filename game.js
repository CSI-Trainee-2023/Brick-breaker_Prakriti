// select canvas element
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");
// Add border to canvas
cvs.style.border = "1 px solid #off";

// Game variables and constants
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;

// Create the Paddle
const paddle = {
    x: cvs.width/2 - PADDLE_WIDTH/2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx : 5
}
// Draw paddle
function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.StrokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}