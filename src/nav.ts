import Main from './main.ts';

interface Menu {
    name: string
    href: string
}

const menus: Menu[] = [
  {
    name: 'plinko',
    href: '/plinko',
  },
];

export default class Nav {
    el: HTMLElement

    main: Main

    constructor(el: HTMLElement, main: Main) {
      this.el = el;
      this.main = main;
      // build nav menu
      const ul : HTMLElement = document.createElement('ul');
      menus.forEach((menu) => {
        const li: HTMLElement = document.createElement('li');
        li.innerText = menu.name;
        ul.appendChild(li);
      });
      this.el.appendChild(ul);
    }
}
