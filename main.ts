<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chrome Dino Game Clone</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: monospace;
            overflow: hidden;
            user-select: none;
        }
        #gameCanvas {
            background-color: #ffffff;
            border-bottom: 2px solid #535353;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>

    <canvas id="gameCanvas" width="800" height="250"></canvas>

<script>
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Settings
let gameSpeed = 6;
let score = 0;
let isGameOver = false;
let gameStarted = false;

// Physics configuration
const GRAVITY = 0.6;

// Entity Objects
const dino = {
    x: 50,
    y: 200,
    width: 40,
    height: 40,
    vy: 0,
    jumpForce: 12,
    isGrounded: true,
    color: "#535353",
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    jump() {
        if (this.isGrounded) {
            this.vy = -this.jumpForce;
            this.isGrounded = false;
        }
    },
    update() {
        // Apply Gravity
        this.vy += GRAVITY;
        this.y += this.vy;

        // Ground Collision Check
        const groundY = canvas.height - this.height - 10;
        if (this.y >= groundY) {
            this.y = groundY;
            this.vy = 0;
            this.isGrounded = true;
        }
    }
};

class Cactus {
    constructor() {
        this.width = 20 + Math.random() * 20; // Random cactus widths
        this.height = 30 + Math.random() * 30; // Random cactus heights
        this.x = canvas.width;
        this.y = canvas.height - this.height - 10;
        this.color = "#535353";
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.x -= gameSpeed;
    }
}

// Obstacle Management Array
let obstacles = [];
let spawnTimer = 0;

function spawnObstacle() {
    if (spawnTimer <= 0) {
        obstacles.push(new Cactus());
        // Randomize next spawn timing window
        spawnTimer = 80 + Math.random() * 60;
    }
    spawnTimer--;
}

// Collision Logic
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.width > rect2.y;
}

// Reset Game State
function resetGame() {
    obstacles = [];
    score = 0;
    gameSpeed = 6;
    isGameOver = false;
    dino.y = canvas.height - dino.height - 10;
    dino.vy = 0;
    dino.isGrounded = true;
}

// Global Text Displays
function drawText(text, x, y, size = "20px") {
    ctx.fillStyle = "#535353";
    ctx.font = `${size} monospace`;
    ctx.fillText(text, x, y);
}

// Main Animation Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        dino.draw();
        drawText("PRESS SPACE TO START", canvas.width / 2 - 110, canvas.height / 2);
        requestAnimationFrame(gameLoop);
        return;
    }

    if (!isGameOver) {
        // Update physics & entities
        dino.update();
        spawnObstacle();

        // Accelerate game engine smoothly
        gameSpeed += 0.002;
        score += 0.1;

        // Handle obstacles lifecycle
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();

            // Check if player failed
            if (checkCollision(dino, obstacles[i])) {
                isGameOver = true;
            }

            // Delete offscreen elements
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }
    }

    // Render Dino and HUD
    dino.draw();
    drawText(`SCORE: ${Math.floor(score)}`, canvas.width - 140, 30);

    if (isGameOver) {
        drawText("G A M E  O V E R", canvas.width / 2 - 80, canvas.height / 2 - 10);
        drawText("PRESS SPACE TO RESTART", canvas.width / 2 - 120, canvas.height / 2 + 20, "15px");
    }

    requestAnimationFrame(gameLoop);
}

// Keyboard Input Event Listeners
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
        } else if (isGameOver) {
            resetGame();
        } else {
            dino.jump();
        }
    }
});

// Run Engine
gameLoop();
</script>
</body>
</html>
