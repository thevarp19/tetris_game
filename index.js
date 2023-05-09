const scoreMax = document.getElementById(".score-max");
const scoreLast = document.getElementById("score-last");
const gameOver = document.querySelector(".game-over");
const startGameBtn = document.querySelector(".start-game-btn");


var latestScore = localStorage.getItem("latestScore");
let score;
var maxScore = localStorage.getItem("maxScore");




function createAudio(path) {
    scoreLast.innerHTML = latestScore;
    scoreMax.innerHTML = maxScore;
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


