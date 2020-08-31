import Plinko from './plinko.ts';

interface El {
    el: HTMLElement
}

interface Route {
    name: string
    path: string
    fn: () => El
}

const routes :Route[] = [
  {
    name: 'plinko',
    path: '#/plinko',
    fn: () => new Plinko(),
  },
];

export default routes;
