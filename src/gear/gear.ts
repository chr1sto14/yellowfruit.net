import 'poly-decomp';
import { Bodies } from 'matter-js';

export default function Gear(x:number, y:number,
  toothHeight: number, radius: number, nTeeth: number) : Body {
  const points = [];
  const innerRadius = radius - toothHeight;
  const deg = 360 / (2 * nTeeth);
  let placement = 0;
  let inner = true;
  let curDeg = 0;
  while (curDeg < 360) {
    const r = inner ? innerRadius : radius;
    if ([1, 3].includes(placement)) {
      curDeg += deg;
      inner = !inner;
    }
    const radians = curDeg * (Math.PI / 180);
    points.push(
      [
        r * Math.cos(radians),
        r * Math.sin(radians),
      ],
    );
    placement += 1;
    placement = placement === 4 ? 0 : placement;
  }
  return Bodies.fromVertices(x, y, points);
}
