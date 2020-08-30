const menus = [
    {name: "plinko", href: "/plinko"}
]

export default class Nav {
    constructor({ main, el }) {
        this._el = el
        this.main = main
        // build nav menu
        const ul = document.createElement("ul")
        for (const menu of menus) {
            const li = document.createElement("li")
            li.innerText = menu.name
            ul.appendChild(li)
        }
        this._el.appendChild(ul)
    }
}
