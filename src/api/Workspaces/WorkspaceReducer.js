
const initialState = {
    workspaces: [],
    workspace: null
}

const getWorkspaceById = (state, workspaceId) => {
    const workspaceIndex = state.workspaces.findIndex(value => value.id === workspaceId);
    return [state.workspaces[workspaceIndex], workspaceIndex]
}

const WorkspaceReducer = (state = initialState, action) => {
    let payload = action.payload || {}
    let [workspace, workspaceIndex] = getWorkspaceById(state, parseInt(payload.workspaceId))

    switch (action.type) {
        case "WORKSPACES_FETCHED":   
            return {
                ...state,
                workspaces: payload
            };

        case "WORKSPACE_FETCHED":
            return {
                ...state,
                workspace: payload
            }

        case "CREATE_BOARD_IN_WORKSPACE":
            if (workspace) {
                workspace.boards.push(payload)
                state.workspaces[workspaceIndex] = {
                    ...workspace
                };
            }
            
            if (state.workspace.boards) {
                state.workspace.boards.push(payload)
                state.workspace = {
                    ...state.workspace,
                    boards: [
                        ...state.workspace.boards
                    ]
                }
            }

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