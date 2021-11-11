import { act } from "react-dom/test-utils";

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
    background_color: [
        245,
        245,
        224
    ],
    default_note_background_color: [
        212,
        214,
        133
    ]
}

const initialState = {
    boards: [
        {
            boardId: 1,
            title: "a board",
            background_color: [0, 128, 128],
            default_note_background_color: [ 212, 214, 133 ],
            notes: [],
        },
    ],
};

const BoardReducer = (state = initialState, action) => {
    let board, boardIndex = null;
    let note, noteIndex = null;

    function findBoardById(id) {
        state.boards.every((_board, index) => {
            if (_board.boardId != id) {
                return true;
            }
            boardIndex = index;
            board = _board;
            return false;
        });
    }

    function findNoteById(board, id) {
        board.notes.every((_note, i) => {
            if (_note.noteId != id) {
                return true;
            }
            note = _note;
            noteIndex = i;
            return false;
        })
    }

    switch (action.type) {
        case "GET_ALL_BOARDS":
            return {
                ...state,
            };

        case "CREATE_BOARD":
            state.boards.push({
                boardId: generateRandomId(),
                title: action.payload.title || initialBoardState.title,
                background_color: action.payload.background_color || initialBoardState.background_color,
                default_note_background_color: action.payload.default_note_background_color || initialBoardState.default_note_background_color,
                notes: [],
            });
            return {
                ...state,
                boards: [...state.boards],
            };

        case "REMOVE_BOARD":
            findBoardById(action.payload.boardId)
            state.boards.splice(boardIndex, 1)

            return {
                ...state,
                boards: [
                    ...state.boards
                ],
            };

        case "UPDATE_BOARD":
            findBoardById(action.payload.boardId)

            state.boards[boardIndex] = {
                ...board,
                ...action.payload.changes
            }

            return {
                ...state,
                boards: [
                    ...state.boards
                ],
            };

        case "CREATE_BOARD_NOTE":
            findBoardById(action.payload.boardId)
            console.log(board)
            board.notes.push({
                noteId: generateRandomId(),
                title: initialNoteState.title,
                text: initialNoteState.text,
                position: action.payload.position || initialNoteState.position,
                background_color: board.default_note_background_color,
                width: initialNoteState.width,
                height: initialNoteState.height
            });

            state.boards[boardIndex] = {
                ...board,
                notes: [...board.notes],
            }

            return {
                ...state,
                boards: [
                    ...state.boards
                ],
            };

        case "REMOVE_BOARD_NOTE":
            findBoardById(action.payload.boardId)
            findNoteById(board, action.payload.noteId)
            board.notes.splice(noteIndex, 1)

            state.boards[boardIndex] = {
                ...board,
                notes: [...board.notes],
            }

            return {
                ...state,
                boards: [
                    ...state.boards
                ],
            };

        case "UPDATE_BOARD_NOTE":
            findBoardById(action.payload.boardId)
            findNoteById(board, action.payload.noteId)

            board.notes[noteIndex] = {
                ...note,
                ...action.payload.changes
            }

            state.boards[boardIndex] = {
                ...board,
                notes: [...board.notes],
            }

            return {
                ...state,
                boards: [
                    ...state.boards
                ],
            }; 

        default:
            return state;
    }
};

export default BoardReducer;
