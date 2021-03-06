import { validateBoard, validateNote } from "./BoardValidators";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { noteDTOtoNote, boardDTOtoBoard } from "../DtoHelpers";
import superagent from "superagent";
import { getToken } from "..";
import ErrorHandler from "../ErrorHandler";

const url = process.env.REACT_APP_BACKEND_URL;
const moveInterval = process.env.REACT_APP_NOTE_MOVE_INTERVAL;

const connections = {
    boardHub: new HubConnectionBuilder()
        .withUrl(`${url}/hubs/board`, {
            accessTokenFactory: () => {
                return getToken();
            }
        })
        .build(),

    noteHub: new HubConnectionBuilder()
        .withUrl(`${url}/hubs/note`, {
            accessTokenFactory: () => {
                return getToken();
            }
        })
        .build(),

    IsConnected: function () {
        return (this.noteHub.state === "Connected" && this.boardHub.state === "Connected")
    },

    Connect: function () {

        return new Promise((resolve, reject) => {

            const tryConnectBoth = () => {
                let hubsThatWillConnect = []
                if (this.boardHub.state === "Disconnected") {
                    hubsThatWillConnect.push(this.boardHub.start());
                }
                if (this.noteHub.state === "Disconnected") {
                    hubsThatWillConnect.push(this.noteHub.start());
                }
                return Promise.all(hubsThatWillConnect)
            }

            if (this.IsConnected()) {
                Promise.all([
                    this.boardHub.invoke("UnSubscribe"),
                    this.noteHub.invoke("UnSubscribe") //TODO: remove once user authentication is added
                ]).then(() => {
                    if (!this.IsConnected()) {
                        tryConnectBoth()
                            .then(resolve)
                            .catch(reject);
                    } else {
                        resolve();
                    }
                });


            } else {
                tryConnectBoth()
                    .then(resolve)
                    .catch(reject)
            }
        })
    },

    Disconnect: function () {
        if (this.boardHub.state === "Connected") {
            this.boardHub.send("UnSubscribe");
            this.boardHub.stop();
        }
        if (this.noteHub.state === "Connected") {
            //TODO: remove once user authentication is added
            this.noteHub.send("UnSubscribe");
            this.noteHub.stop();
        }

        this.boardHub.off();
        this.noteHub.off();
    }
}

const lerp = (start, end, percentage) => {
    return start + (end - start) * percentage
}
const noteMoveIntervals = {};

export const loadBoard = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        id = parseInt(id);
        if (typeof (id) != 'number') {
            return;
        }

        connections.Connect()
            .then(() => {
                Promise.all([
                    connections.boardHub.invoke("Subscribe", id),
                    connections.noteHub.invoke("Subscribe", id)
                ])
                    .then((subscriptioResponses) => {

                        for (const response of subscriptioResponses) {
                            if (response.error) {
                                reject(response.error);
                                return;
                            }
                        }

                        connections.boardHub.off();
                        connections.noteHub.off();

                        const onClose = (err) => {
                            if (err) { console.error(err); }
                            connections.Disconnect();
                        }
                        connections.boardHub.onclose(onClose);
                        connections.noteHub.onclose(onClose);

                        connections.boardHub.on("BoardUpdated", response => {
                            delete response.data.notes;

                            dispatch({
                                type: "UPDATE_BOARD",
                                payload: boardDTOtoBoard(response.data),
                            });
                        });

                        connections.boardHub.on("BoardRemoved", response => {
                            dispatch({
                                type: "REMOVE_BOARD",
                                payload: {
                                    boardId: response.data,
                                },
                            });
                        })

                        connections.noteHub.on("NoteAdded", response => {
                            dispatch({
                                type: "CREATE_BOARD_NOTE",
                                payload: noteDTOtoNote(response.data),
                            });
                        });

                        connections.noteHub.on("NoteUpdated", response => {
                            dispatch({
                                type: "UPDATE_BOARD_NOTE",
                                payload: noteDTOtoNote(response.data),
                            });
                        });

                        connections.noteHub.on("NoteMoved", response => {
                            const { noteId, endX, endY } = response.data;
                            let { startX, startY } = response.data;
                            const moveTimes = 50;
                            const percentagePerInterval = 100 / moveTimes / 100;
                            const invertvalTime = moveInterval / moveTimes;

                            const existingTween = noteMoveIntervals[noteId];
                            if (existingTween) {
                                clearInterval(existingTween.interval);
                                startX = existingTween.posX;
                                startY = existingTween.posY;
                            }

                            let invervalNumber = 1;
                            noteMoveIntervals[noteId] = {
                                posX: startX,
                                posY: startY,
                                interval: setInterval(() => {
                                    const alpha = invervalNumber * percentagePerInterval;
                                    const posX = lerp(startX, endX, alpha);
                                    const posY = lerp(startY, endY, alpha);

                                    noteMoveIntervals[noteId].posX = posX;
                                    noteMoveIntervals[noteId].posY = posY;

                                    dispatch({
                                        type: "UPDATE_BOARD_NOTE_POSITION",
                                        payload: {
                                            noteId: noteId,
                                            positionX: posX,
                                            positionY: posY
                                        }
                                    });

                                    invervalNumber += 1;

                                    if (invervalNumber >= moveTimes) {
                                        clearInterval(noteMoveIntervals[noteId].interval);
                                        delete noteMoveIntervals[noteId];
                                        dispatch({
                                            type: "UPDATE_BOARD_NOTE_POSITION",
                                            payload: {
                                                noteId: noteId,
                                                positionX: endX,
                                                positionY: endY
                                            }
                                        });
                                    }
                                }, invertvalTime)
                            };
                        });

                        connections.noteHub.on("NoteRemoved", response => {
                            dispatch({
                                type: "REMOVE_BOARD_NOTE",
                                payload: {
                                    noteId: response.data.id,
                                },
                            });
                        });

                        let parsedBoard = boardDTOtoBoard(subscriptioResponses[1].data);
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
            .catch(reject);
    }).catch(ErrorHandler);
};

export const unloadBoard = (dispatch) => {
    connections.Disconnect();
    dispatch({
        type: "UNSUBSCRIBED_FROM_BOARD",
    });
};

export const clearBoards = (dispatch) => {
    dispatch({
        type: "BOARDS_FETCHED",
        payload: []
    });
}

export const getBoardsByWorkspaceId = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.get(`${url}/api/workspaces/${id}/boards`)
                .set("Authentication", token)
                .then(response => {
                    dispatch({
                        type: "BOARDS_FETCHED",
                        payload: response.body.map(boardDto => boardDTOtoBoard(boardDto))
                    });
                    resolve(response.body);
                }, reject);
        }).catch(reject)
    })
}

export const deleteBoard = (dispatch, boardId) => {
    return new Promise((resolve, reject) => {
        if (typeof (boardId) != 'number') {
            return;
        }

        getToken(token => {
            superagent.delete(`${url}/api/boards/${boardId}`)
                .set("Authentication", token)
                .then(response => {
                    if (response.error) { reject(response.error) }
                    dispatch({
                        type: "REMOVE_BOARD",
                        payload: {
                            boardId: boardId,
                        },
                    });

                    resolve(response);
                }, reject);
        }).catch(reject);
    });
};

export const setBoardTitle = (newTitle) => {
    let errors = validateBoard({
        title: newTitle,
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }
    connections.boardHub
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

    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }
    connections.boardHub
        .invoke("SetBoardNoteColor", {
            DefaultBackgroundColorR: colorR,
            DefaultBackgroundColorG: colorG,
            DefaultBackgroundColorB: colorB,
        })
        .catch(ErrorHandler);

    return {};
}

export const setBoardColor = (colorR, colorG, colorB) => {
    let errors = validateBoard({
        backgroundColor: [colorR, colorG, colorB],
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.boardHub
        .invoke("SetBoardColor", {
            backgroundColorR: colorR,
            backgroundColorG: colorG,
            backgroundColorB: colorB,
        })
        .catch(ErrorHandler);

    return {};
}

export const createPinNote = (positionX, positionY) => {
    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("CreateNote", {
            positionX: positionX,
            positionY: positionY,
        })
        .catch(ErrorHandler);
};

export const deletePinNote = (noteId) => {
    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("DeleteNote", noteId)
        .catch(ErrorHandler);
};

export const saveNotePosition = (noteId, positionX, positionY) => {
    let errors = validateNote({
        position: {
            x: positionX,
            y: positionY,
        },
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("SetNotePosition", {
            id: noteId,
            positionX: positionX,
            positionY: positionY,
        })
        .catch(ErrorHandler);
}

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
    return {};
};

export const setNoteColor = (noteId, colorR, colorG, colorB) => {
    let errors = validateNote({
        backgroundColor: [colorR, colorG, colorB],
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("SetNoteColor", {
            id: noteId,
            backgroundColorR: colorR,
            backgroundColorG: colorG,
            backgroundColorB: colorB,
        })
        .catch(ErrorHandler);

    return {};
};

export const setNoteText = (noteId, text, dispatch) => {
    let errors = validateNote({
        text: text,
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("SetNoteText", {
            id: noteId,
            text: text,
        })
        .catch(ErrorHandler);

    dispatch({
        type: "UPDATE_BOARD_NOTE",
        payload: {
            noteId: noteId,
            text: text
        },
    });

    return {};
};

export const addNoteAttachment = (noteId, attachment) => {
    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("AddNoteAttachment", {
            noteId: noteId,
            file: attachment,
        })
        .catch(ErrorHandler);
}

export const removeNoteAttachment = (noteId, attachmentId) => {
    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("RemoveNoteAttachment", {
            noteId: noteId,
            attachmentId: attachmentId,
        })
        .catch(ErrorHandler);
}

export const setNoteTitle = (noteId, title) => {
    let errors = validateNote({
        title: title,
    });
    if (Object.keys(errors).length > 0) {
        return errors;
    }

    if (!connections.IsConnected()) {
        return {
            connection: "You are not connected"
        }
    }

    connections.noteHub
        .invoke("SetNoteTitle", {
            id: noteId,
            title: title,
        })
        .catch(ErrorHandler);

    return {};
};
