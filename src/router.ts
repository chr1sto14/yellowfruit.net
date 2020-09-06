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

    swap(path: string) {
      const route: Route = this.routes.find((r) => r.path === path);
      if (!route) {
        if (this.currentClose) {
          this.currentClose();
        }
        return;
      }
      if (this.currentClose) {
        this.currentClose();
      }
      const makeClose = (close: () => void):void => {
        this.currentClose = close;
      };
      route.setup(this.el, makeClose, new URLSearchParams(window.location.search));
    }
}
