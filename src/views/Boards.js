import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MultiFormAlert } from "../utils/Alerts";
import * as yup from "yup";

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import { createBoard, fetchMyWorkspaces } from "../api";
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

    const boards = useSelector((state) => state.boards.boards || []);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchMyWorkspaces(dispatch);
    }, []);

    return (
        <div className="page-container">
            <div className="BoardGrid">
                {boards.map((board, index) => {
                    return <PinBoardItem key={index} boardId={board.id} />;
                })}
                <PinBoardItemButton
                    onClick={() => {
                        MultiFormAlert({
                            validator: (yup.object().shape({
                                Title: boardSchema.fields.title,
                                BackgroundColor: boardSchema.fields.backgroundColor,
                                DefaultNoteColor: boardSchema.fields.defaultNoteColor
                            })),
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
                                createBoard(dispatch, 1, result.values.Title, result.values.BackgroundColor, result.values.DefaultNoteColor);
                            }
                        })
                        //
                    }}
                />
            </div>
        </div>
    );
};

export default Boards;