import './plinko.scss';

export default class Plinko {
    el: HTMLElement

    canvas: HTMLCanvasElement

    constructor(params: URLSearchParams) {
      params.has('nada');
      this.el = document.createElement('div');
      this.canvas = document.createElement('canvas');
      this.canvas.width = window.screen.availWidth;
      this.canvas.height = window.screen.availHeight;
      this.el.appendChild(this.canvas);
    }

    close() : void {
      this.el = null;
      this.canvas = null;
    }
}
