import './app.css';

import Main from './main.ts';
import Nav from './nav.ts';

function app() {
  const m = new Main(document.body.getElementsByTagName('main')[0]);
  const n = new Nav(document.body.getElementsByTagName('nav')[0], m);
  if (n) {
    return true;
  }
  return false;
}

app();
