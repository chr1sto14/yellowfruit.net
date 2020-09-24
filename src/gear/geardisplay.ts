import './geardisplay.scss';
import {
  Constraint, Engine, Render, World, Runner, Mouse, MouseConstraint,
} from 'matter-js';
import Gear from './gear.ts';

const width = 600;
const height = 303;

const gearConfigs = [
  {
    x: 82,
    y: 219,
    toothHeight: 15,
    radius: 60,
    nTeeth: 14,
  },
  {
    x: 226,
    y: 138,
    toothHeight: 15,
    radius: 117,
    nTeeth: 29,
  },
  {
    x: 400,
    y: 100,
    toothHeight: 15,
    radius: 72,
    nTeeth: 17,
  },
  {
    x: 500,
    y: 200,
    toothHeight: 15,
    radius: 80,
    nTeeth: 19,
  },
];

export default class GearDisplay {
    canvas: HTMLCanvasElement

    el: HTMLElement

    engine: Engine

    runner: Runner

    render: Render

    constructor(el: HTMLElement, makeClose: (f: () => void) => void, params: URLSearchParams) {
      this.el = el;
      makeClose(() => this.close());
      params.has('nada');

      // outer div
      const d = document.createElement('div');
      this.el.appendChild(d);
      // canvas for board
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      d.appendChild(this.canvas);

      this.engine = Engine.create();
      this.runner = Runner.create();

      // create a renderer
      this.render = Render.create({
        canvas: this.canvas,
        options: {
          background: 'white',
          wireframes: false,
          width,
          height,
        },
        engine: this.engine,
      });

      // create the gears
      gearConfigs.forEach((gearCfg) => {
        const g = Gear(
          gearCfg.x,
          gearCfg.y,
          gearCfg.toothHeight,
          gearCfg.radius,
          gearCfg.nTeeth,
        );
        const c = Constraint.create({
          bodyA: g,
          pointA: { x: 0, y: 0 },
          pointB: { x: gearCfg.x, y: gearCfg.y },
          length: 0,
          stiffness: 1,
          render: {
            lineWidth: 0,
          },
        });
        World.add(this.engine.world, [c, g]);
      });

      // mouse constraint
      const mouse = Mouse.create(this.canvas);
      const mouseConstraint = MouseConstraint.create(this.engine, {
        mouse,
        constraint: {
          stiffness: 0,
          render: {
            visible: false,
          },
        },
      });

      World.add(this.engine.world, mouseConstraint);

      // keep the mouse in sync with rendering
      this.render.mouse = mouse;

      Runner.run(this.runner, this.engine);
      Render.run(this.render);
    }

    close() : void {
      Render.stop(this.render);
      Runner.stop(this.runner);
      this.el = null;
      this.canvas = null;
    }
}
