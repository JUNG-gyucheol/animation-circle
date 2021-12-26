class App {
  constructor() {
    // html add canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.snowArr = [];

    document.body.appendChild(this.canvas);

    // Set canvas width and height
    this.canvas.width = window.innerWidth * 2;
    this.canvas.height = window.innerHeight * 2;

    this.snowDraw();
    this.move();
  }

  snowDraw() {
    for (let i = 0; i < 200; i++) {
      const r = Math.random() * 10 + 3;
      const x = Math.random() * (this.canvas.width - r * 2) + r;
      const y = Math.random() * (this.canvas.height - r * 2) + r;
      const alpah = Math.random() * 1 + 0.1;
      this.snowArr.push(new Snow(x, y, r, this.canvas, alpah));
    }
  }

  move() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.snowArr.length; i++) {
      this.snowArr[i].animate(this.ctx);
    }

    requestAnimationFrame(this.move.bind(this));
  }
}

class Snow {
  constructor(x, y, r, canvas, alpah) {
    this.x = x; // x value
    this.y = y; // y value
    this.r = r; // radius
    this.alpha = alpah;

    this.dx = Math.random() * 2 + 0.2;
    this.dx *= Math.floor(Math.random() * 2 + 1) === 1 ? 1 : -1;
    this.dy = Math.random() * 5 + 0.1;
    this.canvas = canvas;

    this.canvas.addEventListener('click', e => {
      // if(e.clientX - 5 >  e.clientY - 5)
      // this.x
      // for (let i = 5, j = 0; i >= 0; i--, j++) {
      //   const x = e.clientX + i;
      //   const y = e.clientY - j;
      // }

      if (this.x < e.clientX * 2 + 150 && this.x > e.clientX * 2 - 150 && this.y > e.clientY * 2 - 150 && this.y < e.clientY * 2 + 150) {
        this.dy -= 5;
      }
    });
  }

  draw(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.globalAlpha = this.alpha;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  animate(ctx) {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x - this.r > this.canvas.width || this.x + this.r < 0) {
      this.y = 0;
      this.x = Math.random() * (this.canvas.width - this.r * 2) + this.r;
    }
    if (this.y - this.r > this.canvas.height) {
      this.y = 0;
      this.x = Math.random() * (this.canvas.width - this.r * 2) + this.r;
    }

    this.draw(ctx);
  }
}

const a = new App();
