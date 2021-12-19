import React, { } from 'react';
import { NavLink } from 'react-router-dom';

//Images
import logo from "../assets/img/branding/PinnoteLogo.png";

//CSS
import "../assets/scss/components/Navbar.scss";

const Navbar = () => {
    
    return (
        <nav className="Navbar">
            <div className="NavMenu justify-content-start">
                <NavLink className="NavLink" to="/">
                    Workspaces
                </NavLink>
            </div>

            <NavLink to="/">
                <img className="NavImage" src={logo} alt="Pinnote" />
            </NavLink>

            <div className="NavMenu justify-content-end">
                <NavLink className="NavLink" to="/Login">
                    Login
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar