import './pasture.scss';

export default class Pasture {
    canvas: HTMLCanvasElement

    el: HTMLElement

    constructor(el: HTMLElement, makeClose: (f: () => void) => void, params: URLSearchParams) {
      this.el = el;
      makeClose(() => this.close());
      params.has('nada');

      // outer div
      const d = document.createElement('div');
      d.id = 'geardisplay';
      this.el.appendChild(d);
      // canvas for board
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      d.appendChild(this.canvas);
    }

    close() : void {
      this.el = null;
      this.canvas = null;
    }
}
