const initialState = {
    boards: [],
    board: {}
};

const getBoardById = (state, id) => {
    if (!id) { return [null, null] };
    let index = state.boards.findIndex(_board => _board.id === id);
    return [state.boards[index], index];
}

const getNoteById = (state, id) => {
    if (!id) { return [null, null] };
    let index = state.board.notes.findIndex(_note => _note.id === id);
    return [state.board.notes[index], index];
}

const BoardReducer = (state = initialState, action) => {
    let payload = action.payload || {};
    let [board, boardIndex] = getBoardById(state, parseInt(payload.boardId));
    let [note, noteIndex] = getNoteById(state, parseInt(payload.noteId));

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

            return {
                ...state,
                boards: [...state.boards]
            }

        case "REMOVE_BOARD":
            if (board != null){
                state.boards.splice(boardIndex, 1)
                state = Object.assign({}, state, {
                    boards: [...state.boards]
                })
            }

            if (state.board != null){
                if (parseInt(state.board.id) === parseInt(payload.boardId)) {
                    state.board = {
                        state: "removed"
                    };
                    state = Object.assign({}, state)
                }
            }



            return state;

        case "UPDATE_BOARD":
            return {
                ...state,
                board: {
                    ...state.board,
                    ...payload
                }
            }
        case "CREATE_BOARD_NOTE":
            if (!state.board) { return state }
            board = state.board

            //This fixes note duplication glitch because client NoteAdded occationally fires multiple tines
            if (typeof(note) === "object") {
                return state;
            }

            board.notes.push(payload);
            return {
                ...state,
                board: {
                    ...board,
                    notes: [...board.notes]
                }
            }

        case "REMOVE_BOARD_NOTE":
            if (!state.board) { return state }
            board = state.board
            if (!note) { return state }
            board.notes.splice(noteIndex, 1)

            return {
                ...state,
                board: {
                    ...board,
                    notes: [...board.notes]
                }
            }

        case "UPDATE_BOARD_NOTE":
            if (!state.board) { return state; }
            board = state.board;
            if (!note) { return state; }
            
            board.notes[noteIndex] = Object.assign({}, note, payload);
            return {
                ...state,
                board: {
                    ...board,
                    notes: [...board.notes]
                }
            }

        case "UPDATE_BOARD_NOTE_POSITION":
            if (!state.board) { return state; }
            board = state.board;
            if (!note) { return state; }
            
            board.notes[noteIndex] = Object.assign({}, note, {
                positionX: payload.positionX,
                positionY: payload.positionY
            });
            return {
                ...state,
                board: {
                    ...board,
                    notes: [...board.notes]
                }
            }

        default:
            return state;
    }
};

export default BoardReducer;
