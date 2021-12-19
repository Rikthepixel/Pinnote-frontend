import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Tabs, Tab, FormControl, Button } from "react-bootstrap";

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";

import { BoardIcon, CogIcon, UserIcon, PlusIcon, UsersIcon } from "../assets/img/icons";
import { fetchWorkspace, createBoardInWorkspacePopup } from "../api";

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
                    <header className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="ps-2 section-header">
                            <img className="me-2" src={BoardIcon} />
                            Boards
                        </h2>
                        <div className="d-flex gap-1">
                            <FormControl
                                placeholder="Filter by name"
                            />
                            <Button className="text-nowrap d-flex align-items-center justify-content-center">
                                <img className="img-invert h-1-0em me-1" src={PlusIcon} />
                                Board
                            </Button>
                        </div>
                    </header>
                    <div className="w-100 d-flex flex-wrap gap-3">
                        {workspace.boards.map((board, bIndex) => (
                            <PinBoardItem key={`${board.id}-${bIndex}`} board={board} />
                        ))}
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
                    <header className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="ps-2 section-header">
                            <img className="me-2" src={UsersIcon} />
                            Members
                        </h2>
                        <div className="d-flex gap-1">
                            <FormControl
                                placeholder="Filter by name"
                            />
                            <Button className="text-nowrap d-flex align-items-center justify-content-center">
                                <img className="img-invert h-1-0em me-1" src={PlusIcon} />
                                Member
                            </Button>
                        </div>
                    </header>
                    <article className="d-flex flex-column gap-2 mt-4">
                        {workspace.users.map((user, index) => (
                            <div
                                key={index}
                                className="UserItem"
                                style={{ backgroundColor: index % 2 == 0 ? "var(--bs-gray-200)" : "var(--bs-gray-300)" }}
                            >
                                <div className="NameDetails">
                                    <b>{user.username}</b>
                                    <div>{user.email}</div>
                                </div>
                                <Button variant="danger">
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </article>
                </Tab>
                <Tab
                    eventKey="settings"
                    title={(
                        <div className="d-flex flex-row justify-content-center align-items-center">
                            <img className="me-1 h-1-1em" src={CogIcon} />
                            Settings
                        </div>
                    )}>
                    <header className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="ps-2 section-header">
                            <img className="me-2" src={CogIcon} />
                            Settings
                        </h2>
                        <div className="d-flex gap-1">
                            <FormControl
                                placeholder="Filter by name"
                            />
                        </div>
                    </header>

                </Tab>
            </Tabs>
        </div>
    );
};
export default Workspace;
