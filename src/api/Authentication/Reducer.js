const initialState = {
    user: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SELF_USER_FETCHED":
            return {
                ...state,
                user: action.payload
            }
    
        default:
            return state;
    }

};
export default reducer;