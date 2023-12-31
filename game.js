const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;
const BACKGROUND = new Image;
//const NO_OF_HIGH_SCORES = 10;
//const HIGH_SCORES = 'highScores';
BACKGROUND.src = "./bg2.jpg";
let leftArrow = false
let rightArrow = false
let LIFE = 3;
let SCORE = 0;
let HIGHSCORE=0;
let SCORE_UNIT = 10;
let LEVEL = 1;
let MAX_LEVEL = 3;
let GAME_OVER = false;
let BRICK_HIT = new Audio();
let PADDLE_HIT = new Audio();
let LIFE_LOST = new Audio();
let WALL_COLLISION = new Audio();
let WIN_SOUND = new Audio();
//Adding sounds to the game
BRICK_HIT.src = "./sounds/brick_hit.mp3";
PADDLE_HIT.src = "./sounds/paddle_hit.mp3";
LIFE_LOST.src = "./sounds/life_lost.mp3";
WALL_COLLISION.src = "./sounds/wall_collision.mp3";
WIN_SOUND.src = "./sounds/win_sound.mp3";


// Line width
ctx.lineWidth = 3;

const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : 5
}

function drawPaddle(){
    ctx.fillStyle = "pink";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "purple";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

document.addEventListener("keydown", function(event){
if(event.key === "ArrowLeft"){
    leftArrow = true;
} else if(event.key === "ArrowRight"){
    rightArrow = true;
}
});

document.addEventListener("keyup", function(event){
    if(event.key === "ArrowLeft"){
        leftArrow = false;
    } else if(event.key === "ArrowRight"){
        rightArrow = false;
    }
});

function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 6,
    dx : 3 * (Math.random()*2 - 1),
    dy : -3
}

function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    
    ctx.strokeStyle = "orange";
    ctx.stroke();

    ctx.closePath();

}

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = -ball.dx;
        WALL_COLLISION.play();
    }
    if(ball.y-ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_COLLISION.play();
    }
    if(ball.y + ball.radius > cvs.height){
        LIFE--;
        resetBall();
    }
}

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random()*2 - 1);
    ball.dy = -3;
    LIFE_LOST.play();
}

function ballPaddleCollision() {
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y < paddle.y + paddle.height && ball.y > paddle.y){

        let collidePoint = ball.x - (paddle.x + paddle.width/2);

        collidePoint = collidePoint / (paddle.width/2);

        let angle = collidePoint * Math.PI/3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
        PADDLE_HIT.play();
    }
}

const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "purple",
    strokeColor: "pink"
}

let bricks = [];

function createBricks(){
    for(let r=0; r<brick.row; r++){
        bricks[r] = [];
        for(let c=0;c<brick.column; c++){
            bricks[r][c] = {
                x: c*(brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r*(brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}


createBricks();

function drawBricks(){
    for(let r=0; r<brick.row; r++){
        for(let c=0;c<brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}


function ballBrickCollision(){
    for(let r=0; r<brick.row; r++){
        for(let c=0;c<brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    ball.dy = -ball.dy;
                    b.status = false;
                    SCORE += SCORE_UNIT;
                    BRICK_HIT.play(); 
                }
            }
        }
    }
}

function showGamePoints(text, textX, textY){
    ctx.fillStyle = "purple";
    ctx.font = "20px Germania One";
    ctx.fillText(text, textX, textY);

}
/*function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES-1]?.score ?? 0;
    
    if (score > lowestScore) {
      highScores(score, highScores); // TODO
      highScores(); // TODO
    }
  }*/

function gameOver(){
    if(LIFE < 0){
        GAME_OVER = true;
        showGamePoints("Game Over", cvs.width/2 - 40, cvs.height/2); 
        showGamePoints("Refresh to Play Again!", cvs.width/2 - 90, cvs.height/2 + 30); 
    }
    // checkHighScore(account.score);
}


function levelUp(){
    let isLevelDone = true;

    for(let r=0; r< brick.row; r++){
        for(let c=0; c< brick.column; c++){
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }

    if(isLevelDone){
        if(LEVEL >= MAX_LEVEL){
            GAME_OVER = true;
            WIN_SOUND.play();
            showGamePoints("Win Win !", cvs.width/2-45, cvs.height/2);
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

function draw(){
    drawPaddle();
    drawBall();
    drawBricks();
    showGamePoints("Score:" + SCORE, 15, 25);
    showGamePoints("Life:" + LIFE, cvs.width-45,25);
    showGamePoints("Level:" + LEVEL, cvs.width-130, 25);
    showGamePoints("High Score:" + HIGHSCORE, cvs.width/2-70, 25);
}

function update(){
movePaddle();
moveBall();
ballWallCollision();
ballPaddleCollision();
ballBrickCollision();
gameOver();
levelUp();  
}

function loop(){
    ctx.drawImage(BACKGROUND, 0, 0);

    draw();

    update();

    if(!GAME_OVER){
    requestAnimationFrame(loop);
    }
}

loop()