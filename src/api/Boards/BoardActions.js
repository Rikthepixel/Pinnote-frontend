import boardSchema, { validateBoard, validateNote } from "./BoardValidators";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

const hub = {
    connection: new HubConnectionBuilder()
        .withUrl(`${url}/boardHub`)
        .build(),
}

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

    if (dto.notes != null) {
        dto.notes = dto.notes.map((noteDTO) => noteDTOtoNote(noteDTO))
    }

    let newBoard = {
        ...dto,
        boardId: dto.id,
        backgroundColor: backgroundColor,
        defaultNoteBackgroundColor: defaultBackgroundColor,
    };

    return newBoard;
};

export const loadBoard = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        id = parseInt(id);
        if (typeof(id) != 'number') {
            return;
        }

        let subscribe = () => {
            hub.connection
                .invoke("Subscribe", id)
                .then((response) => {
                    if (response.error) {
                        reject(response.error);
                        return;
                    }
                    
                    hub.connection.off();
                    hub.connection.onclose((err) => {
                        if (err) {
                            console.error(err);
                        }
                    });

                    hub.connection.on("BoardUpdated", (response) => {
                        delete response.data.notes;

                        dispatch({
                            type: "UPDATE_BOARD",
                            payload: boardDTOtoBoard(response.data),
                        });
                    });

                    hub.connection.on("NoteAdded", (response) => {
                        dispatch({
                            type: "CREATE_BOARD_NOTE",
                            payload: noteDTOtoNote(response.data),
                        });
                    });

                    hub.connection.on("NoteUpdated", (response) => {
                        dispatch({
                            type: "UPDATE_BOARD_NOTE",
                            payload: noteDTOtoNote(response.data),
                        });
                    });

                    hub.connection.on("NoteRemoved", (response) => {
                        dispatch({
                            type: "REMOVE_BOARD_NOTE",
                            payload: {
                                noteId: response.data.id,
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
        }

        let connectAndSubscribe = () => {
            hub.connection
                .start()
                .then(subscribe)
                .catch((err) => reject(err));
        }
        
        if (hub.connection.state == "Connected") {
            hub.connection.invoke("UnSubscribe")
                .then(() => {
                    if (hub.connection != "Connected") {
                        connectAndSubscribe();
                    } else {
                        subscribe();
                    }
                })
        } else {
            hub.connection
                .start()
                .then(subscribe)
                .catch((err) => reject(err));
        }
    });
};

export const unloadBoard = (dispatch) => {
    if (hub.connection.state == "Connected") {
        hub.connection.send("UnSubscribe");
        hub.connection.stop();
    }
    hub.connection.off();

    dispatch({
        type: "UNSUBSCRIBED_FROM_BOARD",
    });
};

export const fetchMyWorkspaces = (dispatch) => {
    axios.get(`${url}/api/workspaces/`)
        .then((response) => {
            let allBoards = []
            response.data.forEach((workspace) => {
                workspace.boards.forEach((board) => {
                    allBoards.push(boardDTOtoBoard(board));
                })
            })

            dispatch({
                type: "BOARDS_FETCHED",
                payload: allBoards
            });
        })
        .catch((err) => {
            console.error(err);
        })
}

export const createBoard = (dispatch, workspaceId, title, backgroundColor, noteColor) => {
    if (typeof(workspaceId) != 'number') {
        return;
    }
    axios.post(`${url}/api/workspaces/${workspaceId}/Boards`, {
        title: title,
        backgroundColorR: backgroundColor[0],
        backgroundColorG: backgroundColor[1],
        backgroundColorB: backgroundColor[2],
        defaultNoteColorR: noteColor[0],
        defaultNoteColorG: noteColor[1],
        defaultNoteColorB: noteColor[2],
        visibilityId: 1
    })
    .then((response) => {
        dispatch({
            type: "CREATE_BOARD",
            payload: boardDTOtoBoard(response.data),
        });
    })
    .catch((err) => {
        console.error(err);
    })
};

export const deleteBoard = (dispatch, boardId) => {
    return new Promise((resolve, reject) => {
        if (typeof(boardId) != 'number') {
            return;
        }

        axios.delete(`${url}/api/boards/${boardId}`)
            .then((response) => {
                if (response.error) { reject(response.error)}
                dispatch({
                    type: "REMOVE_BOARD",
                    payload: {
                        boardId: boardId,
                    },
                });

                resolve(response);
            })
            .catch((err) => {
                reject(err)
            }); 
    });
};

export const setBoardTitle = (newTitle) => {
    let errors = validateBoard({
        title: newTitle,
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    hub.connection
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
    hub.connection
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
    hub.connection
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
    hub.connection
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
    hub.connection
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

    hub.connection
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

    hub.connection
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

    hub.connection
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

    hub.connection
        .invoke("SetNoteTitle", {
            id: noteId,
            title: title,
        })
        .catch((err) => {
            console.error(err);
        });

    return {};
};
