import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
    Redirect
} from "react-router-dom";

//Style
import "./App.scss";

//Pages
//import Error from "./pages/Error";
import Boards from "./pages/Boards";
import Board from "./pages/Board";

//Components
import Navbar from "./components/Navbar";


export default function App() {
    const params = useParams();

    return (
        <Router>
            <Navbar />
            <div id="content-container">
                <Switch>
                    <Route exact path="/Boards">
                        <Boards />
                    </Route>
                    <Route exact path="/Boards/:id">
                        <Board BoardId={params.id} />
                    </Route>
                    <Route exact path="/">
                        <Boards />
                    </Route>
                    <Route path="">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}