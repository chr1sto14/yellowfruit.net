export default [
  {
    name: 'plinko',
    path: '#/plinko',
    setup: async (el: HTMLElement, makeClose: (f: () => void) => void,
      params: URLSearchParams):Promise<null> => {
      const { default: Plinko } = await import(/* webpackChunkName: "plinko" */ './plinko/plinko.ts');
      (() => new Plinko(el, makeClose, params))();
      return null;
    },
  },
  {
    name: 'gear',
    path: '#/gear',
    setup: async (el: HTMLElement, makeClose: (f: () => void) => void,
      params: URLSearchParams):Promise<null> => {
      const { default: GearDisplay } = await import(/* webpackChunkName: "gear" */ './gear/geardisplay.ts');
      (() => new GearDisplay(el, makeClose, params))();
      return null;
    },
  },
  {
    name: 'maze',
    path: '#/maze',
    setup: async (el: HTMLElement, makeClose: (f: () => void) => void,
      params: URLSearchParams):Promise<null> => {
      const { default: Maze } = await import(/* webpackChunkName: "maze" */ './maze/maze.ts');
      (() => new Maze(el, makeClose, params))();
      return null;
    },
  },
  {
    name: 'spin',
    path: '#/spin',
    setup: async (el: HTMLElement, makeClose: (f: () => void) => void,
      params: URLSearchParams):Promise<null> => {
      const { default: Spin } = await import(/* webpackChunkName: "spin" */ './spin/spin.ts');
      (() => new Spin(el, makeClose, params))();
      return null;
    },
  },
];
