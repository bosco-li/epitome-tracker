import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Issues from "./pages/Issues";
import Layout from "./pages/Layout";
import Tests from "./pages/Tests";

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard}></IndexRoute>
      <Route path="contact" component={Contact}></Route>
      <Route path="issues" component={Issues}></Route>
      <Route path="tests" component={Tests}></Route>
    </Route>
  </Router>,
app);
