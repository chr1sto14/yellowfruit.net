export default class Plinko {
    el: HTMLElement

    canvas: HTMLCanvasElement

    constructor() {
      this.el = document.createElement('div');
      this.canvas = document.createElement('canvas');
      this.canvas.width = 768;
      this.canvas.height = 1024;
      this.el.appendChild(this.el);
    }
}
