import {
  Engine, Render, World, Runner,
} from 'matter-js';
import Gear from './gear.ts';

const width = 500;
const height = 500;

const gearConfigs = [
  {
    toothHeight: 15,
    radius: 60,
    nTeeth: 14,
  },
];

export default class GearDisplay {
    el: HTMLElement

    engine: Engine

    runner: Runner

    render: Render

    constructor(el: HTMLElement, makeClose: (f: () => void) => void, params: URLSearchParams) {
      this.el = el;
      makeClose(() => this.close());
      params.has('nada');

      this.engine = Engine.create();
      this.runner = Runner.create();

      // create a renderer
      this.render = Render.create({
        element: this.el,
        options: {
          background: 'white',
          wireframes: true,
          width,
          height,
        },
        engine: this.engine,
      });

      // create the gears
      gearConfigs.forEach((gearCfg) => {
        World.add(this.engine.world, Gear(
          100,
          100,
          gearCfg.toothHeight,
          gearCfg.radius,
          gearCfg.nTeeth,
        ));
      });

      Runner.run(this.runner, this.engine);
      Render.run(this.render);
    }

    close() : void {
      Render.stop(this.render);
      Runner.stop(this.runner);
      this.el = null;
    }
}
