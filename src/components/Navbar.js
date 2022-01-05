import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../utils/useAuth";
import { logout } from "../api";

//Images
import logo from "../assets/img/branding/PinnoteLogo.png";

//CSS
import "../assets/scss/components/Navbar.scss";

const Navbar = () => {
    const [user] = useAuth();
    const dispatch = useDispatch();

    return (
        <nav className="Navbar">
            <div className="NavMenu justify-content-start">
                <NavLink className="NavLink" to="/Workspaces">
                    Workspaces
                </NavLink>
            </div>

            <NavLink to="/">
                <img className="NavImage" src={logo} alt="Pinnote" />
            </NavLink>

            <div className="NavMenu justify-content-end">
                <NavLink className="NavLink" to="/Profile">
                    Profile
                </NavLink>
                {!user ? (
                    <NavLink className="NavLink" to="/Login">
                        Login
                    </NavLink>
                ) : (
                    <NavLink className="NavLink" to="#" onClick={() => logout(dispatch)}>
                        Logout
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
