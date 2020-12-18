import './spin.scss';
import {
  Engine, Render, World, Body, Runner, Constraint, Mouse, MouseConstraint, Events,
} from 'matter-js';
import Needle from './needle.ts';

const width = 300;
const height = width;

const maxSlot = 12;
const slotColors = {
  0: 'blue',
  1: 'orange',
  2: 'tan',
  3: 'purple',
  4: 'lime',
  5: 'aqua',
  6: 'maroon',
  7: 'khaki',
  8: 'honeydew',
  9: 'indigo',
  10: 'springgreen',
  11: 'lightpink',
};

export default class Spin {
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
      d.id = 'spin';
      this.el.appendChild(d);
      const sInput = document.createElement('input');
      sInput.setAttribute('id', 'slots');
      sInput.setAttribute('type', 'range');
      sInput.setAttribute('min', '2');
      sInput.setAttribute('max', maxSlot.toString());
      sInput.setAttribute('step', '1');
      sInput.setAttribute('value', '8');
      d.appendChild(sInput);

      // device orientation permission
      if (typeof (DeviceMotionEvent) !== 'undefined'
          && typeof (DeviceMotionEvent.requestPermission) === 'function') {
        const btn = document.createElement('button');
        btn.innerHTML = 'Orientation Permission';
        btn.addEventListener('click', () => {
          DeviceMotionEvent.requestPermission()
            .then((response) => {
              if (response === 'granted') {
                btn.hidden = true;
              }
            })
            .catch(() => undefined);
        });
        d.appendChild(btn);
      }

      // canvas for all contents
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      d.appendChild(this.canvas);

      // fullscreen button
      const fullscreenBtn = document.createElement('button');
      fullscreenBtn.innerHTML = '&#9974';
      fullscreenBtn.addEventListener('click', () => {
        if (fullscreenBtn.requestFullscreen) {
          this.canvas.requestFullscreen();
        }
      });
      d.appendChild(fullscreenBtn);

      this.engine = Engine.create();
      this.engine.world.gravity.x = 0;
      this.engine.world.gravity.y = 0;
      this.engine.world.gravity.scale = 0;

      // create a renderer
      this.render = Render.create({
        canvas: this.canvas,
        options: {
          background: 'white',
          wireframes: false,
          hasBounds: true,
          width,
          height,
        },
        engine: this.engine,
      });

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 0.9 * (width / 2);
      Events.on(this.render, 'afterRender', () => {
        // draw peg
        this.render.context.strokeStyle = 'black';
        this.render.context.fillStyle = 'black';
        this.render.context.beginPath();
        this.render.context.arc(centerX, centerY, 2, 0, 2 * Math.PI);
        this.render.context.fill();
        this.render.context.stroke();
        // begin draw wheel contents
        this.render.context.globalCompositeOperation = 'destination-over';
        const deg = 360 / sInput.valueAsNumber;
        for (let i = 0; i < sInput.valueAsNumber; i += 1) {
          const startRadians = i * deg * (Math.PI / 180);
          const finishRadians = (i + 1) * deg * (Math.PI / 180);
          this.render.context.beginPath();
          // draw arc
          this.render.context.arc(centerX, centerY, radius, startRadians, finishRadians);
          // draw triangle
          this.render.context.moveTo(centerX, centerY);
          this.render.context.lineTo(
            centerX + radius * Math.cos(startRadians),
            centerY + radius * Math.sin(startRadians),
          );
          this.render.context.lineTo(
            centerX + radius * Math.cos(finishRadians),
            centerY + radius * Math.sin(finishRadians),
          );
          this.render.context.closePath();
          // fill style
          this.render.context.fillStyle = slotColors[i];
          this.render.context.fill();
          // stroke style
          this.render.context.lineWidth = 3;
          this.render.context.stroke();
        }
      });

      this.runner = Runner.create();

      // create needle in middle, but shifted
      const needleHeight = 0.8 * radius;
      const shiftY = 0.8 * (needleHeight / 2);
      const needle: Body = Needle(centerX, centerY - shiftY, 10, needleHeight,
        {
          collisionFilter: {
            category: 0x0001,
          },
        });
      const c = Constraint.create({
        bodyA: needle,
        pointA: { x: 0, y: shiftY },
        pointB: { x: centerX, y: centerY },
        length: 0,
        stiffness: 1,
        render: {
          lineWidth: 0,
        },
      });
      World.add(this.engine.world, [needle, c]);

      // mouse constraint
      const mouse = Mouse.create(this.canvas);
      const mouseConstraint = MouseConstraint.create(this.engine, {
        mouse,
        constraint: {
          angularStiffness: 0,
          stiffness: 0.01,
          render: {
            visible: false,
          },
        },
      });
      World.add(this.engine.world, mouseConstraint);

      // keep the mouse in sync with rendering
      this.render.mouse = mouse;

      Render.run(this.render);
      Runner.run(this.runner, this.engine);

      // accelerometer listener
      window.addEventListener('devicemotion', (e) => {
        const aX = e.acceleration.x;
        const aY = e.acceleration.y;
        // acceleration threshold
        if (Math.abs(aX) > 2 && Math.abs(aY) > 2) {
          let pX = needleHeight;
          let pY = needleHeight;
          if (aX < 0 && aY < 0) {
            pX *= -1;
            pY *= -1;
          }
          Body.applyForce(needle, {
            x: needle.position.x + pX,
            y: needle.position.y + pY,
          }, {
            x: Math.abs(aX),
            y: Math.abs(aY),
          });
        }
      });
    }

    close() : void {
      if (this.render) {
        Render.stop(this.render);
      }
      if (this.runner) {
        Runner.stop(this.runner);
      }
      this.el = null;
      this.canvas = null;
    }
}
