import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

//Images
import logo from "../images/PinnoteLogo.png";

//CSS
import "./Navbar.scss";

export default function Navbar() {
    
    return (
        <nav className="Navbar">
            <div className="NavMenu LeftNavGrid">
                <NavLink className="NavLink" to="/Boards">
                    Boards
                    </NavLink>
            </div>

            <NavLink to="/Boards">
                <img className="NavImage" src={logo} alt="Pinnote" />
            </NavLink>

            <div className="NavMenu RightNavGrid">
                <NavLink className="NavLink" to="/Login">
                    Login
                    </NavLink>
            </div>
        </nav>
    );
}