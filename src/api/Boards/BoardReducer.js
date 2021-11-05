const initialState = {
    boards: [
        {
            title: "a board",
            background_color: [128, 128, 128],

            notes: [
                {
                    noteId: Math.random(1, 99999),
                    title: "Note 1",
                    text: "Some text",
                    position: {
                        x: 200,
                        y: 300,
                    },
                },
                {
                    noteId: Math.random(1, 99999),
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
    switch (action.type) {
        case "GET_ALL_BOARDS":
            return {
                ...state,
            };

        case "CREATE_BOARD":
            state.boards.push({
                title: action.payload.title,
                background_color: action.payload.background_color,
                notes: [],
            });
            return {
                ...state,
                boards: [
                    ...state.boards
                ]
            };

        default:
            return state;
    }
};

export default BoardReducer;
