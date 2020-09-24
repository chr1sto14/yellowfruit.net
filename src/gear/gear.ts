import decomp from 'poly-decomp';

import { Body, Bodies, Vertices } from 'matter-js';
// extend global Window to allow decomp
declare global {
    interface Window { decomp: typeof decomp; }
}
window.decomp = decomp;

export default function Gear(x: number, y: number,
  toothHeight: number, radius: number, nTeeth: number) : Body {
  const points = [];
  const innerRadius = radius - toothHeight;
  const deg = 360 / (2 * nTeeth);
  let placement = 0;
  let inner = true;
  let curDeg = 0;
  while (curDeg < (360 - deg)) {
    const r = inner ? innerRadius : radius;
    if ([1, 3].includes(placement)) {
      curDeg += deg;
      inner = !inner;
    }
    const radians = curDeg * (Math.PI / 180);
    points.push(r * Math.cos(radians));
    points.push(r * Math.sin(radians));
    placement += 1;
    placement = placement === 4 ? 0 : placement;
  }
  return Bodies.fromVertices(
    x,
    y,
    Vertices.fromPath(points.join(' ')),
    {
      isStatic: true, // TODO
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      restitution: 0,
      render: {
        fillStyle: 'blue',
        strokeStyle: 'blue',
        lineWidth: 1,
      },
    },
    true,
  );
}
