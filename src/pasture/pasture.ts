import './pasture.scss';
import P5 from 'p5';

const width = 300;
const height = 768;

export default class Pasture {
    el: HTMLElement

    constructor(el: HTMLElement, makeClose: (f: () => void) => void, params: URLSearchParams) {
      this.el = el;
      makeClose(() => this.close());
      params.has('nada');
      new P5((p: typeof P5) => this.render(p)); // eslint-disable-line no-new
    }

    render(p: typeof P5) : void {
      p.setup = (): void => { // eslint-disable-line no-param-reassign
      // outer div
        const d = document.createElement('div');
        d.id = 'pasture';
        this.el.appendChild(d);
        const c = p.createCanvas(width, height);
        c.parent(d);
      };

      let y = 10;
      let direction = 1;

      p.draw = (): void => { // eslint-disable-line no-param-reassign
        p.background(200, 0, 100);
        p.fill(255);
        p.line(0, height / 2, width, height / 2);
        p.ellipse(150, y, 20, 20);
        y += 3 * direction;
        if ((y - 10) <= 0 || y >= (height - 10)) {
          direction *= -1;
        }
      };
    }

    close() : void {
      this.el = null;
    }
}
