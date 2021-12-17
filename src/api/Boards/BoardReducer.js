function generateRandomId() {
    return Math.floor(Math.random() * 10000).toString();
}

const initialNoteState = {
    title: "",
    text: "",
    positionX: 0,
    positionY: 0,
    width: 200,
    height: 200
}

const initialBoardState = {
    title: "",
    backgroundColor: [
        245,
        245,
        224
    ],
    defaultNoteBackgroundColor: [
        212,
        214,
        133
    ]
}

const initialState = {
    boards: [
        {
            id: 1,
            title: "a board",
            backgroundColor: [0, 128, 128],
            defaultNoteBackgroundColor: [26, 77, 73],
            notes: [],
        },
    ],
};

const getBoardById = (state, id) => {
    if (!id) { return [null, null]}
    let board, index;
    state.boards.every((_board, _index) => {
        if (_board.id == id) {
            
            index = _index;
            board = _board;
            return false;
        }
        return true;
    });
    return [board, index]
}

const getNoteById = (state, id) => {
    if (!id) { return [null, null]}
    let note, index;
    state.board.notes.every((_note, _index) => {
        if (_note.id != id) {
            return true;
        }
        note = _note;
        index = _index;
        return false;
    })
    return [note, index]
}

const BoardReducer = (state = initialState, action) => {
    let payload = action.payload || {};
    let [board, boardIndex] = getBoardById(state, payload.boardId);
    let [note, noteIndex] = getNoteById(state, payload.noteId);

    switch (action.type) {
        case "SUBSCRIBED_TO_BOARD":
            return Object.assign({}, state, {
                board: payload.board
            })

        case "UNSUBSCRIBED_FROM_BOARD":
            return {
                ...state,
                board: null
            }

        case "CREATE_BOARD":
            state.boards.push({
                id: generateRandomId(),
                title: payload.title || initialBoardState.title,
                backgroundColor: payload.backgroundColor || initialBoardState.backgroundColor,
                defaultNoteBackgroundColor: payload.defaultNoteBackgroundColor || initialBoardState.defaultNoteBackgroundColor,
                notes: [],
            });

            return Object.assign({}, state, {
                boards: [...state.boards]
            });

        case "REMOVE_BOARD":
            state.boards.splice(boardIndex, 1)

            if (state.board.id == payload.boardId) {
                state.board = null;
            }

            return Object.assign({}, state, {
                boards: [...state.boards]
            });

        case "UPDATE_BOARD":
            return Object.assign({}, state, {
                board: Object.assign({}, board, payload.changes)
            });

        case "CREATE_BOARD_NOTE":
            if (!state.board) { return state }
            board = state.board

            board.notes.push(payload);
            return Object.assign({}, state, {
                board: Object.assign({}, board, {
                    notes: [...board.notes]
                })
            });

        case "REMOVE_BOARD_NOTE":
            if (!state.board) { return state }
            board = state.board
            if (!note) { return state }
            board.notes.splice(noteIndex, 1)

            return Object.assign({}, state, {
                board: Object.assign({}, board, {
                    notes: [...board.notes]
                })
            });

        case "UPDATE_BOARD_NOTE":
            if (!state.board) { return state; }
            board = state.board;
            if (!note) { return state; }
            board.notes[noteIndex] = Object.assign({}, note, payload);
            return Object.assign({}, state, {
                board: Object.assign({}, board, {
                    notes: [...board.notes]
                })
            });

        case "UPDATE_BOARD_NOTE_POSITION":
            if (!state.board) { return state; }
            board = state.board;
            if (!note) { return state; }
            board.notes[noteIndex] = Object.assign({}, note, {
                positionX: payload.positionX,
                positionY: payload.positionY
            });
            return Object.assign({}, state, {
                board: Object.assign({}, board, {
                    notes: [...board.notes]
                })
            });

        default:
            return state;
    }
};

export default BoardReducer;
