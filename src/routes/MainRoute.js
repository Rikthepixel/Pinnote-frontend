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
import { routes } from "./routes";

//Components
import Navbar from "../components/Navbar";

const MainRoute = () => {
  const RouteComponents = Object.keys(routes).map((key, index) => {
    const value = routes[key];

    if (!value.component) {
      console.error("No component set for route");
    }

    return (
      <Route key={key} exact={value.exact} path={value.path}>
        <value.component />
      </Route>
    )
  });

  return (
    <Router>
      <Navbar />
      <main id="content-container">
        <div className="page-container">
          <Switch>
            {RouteComponents}
            <Redirect to="/" />
          </Switch>
        </div>
      </main>
    </Router>
  );
}

export default MainRoute;