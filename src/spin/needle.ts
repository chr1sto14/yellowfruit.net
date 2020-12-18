import { Bodies } from 'matter-js';

export default function Needle(x:number, y:number,
  width:number, height:number, options: Record<string, unknown>): Body {
  return Bodies.rectangle(x, y, width, height, {
    ...options,
    friction: 0.05,
    frictionAir: 0.01,
    density: 0.3,
    render: {
      fillStyle: 'red',
      lineWidth: 3,
      strokeStyle: 'white',
    },
    chamfer: {
      radius: [5, 5, 0, 0],
      quality: 4,
      qualityMin: 2,
      qualityMax: 14,
    },
  });
}
