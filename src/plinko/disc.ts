
import { Bodies } from 'matter-js';

export default class Disc {
    body: Body

    constructor(x:number, y:number, radius:number) {
      this.body = Bodies.circle(x, y, radius, { });
    }
}
