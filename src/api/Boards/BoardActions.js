export const getAllPinBoards = () => {
    return {
        type: "GET_ALL_BOARDS",
    };
};

export const createPinBoard = () => {
    return {
        type: "CREATE_BOARD",
        payload: {
            title: "new board",
            background_color: [128, 128, 128]
        }
    };
};

export const updatePinBoard = (boardId, changes) => {
    return {
        type: "UPDATE_BOARD",
        payload: {
            boardId: boardId,
            changes: changes,
        }
    }
}

export const createPinNote = (boardId, position) => {
    return {
        type: "CREATE_BOARD_NOTE",
        payload: {
            boardId: boardId,
            position: position
        }
    }
}

export const deletePinNote = (boardId, noteId) => {
    return {
        type: "REMOVE_BOARD_NOTE",
        payload: {
            boardId: boardId,
            noteId: noteId
        }
    }
}