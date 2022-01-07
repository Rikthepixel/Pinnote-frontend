
const initialState = {
    invites: []
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case "INVITES_FETCHED":
            return {
                invites: action.payload
            };
    
        default:
            return state;
    }
};

export default Reducer;