var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");


//load img
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = 'images/bird.png';
bg.src = 'images/bg.png';
fg.src = 'images/fg.png';
pipeNorth.src = 'images/pipeNorth.png';
pipeSouth.src = 'images/pipeSouth.png';

//variables
const gap = 115;
var bX = 10;
var bY = 150;
var gravity = 1.5
var score = 0;
var pHeight = 242;  
/*pipeNorth.height yields 0 at first because it takes a bit for the image to load
so it takes the height of new Image() which is zero. So in the first iteration of the game
if you use [pipeNorth.height] the pipes overlap. For this reason I won't use pipeNorth.height
*/   
var constant = pHeight + gap;       

//Audio Files
var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
//on key down

document.addEventListener("keydown", moveUp);

function moveUp() {
    bY -= 50;
    fly.play();
}

//pipe coordinates
var pipe = [];
pipe[0] = {
    x : cvs.width,
    y : Math.floor(Math.random() * pHeight) - pHeight
}

//draw
function draw() {
    

    ctx.drawImage(bg,0,0);

    for(var i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);

        pipe[i].x -=2;

        if(pipe[i].x == 56) {
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random() * pHeight) - pHeight
            })
        }
        //detect collision
        if (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pHeight
            || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >= cvs.height - fg.height){
            location.reload();    //reload page
        }
        if(pipe[i].x == 6) {
            score++;
            scor.play();
        }
    }
      

    ctx.drawImage(fg,0,cvs.height - fg.height);
    ctx.drawImage(bird, bX,bY);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score,10,cvs.height-20);

    requestAnimationFrame(draw);


}
draw();