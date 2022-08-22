const N = 15;           // Grid dimensions: N x N
const TILE_SIZE = 60;   // Size (px) of squares in grid

const WIDTH = N * TILE_SIZE;
const HEIGHT = N * TILE_SIZE;

const canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
ctx.font = "30px Monospace";
ctx.textAlign = "center"

const validKeys = new Set(['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']);
const oppositeKey = {
    'ArrowUp' : 'ArrowDown',
    'ArrowLeft' : 'ArrowRight',
    'ArrowDown' : 'ArrowUp',
    'ArrowRight' : 'ArrowLeft',
}

var startMsg = "Press ARROW KEYS to move snake...";
var lastKey;  // for knowing which way to go at tick
var lastDir;  // for preventing snake going back into self
var snake, food, score, gameOver, timer;

reset()
draw();

document.addEventListener('keydown', e => {
    if (validKeys.has(e.key) && e.key != oppositeKey[lastDir]) {
        lastKey = e.key;
    }
    if (gameOver && e.key == "Enter") {
        reset();
    }

});

function reset() {
    lastKey = 'ArrowRight';  // for knowing which way to go at tick
    lastDir = 'ArrowRight';  // for preventing snake going back into self
    snake = [
        {x: 1, y: N >> 1},
        {x: 2, y: N >> 1},
        {x: 3, y: N >> 1},
        {x: 4, y: N >> 1},
    ];
    food = {x: 10, y: N >> 1};
    score = 1;
    gameOver = false;
    timer = setInterval(tick, 150);
}

function tick() {
    moveSnake();
    draw();
}

function moveSnake() {

    var tail = snake.shift();
    var dx = 0
    var dy = 0;
    var key = lastKey;
    if (key == 'ArrowUp') {
        dy = -1;
    }
    if (key == 'ArrowLeft') {
        dx = -1;
    }
    if (key == 'ArrowDown') {
        dy = 1;
    }
    if (key == 'ArrowRight') {
        dx = 1;
    }
    var head = snake[snake.length-1];
    var nx = head.x+dx;
    var ny = head.y+dy;
    var newHead = {x: nx, y: ny};
    if (snakeContains(newHead) || nx < 0 || ny < 0 || nx >= N || ny >= N) {
        snake.unshift(tail);
        clearInterval(timer);
        startMsg = "Game over! Press ENTER to play again..."
        gameOver = true;
    } else {
        snake.push(newHead)
        // did we eat food?
        if (newHead.x == food.x && newHead.y == food.y) {
            snake.unshift(tail);  // grow snake
            score++;
            while (snakeContains(food)) {
                food.x = Math.floor(Math.random() * N);
                food.y = Math.floor(Math.random() * N);
            }
        }

        lastDir = key;
        if (lastKey == oppositeKey[lastDir]) {
            lastKey = key;  // in case modified lastKey not suitable
        }
    }
}

function snakeContains(p) {
    for (const body of snake) {
        if (body.x == p.x && body.y == p.y) {
            return true;
        }
    }
    return false;
}

function draw() {
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            ctx.fillStyle = (i+j) % 2 == 0 ? "#c0c0c0" : "#c8c8c8"
            ctx.fillRect(i*TILE_SIZE, j*TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    ctx.fillStyle = "#00FFFF";
    for (const body of snake) {
        ctx.fillRect(body.x*TILE_SIZE, body.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    ctx.fillStyle = "#0080FF";
    var head = snake[snake.length-1];
    ctx.fillRect(head.x*TILE_SIZE, head.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // draw food
    const Y_PAD = 20;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x*TILE_SIZE, food.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "#000000"
    ctx.fillText(score, (food.x+.5)*TILE_SIZE, (food.y+1)*TILE_SIZE-Y_PAD);
    if (gameOver) {
        ctx.fillStyle = "#F0F0F080"
        var msg_y = food.y != N-1 ? N-1 : 0;
        ctx.fillRect(0, msg_y*TILE_SIZE, N*TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = "#000000";
        ctx.fillText(startMsg, WIDTH/2, (msg_y+1)*TILE_SIZE-Y_PAD);
    }
}