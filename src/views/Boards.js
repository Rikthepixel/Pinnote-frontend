import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { MultiFormAlert } from "../utils/Alerts";
import * as yup from "yup";

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import { createBoardInWorkspace, fetchMyWorkspaces } from "../api";
import { boardSchema } from "../api/Boards/BoardValidators";

import {
    FolderIcon,
    BoardIcon,
    ArrowRightIcon
} from "../assets/img/icons";

import "../assets/scss/views/Boards.scss";

const prefabBackgroundColors = [
    [180, 84, 84],
    [84, 136, 180],
    [180, 76, 198],
    [160, 222, 159],
    [243, 232, 204],
    [148, 219, 233]
]

const prefabNoteColors = [
    [207, 38, 38],
    [207, 197, 38],
    [67, 217, 51],
    [14, 123, 209],
    [12, 10, 177],
    [177, 10, 166],
    [222, 56, 117],
    [192, 11, 69]
]

const Boards = (props) => {
    document.title = "Pinnote - Boards";

    const workspaces = useSelector(root => root.workspaces.workspaces || []);
    const dispatch = useDispatch();

    const boardValidator = yup.object().shape({
        Title: boardSchema.fields.title,
        BackgroundColor: boardSchema.fields.backgroundColor,
        DefaultNoteColor: boardSchema.fields.defaultNoteColor
    })

    const createBoardPopup = (workspaceId) => {
        MultiFormAlert({
            validator: boardValidator,
            title: "Create a board",

            acceptButtonText: "Create board!",
            cancelButtonText: "Cancel",

            showCancelButton: true,
            inputs: [
                {
                    type: "title",
                    title: "Title"
                },
                {
                    name: "Title",
                    type: "text",
                    value: "",
                    placeholder: "board title",
                    className: "mb-4"
                },
                {
                    type: "page"
                },
                {
                    type: "title",
                    title: "Colors"
                },
                {
                    name: "BackgroundColor",
                    buttonText: "Background color",
                    type: "colorButton",
                    value: prefabBackgroundColors[(Math.floor(Math.random() * prefabBackgroundColors.length))]
                },
                {
                    name: "DefaultNoteColor",
                    buttonText: "Default note color",
                    type: "colorButton",
                    value: prefabNoteColors[(Math.floor(Math.random() * prefabNoteColors.length))]
                }
            ]
        }).then((result) => {
            if (result.confirmed) {
                console.log(workspaceId);
                createBoardInWorkspace(dispatch, workspaceId, result.values.Title, result.values.BackgroundColor, result.values.DefaultNoteColor);
            }
        })
    }

    useEffect(() => {
        fetchMyWorkspaces(dispatch);
    }, []);

    return (
        <div className="w-100 h-100 d-flex flex-row px-4 pt-4">
            <aside className="h-100 w-20 ps-4 pt-4 d-flex flex-column">
                <h2 className="fs-5 SectionHeader">
                    <img className="me-1" src={FolderIcon} />
                    Your workspaces
                </h2>
                <nav className="w-100 h-100 d-flex flex-column gap-1">
                    {workspaces.map((workspace, index) => {
                        return (
                            <NavLink
                                key={`${workspaces.id}-${index}`}
                                to={`/workspaces/${workspace.id}`}
                                className="WorkspaceLink d-flex justify-content-between align-items-center text-break"
                            >
                                <b>
                                    {workspace.name}
                                </b>
                                <img src={ArrowRightIcon} />
                            </NavLink>)
                    })}
                </nav>
            </aside>
            <section className="px-4 pt-4 w-80">
                <h2 className="ps-2 SectionHeader">
                    <img className="me-2" src={BoardIcon} />
                    Your boards
                </h2>
                <div className="px-4">
                    {workspaces.map((workspace, wIndex) => {
                        return (
                            <article key={`${workspace.id}-${wIndex}`} className="mb-3">
                                <h3 className="mx-3 m-0">{workspace.name}</h3>
                                <div className="BoardContainer">
                                    <div className="BoardScrollContainer scrollbar-thin p-2 gap-3">
                                        {workspace.boards.map((board, bIndex) => <PinBoardItem key={`${board.id}-${bIndex}`} board={board} />)}
                                        <PinBoardItemButton onClick={() => createBoardPopup(workspace.id)} />
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>
        </div>
    );
};

export default Boards;