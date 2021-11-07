import { act } from "react-dom/test-utils";

function generateRandomId() {
    return Math.floor(Math.random() * 10000).toString();
}

const initialState = {
    boards: [
        {
            boardId: 1,
            title: "a board",
            background_color: [128, 128, 128],

            notes: [
                {
                    noteId: generateRandomId(),
                    title: "Note 1",
                    text: "Some text",
                    position: {
                        x: 200,
                        y: 300,
                    },
                },
                {
                    noteId: generateRandomId(),
                    title: "Note 2",
                    text: "Some text",
                    position: {
                        x: 300,
                        y: 300,
                    },
                },
            ],
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
                title: action.payload.title,
                background_color: action.payload.background_color,
                notes: [],
            });
            return {
                ...state,
                boards: [...state.boards],
            };

        case "UPDATE_BOARD":
            findBoardById(action.payload.boardId)

            console.log(state.boards[boardIndex])
            state.boards[boardIndex] = {
                ...board,
                ...action.payload.changes
            }

            console.log(state.boards[boardIndex])

            return {
                ...state,
                boards: [
                    ...state.boards
                ],
            };

        case "CREATE_BOARD_NOTE":
            findBoardById(action.payload.boardId)

            board.notes.push({
                noteId: generateRandomId(),
                title: "",
                text: "",
                position: action.payload.position,
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

        default:
            return state;
    }
};

export default BoardReducer;
