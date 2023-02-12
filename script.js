var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var bird = new Image();
var bg = new Image();
var lg = new Image();
var pipeTop = new Image();
var pipeBot = new Image();

bird.src = "img/char.png";
bg.src = "img/bg.png";
lg.src = "img/lg.png";
pipeTop.src = "img/top.png";
pipeBot.src = "img/bot.png";

var gap = 100;

// При нажатии на кнопку
document.addEventListener("keydown", moveUp);

function moveUp() {
	yPos -= 25;
}

// Создание блоков
var pipe = [];
pipe[0] = {
	x : cvs.width,
	y : -80
}

var score = 0;

// Позиция утки
var xPos = 10;
var yPos = 150;
var grav = 1.5;


function draw() {
	ctx.drawImage(bg, 0, 0);

	for(var i = 0; i < pipe.length; i++){
		ctx.drawImage(pipeTop, pipe[i].x, pipe[i].y);
		ctx.drawImage(pipeBot, pipe[i].x, pipe[i].y + pipeTop.height + gap);

		pipe[i].x--;

		if(pipe[i].x == 125) {
			pipe.push({
				x : cvs.width,
				y : Math.floor(Math.random() * pipeTop.height) - pipeTop.height
			});
		}


		 // Отслеживание прикосновений
 		if(xPos + bird.width >= pipe[i].x
 			&& xPos <= pipe[i].x + pipeTop.width
 			&& (yPos <= pipe[i].y + pipeTop.height
 			|| yPos + bird.height >= pipe[i].y + pipeTop.height + gap) || yPos + bird.height >= cvs.height - lg.height) {
 		location.reload(); // Перезагрузка страницы
 		}
		
		if(pipe[i].x == 5) {
			score++;
		}

	}

	

	ctx.drawImage(lg, 0, cvs.height - lg.height);
	ctx.drawImage(bird, xPos, yPos);

	yPos += grav;

	ctx.fillStyle = "#fff";
	ctx.font = "24px Verdana";
	ctx.fillText("Score: " + score, 10, cvs.height - 450);

	requestAnimationFrame(draw);
}

pipeBot.onload = draw;