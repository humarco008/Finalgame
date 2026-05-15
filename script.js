const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentMap = 'CASA';

const maps = {
    'CASA': {
        color: '#f3e5ab', // Crema/Parquet chiaro
        obstacles: [
            // Mura perimetrali interne
            { x: 0, y: 0, w: 800, h: 40, color: '#5d4037' }, 
            // Letto (proporzionato: Ash ci starebbe comodo sopra)
            { x: 50, y: 50, w: 70, h: 100, color: '#e91e63', label: "LETTO" },
            // Scrivania PC
            { x: 600, y: 50, w: 120, h: 60, color: '#8d6e63', label: "PC" },
            // Grande tappeto centrale (estetico)
            { x: 250, y: 250, w: 300, h: 200, color: '#c62828', isFloor: true },
            // Librerie giganti (parete sinistra)
            { x: 40, y: 200, w: 40, h: 300, color: '#4e342e' },
            // Armadio
            { x: 720, y: 200, w: 40, h: 150, color: '#4e342e' }
        ],
        door: { x: 740, y: 520, w: 60, h: 40, target: 'CITTA', spawnX: 110, spawnY: 200 },
        npcs: []
    },
    'CITTA': {
        color: '#91d058', // Verde brillante Pokémon
        obstacles: [
            // Strade (estetiche, grigie)
            { x: 0, y: 180, w: 800, h: 100, color: '#9e9e9e', isFloor: true },
            { x: 350, y: 0, w: 100, h: 600, color: '#9e9e9e', isFloor: true },
            // Casa di Ash (Edificio grande)
            { x: 40, y: 40, w: 180, h: 140, color: '#ff8a65', label: "CASA TUA" },
            // Centro Pokémon (Rosso)
            { x: 500, y: 40, w: 220, h: 140, color: '#ef5350', label: "POKÉ CENTER" },
            // Pokémon Market (Blu)
            { x: 500, y: 350, w: 220, h: 140, color: '#42a5f5', label: "MARKET" },
            // Laghetto (Blu scuro)
            { x: 50, y: 350, w: 200, h: 200, color: '#0288d1', label: "ACQUA" },
            // Alberi ornamentali
            { x: 280, y: 40, w: 40, h: 40, color: '#2e7d32' },
            { x: 280, y: 100, w: 40, h: 40, color: '#2e7d32' },
            { x: 420, y: 450, w: 40, h: 40, color: '#2e7d32' }
        ],
        door: { x: 90, y: 170, w: 40, h: 20, target: 'CASA', spawnX: 700, spawnY: 480 },
        npcs: [
            { x: 420, y: 210, name: "BULLO" },
            { x: 550, y: 290, name: "INFERMIERA" }
        ]
    }
};

const player = {
    x: 380, y: 280,
    width: 40, height: 40, // Ridimensionato per proporzioni migliori
    collisionSize: 28,
    speed: 5,
    frameIndex: 0,
    frameCount: 0,
    isMoving: false
};

const keys = {};
window.onkeydown = e => keys[e.code] = true;
window.onkeyup = e => keys[e.code] = false;

function checkCollision(newX, newY, obj) {
    const pX = newX + (player.width - player.collisionSize) / 2;
    const pY = newY + (player.height - player.collisionSize) / 2;
    const oW = obj.w || 40; 
    const oH = obj.h || 40; 
    return (pX < obj.x + oW && pX + player.collisionSize > obj.x &&
            pY < obj.y + oH && pY + player.collisionSize > obj.y);
}

function update() {
    let nextX = player.x, nextY = player.y;
    player.isMoving = false;
    const map = maps[currentMap];

    if (keys['ArrowUp']) { nextY -= player.speed; player.isMoving = true; }
    if (keys['ArrowDown']) { nextY += player.speed; player.isMoving = true; }
    if (keys['ArrowLeft']) { nextX -= player.speed; player.isMoving = true; }
    if (keys['ArrowRight']) { nextX += player.speed; player.isMoving = true; }

    if (nextX < 0) nextX = 0;
    if (nextX + player.width > canvas.width) nextX = canvas.width - player.width;
    if (nextY < 0) nextY = 0;
    if (nextY + player.height > canvas.height) nextY = canvas.height - player.height;

    let canMoveX = true, canMoveY = true;
    const obstaclesOnly = [...map.obstacles.filter(o => !o.isFloor), ...map.npcs.map(n => ({x: n.x, y: n.y}))];
    
    for (let item of obstaclesOnly) {
        if (checkCollision(nextX, player.y, item)) canMoveX = false;
        if (checkCollision(player.x, nextY, item)) canMoveY = false;
    }

    if (canMoveX) player.x = nextX;
    if (canMoveY) player.y = nextY;

    if (checkCollision(player.x, player.y, map.door)) {
        player.x = map.door.spawnX;
        player.y = map.door.spawnY;
        currentMap = map.door.target;
    }

    if (player.isMoving) {
        player.frameCount++;
        if (player.frameCount % 8 === 0) player.frameIndex = (player.frameIndex + 1) % playerFrames.length;
    } else { player.frameIndex = 0; }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const map = maps[currentMap];

    ctx.fillStyle = map.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Disegno Ostacoli e Pavimenti
    map.obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        
        if (!obs.isFloor) {
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        }
        
        if (obs.label) {
            ctx.fillStyle = "white";
            ctx.font = "bold 12px 'Courier New'";
            ctx.textAlign = "center";
            ctx.fillText(obs.label, obs.x + obs.w/2, obs.y + obs.h/2 + 5);
        }
    });

    // Porta (Invisibile o luminosa)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(map.door.x, map.door.y, map.door.w, map.door.h);

    // NPC
    map.npcs.forEach(npc => {
        ctx.drawImage(npcImage, npc.x, npc.y, 40, 40);
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(npc.name, npc.x + 20, npc.y - 5);
    });

    // Player
    if (framesLoaded > 0) {
        ctx.drawImage(playerFrames[player.frameIndex], player.x, player.y, player.width, player.height);
    }

    update();
    requestAnimationFrame(draw);
}

draw();