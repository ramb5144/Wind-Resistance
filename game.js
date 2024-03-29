class Vec
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    get len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const f = value / this.len;
        this.x *= f;
        this.y *= f;
    }


}

class Rect
{
    constructor(x = 0, y = 0)
    {
        this.pos = new Vec(0, 0);
        this.size = new Vec(x, y);
    }
    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect
{
    constructor()
    {
        super(100, 100);
        this.vel = new Vec;
    }
}

class Player extends Rect
{
    constructor()
    {
        super(20, 600);
        this.vel = new Vec;
        this.score = 0;

        this._lastPos = new Vec;
    }
    update(dt)
    {
        this.vel.y = (this.pos.y - this._lastPos.y) / dt;
        this._lastPos.y = this.pos.y;
    }
}

class Pong
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.initialSpeed = 500;

        this.ball = new Ball;

        this.players = [
            new Player,
            new Player,
        ];

        this.players[0].pos.x = 0;
        this.players[1].pos.x = this._canvas.width - 0;
        this.players.forEach(p => p.pos.y = this._canvas.height / 2);

        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };

        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map(str => {
            const canvas = document.createElement('canvas');
            const s = this.CHAR_PIXEL;
            canvas.height = s * 5;
            canvas.width = s * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#F90837';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect((i % 3) * s, (i / 3 | 0) * s, s, s);
                }
            });
            return canvas;
        });

        this.reset();
    }
    clear()
    {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
    collide(player, ball)
    {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
            this.reset()
;

            ball.vel.x = -ball.vel.x * 1.05;
            const len = ball.vel.len;
            ball.vel.y += player.vel.y * .2;
            ball.vel.len = len;
        }
    }
    draw()
    {
        this.clear();

        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }
    drawRect(rect)
    {
        this._context.fillStyle = '#4DF62D';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
    drawScore()
    {
        const align = this._canvas.width / 3;
        const cw = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (cw * chars.length / 2) + this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0], offset + pos * cw, 20);
            });
        });
               //alert(this.players[0].score);
            if (this.players[0].score == 50) 
                alert('You Win!');

    }

    play()
    {
        const b = this.ball;
        if (b.vel.x === 0 && b.vel.y === 0) {
            b.vel.x = 200 * (Math.random() > .5 ? 1 : -1);
            b.vel.y = 200 * (Math.random() * 2 - 1);
            b.vel.len = this.initialSpeed;
        }
    }
    moveball(keyCodeNumber)
    {
        var key_arrow_or_other = document.getElementById('key_arrow_or_other'),
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40;

    switch (keyCodeNumber) {
    case LEFT:
    //alert (this.ball.pos);
        this.ball.pos.x = this.ball.pos.x - this.ball.size.x / 1.5;
        break;
    case RIGHT:
        this.ball.pos.x = this.ball.pos.x + this.ball.size.x / 1.5;
        break;
    case UP:
        this.ball.pos.y = this.ball.pos.y - this.ball.size.y / 1.5;
        break;
    case DOWN:
        this.ball.pos.y = this.ball.pos.y + this.ball.size.y / 1.5;
        break;

    }
          //key_arrow_or_other.innerHTML += ' (keyCode: ' + keyCodeNumber + ')';

    }
    reset()
    {
        const b = this.ball;
        b.vel.x = 0;
        b.vel.y = 0;
        b.pos.x = this._canvas.width / 2;
        b.pos.y = this._canvas.height / 2;
    }
    start()
    {
        requestAnimationFrame(this._frameCallback);
    }
    update(dt)
    {
        const cvs = this._canvas;
        const ball = this.ball;
        ball.pos.x += ball.vel.x * dt;
        ball.pos.y += ball.vel.y * dt;

        if (ball.right < 0 || ball.left > cvs.width) {
            ++this.players[ball.vel.x < 0 | 0].score;
            this.reset();
        }

        if (ball.vel.y < 0 && ball.top < 0 ||
            ball.vel.y > 0 && ball.bottom > cvs.height) {
            ball.vel.y = -ball.vel.y;
        }

        var tmp = this.players[1].pos.y ;

       //console.log(tmp);

      this.players[1].pos.y = tmp + 0;

      if (tmp > 700 ) {
        this.players[1].pos.y = 0;
      }

        var tmp2 = this.players[0].pos.y ;

       //console.log(tmp);

      this.players[0].pos.y = tmp + 0;

      if (tmp > 700 ) {
        this.players[0].pos.y = 0;
      }

      if (this.ball.pos.y > 700) {
        this.reset()
      }


      if (this.ball.pos.y < 0) {
        this.reset()
      }        


        this.players.forEach(player => {
            player.update(dt);
            this.collide(player, ball);
        });

        this.draw();
    }
}

const canvas = document.querySelector('#pong');
const pong = new Pong(canvas);

canvas.addEventListener('click', () => pong.play());

canvas.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
}); 


pong.start();
//pong.play();


function print_arrow_key(keyCodeNumber) {
    // console.log(keyCodeNumber);
    var key_arrow_or_other = document.getElementById('key_arrow_or_other'),
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40;

    switch (keyCodeNumber) {
    case LEFT:
        key_arrow_or_other.innerHTML = 'Left';
        break;
    case UP:
        key_arrow_or_other.innerHTML = 'Up';
        break;
    case RIGHT:
        key_arrow_or_other.innerHTML = 'Right';
        break;
    case DOWN:
        key_arrow_or_other.innerHTML = 'Down';
        break;
    default:
        key_arrow_or_other.innerHTML = 'Other character (not an arrow key)';
        break;
    }

    key_arrow_or_other.innerHTML += ' (keyCode: ' + keyCodeNumber + ')';
}

function checkKeycode(event) {
    // handling Internet Explorer stupidity with window.event
    // @see http://stackoverflow.com/a/3985882/517705
    var keyDownEvent = event || window.event,
        keycode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;

    //print_arrow_key(keycode);
    pong.moveball(keycode);

    return false;
}

document.onkeydown = checkKeycode;
