import decomp from 'poly-decomp';
import { Body, Bodies, Vertices } from 'matter-js';
// extend global Window to allow decomp
declare global {
    interface Window { decomp: typeof decomp; }
}
window.decomp = decomp;

const taperDeg = 2;

export default function Gear(x: number, y: number,
  toothHeight: number, radius: number, nTeeth: number, fillStyle: string) : Body {
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
    let radians = curDeg * (Math.PI / 180);
    // taper outer
    if (placement === 2) {
      radians = (curDeg + taperDeg) * (Math.PI / 180);
    }
    if (placement === 3) {
      radians = (curDeg - taperDeg) * (Math.PI / 180);
    }
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
      friction: 0,
      frictionAir: 0.005,
      frictionStatic: 0,
      collisionFilter: {
        group: Body.nextGroup(true),
      },
      density: 0.2,
      restitution: 0,
      render: {
        fillStyle,
        strokeStyle: fillStyle,
        lineWidth: 1,
      },
    },
    true,
  );
}
