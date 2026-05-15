import { setCurrentMap } from './maps.js';
import { playerFrames } from './sprite.js';

export const player = {
    x: 140,
    y: 80,
    width: 40,
    height: 40,
    collisionSize: 28,
    speed: 5,
    frameIndex: 0,
    frameCount: 0,
    isMoving: false
};

export const keys = {};

export function setupInputListeners() {
    window.addEventListener('keydown', event => {
        keys[event.code] = true;
    });

    window.addEventListener('keyup', event => {
        keys[event.code] = false;
    });
}

function checkCollision(newX, newY, obj) {
    const pX = newX + (player.width - player.collisionSize) / 2;
    const pY = newY + (player.height - player.collisionSize) / 2;
    const oW = obj.w || 40;
    const oH = obj.h || 40;

    return (pX < obj.x + oW && pX + player.collisionSize > obj.x &&
            pY < obj.y + oH && pY + player.collisionSize > obj.y);
}

export function updatePlayer(map, canvas) {
    let nextX = player.x;
    let nextY = player.y;
    player.isMoving = false;

    if (keys['ArrowUp']) { nextY -= player.speed; player.isMoving = true; }
    if (keys['ArrowDown']) { nextY += player.speed; player.isMoving = true; }
    if (keys['ArrowLeft']) { nextX -= player.speed; player.isMoving = true; }
    if (keys['ArrowRight']) { nextX += player.speed; player.isMoving = true; }

    if (nextX < 0) nextX = 0;
    if (nextX + player.width > canvas.width) nextX = canvas.width - player.width;
    if (nextY < 0) nextY = 0;
    if (nextY + player.height > canvas.height) nextY = canvas.height - player.height;

    let canMoveX = true;
    let canMoveY = true;

    const obstaclesOnly = [...map.obstacles.filter(o => !o.isFloor)];
    if (map.npcs) obstaclesOnly.push(...map.npcs.map(npc => ({ x: npc.x, y: npc.y })));

    for (let item of obstaclesOnly) {
        if (checkCollision(nextX, player.y, item)) canMoveX = false;
        if (checkCollision(player.x, nextY, item)) canMoveY = false;
    }

    if (canMoveX) player.x = nextX;
    if (canMoveY) player.y = nextY;

    if (checkCollision(player.x, player.y, map.door)) {
        player.x = map.door.spawnX;
        player.y = map.door.spawnY;
        setCurrentMap(map.door.target);
    }

    if (player.isMoving) {
        player.frameCount++;
        if (player.frameCount % 8 === 0) {
            player.frameIndex = (player.frameIndex + 1) % playerFrames.length;
        }
    } else {
        player.frameIndex = 0;
    }
}
