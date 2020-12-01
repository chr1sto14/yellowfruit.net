import './maze.scss';
import {
  Engine, Render, World, Body, Bodies, Runner, Events,
} from 'matter-js';
import NoSleep from 'nosleep.js';
import pathsvg from './path.svg';
import Ball from './ball.ts';
import Hole from './hole.ts';
import * as mazedef from './mazedef.json';

const width = 300;
const height = 400;

function buildWalls() : Body[] {
  const wallHalfWidth = 10;
  const walls = [];
  // build left wall, right wall, ceiling, and ground
  walls.push(Bodies.rectangle(-wallHalfWidth, height / 2, 2 * wallHalfWidth, height * 1.1, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }));
  walls.push(Bodies.rectangle(width + wallHalfWidth, height / 2, 2 * wallHalfWidth, height * 1.1, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }));
  walls.push(Bodies.rectangle(width / 2, -wallHalfWidth, width * 1.1, 2 * wallHalfWidth, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }));
  walls.push(Bodies.rectangle(width / 2, height + wallHalfWidth, width * 1.1, 2 * wallHalfWidth, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }));
  return walls;
}

export default class Maze {
    noSleep: NoSleep

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
      d.id = 'maze';
      this.el.appendChild(d);

      // check mobile compatibility
      if (!/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) {
        if (process.env.NODE_ENV === 'production') {
          d.innerHTML = 'Mobile only';
          return;
        }
      }

      const startBtn = document.createElement('button');
      d.appendChild(startBtn);

      // device orientation permission
      if (typeof (DeviceMotionEvent) !== 'undefined'
          && typeof (DeviceMotionEvent.requestPermission) === 'function') {
        startBtn.hidden = true;
        const btn = document.createElement('button');
        btn.innerHTML = 'Orientation Permission';
        btn.addEventListener('click', () => {
          DeviceMotionEvent.requestPermission()
            .then((response) => {
              if (response === 'granted') {
                btn.hidden = true;
                startBtn.hidden = false;
              }
            })
            .catch(() => undefined);
        });
        d.appendChild(btn);
      }

      // canvas for all game contents
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      d.appendChild(this.canvas);

      this.engine = Engine.create();
      this.engine.world.gravity.x = 0;
      this.engine.world.gravity.y = 0;
      this.engine.world.gravity.scale = 0.002;

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

      this.runner = Runner.create();

      // wakeLock button
      this.noSleep = new NoSleep();
      startBtn.innerHTML = 'Start';
      let initial = true;
      let start = true;
      const toggleStartPause = () => {
        if (start) {
          if (initial) {
            Runner.run(this.runner, this.engine);
            initial = false;
          } else {
            this.runner.enabled = true;
          }
          this.noSleep.enable();
          startBtn.innerHTML = 'Pause';
          start = false;
        } else {
          this.noSleep.disable();
          this.runner.enabled = false;
          startBtn.innerHTML = 'Start';
          start = true;
        }
      };
      startBtn.addEventListener('click', toggleStartPause, false);

      // create the walls
      World.add(this.engine.world, buildWalls());

      const img = new Image();
      img.src = pathsvg;
      Events.on(this.render, 'afterRender', () => {
        this.render.context.globalCompositeOperation = 'destination-over';
        this.render.context.drawImage(img, 0, 0);
      });

      // create ball in middle
      const ball: Body = Ball(width / 2, mazedef.ballRadius * 2, mazedef.ballRadius,
        {
          collisionFilter: {
            category: 0x0001,
          },
        });

      const startXY = { x: width / 2, y: mazedef.ballRadius * 2 };
      const blockWidth = width / mazedef.nCol;
      const blockHeight = height / mazedef.nRow;
      const halfBlockWidth = blockWidth / 2;
      const halfBlockHeight = blockHeight / 2;
      let count = 0;
      mazedef.blocks.forEach((block) => {
        const x = (count % mazedef.nCol) * blockWidth;
        const y = Math.floor(count / mazedef.nCol) * blockHeight;
        if (block.hole) {
          // create hole
          const hole = new Hole(
            x + halfBlockWidth,
            y + halfBlockHeight,
            1.1 * mazedef.ballRadius, 0.8 * mazedef.ballRadius, { },
          );
          World.add(this.engine.world, hole.getBodies());
          // create hole event
          Events.on(this.engine, 'collisionStart', hole.getBallListener(() => {
            Body.setPosition(ball, startXY);
          }));
        }
        if (block.topHole) {
          // create hole
          const hole = new Hole(
            x + halfBlockWidth,
            y,
            1.1 * mazedef.ballRadius, 0.8 * mazedef.ballRadius, { },
          );
          World.add(this.engine.world, hole.getBodies());
          // create hole event
          Events.on(this.engine, 'collisionStart', hole.getBallListener(() => {
            Body.setPosition(ball, startXY);
          }));
        }
        if (block.midTopHole) {
          // create hole
          const hole = new Hole(
            x + halfBlockWidth,
            y + (halfBlockHeight / 2),
            1.1 * mazedef.ballRadius, 0.8 * mazedef.ballRadius, { },
          );
          World.add(this.engine.world, hole.getBodies());
          // create hole event
          Events.on(this.engine, 'collisionStart', hole.getBallListener(() => {
            Body.setPosition(ball, startXY);
          }));
        }
        if (block.midBottomHole) {
          // create hole
          const hole = new Hole(
            x + halfBlockWidth,
            y + halfBlockHeight + (halfBlockHeight / 2),
            1.1 * mazedef.ballRadius, 0.8 * mazedef.ballRadius, { },
          );
          World.add(this.engine.world, hole.getBodies());
          // create hole event
          Events.on(this.engine, 'collisionStart', hole.getBallListener(() => {
            Body.setPosition(ball, startXY);
          }));
        }
        if (block.rightBottomHole) {
          // create hole
          const hole = new Hole(
            x + blockWidth,
            y + blockHeight,
            1.1 * mazedef.ballRadius, 0.8 * mazedef.ballRadius, { },
          );
          World.add(this.engine.world, hole.getBodies());
          // create hole event
          Events.on(this.engine, 'collisionStart', hole.getBallListener(() => {
            Body.setPosition(ball, startXY);
          }));
        }
        if (block.bottomHole) {
          // create hole
          const hole = new Hole(
            x + halfBlockWidth,
            y + blockHeight,
            1.1 * mazedef.ballRadius, 0.8 * mazedef.ballRadius, { },
          );
          World.add(this.engine.world, hole.getBodies());
          // create hole event
          Events.on(this.engine, 'collisionStart', hole.getBallListener(() => {
            Body.setPosition(ball, startXY);
          }));
        }
        if (block.topWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + halfBlockWidth, y, blockWidth, 2, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.rightWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + blockWidth, y + halfBlockHeight, 2, blockHeight, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.midRightWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + blockWidth, y + halfBlockHeight, 2, halfBlockHeight, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.shortUpperRightWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + blockWidth, y + (halfBlockHeight / 2), 2, halfBlockHeight, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.shortBottomRightWall) {
          World.add(this.engine.world,
            Bodies.rectangle(
              x + blockWidth, y + halfBlockHeight + (halfBlockHeight / 2),
              2,
              halfBlockHeight,
              {
                isStatic: true,
                render: { fillStyle: 'black' },
              },
            ));
        }
        if (block.bottomWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + halfBlockWidth, y + blockHeight, blockWidth, 2, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.shortRightBottomWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + halfBlockWidth + (halfBlockWidth / 2), y + blockHeight,
              halfBlockWidth, 2, {
                isStatic: true,
                render: { fillStyle: 'black' },
              }));
        }
        if (block.shortLeftBottomWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + (halfBlockWidth / 2), y + blockHeight,
              halfBlockWidth, 2, {
                isStatic: true,
                render: { fillStyle: 'black' },
              }));
        }
        if (block.leftWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x, y + halfBlockHeight, 2, blockHeight, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.shortTopLeftWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x, y + (halfBlockHeight / 2), 2, halfBlockHeight, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.shortBottomLeftWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x, y + halfBlockHeight + (halfBlockHeight / 2), 2, halfBlockHeight, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.shortUpperLeftWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x, y + (halfBlockHeight / 2), 2, halfBlockHeight, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.horizontalMiddleWall) {
          World.add(this.engine.world,
            Bodies.rectangle(x + halfBlockWidth, y + halfBlockHeight, blockWidth, 2, {
              isStatic: true,
              render: { fillStyle: 'black' },
            }));
        }
        if (block.horizontalThreeQuarterWall) {
          World.add(this.engine.world,
            Bodies.rectangle(
              x + halfBlockWidth,
              y + halfBlockHeight + (halfBlockWidth / 2), blockWidth, 2, {
                isStatic: true,
                render: { fillStyle: 'black' },
              },
            ));
        }
        count += 1;
      });

      World.add(this.engine.world, ball);

      Render.run(this.render);

      window.addEventListener('deviceorientation', ({ beta, gamma }) => {
        const xMax = 90; const
          yMax = 180;
        let x = gamma;
        if (Math.abs(x) > (xMax / 2)) {
          x = x < 0 ? -1 : 1;
        } else {
          x /= (xMax / 2);
        }
        this.engine.world.gravity.x = x;
        let y = beta;
        if (Math.abs(y) > (yMax / 2)) {
          y = y < 0 ? -1 : 1;
        } else {
          y /= (yMax / 2);
        }
        this.engine.world.gravity.y = y;
      });
    }

    close() : void {
      if (this.noSleep) {
        this.noSleep.disable();
      }
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
