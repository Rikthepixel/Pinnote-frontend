
const initialState = {
    workspaces: [],
    workspace: null
}

const WorkspaceReducer = (state = initialState, action) => {

    switch (action.type) {
        case "WORKSPACES_FETCHED":
            return {
                ...state,
                workspaces: action.payload
            };
    
        default:
            return state;
    }

};

export default WorkspaceReducer;