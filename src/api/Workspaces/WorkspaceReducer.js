
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

        case "UPDATE_WORKSPACE":
            if (workspace) {
                state.workspaces[workspaceIndex] = {
                    ...workspace,
                    ...payload.changes
                }
            }
            
            if (state.workspace.id === parseInt(payload.workspaceId)) {
                state.workspace = {
                    ...state.workspace,
                    ...payload.changes
                }
            }
            
            return {
                ...state,
                workspaces: [
                    ...state.workspaces
                ]
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

        case "ADD_WORKSPACE_INVITE":
            if (typeof(workspace) === "object") {
                workspace.invitations.push(payload.invite)
                state.workspaces[workspaceIndex] = {
                    ...workspace,
                    invitations: [...workspace.invitations]
                }
            }

            if (typeof(state.workspace) === "object" || Object.keys(state.workspace) > 0) {
                state.workspace.invitations.push(payload.invite)
                state.workspace = {
                    ...state.workspace,
                    invitations: [...state.workspace.invitations]
                }
            }
            
            return {
                ...state
            }

        case "REMOVE_WORKSPACE_INVITE":
            if (typeof(workspace) === "object") {
                workspace.invitations = workspace.invitations.filter(inv => parseInt(inv.id) !== parseInt(payload.inviteId));
                state.workspaces[workspaceIndex] = {
                    ...workspace,
                    invitations: [...workspace.invitations]
                }
            }

            if (typeof(state.workspace) === "object" || Object.keys(state.workspace) > 0) {
                state.workspace.invitations = state.workspace.invitations.filter(inv => parseInt(inv.id) !== parseInt(payload.inviteId));
                state.workspace = {
                    ...state.workspace,
                    invitations: [...state.workspace.invitations]
                }
            }
            
            return {
                ...state
            }
    
        default:
            return state;
    }

};

export default WorkspaceReducer;