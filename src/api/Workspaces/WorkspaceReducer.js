
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
        
        case "WORKSPACE_DELETED":
            if (workspace) {
                state.workspaces = state.workspaces.filter(workspace => parseInt(workspace.id) !== parseInt(payload.workspaceId))
            }

            if (state.workspace) {
                state.workspace = null;
            }

            return {
                ...state
            }

        case "WORKSPACE_CREATED":
            
            state.workspaces.push(payload.workspace)

            return {
                ...state,
                workspace: payload.workspace,
                workspaces: [...state.workspaces]
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
                if (workspace.invitations) {
                    workspace.invitations.push(payload.invite)
                    state.workspaces[workspaceIndex] = {
                        ...workspace,
                        invitations: [...workspace.invitations]
                    }
                }
            }

            if (typeof(state.workspace) === "object" || Object.keys(state.workspace) > 0) {
                if (state.workspace.invitations) {
                    state.workspace.invitations.push(payload.invite)
                    state.workspace = {
                        ...state.workspace,
                        invitations: [...state.workspace.invitations]
                    }
                }
            }
            
            return {
                ...state
            }

        case "REMOVE_WORKSPACE_INVITE":
            if (typeof(workspace) === "object") {
                if (workspace.invitations) {
                    workspace.invitations = workspace.invitations.filter(inv => parseInt(inv.id) !== parseInt(payload.inviteId));
                    state.workspaces[workspaceIndex] = {
                        ...workspace,
                        invitations: [...workspace.invitations]
                    }
                }
            }

            if (typeof(state.workspace) === "object" || Object.keys(state.workspace) > 0) {
                if (state.workspace.invitations) {
                    state.workspace.invitations = state.workspace.invitations.filter(inv => parseInt(inv.id) !== parseInt(payload.inviteId));
                    state.workspace = {
                        ...state.workspace,
                        invitations: [...state.workspace.invitations]
                    }
                }
            }
            
            return {
                ...state
            }

        case "REMOVE_WORKSPACE_MEMBER":
            if (typeof(workspace) === "object") {
                if (workspace.users) {
                    workspace.users = workspace.users.filter(user => parseInt(user.id) !== parseInt(payload.userId));
                    state.workspaces[workspaceIndex] = {
                        ...workspace,
                        users: [...workspace.users]
                    }
                }
            }

            if (typeof(state.workspace) === "object" || Object.keys(state.workspace) > 0) {
                if (state.workspace.users) {
                    state.workspace.users = state.workspace.users.filter(user => parseInt(user.id) !== parseInt(payload.userId));
                    state.workspace = {
                        ...state.workspace,
                        users: [...state.workspace.users]
                    }
                }
            }
            
            return {
                ...state
            }     
            
        case "ASSIGN_WORKSPACE_OWNER":
            if (typeof(workspace) === "object") {
                if (workspace.users) {
                    workspace.owner = workspace.users.find(user => user.id === parseInt(payload.userId));
                    workspace.ownerId = workspace.owner.id;
                    state.workspaces[workspaceIndex] = {
                        ...workspace
                    }
                }
            }

            if (typeof(state.workspace) === "object" || Object.keys(state.workspace) > 0) {
                if (state.workspace.users) {
                    state.workspace.owner = state.workspace.users.find(user => user.id === parseInt(payload.userId));
                    state.workspace.ownerId = state.workspace.owner.id;
                    state.workspace = {
                        ...state.workspace
                    }
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