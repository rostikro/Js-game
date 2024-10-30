const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerTank = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 60,
    angle: -Math.PI / 2,
    speed: 4,
    bullets: []
};

const enemyTanks = [];
const enemyBullets = [];

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

window.addEventListener("keydown", (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code in keys) {
        keys[e.code] = false;
    }
});

function drawPlayerTank() {
    ctx.save();
    ctx.translate(playerTank.x, playerTank.y);
    ctx.rotate(playerTank.angle + Math.PI / 2);

    ctx.fillStyle = "#555";
    ctx.fillRect(-playerTank.width / 2 - 5, -playerTank.height / 2, 10, playerTank.height);
    ctx.fillRect(playerTank.width / 2 - 5, -playerTank.height / 2, 10, playerTank.height);

    const bodyGradient = ctx.createLinearGradient(-playerTank.width / 2, 0, playerTank.width / 2, 0);
    bodyGradient.addColorStop(0, "#4CAF50");
    bodyGradient.addColorStop(1, "#81C784");
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-playerTank.width / 2, -playerTank.height / 2, playerTank.width, playerTank.height);

    ctx.beginPath();
    ctx.arc(0, 0, playerTank.width / 3, 0, Math.PI * 2);
    ctx.fillStyle = "#2E7D32";
    ctx.fill();
    ctx.fillStyle = "#1B5E20";
    ctx.fillRect(-3, -playerTank.height / 2 - 20, 6, 20);

    ctx.restore();
}

function drawEnemyTank(enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.angle + Math.PI / 2);

    ctx.fillStyle = "#D32F2F";
    ctx.fillRect(-enemy.width / 2 - 5, -enemy.height / 2, 10, enemy.height);
    ctx.fillRect(enemy.width / 2 - 5, -enemy.height / 2, 10, enemy.height);

    const bodyGradient = ctx.createLinearGradient(-enemy.width / 2, 0, enemy.width / 2, 0);
    bodyGradient.addColorStop(0, "#F44336");
    bodyGradient.addColorStop(1, "#FF7043");
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);

    ctx.beginPath();
    ctx.arc(0, 0, enemy.width / 3, 0, Math.PI * 2);
    ctx.fillStyle = "#C62828";
    ctx.fill();

    ctx.fillStyle = "#B71C1C";
    ctx.fillRect(-3, -enemy.height / 2 - 20, 6, 20);

    ctx.restore();
}


function shootBullet() {
    const barrelLength = playerTank.height / 2 + 20;
    const bulletX = playerTank.x + Math.cos(playerTank.angle) * barrelLength;
    const bulletY = playerTank.y + Math.sin(playerTank.angle) * barrelLength;

    playerTank.bullets.push({
        x: bulletX,
        y: bulletY,
        angle: playerTank.angle,
        speed: 5
    });
}

function updateBullets() {
    playerTank.bullets.forEach((bullet, index) => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            playerTank.bullets.splice(index, 1);
        }

        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
    });
}

function generateEnemyTanks(n) {
    for (let i = 0; i < n; i++) {
        const enemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: 40,
            height: 60,
            angle: Math.random() * Math.PI * 2,
            speed: 2,
            shootTimer: Math.random() * 2000
        };
        enemyTanks.push(enemy);
    }
}

function updateEnemyTanks() {
    enemyTanks.forEach((enemy) => {
        enemy.x += Math.cos(enemy.angle) * enemy.speed;
        enemy.y += Math.sin(enemy.angle) * enemy.speed;

        if (Math.random() < 0.02) {
            enemy.angle += (Math.random() - 0.5) * Math.PI;
        }

        drawEnemyTank(enemy);

        enemy.shootTimer -= 16;
        if (enemy.shootTimer <= 0) {
            shootEnemyBullet(enemy);
            enemy.shootTimer = Math.random() * 2000 + 1000;
        }
    });
}

function shootEnemyBullet(enemy) {
    const bulletX = enemy.x;
    const bulletY = enemy.y;
    const bulletSpeed = 2;

    enemyBullets.push({
        x: bulletX,
        y: bulletY,
        angle: Math.atan2(playerTank.y - bulletY, playerTank.x - bulletX),
        speed: bulletSpeed
    });
}

function updateEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
        }

        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
    });
}

function handleKeyboardInput() {
    let newX = playerTank.x;
    let newY = playerTank.y;

    if (keys.ArrowUp) {
        newX += Math.cos(playerTank.angle) * playerTank.speed;
        newY += Math.sin(playerTank.angle) * playerTank.speed;
    }
    if (keys.ArrowDown) {
        newX -= Math.cos(playerTank.angle) * playerTank.speed;
        newY -= Math.sin(playerTank.angle) * playerTank.speed;
    }
    if (keys.ArrowLeft) {
        playerTank.angle -= 0.05;
    }
    if (keys.ArrowRight) {
        playerTank.angle += 0.05;
    }
    if (keys.Space) {
        shootBullet();
        keys.Space = false;
    }

    playerTank.x = newX;
    playerTank.y = newY;
}

function checkCollisions() {
    playerTank.bullets.forEach((bullet, bulletIndex) => {
        enemyTanks.forEach((enemy, enemyIndex) => {
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.hypot(dx, dy);

            if (distance < enemy.width / 2) {
                playerTank.bullets.splice(bulletIndex, 1);
                enemyTanks.splice(enemyIndex, 1);
            }
        });
    });

    enemyBullets.forEach((bullet, bulletIndex) => {
        const dx = bullet.x - playerTank.x;
        const dy = bullet.y - playerTank.y;
        const distance = Math.hypot(dx, dy);

        if (distance < playerTank.width / 2) {
            //alert("Game Over!");
            document.location.reload();
        }
    });
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayerTank();
    updateBullets();
    
    updateEnemyTanks();
    updateEnemyBullets();

    handleKeyboardInput();

    checkCollisions();

    requestAnimationFrame(gameLoop);
}

generateEnemyTanks(1);
gameLoop();
