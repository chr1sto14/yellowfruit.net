import "./app.css"

import Header from "./header.js"
import Main from "./main.js"
import Nav from "./nav.js"
import Footer from "./footer.js"

function app() {
    const m = new Main({el: document.body.getElementsByTagName("main")[0]})
    const n = new Nav({main: m, el: document.body.getElementsByTagName("nav")[0]})
    const h = new Header({el: document.body.getElementsByTagName("header")[0]})
    const f = new Footer({el: document.body.getElementsByTagName("footer")[0]})
}

app()
