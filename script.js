const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


ctx.imageSmoothingEnabled = false;

const bgImage = new Image();
bgImage.src = 'image_b20f58.png'; 
let bgPattern;
bgImage.onload = () => { 
    bgPattern = ctx.createPattern(bgImage, 'repeat'); 
};

const playerImage = new Image();

playerImage.src = 'personaggio_trasparente.png'; 

let playerLoaded = false;
playerImage.onload = () => {
    playerLoaded = true;
};

const player = {
    x: 50,
    y: 50,
    width: 30,         
    height: 30,        
    collisionSize: 22,
    speed: 4
};


const obstacles = [
    { x: 0, y: 0, w: 600, h: 20 },      
    { x: 0, y: 380, w: 600, h: 20 },    
    { x: 0, y: 0, w: 20, h: 400 },      
    { x: 580, y: 0, w: 20, h: 400 },    
    { x: 120, y: 20, w: 40, h: 180 },
    { x: 120, y: 240, w: 200, h: 40 }, 
    { x: 300, y: 0, w: 40, h: 120 },
    { x: 420, y: 80, w: 100, h: 120 },
    { x: 400, y: 280, w: 180, h: 40 },
    { x: 220, y: 320, w: 40, h: 60 },
    { x: 0, y: 280, w: 140, h: 40 }
];

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function checkCollision(newX, newY) {
    const pX = newX + (player.width - player.collisionSize) / 2;
    const pY = newY + (player.height - player.collisionSize) / 2;

    for (let obs of obstacles) {
        if (pX < obs.x + obs.w &&
            pX + player.collisionSize > obs.x &&
            pY < obs.y + obs.h &&
            pY + player.collisionSize > obs.y) {
            return true; 
        }
    }
    return false;
}

function update() {
    let nextX = player.x;
    let nextY = player.y;

    if (keys['ArrowUp'])    nextY -= player.speed;
    if (keys['ArrowDown'])  nextY += player.speed;
    if (keys['ArrowLeft'])  nextX -= player.speed;
    if (keys['ArrowRight']) nextX += player.speed;

    if (!checkCollision(nextX, player.y)) player.x = nextX;
    if (!checkCollision(player.x, nextY)) player.y = nextY;
}

function draw() {
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    ctx.imageSmoothingEnabled = false;

   
    if (bgPattern) {
        ctx.fillStyle = bgPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

  
    ctx.fillStyle = '#5d4037'; 
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
    });

  
    if (playerLoaded) {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
 
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    requestAnimationFrame(() => {
        update();
        draw();
    });
}


draw();