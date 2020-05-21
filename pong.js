const WIDTH = 700;
const HEIGHT = 600;
const UpArrow = 38;
const DownArrow = 40;
const pi = Math.PI;

const player = {
    x: null,
    y: null,
    width: 20,
    height: 100,

    update: function () {
        if (keystate[UpArrow]) this.y -= 10;
        if (keystate[DownArrow]) this.y += 10;
    },
    draw: function () {
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const ai = {
    x: null,
    y: null,
    width: 20,
    height: 100,

    update: function () {

    },
    draw: function () {
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const ball = {
    x: null,
    y: null,
    side: 20,
    vel: null,
    speed: 8,
    update: function () {
        this.x += this.vel.x;
        this.y += this.vel.y;

        if (0 > this.y || this.y + this.side > HEIGHT) {
            this.vel.y *= -1;
        }
        if (0 > this.x || this.x + this.side > WIDTH) {
            this.vel.x *= -1;
        }

        const AABBInterect = function (ax, ay, aw, ah, bx, by, bw, bh) {
            return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
        };

        const padle = this.vel.x < 0 ? player : ai;
        if (AABBInterect(padle.x, padle.y, padle.width, padle.height, this.x, this.y, this.side, this.side)) {
            const n = (this.y + this.side - padle.y) / (padle.height + this.side);
            const pie = 0.25 * pi * (2 * n - 1);
            this.vel.x = (padle === player ? 1 : -1) * this.speed * Math.cos(pie);
            this.vel.y = this.speed * Math.sin(pie);

        }
    },
    draw: function () {
        ctx.fillRect(this.x, this.y, this.side, this.side)
    }
}

var ctx;
var keystate;


function main() {
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    keystate = {};
    document.addEventListener("keydown", function (evt) {
        keystate[evt.keyCode] = true;
    })
    document.addEventListener("keyup", function (evt) {
        delete keystate[evt.keyCode];
    })

    init();

    var loop = function () {
        update();
        draw();

        window.requestAnimationFrame(loop, canvas);
    };
    window.requestAnimationFrame(loop, canvas);
}

function init() {
    player.x = player.width;
    player.y = (HEIGHT - player.height) / 2;

    ai.x = WIDTH - (player.width + ai.width);
    ai.y = (HEIGHT - ai.height) / 2;

    ball.x = (WIDTH - ball.side) / 2;
    ball.y = (HEIGHT - ball.side) / 2;
    ball.vel = {
        x: ball.speed,
        y: ball.speed
    }
}

function update() {
    player.update();
    ai.update();
    ball.update();
}

function draw() {
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    ctx.fillStyle = "#fff";

    player.draw();
    ai.draw();
    ball.draw();

    ctx.restore();
}

main();