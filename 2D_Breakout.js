var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.fillStyle = "#0095DD";
//load images

//variables
var x = canvas.width/2;
var y = canvas.height-30;
var ballAngle = Math.floor(Math.random() * (5) - 2);
var dx = ballAngle === 0 ? -2 : ballAngle;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 95;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var score = 0;
var lives = 3;
//brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickCount = brickRowCount * brickColumnCount;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var notEmpty = true;
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    notEmpty = false;
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                notEmpty = true;
                if(x + ballRadius > b.x && x - ballRadius < b.x+brickWidth && y + ballRadius > b.y && y - ballRadius < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    ctx.fillStyle = 'hsl(' + Math.floor(Math.random() * 360) + ', 50%, 50%)';
                }
            }
        }
    }
    if (!notEmpty) {
        alert("YOU WON");
        document.location.reload();
        clearInterval(interval);
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function addBrick() {
    if (brickCount % brickColumnCount === 0) {
        brickRowCount++;
        for(var c=0; c<brickColumnCount; c++) {
            bricks[c].push( { x: 0, y: 0, status: c===0 ? 1 : 0 });
        }
        brickCount++;
    }
    else {
        s = brickCount % brickColumnCount;
        bricks[s][brickRowCount-1].status = 1;
        brickCount++;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    collisionDetection();
    

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        ctx.fillStyle = 'hsl(' + Math.floor(Math.random() * 360) + ', 50%, 50%)';
        paddleWidth -= 1; 
        addBrick();
    }
    if( y + dy < ballRadius) {
        dy = -dy;
        ctx.fillStyle = 'hsl(' + Math.floor(Math.random() * 360) + ', 50%, 50%)';
        paddleWidth -= 1; 
    }
    else if (y + dy > canvas.height-ballRadius) {
        if(x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
            var da = (Math.floor(Math.random() * (2) + 1)) / 10;
            dx += da;
            dy += da;
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 1;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }

    ctx.font = "15px Verdana";
    ctx.fillText("Score : " + score,5,20);
    ctx.fillText("Lives : " + lives,100,20);

    x += dx;
    y += dy;
}

var interval = setInterval(draw, 10);

