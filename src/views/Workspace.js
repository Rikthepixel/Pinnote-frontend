import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";

import BoardTab from "../components/BoardTab";
import MembersTab from "../components/MembersTab";
import SettingsTab from "../components/SettingsTab";

import { BoardIcon, CogIcon, UsersIcon } from "../assets/img/icons";
import { fetchWorkspace } from "../api";

import "../assets/scss/views/Workspace.scss";

const Workspace = (props) => {
    const { workspaceId } = useParams();
    const dispatch = useDispatch();
    const workspace = useSelector(
        (root) =>
            root.workspaces.workspace || {
                boards: [],
                users: []
            }
    );

    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        if (parseInt(workspaceId)) {
            fetchWorkspace(dispatch, parseInt(workspaceId))
                .catch(() => {
                    setRedirect("/workspaces")
                });
        } else {
            setRedirect("/workspaces");
        }
    }, [workspaceId, dispatch]);

    if (redirect) {
        return <Redirect to={redirect} />
    }

    document.title = `Pinnote - ${workspace.name || "Workspace"}`;
    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <div className="mx-4 mt-4 mb-2 pt-4">
                <h1>{workspace.name}</h1>
            </div>
            <Tabs
                defaultActiveKey="boards"
                className="w-100 d-flex justify-content-center"
            >
                <Tab
                    eventKey="boards"
                    title={(
                        <div className="d-flex flex-row justify-content-center align-items-center">
                            <img className="me-1 h-1-1em" alt="" src={BoardIcon} />
                            Boards
                        </div>
                    )}
                >
                    <BoardTab
                        workspaceId={workspace.id}
                        boards={workspace.boards}
                    />
                </Tab>
                <Tab
                    eventKey="members"
                    title={(
                        <div className="d-flex flex-row justify-content-center align-items-center">
                            <img className="me-1 h-1-1em" alt="" src={UsersIcon} />
                            Members
                        </div>
                    )}
                >
                    <MembersTab
                        workspaceId={workspace.id}
                        members={workspace.users}
                    />
                </Tab>
                <Tab
                    eventKey="settings"
                    title={(
                        <div className="d-flex flex-row justify-content-center align-items-center">
                            <img className="me-1 h-1-1em" alt="" src={CogIcon} />
                            Settings
                        </div>
                    )}>
                    <SettingsTab 
                        workspaceId={workspace.id}
                    />
                </Tab>
            </Tabs>
        </div>
    );
};
export default Workspace;
