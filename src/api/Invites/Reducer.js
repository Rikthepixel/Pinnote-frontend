
const initialState = {
    invites: []
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case "INVITES_FETCHED":
            return {
                invites: action.payload
            };
        
        case "REMOVE_INVITE":
            return {
                ...state,
                invites: state.invites.filter(inv => parseInt(inv.id) !== parseInt(action.payload))
            }
    
        default:
            return state;
    }
};

export default Reducer;