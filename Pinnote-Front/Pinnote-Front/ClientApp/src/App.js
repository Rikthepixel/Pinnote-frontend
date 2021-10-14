import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

//Style
import "./App.css";

//Pages
import Error from "./pages/Error";
import Boards from "./pages/Boards";

//Components
import Navbar from "./components/Navbar";


export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/Boards">
                        <Boards/>
                    </Route>
                    <Route exact path="/">
                        <Boards/>
                    </Route>
                    <Route path="">
                        <Error/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}