export default class Header {
    constructor({ el }) {
        this.el = document.createElement("div");
        el.appendChild(this.el)
    }
}
