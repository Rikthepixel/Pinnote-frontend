import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toastAlerts, formAlert } from "../utils/Alerts";

import { useAuth } from "../utils/useAuth";

import { createWorkspace, fetchMyWorkspaces } from "../api";
import { workspacePatchNameSchema } from "../api/Workspaces/WorkspaceValidators";

import {
    FolderIcon,
    BoardIcon,
    ArrowRightIcon,
    UsersIcon,
    UserTieIcon,
    PlusIcon
} from "../assets/img/icons";

import "../assets/scss/views/Workspaces.scss";

const Workspaces = (props) => {
    document.title = "Pinnote - Workspaces";

    const workspaces = useSelector(root => root.workspaces.workspaces || []);
    const [, isAuthLoaded] = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthLoaded) { return }
        fetchMyWorkspaces(dispatch)
    }, [dispatch, isAuthLoaded]);

    return (
        <div className="w-100 h-100 d-flex flex-row justify-content-center px-4 pt-4">
            <section className="px-4 pt-4 w-80">
                <div className="d-flex justify-content-between">
                    <h2 className="ps-2 section-header">
                        <img className="me-2" alt="" src={FolderIcon} />
                        Your workspaces
                    </h2>
                    <Button
                        className="pe-2 mb-2"
                        onClick={() => formAlert({
                            title: "Create a workspace",
                            validator: workspacePatchNameSchema,
                            inputs: [
                                {
                                    type: "explanation",
                                    text: "What do you want to call your workspace?"
                                },
                                {
                                    name: "name",
                                    type: "text",
                                    value: "",
                                    placeholder: "name"
                                }
                            ],
                            acceptButtonText: "Create workspace",
                            cancelButtonText: "Cancel",
                        }).then(result => {
                            if (result.confirmed) {
                                createWorkspace(dispatch, result.values.name)
                                    .catch(err => {
                                        toastAlerts({
                                            title: "Error!",
                                            text: err.message,
                                            icon: "error"
                                        })
                                    });
                            }
                        })}
                    >
                        <img className="img-invert h-1-0em me-1" alt="" src={PlusIcon} />
                        Workspace
                    </Button>
                </div>
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

export default Workspaces;