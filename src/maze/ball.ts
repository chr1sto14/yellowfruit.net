import { Bodies } from 'matter-js';

export default function Ball(x:number, y:number,
  radius:number, options: Record<string, unknown>): Body {
  return Bodies.circle(x, y, radius, {
    ...options,
    restitution: 0.8,
    friction: 0.05,
    render: { fillStyle: 'red' },
  });
}
