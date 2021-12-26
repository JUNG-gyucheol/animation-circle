// import WaveGroup from './wave.js';

import { Wave } from './wave.js';

class App {
  /* 생성자 */
  constructor() {
    /* 캔버스 엘리먼트 생성 */
    this.canvas = document.createElement('canvas');

    /*
    Canvas는 getContext() 메소드를 이용해서 렌더링 컨텍스트와
    렌더링 컨텍스트의 그리기 함수들을 사용할 수 있습니다.

    getContext() 메소드는 렌더링 컨텍스트 타입을 지정하는
    하나의 파라메터를 가집니다.

    여기서는 `CanvasRenderingContext2D`를 얻기 위해 '2d'로 지정합니다.
    https://developer.mozilla.org/ko/docs/Web/HTML/Canvas/Tutorial/Basic_usage
    */
    this.ctx = this.canvas.getContext('2d');

    /* 현재 html 문서의 body에 캔버스 엘리먼트 추가하기 */
    document.body.appendChild(this.canvas);

    /* 
    사이즈가 변할 때 대응하기 위한 이벤트 리스너 
    
    추가 : once, passive, capture 등에 대한 설명
    http://sculove.github.io/blog/2016/12/29/addEventListener-passive/
    https://joshua1988.github.io/web-development/javascript/event-propagation-delegation/
    */
    window.addEventListener('resize', this.resize.bind(this), {
      once: false,
      passive: false,
      capture: false,
    });

    /* 웨이브 객체 생성 */
    this.wave = new Wave();

    /* 초기 사이즈를 기준으로 resize 함수 실행 */
    this.resize();

    /*
    requestAnimationFrame은 css로 처리하기 어려운 애니메이션이나 
    Canvas, SVG 등의 애니메이션 구현에 이용하는 함수
    setInterval과 흡사한데, 재귀적으로 자신을 호출한다는 점이 다름
    1초당 디스플레이 주사율에 따라 정해진 프레임을 렌더링해줌
    https://blog.eunsatio.io/develop/JavaScript-window.requestAnimationFrame-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC
    https://css-tricks.com/using-requestanimationframe/
    */
    requestAnimationFrame(this.animate.bind(this));
  }

  /* 사이즈가 변했을 때 실행될 콜백 */
  resize() {
    /* 레티나 디스플레이에서 올바른 화면을 보여주기 위해 설정 */
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    /* 캔버스의 크기를 스테이지의 2배로 잡음 */
    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;

    /* 
    캔버스에서 1개의 픽셀이 차지할 크기를 정함
    크기를 2배로 늘렸으므로 각 픽셀이 2개씩 차지하도록 함
    https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale
    */
    this.ctx.scale(2, 2);

    // this.wave.resize(this.stageWidth,this.stageHeight)
    /* 웨이브에도 리사이즈가 적용 되도록 설정 */
    this.wave.resize(this.stageWidth, this.stageHeight);
  }

  /* 애니메이션 관련 루틴 정의 */
  animate(t) {
    /* 지정된 사각 영역을 rgba(0, 0, 0, 0)의 색상으로 만듦 */
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    /* 애니메이션이 실행되면 웨이브가 그려지도록 설정 */
    this.wave.draw(this.ctx);
    /* this를 바인드한 채로 애니메이션 프레임 요청 */
    requestAnimationFrame(this.animate.bind(this));
  }
}

/* 브라우저에 window가 로드 됐을 때, 객체 생성 */
window.onload = () => {
  new App();
};
