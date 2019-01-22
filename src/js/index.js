import "babel-polyfill";

import React from "react";
import { render } from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import Game from "./components/Game";

const App = () => (
  <Provider store={store}>
    <HashRouter>
      <Game />
    </HashRouter>
  </Provider>
);

render(<App />, document.querySelector("#app"));
