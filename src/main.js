export default class Main {
    constructor({ el }) {
        this.el = document.createElement("div")
        el.style.width = this.el.style.width
        el.style.height = this.el.style.height
        el.appendChild(this.el)
    }
}
