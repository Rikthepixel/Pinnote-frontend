import React, { Fragment, useEffect, useRef } from "react";
import { Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../utils/useAuth";
import { useInterval } from "../utils/useInterval";
import { logout, fetchInvites } from "../api";
import { ToastAlerts } from "../utils/Alerts";

//Images
import logo from "../assets/img/branding/PinnoteLogo.png";

//CSS
import "../assets/scss/components/Navbar.scss";

const Navbar = () => {
    const authRef = useRef();
    const [user, isAuthLoaded] = useAuth();
    const dispatch = useDispatch();
    const invites = useSelector(root => root.invites.invites)
    authRef.current = {
        isAuthLoaded,
        user
    };

    const onInterval = () => {
        if (!authRef.current.isAuthLoaded || !authRef.current.user) return;
        fetchInvites(dispatch).catch(err => ToastAlerts({
            title: "Error!",
            text: err.message,
            icon: "error"
        }));
    }

    useInterval(onInterval, 60000, true);
    useEffect(onInterval, [isAuthLoaded]);

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
                {!user ? (
                    <NavLink className="NavLink" to="/Login">
                        Login
                    </NavLink>
                ) : (
                    <Fragment>
                        <NavLink className="NavLink" to="/Profile">
                            <span>
                                Profile
                            </span>
                            {invites.length > 0 && <Badge className="nav-badge">
                                {invites.length}
                            </Badge>}
                        </NavLink>
                        <NavLink className="NavLink" to="#" onClick={() => logout(dispatch)}>
                            Logout
                        </NavLink>
                    </Fragment>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
