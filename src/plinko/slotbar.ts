import { Bodies } from 'matter-js';

export default function SlotBar(x:number, y:number, w:number, h:number): Body {
  return Bodies.rectangle(x, y, w, h, { isStatic: true, render: { fillStyle: 'gray' } });
}
