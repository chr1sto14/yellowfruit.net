import './app.scss';

import Router from './router.ts';
import routes from './routes.ts';

interface Route {
    name: string
    path: string
}

function buildNav(rs: Route[]): HTMLUListElement {
  // build nav menu
  const ul : HTMLUListElement = document.createElement('ul');
  rs.forEach((route) => {
    const li: HTMLLIElement = document.createElement('li');
    const a: HTMLAnchorElement = document.createElement('a');
    a.innerText = route.name;
    a.href = route.path;
    li.appendChild(a);
    ul.appendChild(li);
  });
  return ul;
}

function app() {
  const r = new Router(routes, document.body.getElementsByTagName('main')[0]);
  document.body.getElementsByTagName('nav')[0].appendChild(buildNav(routes));
  if (r) {
    return true;
  }
  return false;
}

app();
