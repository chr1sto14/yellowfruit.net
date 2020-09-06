import { Engine, Render, World } from 'matter-js';
// import Disc from './disc.ts'
import Peg from './peg.ts';

const width: number = 320;
const height: number = 540;
const nCol: number = 5;
const radius: number = 10;

function buildPegBoard() : Body[] {
  const pegs = [];
  const startX: number = 2 * radius;
  const startY: number = 0.1 * height;
  const gapSize: number = (width - startX) / nCol;
  const nRow: number = (height - startY) / gapSize;
  for (let i:number = 0; i < nRow; i += 1) {
    for (let j:number = 0; j < nCol; j += 1) {
      let x:number = startX + j * gapSize;
      const y:number = startY + i * gapSize;
      if (i % 2 === 1) {
        x += gapSize / 2;
      }
      pegs.push(Peg(x, y, radius));
    }
  }
  return pegs;
}

export default class Plinko {
    canvas: HTMLCanvasElement

    el: HTMLElement

    constructor(params: URLSearchParams) {
      params.has('nada');
      this.el = document.createElement('div');
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.el.appendChild(this.canvas);

      // create an engine
      const engine = Engine.create();

      // create a renderer
      const render = Render.create({
        canvas: this.canvas,
        options: {
          hasBounds: true,
          width,
          height,
        },
        engine,
      });

      // add all of the pegs to the world
      World.add(engine.world, buildPegBoard());

      // run the engine
      Engine.run(engine);

      // run the renderer
      Render.run(render);
    }

    close() : void {
      this.el = null;
      this.canvas = null;
    }
}
