interface ElCloser {
    el: HTMLElement
    close: () => void
}

interface Route {
    path: string
    setup: (params: URLSearchParams) => ElCloser
}

interface RegexRoute {
    path: string
    setup: () => ElCloser
    regex: RegExp
}

export default class Router {
    content: HTMLElement

    current: ElCloser

    routes: Route[]

    constructor(routes: Route[], content: HTMLElement) {
      this.content = content;
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
        if (this.current) {
          this.current.close();
        }
        this.content.innerHTML = '';
        return;
      }
      if (this.current) {
        this.current.close();
      }
      this.current = route.setup(new URLSearchParams(window.location.search));
      this.content.appendChild(this.current.el);
    }
}
