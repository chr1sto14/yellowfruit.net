import { Bodies } from 'matter-js';

interface Pair {
    bodyA: Body
    bodyB: Body
}
interface Event {
    pairs: Pair[]
}

export default class Hole {
    inner: Body

    outer: Body

    constructor(x:number, y:number,
      radius:number, gap:number, options: Record<string, unknown>) {
      // create outer decorative hole
      const lineWidth = 3;
      this.outer = Bodies.circle(x, y, radius - lineWidth,
        {
          ...options,
          isStatic: true,
          collisionFilter: {
            mask: 0x0002,
          },
          render: {
            fillStyle: 'black',
            strokeStyle: 'darkgray',
            lineWidth,
          },
        });
      // create inner sensor hole
      this.inner = Bodies.circle(x, y, radius - gap,
        {
          ...options,
          isSensor: true,
          isStatic: true,
          render: { visible: false },
        });
    }

    getBallListener(fn: () => void): (Event) => void {
      return ({ pairs }:Event) => {
        pairs.forEach((pair) => {
          if (pair.bodyA === this.inner || pair.bodyB === this.inner) {
            fn();
          }
        });
      };
    }

    getBodies() : Body[] {
      return [this.inner, this.outer];
    }
}
