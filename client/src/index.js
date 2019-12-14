import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Entry from "./Entry";

import { HashRouter } from "react-router-dom";
ReactDOM.render(
  <HashRouter>
    <Entry />
  </HashRouter>,
  document.getElementById("root")
);
