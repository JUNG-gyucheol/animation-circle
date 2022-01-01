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

    // this.snowDraw();
    // this.move();
    // this.ctx.quadraticCurveTo;
    this.wave = new Wave(this.canvas.width, this.canvas.height);
    this.wave.resize();
    this.move();
  }

  snowDraw() {
    // for (let i = 0; i < 200; i++) {
    //   const r = Math.random() * 10 + 3;
    //   const x = Math.random() * (this.canvas.width - r * 2) + r;
    //   const y = Math.random() * (this.canvas.height - r * 2) + r;
    //   const alpah = Math.random() * 1 + 0.1;
    //   this.snowArr.push(new Snow(x, y, r, this.canvas, alpah));
    // }
    // wave.draw(this.ctx);
  }

  move() {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // for (let i = 0; i < this.snowArr.length; i++) {
    //   this.snowArr[i].animate(this.ctx);
    // }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.wave.animate(this.ctx);

    requestAnimationFrame(this.move.bind(this));
  }
}

class Wave {
  constructor(x, y, r) {
    this.x = x;
    this.y = y / 2;
    this.points = [];
    this.numberOfPoints = 6;
  }

  resize() {
    /* 중간을 각각 넓이, 높이를 2로 나눈 값으로 지정 */

    /* 
    각 점의 간격은 `전체 넓이 / (전체 점의 숫자 - 1)` 이 됩니다.  
    이렇게 점의 간격을 나누면 화면의 시작부터 끝까지 고른 간격으로 점을 찍을 수 있습니다.
    */
    this.pointGap = this.x / (this.numberOfPoints - 1);

    /* 초기화 함수로 넘어가기 */
    this.init();
  }

  init() {
    /* 가운데 하나의 점 만들기 */
    // this.point = new Point(this.x, this.y);

    /* 
    points에 각각의 점의 좌표와 인덱스를 넣어줍니다. 
    인덱스를 넣어주는 이유는 각 점의 위치에 따라 파동이 움직이는 모양도 다르게 하기 위해서입니다.
    */
    for (let i = 0; i < this.numberOfPoints; i++) {
      this.points[i] = new Point(i, this.pointGap * i, this.y);
    }
  }

  draw(ctx) {
    /*
    그리기의 경로를 시작하는 메소드
    https://developer.mozilla.org/ko/docs/Web/HTML/Canvas/Tutorial/Drawing_shapes
    https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
    */
    ctx.beginPath();

    /* 곡선을 위해 이전의 좌표 기억하기 */
    let prevX = this.points[0].x;
    let prevY = this.points[0].y;

    /* 점의 시작점으로 붓 이동하기 */
    ctx.moveTo(prevX, prevY);

    for (let i = 0; i < this.numberOfPoints; i++) {
      /* 
      호(arc)를 그리는 메소드를 이용하여 원을 그림 
      2 * Math.PI = 반지름 * 2 = 지름
      */
      // ctx.arc(this.points[i].x, this.points[i].y, 30, 0, 2 * Math.PI);

      /* 각 좌표에 선 긋기 */
      // ctx.lineTo(this.points[i].x, this.points[i].y);

      /* 
      각 좌표에 곡선 긋기
      https://www.w3schools.com/tags/canvas_quadraticcurveto.aspㄴ
      */
      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      ctx.quadraticCurveTo(prevX, prevY, cx, cy);

      /* 곡선을 그리기 위해 이전 좌표 업데이트하기 */
      prevX = this.points[i].x;
      prevY = this.points[i].y;

      /* 공의 위치 변경하기 */
      if (i != 0 && i != this.numberOfPoints - 1) {
        this.points[i].update();
      }
    }

    /* 붓을 오른쪽 모서리부터 왼쪽 모서리 그리고 첫번째 점 위치까지 옮기면서 색칠해줍니다. */
    ctx.lineTo(prevX, prevY);
    ctx.lineTo(this.x * 2, this.y * 2);
    ctx.lineTo(0, this.y * 2);
    ctx.lineTo(this.points[0].x, this.points[0].y);

    /* 색상 RED & 채우기 */
    ctx.fillStyle = 'red';
    ctx.fill();

    /* 붓 끝내기 */
    // ctx.closePath();
    ctx.stroke();
  }

  animate(ctx) {
    this.draw(ctx);
  }
}

class Point {
  /*
  한번에 웨이브를 그려낸다기보다는

  웨이브는 화면에 간격을 가진 점을 찍고 
  그 점 사이를 곡선으로 연결하는 방식이라고 이해하면 쉬움

  웨이브를 그리는데 이용되는 점들은
  아래 위로 랜덤하게 offset 값을 가짐
  */
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fieldY = y; // 기본 Y 중심
    this.speed = 0.1;
    this.cur = index; // 각 점이 최대한 평행하지 않도록 각각 다른 시작점을 가지게 합니다.
    this.max = Math.random() * 100 + 150;
  }

  update() {
    /* 
    스피드만큼 cur 값이 더해짐 
    cur 값은 계속 커지지만,
    y값은 sin함수의 주기를 따르기 때문에 무한히 -1 ~ 1 사이를 반복함
    */
    this.cur += this.speed;
    /*
    y값이 sin(cur) * max 만큼 늘어남 
    sin(cur)는 sin함수의 주기에 따라 -1에서 1까지 반복
    -1 ~ 1까지의 값에 max(150 ~ 250)값을 곱해줌
    */
    this.y = this.fieldY + Math.sin(this.cur) * this.max;
  }
}

const a = new App();
