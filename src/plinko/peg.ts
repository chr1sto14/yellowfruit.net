import { Bodies } from 'matter-js';

export default function Peg(x:number, y:number, radius:number): Body {
  return Bodies.circle(x, y, radius, { isStatic: true });
}
