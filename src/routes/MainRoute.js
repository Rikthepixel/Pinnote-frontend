import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect,
} from "react-router-dom";

//Style
import "../assets/scss/views/App.scss";

//Import Routes
import {routes} from "./routes";

//Components
import Navbar from "../components/Navbar";

export default function MainRoute() {
  const params = useParams();

  const RouteComponents = [];
  for (let [key, value] of Object.entries(routes)) {
    if (!value.component) {
      console.error("No component set for route");
    }

    RouteComponents.push(<Route key={key} exact path={value.path}>
        <value.component params={params} />
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
