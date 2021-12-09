import boardSchema, { validateBoard, validateNote } from "./BoardValidators";

export const loadBoard = (dispatch, id) => {
    if (!id) { return }

    dispatch({
        type: "LOAD_BOARD",
        payload: {
            boardId: id
        }
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