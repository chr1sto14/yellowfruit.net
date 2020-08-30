import "./app.css"

import Header from "./header.ts"
import Main from "./main.ts"
import Nav from "./nav.ts"
import Footer from "./footer.ts"

function app() {
    const m = new Main(document.body.getElementsByTagName("main")[0])
    const n  = new Nav(document.body.getElementsByTagName("nav")[0], m)
    const h = new Header(document.body.getElementsByTagName("header")[0])
    const f = new Footer(document.body.getElementsByTagName("footer")[0])
}

app()
