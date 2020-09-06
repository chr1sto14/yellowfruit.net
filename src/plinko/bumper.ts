import { Bodies } from 'matter-js';

export default function Bumper(x:number, y:number, sides:number, radius:number): Body {
  return Bodies.polygon(x, y, sides, radius, { isStatic: true });
}
