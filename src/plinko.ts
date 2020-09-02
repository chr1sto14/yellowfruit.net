export default class Plinko {
    el: HTMLElement

    canvas: HTMLCanvasElement

    constructor(params: URLSearchParams) {
      params.has('nada');
      this.el = document.createElement('div');
      this.canvas = document.createElement('canvas');
      this.canvas.width = 768;
      this.canvas.height = 768;
      this.el.appendChild(this.canvas);
    }

    close() : void {
      this.el = null;
      this.canvas = null;
    }
}
