function init(){
    canvas = document.getElementById('snakecanvas');
    W = canvas.width = 600;
    H = canvas.height = 600;
    pen = canvas.getContext('2d');
    cs = 30;
    game_over=false;
    score=0;

    food_img = new Image()
    food_img.src='images/snakefood.png'

    food = getRandomFood()

    snake = {
        init_len : 5,
        color: "#993300",
        cells: [],
        direction: "right",

        createsnake : function(){
            for(var i=this.init_len;i>0;i--){
                this.cells.push({x:i,y:0});
            }
        },

        drawsnake : function(){
            for(var i=0;i<this.cells.length;i++){
                pen.fillStyle=this.color;
                pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-2,cs-2);
            }
        },

        updatesnake : function(){
            var Xhead = this.cells[0].x;
            var Yhead = this.cells[0].y;

            if( (Xhead==food.x && Yhead==food.y)  ){
                score++;
                food=getRandomFood();

                // sound apply
                var sound = new Howl({
                    src: ['./sounds/strike.mp3']
                });
                  
                sound.play();
            }

            else{
                this.cells.pop();
            }


            var nextx; 
            var nexty;

            if(snake.direction=="right"){
                nextx = Xhead + 1;
                nexty = Yhead;
            }
            else if(snake.direction=="left"){
                nextx = Xhead - 1;
                nexty = Yhead;
            }
            else if(snake.direction=="down"){
                nextx = Xhead;
                nexty = Yhead+1;
            }
            else{
                nextx = Xhead;
                nexty = Yhead-1;
            }

            this.cells.unshift({x:nextx,y:nexty});

            // To prevent snake from going out
			var last_x = Math.round(W/cs);
			var last_y = Math.round(H/cs);

			if(this.cells[0].y<0 || this.cells[0].x<0 || this.cells[0].x>last_x || this.cells[0].y>last_y){      
                pen.font = "60px Roboto";
                pen.fillText("GAME OVER",120,300);
                game_over = true;
			}
        },
    };

    snake.createsnake();

    function keypressed(e){
        if(e.key=="ArrowRight"){
            snake.direction="right";
        }
        else if(e.key=="ArrowLeft"){
            snake.direction="left";
        }
        else if(e.key=="ArrowUp"){  
            snake.direction="up";
        }
        else if(e.key=="ArrowDown"){
            snake.direction="down";
        }
    }

    document.addEventListener('keydown',keypressed);
}

function draw(){
    pen.clearRect(0,0,W,H);
    snake.drawsnake();
    pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);
    document.getElementById('snakescore').innerHTML=score
}

function update(){
    snake.updatesnake();
}

function getRandomFood(){
    var foodx = Math.round(Math.random()*(W-cs)/cs);
    var foody = Math.round(Math.random()*(H-cs)/cs);
    var food = {
        x:foodx,
        y:foody,
        color:"red",
    }

    return food;
}

function gameloop(){
    if(game_over==true){    
        clearInterval(f);
    }
    draw();
    update();
}

function play(){
    document.getElementById('playbtn').style.display="none"
    init();
    f = setInterval(gameloop,100);
}