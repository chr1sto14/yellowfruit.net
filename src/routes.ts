export default [
  {
    name: 'plinko',
    path: '#/plinko',
    setup: async (el: HTMLElement, makeClose: (f: () => void) => void, params: URLSearchParams) => {
      const { default: Plinko } = await import(/* webpackChunkName: "plinko" */ './plinko/plinko.ts');
      return new Plinko(el, makeClose, params);
    },
  },
];
