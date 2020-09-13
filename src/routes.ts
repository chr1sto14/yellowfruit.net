class Module {}

export default [
  {
    name: 'plinko',
    path: '#/plinko',
    setup: async (el: HTMLElement, makeClose: (f: () => void) => void,
      params: URLSearchParams):Promise<Module> => {
      const { default: Plinko } = await import(/* webpackChunkName: "plinko" */ './plinko/plinko.ts');
      return new Plinko(el, makeClose, params);
    },
  },
  {
    name: 'gear',
    path: '#/gear',
    setup: async (el: HTMLElement, makeClose: (f: () => void) => void,
      params: URLSearchParams):Promise<Module> => {
      const { default: GearDisplay } = await import(/* webpackChunkName: "gear" */ './gear/geardisplay.ts');
      return new GearDisplay(el, makeClose, params);
    },
  },
];
