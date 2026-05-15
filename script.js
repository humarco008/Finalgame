const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentMap = 'CASA';

const maps = {
    'CASA': {
        color: '#3e2723', 
        obstacles: [
            { x: 0, y: 0, w: 800, h: 20, color: '#1b1102' },
            { x: 50, y: 50, w: 80, h: 120, color: '#ffffff', label: "LETTO" },
            { x: 600, y: 50, w: 100, h: 15, color: '#000000', label: "TV" },
            { x: 580, y: 65, w: 140, h: 40, color: '#5d4037' }, 
            { x: 580, y: 220, w: 140, h: 60, color: '#795548', label: "DIVANO" },
            { x: 20, y: 250, w: 50, h: 200, color: '#2b1d0e' },
            { x: 250, y: 300, w: 200, h: 150, color: '#4e342e', isFloor: true }
        ],
        door: { x: 740, y: 500, w: 60, h: 60, color: '#a1887f', target: 'CITTA', spawnX: 110, spawnY: 200 }
    },
    'CITTA': {
        color: '#7cb342', // Verde erba bosco
        obstacles: [
            // Strade di terra battuta (Calpestabili)
            { x: 0, y: 180, w: 800, h: 100, color: '#d7ccc8', isFloor: true },
            { x: 350, y: 0, w: 100, h: 600, color: '#d7ccc8', isFloor: true },
            
            // Edifici principali
            { x: 40, y: 40, w: 180, h: 140, color: '#ff8a65', label: "CASA TUA" },
            { x: 500, y: 40, w: 220, h: 140, color: '#ef5350', label: "POKÉMON CENTER" },
            
            // --- AREA BOSCO (Ex area acqua) ---
            // Un ammasso di alberi (verdi scuri) e cespugli (verdi chiari)
            { x: 50, y: 350, w: 60, h: 60, color: '#1b5e20', label: "ALBERO" },
            { x: 110, y: 350, w: 60, h: 60, color: '#2e7d32' },
            { x: 170, y: 350, w: 60, h: 60, color: '#1b5e20' },
            { x: 50, y: 410, w: 60, h: 60, color: '#43a047', label: "CESPUGLIO" },
            { x: 110, y: 410, w: 60, h: 60, color: '#1b5e20' },
            { x: 170, y: 410, w: 60, h: 60, color: '#2e7d32' },
            { x: 50, y: 470, w: 180, h: 80, color: '#1b5e20', label: "BOSCO FITTO" },

            // Altri alberi sparsi per la città
            { x: 300, y: 50, w: 40, h: 40, color: '#1b5e20' },
            { x: 460, y: 300, w: 40, h: 40, color: '#1b5e20' },
            { x: 600, y: 500, w: 60, h: 60, color: '#2e7d32', label: "ALBERO" }
        ],
        door: { x: 90, y: 170, w: 40, h: 20, target: 'CASA', spawnX: 680, spawnY: 510 },
        npcs: [
            { x: 420, y: 210, name: "EISA" },
            { x: 550, y: 290, name: "PIPPO" },
            { x: 280, y: 450, name: "MAMADOU" }
        ]
    }
};

const player = {
    x: 140, // Spawn vicino al letto
    y: 80,
    width: 40, 
    height: 40,
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
    const obstaclesOnly = [...map.obstacles.filter(o => !o.isFloor)];
    if (map.npcs) obstaclesOnly.push(...map.npcs.map(n => ({x: n.x, y: n.y})));
    
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

    // Disegno Porta/Uscita
    ctx.fillStyle = map.door.color || 'rgba(255,255,0,0.2)';
    ctx.fillRect(map.door.x, map.door.y, map.door.w, map.door.h);

    // Disegno Oggetti Mappa
    map.obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        
        if (obs.label) {
            ctx.fillStyle = (obs.color === '#ffffff' || obs.color === '#d7ccc8') ? 'black' : 'white';
            ctx.font = "bold 10px Arial";
            ctx.textAlign = "center";
            ctx.fillText(obs.label, obs.x + obs.w/2, obs.y + obs.h/2 + 5);
        }
    });

    // NPC con i nuovi nomi
    if (map.npcs) {
        map.npcs.forEach(npc => {
            if (npcImage.complete) ctx.drawImage(npcImage, npc.x, npc.y, 40, 40);
            ctx.fillStyle = "black";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(npc.name, npc.x + 20, npc.y - 5);
        });
    }

    // Ash
    if (framesLoaded > 0) {
        ctx.drawImage(playerFrames[player.frameIndex], player.x, player.y, player.width, player.height);
    }

    update();
    requestAnimationFrame(draw);
}

draw();