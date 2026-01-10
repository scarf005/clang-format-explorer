import { render } from "preact"
import App from "../src/App.tsx"
import "./style.css"

const rootElement = document.getElementById("app")
if (!rootElement) {
  throw new Error("Could not find root element to mount to")
}

render(<App />, rootElement)
