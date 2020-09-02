import Plinko from './plinko.ts';

export default [
  {
    name: 'plinko',
    path: '#/plinko',
    setup: (params: URLSearchParams) => new Plinko(params),
  },
];
