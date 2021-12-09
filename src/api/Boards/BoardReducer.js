function generateRandomId() {
    return Math.floor(Math.random() * 10000).toString();
}

const initialNoteState = {
    title: "",
    text: "",
    position: {
        x: 0,
        y: 0
    },
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
    let payload = action.payload;
    let board, boardIndex = null;
    let note, noteIndex = null;

    switch (action.type) {
        case "LOAD_BOARD":
            [board, boardIndex] = getBoardById(state, payload.boardId)
            return Object.assign({}, state, {
                board: board
            })

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
            getBoardById(payload.boardId)
            state.boards.splice(boardIndex, 1)

            if (state.board.id == payload.boardId) {
                state.board = null;
            }

            return Object.assign({}, state, {
                boards: [...state.boards]
            });

        case "UPDATE_BOARD":
            [board, boardIndex] = getBoardById(state, payload.boardId)

            state.boards[boardIndex] = Object.assign({}, board, payload.changes)

            if (state.board.id == payload.boardId) {
                state.board = state.boards[boardIndex]
            }

            return Object.assign({}, state, {
                boards: [...state.boards]
            });

        case "CREATE_BOARD_NOTE":
            if (!state.board) { return state }
            board = state.board

            board.notes.push({
                id: generateRandomId(),
                title: initialNoteState.title,
                text: initialNoteState.text,
                position: action.payload.position || initialNoteState.position,
                backgroundColor: board.defaultNoteBackgroundColor,
                width: initialNoteState.width,
                height: initialNoteState.height
            });

            return Object.assign({}, state, {
                board: Object.assign({}, board, {
                    notes: [...board.notes]
                })
            });

        case "REMOVE_BOARD_NOTE":
            if (!state.board) { return state }
            board = state.board

            [note, noteIndex] = getNoteById(state, action.payload.noteId)
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
            [note, noteIndex]= getNoteById(state, payload.noteId);
            if (!note) { return state; }

            board.notes[noteIndex] = Object.assign({}, note, payload.changes)
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
