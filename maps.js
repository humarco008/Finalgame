import { npcImage } from './sprite.js';

const maps = {
    'CASA': {
        color: '#3e2723',
        obstacles: [
            { x: 0, y: 0, w: 800, h: 20, color: '#1b1102' },
            { x: 50, y: 50, w: 80, h: 120, color: '#ffffff', label: 'LETTO' },
            { x: 600, y: 50, w: 100, h: 15, color: '#000000', label: 'TV' },
            { x: 580, y: 65, w: 140, h: 40, color: '#5d4037' },
            { x: 580, y: 220, w: 140, h: 60, color: '#795548', label: 'DIVANO' },
            { x: 20, y: 250, w: 50, h: 200, color: '#2b1d0e' },
            { x: 250, y: 300, w: 200, h: 150, color: '#4e342e', isFloor: true }
        ],
        door: { x: 740, y: 500, w: 60, h: 60, color: '#a1887f', target: 'CITTA', spawnX: 110, spawnY: 200 }
    },
    'CITTA': {
        color: '#7cb342',
        obstacles: [
            { x: 0, y: 180, w: 800, h: 100, color: '#d7ccc8', isFloor: true },
            { x: 350, y: 0, w: 100, h: 600, color: '#d7ccc8', isFloor: true },
            { x: 40, y: 40, w: 180, h: 140, color: '#ff8a65', label: 'CASA TUA' },
            { x: 500, y: 40, w: 220, h: 140, color: '#ef5350', label: 'POKÉMON CENTER' },
            { x: 50, y: 350, w: 60, h: 60, color: '#1b5e20', label: 'ALBERO' },
            { x: 110, y: 350, w: 60, h: 60, color: '#2e7d32' },
            { x: 170, y: 350, w: 60, h: 60, color: '#1b5e20' },
            { x: 50, y: 410, w: 60, h: 60, color: '#43a047', label: 'CESPUGLIO' },
            { x: 110, y: 410, w: 60, h: 60, color: '#1b5e20' },
            { x: 170, y: 410, w: 60, h: 60, color: '#2e7d32' },
            { x: 50, y: 470, w: 180, h: 80, color: '#1b5e20', label: 'BOSCO FITTO' },
            { x: 300, y: 50, w: 40, h: 40, color: '#1b5e20' },
            { x: 460, y: 300, w: 40, h: 40, color: '#1b5e20' },
            { x: 600, y: 500, w: 60, h: 60, color: '#2e7d32', label: 'ALBERO' }
        ],
        door: { x: 90, y: 170, w: 40, h: 20, target: 'CASA', spawnX: 680, spawnY: 510 },
        npcs: [
            { x: 420, y: 210, name: 'EISA' },
            { x: 550, y: 290, name: 'PIPPO' },
            { x: 280, y: 450, name: 'MAMADOU' }
        ]
    }
};

let currentMap = 'CASA';

export function getCurrentMapKey() {
    return currentMap;
}

export function setCurrentMap(key) {
    if (maps[key]) {
        currentMap = key;
    }
}

export function getCurrentMap() {
    return maps[currentMap];
}

export function drawMap(ctx) {
    const map = getCurrentMap();

    ctx.fillStyle = map.color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = map.door.color || 'rgba(255,255,0,0.2)';
    ctx.fillRect(map.door.x, map.door.y, map.door.w, map.door.h);

    map.obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

        if (obs.label) {
            ctx.fillStyle = (obs.color === '#ffffff' || obs.color === '#d7ccc8') ? 'black' : 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + obs.h / 2 + 5);
        }
    });

    if (map.npcs) {
        map.npcs.forEach(npc => {
            if (npcImage.complete) {
                ctx.drawImage(npcImage, npc.x, npc.y, 40, 40);
            }
            ctx.fillStyle = 'black';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(npc.name, npc.x + 20, npc.y - 5);
        });
    }
}
