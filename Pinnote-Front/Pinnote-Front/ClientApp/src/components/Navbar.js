import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

//CSS
import "./Navbar.css";

export default class Navbar extends Component {

    render() {
        return (
            <nav className="Navbar">
                <div className="NavMenu LeftNavGrid">
                    <NavLink className="NavLink" to="/Boards">
                        Boards
                    </NavLink>
                </div>

                <NavLink to="/Boards">
                    <img className="NavImage" src={require("../images/PinnoteLogo.png")} alt="Pinnote"/>
                </NavLink>

                <div className="NavMenu RightNavGrid">
                    <NavLink className="NavLink" to="/Login">
                        Login
                    </NavLink>
                </div>
            </nav>
        );
    }
}