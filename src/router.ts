interface Closer {
    close: () => void
}

interface Route {
    path: string
    setup: (el: HTMLElement, makeClose: (f: () => void) => void, params: URLSearchParams) => void
}

export default class Router {
    el: HTMLElement

    currentClose: () => void

    routes: Route[]

    constructor(routes: Route[], el: HTMLElement) {
      this.el = el;
      this.routes = routes;
      window.addEventListener('hashchange', () => this.onHashChange(), false);
      this.onHashChange();
    }

    onHashChange():void {
      this.swap(window.location.hash);
    }

    swap(path: string):void {
      const route: Route = this.routes.find((r) => r.path === path);
      if (!route) {
        if (this.currentClose) {
          this.currentClose();
          this.currentClose = null;
          this.el.innerHTML = '';
        }
        return;
      }
      if (this.currentClose) {
        this.currentClose();
        this.currentClose = null;
        this.el.innerHTML = '';
      }
      const makeClose = (close: () => void):void => {
        this.currentClose = close;
      };
      route.setup(this.el, makeClose, new URLSearchParams(window.location.search));
    }
}
