import { validateBoard, validateNote } from "./BoardValidators";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { noteDTOtoNote, boardDTOtoBoard } from "../DtoHelpers";
import superagent from "superagent";

const url = process.env.REACT_APP_BACKEND_URL;

const hub = {
    connection: new HubConnectionBuilder()
        .withUrl(`${url}/boardHub`)
        .build(),
}

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
        
        if (hub.connection.state === "Connected") {
            hub.connection.invoke("UnSubscribe")
                .then(() => {
                    if (hub.connection !== "Connected") {
                        connectAndSubscribe();
                    } else {
                        subscribe();
                    }
                });

        } else if (hub.connection.state === "Disconnected") {
            hub.connection
                .start()
                .then(subscribe)
                .catch((err) => reject(err));
        }
    });
};

export const unloadBoard = (dispatch) => {
    if (hub.connection.state === "Connected") {
        hub.connection.send("UnSubscribe");
        hub.connection.stop();
    }
    hub.connection.off();

    dispatch({
        type: "UNSUBSCRIBED_FROM_BOARD",
    });
};

export const getBoardsByWorkspaceId = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        superagent.get(`${url}/api/workspaces/${id}/boards`)
        .then((response) => {
            dispatch({
                type: "BOARDS_FETCHED",
                payload: response.body.map(boardDto => boardDTOtoBoard(boardDto))
            });
            resolve(response.body);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

export const deleteBoard = (dispatch, boardId) => {
    return new Promise((resolve, reject) => {
        if (typeof(boardId) != 'number') {
            return;
        }

        superagent.delete(`${url}/api/boards/${boardId}`)
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

    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
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

    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
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

    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
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
    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
    }

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
    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
    }

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

    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
    }

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

    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
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

    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
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
    };

    if (hub.connection.state !== "Connected") {
        return {
            connection: "You are not connected"
        }
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
