import boardSchema, { validateBoard, validateNote } from "./BoardValidators";
import { HubConnectionBuilder } from "@microsoft/signalr";

const boardHubConnection = new HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_BACKEND_URL}/boardHub`)
    .build();

const noteDTOtoNote = (dto) => {
    let backgroundColor = [
        dto.backgroundColorR,
        dto.backgroundColorG,
        dto.backgroundColorB,
    ];

    delete dto.backgroundColorR;
    delete dto.backgroundColorG;
    delete dto.backgroundColorB;

    return {
        ...dto,
        noteId: dto.id,
        backgroundColor: backgroundColor,
    };
};

const boardDTOtoBoard = (dto) => {
    let backgroundColor = [
        dto.backgroundColorR,
        dto.backgroundColorG,
        dto.backgroundColorB,
    ];
    let defaultBackgroundColor = [
        dto.defaultBackgroundColorR,
        dto.defaultBackgroundColorG,
        dto.defaultBackgroundColorB,
    ];

    delete dto.backgroundColorR;
    delete dto.backgroundColorG;
    delete dto.backgroundColorB;
    delete dto.defaultBackgroundColorR;
    delete dto.defaultBackgroundColorG;
    delete dto.defaultBackgroundColorB;

    let newBoard = {
        ...dto,
        boardId: dto.id,
        backgroundColor: backgroundColor,
        defaultNoteBackgroundColor: defaultBackgroundColor
    };

    if (dto.notes) {
        newBoard.notes = dto.notes.map((noteDTO) => noteDTOtoNote(noteDTO));
    }

    return newBoard;
};

export const loadBoard = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            return;
        }
        boardHubConnection
            .start()
            .then(() => {
                boardHubConnection
                    .invoke("Subscribe", 2)
                    .then((response) => {
                        if (response.error) {
                            reject(response.error);
                            return;
                        }

                        boardHubConnection.on("BoardUpdated", (board) => {
                            delete board.notes;

                            dispatch({
                                type: "UPDATE_BOARD",
                                payload: boardDTOtoBoard(board),
                            });
                        });

                        boardHubConnection.on("NoteAdded", (note) => {
                            dispatch({
                                type: "CREATE_BOARD_NOTE",
                                payload: noteDTOtoNote(note),
                            });
                        });

                        boardHubConnection.on("NoteUpdated", (note) => {
                            dispatch({
                                type: "UPDATE_BOARD_NOTE",
                                payload: noteDTOtoNote(note),
                            });
                        });

                        boardHubConnection.on("NoteRemoved", (note) => {
                            dispatch({
                                type: "REMOVE_BOARD_NOTE",
                                payload: {
                                    noteId: note.id,
                                },
                            });
                        });

                        let parsedBoard = boardDTOtoBoard(response.data);
                        dispatch({
                            type: "SUBSCRIBED_TO_BOARD",
                            payload: {
                                board: parsedBoard,
                            },
                        });
                        resolve(parsedBoard);
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
};

export const unloadBoard = (dispatch) => {
    boardHubConnection.send("UnSubscribe");
    boardHubConnection.off();
    boardHubConnection.stop();

    dispatch({
        type: "UNSUBSCRIBED_FROM_BOARD",
    });
};

export const createPinBoard = (dispatch) => {
    dispatch({
        type: "CREATE_BOARD",
        payload: {
            title: "new board",
        },
    });
};

export const removePinBoard = (dispatch, boardId) => {
    dispatch({
        type: "REMOVE_BOARD",
        payload: {
            boardId: boardId,
        },
    });
};

export const setBoardTitle = (newTitle) => {
    let errors = validateBoard({
        title: newTitle,
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    boardHubConnection
        .invoke("SetBoardTitle", {
            title: newTitle,
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
}

export const setBoardNoteColor = (colorR, colorG, colorB) => {
    let errors = validateBoard({
        defaultNoteColor: [colorR, colorG, colorB],
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }
    boardHubConnection
        .invoke("SetBoardNoteColor", {
            DefaultBackgroundColorR: colorR,
            DefaultBackgroundColorG: colorG,
            DefaultBackgroundColorB: colorB,
        })
        .then((response) => {
            //console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
}

export const setBoardColor = (colorR, colorG, colorB) => {
    let errors = validateBoard({
        backgroundColor: [colorR, colorG, colorB],
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }
    boardHubConnection
        .invoke("SetBoardColor", {
            backgroundColorR: colorR,
            backgroundColorG: colorG,
            backgroundColorB: colorB,
        })
        .then((response) => {
            //console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
}

export const createPinNote = (positionX, positionY) => {
    boardHubConnection
        .invoke("CreateNote", {
            positionX: positionX,
            positionY: positionY,
        })
        .then((response) => {
            //console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });
};

export const deletePinNote = (noteId) => {
    boardHubConnection
        .invoke("DeleteNote", noteId)
        .then((response) => {
            //console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });
};

export const setNotePosition = (dispatch, noteId, positionX, positionY) => {
    let errors = validateNote({
        position: {
            x: positionX,
            y: positionY,
        },
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    dispatch({
        type: "UPDATE_BOARD_NOTE_POSITION",
        payload: {
            noteId: noteId,
            positionX: positionX,
            positionY: positionY,
        },
    });

    boardHubConnection
        .invoke("SetNotePosition", {
            id: noteId,
            positionX: positionX,
            positionY: positionY,
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
};

export const setNoteColor = (noteId, colorR, colorG, colorB) => {
    let errors = validateNote({
        backgroundColor: [colorR, colorG, colorB],
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    boardHubConnection
        .invoke("SetNoteColor", {
            id: noteId,
            backgroundColorR: colorR,
            backgroundColorG: colorG,
            backgroundColorB: colorB,
        })
        .then((response) => {
            //console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
};

export const setNoteText = (noteId, text) => {
    let errors = validateNote({
        text: text,
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    boardHubConnection
        .invoke("SetNoteText", {
            id: noteId,
            text: text,
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
};

export const setNoteTitle = (noteId, title) => {
    let errors = validateNote({
        title: title,
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    boardHubConnection
        .invoke("SetNoteTitle", {
            id: noteId,
            title: title,
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
};
