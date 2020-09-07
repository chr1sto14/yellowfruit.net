import { Bodies } from 'matter-js';

export default function Disc(x:number, y:number, radius:number): Body {
  return Bodies.circle(x, y, radius, {
    restitution: 0.8,
    friction: 0.05,
    render: { fillStyle: 'yellow' },
  });
}
