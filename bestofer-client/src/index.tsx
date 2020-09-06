import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"

import { AppStateProvider } from "./AppState"
import { TypeSelector } from "./TypeSelector"
import { Finder } from "./Finder"
import { Options } from "./Options"

ReactDOM.render(
  <React.StrictMode>
    <AppStateProvider>
      <section className="section">
        <div className="container">
          <TypeSelector />
          <Finder />
          <Options />
        </div>
      </section>
    </AppStateProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
