const initialState = {
    user: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SELF_USER_FETCHED":
            console.log(action.payload);
            return {
                ...state,
                user: action.payload
            }
    
        default:
            console.log(action.type);
            return state;
    }

};
export default reducer;