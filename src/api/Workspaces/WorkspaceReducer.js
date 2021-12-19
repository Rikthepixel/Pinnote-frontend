
const initialState = {
    workspaces: [],
    workspace: null
}

const getWorkspaceById = (state, workspaceId) => {
    const workspaceIndex = state.workspaces.findIndex(value => value.id == workspaceId);
    return [state.workspaces[workspaceIndex], workspaceIndex]
}

const WorkspaceReducer = (state = initialState, action) => {
    let [workspace, workspaceIndex] = [null, null];
    if (typeof(action.payload) === "object") {
        [workspace, workspaceIndex] = getWorkspaceById(state, action.payload.workspaceId)
    }

    switch (action.type) {
        case "WORKSPACES_FETCHED":
            
            return {
                ...state,
                workspaces: action.payload
            };

        case "CREATE_BOARD_IN_WORKSPACE":
            workspace.boards.push(action.payload)
            state.workspaces[workspaceIndex] = {
                ...workspace
            };

            console.log(workspace);
            return {
                ...state,
                workspaces: [
                    ...state.workspaces
                ]
            }
    
        default:
            return state;
    }

};

export default WorkspaceReducer;