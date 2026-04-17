        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const player = {
            x: 50,
            y: 50,
            size: 30,
            speed: 4,
            color: '#4CAF50'
        };

  
        const obstacles = [
            { x: 150, y: 100, w: 100, h: 100 },
            { x: 400, y: 50, w: 50, h: 200 },
            { x: 200, y: 300, w: 200, h: 40 }
        ];

        const keys = {};
        window.addEventListener('keydown', e => keys[e.code] = true);
        window.addEventListener('keyup', e => keys[e.code] = false);

      
        function checkCollision(newX, newY) {
   
            if (newX < 0 || newX + player.size > canvas.width || 
                newY < 0 || newY + player.size > canvas.height) {
                return true;
            }

            for (let obs of obstacles) {
                if (newX < obs.x + obs.w &&
                    newX + player.size > obs.x &&
                    newY < obs.y + obs.h &&
                    newY + player.size > obs.y) {
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

    
            if (!checkCollision(nextX, player.y)) {
                player.x = nextX;
            }
            if (!checkCollision(player.x, nextY)) {
                player.y = nextY;
            }
        }

        function draw() {
       
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#FF5252';
            obstacles.forEach(obs => {
                ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            });

            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.size, player.size);

            requestAnimationFrame(() => {
                update();
                draw();
            });
        }

        draw(); 