import './plinko.scss';
import {
  Engine, Render, World, Body,
} from 'matter-js';
// import Disc from './disc.ts'
import Peg from './peg.ts';
import SlotBar from './slotbar.ts';
import Bumper from './bumper.ts';

const width: number = 320;
const height: number = 590;
const nCol: number = 6;
const radius: number = 5;
const slotBarHeight: number = 60;
const slotBarWidth: number = 5;

function buildBoard() : Body[] {
  const board = [];
  // build pegs and bumpers
  const pegStartY: number = 0.1 * height;
  const pegGapSize: number = width / nCol;
  const pegStartX: number = pegGapSize / 2;
  const nRow: number = 1 + ((height - pegStartY - slotBarHeight - pegGapSize) / pegGapSize);
  for (let i:number = 0; i < nRow; i += 1) {
    const y:number = pegStartY + i * pegGapSize;
    if (i % 2 === 0) {
      // full of pegs
      for (let j:number = 0; j < nCol; j += 1) {
        board.push(Peg(pegStartX + j * pegGapSize, y, radius));
      }
    } else {
      // left triangle bumper
      const bumper: Body = Bumper((pegGapSize / 8), y, 3, (pegGapSize / 2) / Math.sqrt(3));
      Body.setAngle(bumper, 60 * (Math.PI / 180));
      board.push(bumper);
      // shifted pegs
      for (let j:number = 0; j < (nCol - 1); j += 1) {
        const x:number = pegStartX + j * pegGapSize + pegGapSize / 2;
        board.push(Peg(x, y, radius));
      }
      // right triangle bumper
      board.push(Bumper(width - (pegGapSize / 8), y, 3, (pegGapSize / 2) / Math.sqrt(3)));
    }
  }
  // build slots
  const nSlotBar:number = 8;
  const slotBarStartY: number = height - slotBarHeight + slotBarHeight / 2;
  const slotGapSize: number = (width - slotBarWidth * nSlotBar) / nSlotBar;
  const slotBarStartX: number = slotGapSize;
  for (let i:number = 0; i < nSlotBar; i += 1) {
    const x:number = slotBarStartX + i * slotGapSize;
    const y:number = slotBarStartY;
    board.push(SlotBar(x, y, slotBarWidth, slotBarHeight));
  }
  return board;
}

export default class Plinko {
    canvas: HTMLCanvasElement

    el: HTMLElement

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

      // create the board
      World.add(engine.world, buildBoard());

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
