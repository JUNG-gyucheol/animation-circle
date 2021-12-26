import { Wave } from './wave.js';

export default class WaveGroup {
  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  }

  draw(ctx) {
    const colors = ['red', 'blue', 'black'];

    for (let i = 0; i < 3; i++) {
      const wave = new Wave(colors[i]);

      //   wave.resize(this.stageWidth, this.stageHeight);

      wave.draw(ctx);
    }
  }
}
