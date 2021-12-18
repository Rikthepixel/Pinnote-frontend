const initialState = {
    boards: [],
    board: null
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

        case "BOARDS_FETCHED":
            return {
                ...state,
                boards: action.payload
            }

        case "CREATE_BOARD":
            state.boards.push(payload);

            return Object.assign({}, state, {
                boards: [...state.boards]
            });

        case "REMOVE_BOARD":
            if (board != null){
                state.boards.splice(boardIndex, 1)
                state = Object.assign({}, state, {
                    boards: [...state.boards]
                })
            }

            if (state.board.id == payload.boardId) {
                state.board = null;
                state = Object.assign({}, state)
            }

            return state;

        case "UPDATE_BOARD":
            return Object.assign({}, state, {
                board: Object.assign({}, state.board, payload)
            });

        case "CREATE_BOARD_NOTE":
            if (!state.board) { return state }
            board = state.board

            //This fixes note duplication glitch because client NoteAdded occationally fires multiple tines
            if (typeof(note) == "object") {
                return state;
            }

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
