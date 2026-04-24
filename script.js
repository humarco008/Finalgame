const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// === IMPORTANTE PER PIXEL ART: Disattiva la sfocatura ===
ctx.imageSmoothingEnabled = false;

// --- CARICAMENTO RISORSE ---

// 1. Sfondo (La tua pietra)
const bgImage = new Image();
bgImage.src = 'image_b20f58.png'; // Assicurati di avere questo file
let bgPattern;
bgImage.onload = () => { 
    bgPattern = ctx.createPattern(bgImage, 'repeat'); 
};

// 2. Personaggio (L'immagine con TRASPARENZA REALE)
const playerImage = new Image();
// SALVA L'IMMAGINE SOPRA CON QUESTO NOME
playerImage.src = 'personaggio_trasparente.png'; 

let playerLoaded = false;
playerImage.onload = () => {
    playerLoaded = true;
};

const player = {
    x: 50,
    y: 50,
    width: 30,         // Dimensione visiva
    height: 30,        // Dimensione visiva
    collisionSize: 22, // Scatola di collisione
    speed: 4
};

// --- OSTACOLI ---
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
    // Pulisce il canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Re-imposta smoothing ad ogni frame (a volte necessario)
    ctx.imageSmoothingEnabled = false;

    // 1. Disegna il Pavimento (Pattern di Pietra)
    if (bgPattern) {
        ctx.fillStyle = bgPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Disegna gli Ostacoli (Rocce marroni)
    ctx.fillStyle = '#5d4037'; 
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
    });

    // 3. Disegna il Personaggio Trasparente
    if (playerLoaded) {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
        // Fallback rosso
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

// Avvia il loop del gioco
draw();