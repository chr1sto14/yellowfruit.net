import './plinko.scss';
import {
  Engine, Render, World, Body, Bodies,
} from 'matter-js';
import Disc from './disc.ts';
import Peg from './peg.ts';
import SlotBar from './slotbar.ts';
import Bumper from './bumper.ts';

const width: number = 320;
const height: number = 440;
const nCol: number = 10;
const pegRadius: number = 3;
const pegGapSize: number = (width - (2 * nCol * pegRadius)) / nCol;
const pegStartY: number = 0.1 * height;
const discRadius: number = 0.99 * ((pegGapSize - (2 * pegRadius)) / 2);
const nSlotBar:number = 8;
const slotBarHeight: number = 2 * discRadius;
const slotBarWidth: number = 5;
const slotGapSize: number = (width - (slotBarWidth * nSlotBar)) / nSlotBar;
const nRow: number = (height - pegStartY - slotBarHeight - (2 * pegGapSize)) / pegGapSize;

function buildBoard() : Body[] {
  const board = [];
  // build left wall, right wall, and ground
  board.push(Bodies.rectangle(0, height / 2, 1, height, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }));
  board.push(Bodies.rectangle(width, height / 2, 1, height, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }));
  board.push(Bodies.rectangle(width / 2, height, width, 1, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }));
  // build pegs and bumpers
  for (let i:number = 0; i < nRow; i += 1) {
    const y:number = pegStartY + pegRadius + i * (pegGapSize + pegRadius);
    if (i % 2 === 0) {
      // full of pegs
      const pegStartX: number = pegGapSize;
      for (let j:number = 0; j < nCol; j += 1) {
        board.push(Peg(pegStartX + pegRadius + j * (pegGapSize + pegRadius), y, pegRadius));
      }
    } else {
      // left triangle bumper
      const bumperRadius = (pegGapSize / 2) * (Math.sqrt(3) / 2);
      const bumper: Body = Bumper(bumperRadius / 2, y, 3, bumperRadius);
      Body.setAngle(bumper, 60 * (Math.PI / 180));
      board.push(bumper);
      // shifted pegs
      const pegStartX: number = pegGapSize;
      for (let j:number = 0; j < (nCol - 1); j += 1) {
        const x:number = pegStartX + pegRadius + j * (pegGapSize + pegRadius) + pegGapSize / 2;
        board.push(Peg(x, y, pegRadius));
      }
      // right triangle bumper
      board.push(Bumper(width - bumperRadius / 2, y, 3, bumperRadius));
    }
  }
  // build slots
  const slotBarStartY: number = height - slotBarHeight + slotBarHeight / 2;
  const slotBarStartX: number = slotGapSize;
  for (let i:number = 0; i < nSlotBar; i += 1) {
    const x:number = slotBarStartX + slotBarWidth / 2 + i * slotGapSize;
    const y:number = slotBarStartY;
    board.push(SlotBar(x, y, slotBarWidth, slotBarHeight));
  }
  return board;
}

export default class Plinko {
    canvas: HTMLCanvasElement

    el: HTMLElement

    engine: Engine

    constructor(el: HTMLElement, makeClose: (f: () => void) => void, params: URLSearchParams) {
      makeClose(this.close);
      params.has('nada');
      this.el = el;
      const d = document.createElement('div');
      this.el.appendChild(d);
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      d.appendChild(this.canvas);

      this.engine = Engine.create();

      // create a renderer
      const render = Render.create({
        canvas: this.canvas,
        options: {
          background: 'white', // very light pink
          wireframes: false,
          hasBounds: true,
          width,
          height,
        },
        engine: this.engine,
      });

      // create the board
      World.add(this.engine.world, buildBoard());

      Engine.run(this.engine);
      Render.run(render);
      this.addDisc(width / 2, 0);
      setInterval(() => this.addDisc(Math.random() * width, 0), 5000);
    }

    addDisc(x:number, y:number) : void {
      const d = Disc(x, y, discRadius);
      World.add(this.engine.world, d);
      setTimeout(() => World.remove(this.engine.world, d), 20 * 1000);
    }

    close() : void {
      this.el = null;
      this.canvas = null;
    }
}
