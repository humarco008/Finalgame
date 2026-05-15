import { drawMap, getCurrentMap } from './maps.js';
import { player, setupInputListeners, updatePlayer } from './player.js';
import { playerFrames, framesLoaded } from './sprite.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

setupInputListeners();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap(ctx);
    const map = getCurrentMap();

    if (framesLoaded > 0) {
        ctx.drawImage(playerFrames[player.frameIndex], player.x, player.y, player.width, player.height);
    }

    updatePlayer(map, canvas);
    requestAnimationFrame(draw);
}

draw();