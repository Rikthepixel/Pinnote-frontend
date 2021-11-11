import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//Style
import "../assets/scss/views/App.scss";

//Import Routes
import {routes} from "./routes";

//Components
import Navbar from "../components/Navbar";

export default function MainRoute() {
  const RouteComponents = [];
  for (let [key, value] of Object.entries(routes)) {
    if (!value.component) {
      console.error("No component set for route");
    }

    RouteComponents.push(<Route key={key} exact={value.exact} path={value.path}>
        <value.component />
    </Route>);
  }

  return (
    <Router>
      <Navbar />
      <div id="content-container">
        <Switch>
          {RouteComponents}
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}
