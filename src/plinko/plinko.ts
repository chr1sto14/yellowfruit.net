import { Engine, Render, World } from 'matter-js';
// import Disc from './disc.ts'
import Peg from './peg.ts';

export default class Plinko {
    canvas: HTMLCanvasElement

    el: HTMLElement

    constructor(params: URLSearchParams) {
      params.has('nada');
      this.el = document.createElement('div');
      this.canvas = document.createElement('canvas');
      this.canvas.width = 320;
      this.canvas.height = 320;
      this.el.appendChild(this.canvas);

      // create an engine
      const engine = Engine.create();

      // create a renderer
      const render = Render.create({
        canvas: this.canvas,
        engine,
      });

      const p = new Peg(200, 200, 10);

      // add all of the bodies to the world
      World.add(engine.world, p);

      // run the engine
      Engine.run(engine);

      // run the renderer
      Render.run(render);
    }

    close() : void {
      this.el = null;
    }
}
