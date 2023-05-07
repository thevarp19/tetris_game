const scoreGame = document.getElementById("score-num");
var scoreLast= document.querySelectorAll(".score-last");
var scoreMax = document.querySelectorAll(".score-max");

const gameOver = document.querySelector(".game-over");
const startGameBtn = document.querySelector(".start-game-btn");
const canvas = document.querySelector(".canvas");

canvas.width = 300;
canvas.height = 400;

const context = canvas.getContext("2d");

const backgroundSound = createAudio("audio/Background.mp3");
const dropSound = createAudio("audio/Drop.wav");
const gameOverSound = createAudio("audio/Gameover.wav");
const lineClear = createAudio("audio/Lineclear.wav");

let dropCounter;
let dropInterval;

let rowsFill;
let latestScore = localStorage.getItem("latestScore");
let score;
let maxScore = localStorage.getItem("maxScore");

let squareSize = 20;
let gameWidth = (canvas.width / squareSize);
let gameHeight = canvas.height / squareSize;

scoreLast.innerHTML = latestScore;
scoreMax.innerHTML = maxScore;

class TetrisGame{
    constructor(n) {
        const tetrominoesLetters = ["I", "J", "L", "O", "S", "T", "Z"];
        if (tetrominoesLetters[n] == "I") {
            this.matrix = [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        } else if (tetrominoesLetters[n] == "J") {
            this.matrix = [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
            ];
        }else if (tetrominoesLetters[n] == "L") {
            this.matrix = [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
            ];
        }else if (tetrominoesLetters[n] == "O") {
            this.matrix = [
                [1, 1],
                [1, 1]
            ];
        }else if (tetrominoesLetters[n] == "S") {
            this.matrix = [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ];
        }else if (tetrominoesLetters[n] == "T") {
            this.matrix = [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        }else if (tetrominoesLetters[n] == "Z") {
            this.matrix = [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ];
        }
        // console.log(this.matrix);
        /// Rows === Cols
        this.len = this.matrix.length;
        let rand = Math.floor(Math.random() * 360);
        this.color = `hsl(${rand} , 50% , 50%)`;
    }

    draw(offset) {
        for (let i = 0; i < this.len; i++){
            for (let j = 0; j < this.len; j++){
                if (this.matrix[i][j] !== 0) {
                    context.beginPath();
                    context.fillStyle = this.color;
                    context.strokeStyle = "black";
                    context.fillRect(squareSize * (j + offset.x),
                        squareSize * (i + offset.y),
                        squareSize, squareSize);
                    context.strokeRect(squareSize * (j + offset.x),
                        squareSize * (i + offset.y),
                        squareSize, squareSize);
                    context.closePath();
                }
            }
        }
    }

    rotate(dir) {
        // Transpose
        const mat = this.matrix;
        for (let i = 0; i < this.len; i++){
            for (let j = 0; j < i; j++){
                [
                    mat[i][j],
                    mat[j][i]
                ] = [
                        mat[j][i],
                        mat[i][j]
                    ];
            }
        }

        // Reverse
        if (dir > 0) {
            this.matrix.forEach(row => row.reverse());
        } else {
            this.matrix.reverse();
        }

        this.matrix = mat;
    }
}

class Player{
    constructor() {
        /// Random Number From 0 to 6
        let rand = Math.floor(Math.random() * 7);
        this.shape = new TetrisGame(rand);

        this.position = {
            x: (gameWidth/2 | 0) - (this.shape.len / 2 | 0),
            y: 0,
        }
    }

    draw() {
        this.shape.draw(this.position);
    }

    rotate(dir) {
        this.shape.rotate(dir);
    }
}

class Matrix{
    
    drop() {
        this.player.position.y++;
        dropSound.play();
        /// Collision Detection
        if (this.collision(this.player.shape.matrix , this.player.position)) {
            this.player.position.y--;
            this.merge();
            this.gridSweep();
            this.player = new Player();
        }
        dropCounter = 0;
        
    }

    move(dir) {
        this.player.position.x += dir;
        if (this.collision(this.player.shape.matrix , this.player.position)) {
            this.player.position.x -= dir;
        }
    }

    rotate(dir) {
        /// I will Recode This
        const pos = this.player.position.x;
        this.player.rotate(dir);
        let offset = 1;
        while (this.collision(this.player.shape.matrix, this.player.position)) {
            this.player.pos += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.shape.len) {
                this.player.rotate(-dir);
                this.player.position.x = pos;
                return;
            }
        }
    }

    draw() {
        const height = this.grid.length;
        const width = this.grid[0].length;
        for (let i = 0; i < height; i++){
            for (let j = 0; j < width; j++){
                if (this.grid[i][j] !== 0) {
                    context.beginPath();
                    context.fillStyle = "yellow";
                    context.strokeStyle = "black";
                    context.fillRect(squareSize * j,
                        squareSize * i,
                        squareSize, squareSize);
                    context.strokeRect(squareSize * j,
                        squareSize * i,
                        squareSize, squareSize);
                    context.closePath();
                } else {
                    context.beginPath();
                    context.fillStyle = "red";
                    context.strokeStyle = "rgb(144, 25, 255)";
                    context.fillRect(squareSize * j,
                        squareSize * i,
                        squareSize, squareSize);
                    context.strokeRect(squareSize * j,
                        squareSize * i,
                        squareSize, squareSize);
                    context.closePath();
                }
            }
        }
        this.player.draw();
    }
    constructor(w , h){
        this.grid = [];
        while (h--)
            this.grid.push(new Array(w).fill(0));
        this.player = new Player();
    }
    merge() {

        this.player.shape.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.grid[y + this.player.position.y][x + this.player.position.x] = value;
                }
            });
        });
    }


    collision(mat , pos) {
        for (let i = 0; i < mat.length; i++){
            for (let j = 0; j < mat[i].length; j++){
                if (mat[i][j] !== 0 && (this.grid[i + pos.y] && this.grid[i + pos.y][j + pos.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    gridSweep() {
        outer: for (let i = gameHeight - 1; i > 0 ; i--) {
            for (let j = 0; j < gameWidth; j++){
                if (this.grid[i][j] === 0) {
                    continue outer;
                }
            }
            lineClear.play();
            const row = this.grid.splice(i, 1)[0].fill(0);
            this.grid.unshift(row);
            ++i;
            score += rowsFill;
            rowsFill += 500;
            scoreGame.innerHTML = score; 
        }
    }
}


let game;
let lastTime;
let animateID;
function animate(time = 0) {
    const delayTime = time - lastTime;
    lastTime = time;
    dropCounter += delayTime;

    if (dropCounter > dropInterval) {
        game.drop();
    }

    animateID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.draw();
    
    if (game.player.position.y === 0 && game.collision(game.player.shape.matrix , game.player.position)) {
        gameOverSound.play();
        localStorage.setItem("latestScore", score)
        if(maxScore < score){
        localStorage.setItem("maxScore", score)
        }
        console.log("Game Over");
        scoreGame.innerHTML = score; 
        cancelAnimationFrame(animateID);
        // setTimeout(5000);
        window.location='index.html'

    }

    scoreGame.innerHTML = score;
    localStorage.setItem("latestScore", score)
    if(maxScore < scoreGame){
        localStorage.setItem("maxScore", scoreGame)
    }
}

function createAudio(path) {
    const audio = new Audio();
    audio.src = path;
    return audio;
}

function initGame() {
    game = new Matrix(gameWidth, gameHeight);
    rowsFill = 100;
    score = 0;

    dropCounter = 0;
    dropInterval = 1000;
    lastTime = 0;

    backgroundSound.play();
    backgroundSound.volume = 0.1;

    animate();
}



startGameBtn.addEventListener("click", () => {
    gameOver.style.display = "none";
    initGame();
});


document.addEventListener("keydown", event => {
    // console.log(event.key);
    switch (event.key) {
        case "ArrowUp":
            game.rotate(1);
            break;
        case "Control":
            game.rotate(-1);
            break;
        case "ArrowDown":
            game.drop();
            break;
        case "ArrowLeft":
            game.move(-1);
            break;
        case "ArrowRight":
            game.move(1);
            break;
    }
});