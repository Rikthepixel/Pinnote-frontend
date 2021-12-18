import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MultiFormAlert } from "../utils/Alerts";
import * as yup from "yup";

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import { createBoardInWorkspace, fetchMyWorkspaces } from "../api";
import { boardSchema } from "../api/Boards/BoardValidators";

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
                createBoardInWorkspace(dispatch, workspaceId, result.values.Title, result.values.BackgroundColor, result.values.DefaultNoteColor);
            }
        })
    }

    useEffect(() => {
        fetchMyWorkspaces(dispatch);
    }, []);

    return (
        <div className="page-container">
            <div className="px-4 pt-4">
                {workspaces.map((workspace, wIndex) => {
                    console.log(workspace);
                    return (
                        <div key={wIndex}>
                            <h2>{workspace.name}</h2>
                            <div className="BoardContainer gap-3 px-2 py-3">
                                {workspace.boards.map((board, bIndex) => <PinBoardItem key={bIndex} board={board} />)}
                                <PinBoardItemButton onClick={() => createBoardPopup(workspace.id)} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Boards;