import boardSchema, { validateBoard, validateNote } from "./BoardValidators";
import { HubConnectionBuilder } from "@microsoft/signalr";

const boardHubConnection = new HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_BACKEND_URL}/boardHub`)
    .build();

const colorDTOtoColor = (dto) => {
    return JSON.parse(dto, (key, value) => {
        if (!key) {
            return value
        }
        return parseInt(value)
    })
}

const noteDTOtoNote = (dto) => {
    console.log(dto);
    return {
        ...dto,
        backgroundColor: colorDTOtoColor(dto.backgroundColor)
    }
}

const boardDTOtoBoard = (dto) => {
    return {
        ...dto,
        backgroundColor: colorDTOtoColor(dto.backgroundColor),
        notes: dto.notes.map(noteDTO => noteDTOtoNote(noteDTO)),
    }
}

export const loadBoard = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        if (!id) { return }
        boardHubConnection.start()
            .then(() => {
                boardHubConnection.invoke("Subscribe", 2)
                    .then((response) => {
                        if (response.error) {
                            reject(response.error);
                            return;
                        }

                        let parsedBoard = boardDTOtoBoard(response.data)
                        console.log(parsedBoard);
                        dispatch({
                            type: "SUBSCRIBED_TO_BOARD",
                            payload: {
                                board: parsedBoard
                            }
                        });
                        resolve(parsedBoard)
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));
    })
}

export const unloadBoard = (dispatch) => {
    boardHubConnection.send("UnSubscribe")
    boardHubConnection.off();
    boardHubConnection.stop();

    dispatch({
        type: "UNSUBSCRIBED_FROM_BOARD"
    })
}

export const createPinBoard = (dispatch) => {
    dispatch({
        type: "CREATE_BOARD",
        payload: {
            title: "new board",
        }
    });
};

export const removePinBoard = (dispatch, boardId) => {
    dispatch({
        type: "REMOVE_BOARD",
        payload: {
            boardId: boardId,
        }
    })
}

export const updatePinBoard = (dispatch, boardId, changes) => {

    let errors = validateBoard(changes)
    if (Object.keys(errors).length > 0) {
        return errors
    }

    dispatch({
        type: "UPDATE_BOARD",
        payload: {
            boardId: boardId,
            changes: changes,
        }
    })

    return {}
}

export const createPinNote = (dispatch, position) => {
    dispatch({
        type: "CREATE_BOARD_NOTE",
        payload: {
            position: position
        }
    })
}

export const deletePinNote = (dispatch, noteId) => {
    dispatch({
        type: "REMOVE_BOARD_NOTE",
        payload: {
            noteId: noteId
        }
    })
}

export const setPinNotePosition = (dispatch, noteId, x, y) => {
    dispatch({
        type: "SET_NOTE_POSITION",
        payload: {
            x: x,
            y: y,
        }
    })
}

export const updatePinNote = (dispatch, noteId, changes) => {
    let errors = validateNote(changes)
    if (Object.keys(errors).length > 0) {
        return errors
    }

    dispatch({
        type: "UPDATE_BOARD_NOTE",
        payload: {
            noteId: noteId,
            changes: changes
        }
    })

    return {}
}