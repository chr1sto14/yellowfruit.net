interface El {
    el: HTMLElement
}

interface Route {
    path: string
    fn: () => El
}

export default class Router {
    content: HTMLElement

    constructor(routes: Route[], content: HTMLElement) {
      this.content = content;
    }
}
