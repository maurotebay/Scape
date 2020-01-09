(function () {
    'use strict';
    window.addEventListener('load', init, false);
    var canvas = null, ctx = null;
    var lastPress = null;
    var mousex = 0, mousey = 0;
    var score = 0;
    var bgColor = '#000';
    var player = null;
    var target = null;
    var lastUpdate = 0;
    var counter = 0;
    var pause = true;


    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 200;
        player = new Circle(0, 0, 5);
        target = new Circle(100, 100, 10);
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

        counter -= deltaTime;
        if (!pause) {
            if (lastPress == 1) {
                bgColor = '#333';
                if (player.distance(target) < 0) {
                    score++;
                    target.x = random(canvas.width / 10 - 1) * 10 + target.radius;
                    target.y = random(canvas.height / 10 - 1) * 10 + target.radius;
                }
            }
            else
                bgColor = '#000';
            if (counter <= 0) {
                pause = true;
            }
        }
        else if (lastPress == 1 && counter < -1) {
            pause = false;
            counter = 15;
            score = 0;
        }
        lastPress = null;
    }

    function paint(ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //print target
        ctx.strokeStyle = '#f00';
        target.stroke(ctx);
        //print player
        ctx.strokeStyle = '#0f0';
        player.stroke(ctx);
        //print score and distance
        ctx.fillStyle = '#fff';
        ctx.fillText('Distance: ' + player.distance(target).toFixed(1), 0, 10);
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
    }

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 17); };
    })();

})();