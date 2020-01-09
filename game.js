(function () {
    'use strict';
    window.addEventListener('load', init, false);
    var canvas = null, ctx = null;
    var lastPress = null;
    var mousex = 0, mousey = 0;
    var score = 0;
    var bgColor = '#000';
    var player = null;
    var lastUpdate = 0;
    var counter = 0;
    var pause = false;
    var gameover = false;
    var bombs = [];
    var eTimer = 0;


    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 200;
        player = new Circle(0, 0, 5);
        enableInputs();
        run();
    }

    function random(max) {
        return ~~(Math.random() * max);
    }

    function run() {
        requestAnimationFrame(run);
        var now = Date.now();
        var deltaTime = (now - lastUpdate) / 1000;
        if (deltaTime > 1) deltaTime = 0;
        lastUpdate = now;
        act(deltaTime);
        paint(ctx);
    }

    function act(deltaTime) {
        if (!pause) {
            if (gameover)
                reset();
            //move player
            player.x = mousex;
            player.y = mousey;
            //keep player on canvas
            if (player.x < 0)
                player.x = 0 + player.radius;
            if (player.x > canvas.width)
                player.x = canvas.width - player.radius;
            if (player.y < 0)
                player.y = 0 + player.radius;
            if (player.y > canvas.height)
                player.y = canvas.height - player.radius;

            // Generate new bomb
            eTimer -= deltaTime;
            if (eTimer < 0) {
                var bomb = new Circle(random(2) * canvas.width, random(2) * canvas.height, 10);
                bomb.timer = 1.5 + random(2.5);
                bomb.speed = 100 + (random(score)) * 10;
                bombs.push(bomb);
                eTimer = 0.5 + random(2.5);
            }
            // Bombs
            for (var i = 0, l = bombs.length; i < l; i++) {
                if (bombs[i].timer < 0) {
                    score++;
                    bombs.splice(i--, 1);
                    l--;
                    continue;
                }
                bombs[i].timer -= deltaTime;
                var angle = bombs[i].getAngle(player);
                bombs[i].move(angle, bombs[i].speed * deltaTime);
                if (bombs[i].timer < 0) {
                    bombs[i].radius *= 2;
                    if (bombs[i].distance(player) < 0) {
                        gameover = true;
                        pause = true;
                    }
                }
            }
        }
    }

    function paint(ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //print bombs
        for (var i = 0; i < bombs.length; i++) {
            ctx.strokeStyle = '#f00';
            bombs[i].stroke(ctx);
        }
        //print player
        ctx.strokeStyle = '#0f0';
        player.stroke(ctx);
        //print score and distance
        ctx.fillStyle = '#fff';
        ctx.fillText('Score: ' + score, 0, 20);
        lastPress = null;
        if (counter > 0)
            ctx.fillText('Time: ' + counter.toFixed(1), 250, 10);
        else
            ctx.fillText('Time: 0.0', 250, 10);
        if (pause) {
            ctx.fillText('Score: ' + score, 120, 100);
            if (counter < -1)
                ctx.fillText('CLICK TO START', 100, 120);
        }
    }

    function enableInputs() {
        document.addEventListener('mousemove', function (evt) {
            mousex = evt.pageX - canvas.offsetLeft;
            mousey = evt.pageY - canvas.offsetTop;
        }, false);
        canvas.addEventListener('mousedown', function (evt) {
            lastPress = evt.which;
        }, false);
    }

    class Circle {
        constructor(x, y, radius) {
            this.x = (x == null) ? 0 : x;
            this.y = (y == null) ? 0 : y;
            this.radius = (radius == null) ? 0 : radius;
        }

        distance(circle) {
            if (circle != null) {
                var dx = this.x - circle.x;
                var dy = this.y - circle.y;
                return (Math.sqrt(dx * dx + dy * dy) - (this.radius + circle.radius));
            }
        }

        stroke(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.stroke();
        }

        move(angle, speed) {
            if (speed != null) {
                this.x += Math.cos(angle) * speed;
                this.y += Math.sin(angle) * speed;
            }
        }

        getAngle(circle) {
            if (circle != null)
                return (Math.atan2(circle.y - this.y, circle.x - this.x));
        }
    }

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 17); };
    })();

})();