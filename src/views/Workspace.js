import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";

import { BoardIcon, CogIcon, UserIcon } from "../assets/img/icons";
import { fetchWorkspace, createBoardInWorkspacePopup } from "../api";

import "../assets/scss/views/Workspace.scss";

const Workspace = (props) => {
    const { workspaceId } = useParams();
    const dispatch = useDispatch();
    const workspace = useSelector(
        (root) =>
            root.workspaces.workspace || {
                boards: [],
            }
    );

    useEffect(() => {
        fetchWorkspace(dispatch, parseInt(workspaceId));
    }, []);

    console.log();

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
                            <img className="me-1 h-1-1em" src={BoardIcon} />
                            Boards
                        </div>
                    )}
                >
                    <h2 className="ps-2 section-header">
                        <img className="me-2" src={BoardIcon} />
                        Your boards
                    </h2>
                    <div className="w-100 d-flex flex-wrap gap-3">
                        {workspace.boards.map((board, bIndex) => (
                            <PinBoardItem key={`${board.id}-${bIndex}`} board={board} />
                        ))}
                        <PinBoardItemButton
                            onClick={() =>
                                createBoardInWorkspacePopup(dispatch, workspace.id)
                            }
                        />
                    </div>
                </Tab>
                <Tab 
                    eventKey="members"
                    title={(
                        <div className="d-flex flex-row justify-content-center align-items-center">
                            <img className="me-1 h-1-1em" src={UserIcon} />
                            Members
                        </div>
                    )}
                >

                </Tab>
                <Tab 
                    eventKey="settings"
                    title={(
                        <div className="d-flex flex-row justify-content-center align-items-center">
                            <img className="me-1 h-1-1em" src={CogIcon} />
                            Settings
                        </div>
                    )}>

                </Tab>
            </Tabs>
        </div>
    );
};
export default Workspace;
