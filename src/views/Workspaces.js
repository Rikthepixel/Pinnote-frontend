import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../utils/useAuth";
import { NavLink } from "react-router-dom";

import { fetchMyWorkspaces } from "../api";

import {
    FolderIcon,
    BoardIcon,
    ArrowRightIcon,
    UsersIcon,
    UserTieIcon
} from "../assets/img/icons";

import "../assets/scss/views/Workspaces.scss";

const Boards = (props) => {
    document.title = "Pinnote - Workspaces";

    const workspaces = useSelector(root => root.workspaces.workspaces || []);
    const [user, isAuthLoaded, getToken] = useAuth(() => {

    });
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthLoaded) { return }
        fetchMyWorkspaces(dispatch)
            .catch((err) => {
                console.log(err);
            });
    }, [dispatch, isAuthLoaded]);

    return (
        <div className="w-100 h-100 d-flex flex-row justify-content-center px-4 pt-4">
            <section className="px-4 pt-4 w-80">
                <h2 className="ps-2 section-header">
                    <img className="me-2" alt="" src={FolderIcon} />
                    Your workspaces
                </h2>
                <div className="px-4">
                    {workspaces.map((workspace, wIndex) => {
                        return (
                            <NavLink
                                key={`${workspace.id}-${wIndex}`}
                                to={`/workspaces/${workspace.id}`}
                                className="mb-3 WorkspaceItem"
                            >
                                <div className="WorkspaceDetails">
                                    <h2 className="mx-3 m-0">{workspace.name}</h2>
                                    <section className="ms-2 px-4">
                                        <div>
                                            <img alt="" src={UserTieIcon} />
                                            <b> Owner: </b>
                                            <span> {workspace.owner.username} </span>
                                        </div>
                                        <div >
                                            <img alt="" src={UsersIcon} />
                                            <b>  Users: </b>
                                            <span> {workspace.users.length} </span>
                                        </div>
                                        <div>
                                            <img alt="" src={BoardIcon} />
                                            <b> Boards: </b>
                                            <span> {workspace.boards.length} </span>
                                        </div>

                                    </section>
                                </div>
                                <img className="LinkArrow" alt="" src={ArrowRightIcon} />
                            </NavLink>
                        )
                    })}
                </div>
            </section>
        </div>
    );
};

export default Boards;