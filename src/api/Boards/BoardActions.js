export const getAllPinBoards = (dispatch) => {
    dispatch({
        type: "GET_ALL_BOARDS",
    });
};

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
    dispatch({
        type: "UPDATE_BOARD",
        payload: {
            boardId: boardId,
            changes: changes,
        }
    })
}

export const createPinNote = (dispatch, boardId, position) => {
    dispatch({
        type: "CREATE_BOARD_NOTE",
        payload: {
            boardId: boardId,
            position: position
        }
    })
}

export const deletePinNote = (dispatch, boardId, noteId) => {
    dispatch({
        type: "REMOVE_BOARD_NOTE",
        payload: {
            boardId: boardId,
            noteId: noteId
        }
    })
}

export const updatePinNote = (dispatch, boardId, noteId, changes) => {
    dispatch({
        type: "UPDATE_BOARD_NOTE",
        payload: {
            boardId: boardId,
            noteId: noteId,
            changes: changes
        }
    })
}