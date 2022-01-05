import React, { Fragment } from "react";
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
import { useAuth } from "../utils/useAuth";

const MainRoute = () => {
  const [user, isAuthLoaded] = useAuth();

  const RouteComponents = Object.keys(routes).map((key, index) => {
    const value = routes[key];

    if (!value.component) {
      console.error("No component set for route");
    }
    if (value.NotAuthenticatedRedirect && value.AuthenticatedRedirect) {
      console.error("Cannot have both Not Authenticated and Authenticated redirect");
    }

    let RenderedComponent = "";
    if (isAuthLoaded) {
      if (value.NotAuthenticatedRedirect && !user) {
        RenderedComponent = <Redirect to={value.NotAuthenticatedRedirect} />
      }
      if (value.AuthenticatedRedirect && user) {
        RenderedComponent = <Redirect to={value.AuthenticatedRedirect} />
      }
    }

    if (!RenderedComponent) {
      RenderedComponent = <value.component />
    }
    
    return (
      <Route key={key} exact={value.exact} path={value.path}>
        {RenderedComponent}
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