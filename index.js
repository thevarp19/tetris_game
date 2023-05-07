const scoreLast = document.querySelectorAll(".score-number");
const scoreMax = document.querySelectorAll(".score-max");
const gameOver = document.querySelector(".game-over");
const startGameBtn = document.querySelector(".start-game-btn");
const canvas = document.querySelector(".canvas");

const searchParams = new URLSearchParams(window.location.search);
const button_start = searchParams.get("button_start");

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

scoreEl.innerHTML = latestScore;
scoreEl1.innerHTML = maxScore;


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


