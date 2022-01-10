import { workspaceDTOtoWorkspace, boardDTOtoBoard } from "../DtoHelpers";
import { FormAlert } from "../../utils/Alerts";
import { createBoardSchema } from "../Boards/BoardValidators";
import superagent from "superagent";
import { getToken } from "../Authentication/AuthenticationActions";

const url = process.env.REACT_APP_BACKEND_URL;
const prefabBackgroundColors = [
    [180, 84, 84],
    [84, 136, 180],
    [180, 76, 198],
    [160, 222, 159],
    [243, 232, 204],
    [148, 219, 233]
]

const prefabNoteColors = [
    [207, 38, 38],
    [207, 197, 38],
    [67, 217, 51],
    [14, 123, 209],
    [12, 10, 177],
    [177, 10, 166],
    [222, 56, 117],
    [192, 11, 69]
]

export const clearWorkspaces = (dispatch) => {
    dispatch({
        type: "WORKSPACES_FETCHED",
        payload: []
    });
}

export const fetchMyWorkspaces = (dispatch) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.get(`${url}/api/users/self/workspaces`)
            .set("Authentication", token)
            .then((response) => {
                const workspaces = response.body.map(workspaceDto => workspaceDTOtoWorkspace(workspaceDto));
                dispatch({
                    type: "WORKSPACES_FETCHED",
                    payload: workspaces
                });
                resolve(workspaces);
            }, reject);
        }).catch(reject);
    })
};


export const fetchWorkspace = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.get(`${url}/api/workspaces/${id}`)
            .set("Authentication", token)
            .then((response) => {

                if (response.body.error) {
                    reject(response.body.error)
                    return;
                }

                dispatch({
                    type: "WORKSPACE_FETCHED",
                    payload: workspaceDTOtoWorkspace(response.body.data)
                });
                resolve(response.body);
            }, reject)
        }).catch(reject);
    })
};

export const createWorkspace = (dispatch, name) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.post(`${url}/api/workspaces`)
                .set("Authentication", token)
                .send({
                    name: name
                })
                .then(response => {
                    if (response.body.error) {
                        reject({
                            message: response.body.error
                        })
                        return;
                    }

                    dispatch({
                        type: "WORKSPACE_CREATED",
                        payload: {
                            workspace: workspaceDTOtoWorkspace(response.body.data)
                        }
                    });
                    resolve();
                }, reject);
        }).catch(reject)
    })
};

export const deleteWorkspace = (dispatch, workspaceId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.delete(`${url}/api/workspaces/${workspaceId}`)
                .set("Authentication", token)
                .then(response => {
                    if (response.body.error) {
                        reject({
                            message: response.body.error
                        })
                        return;
                    }
                    dispatch({
                        type: "WORKSPACE_DELETED",
                        payload: {
                            workspaceId: workspaceId
                        }
                    });
                    resolve();
                }, reject);
        }).catch(reject)
    })
};

export const createBoardInWorkspace = (dispatch, workspaceId, title, backgroundColor, noteColor) => {
    return new Promise((resolve, reject) => {
        if (typeof (workspaceId) != 'number') {
            return;
        }

        getToken(token => {
            superagent.post(`${url}/api/workspaces/${workspaceId}/Boards`)
                .set("Authentication", token)
                .send({
                    title: title,
                    backgroundColorR: backgroundColor[0],
                    backgroundColorG: backgroundColor[1],
                    backgroundColorB: backgroundColor[2],
                    defaultNoteColorR: noteColor[0],
                    defaultNoteColorG: noteColor[1],
                    defaultNoteColorB: noteColor[2],
                    visibilityId: 1
                })
                .then((response) => {
                    const board = boardDTOtoBoard(response.body);
                    dispatch({
                        type: "CREATE_BOARD_IN_WORKSPACE",
                        payload: board,
                    });
                    resolve(board);
                }, reject);
        }).catch(reject)
    })
};


export const createBoardInWorkspacePopup = (dispatch, workspaceId) => {
    FormAlert({
        validator: createBoardSchema,
        title: "Create a board",

        acceptButtonText: "Create board!",
        cancelButtonText: "Cancel",

        showCancelButton: true,
        inputs: [
            {
                type: "title",
                title: "Title"
            },
            {
                name: "Title",
                type: "text",
                value: "",
                placeholder: "board title",
                className: "mb-4"
            },
            {
                type: "page"
            },
            {
                type: "title",
                title: "Colors"
            },
            {
                name: "BackgroundColor",
                buttonText: "Background color",
                type: "colorButton",
                value: prefabBackgroundColors[(Math.floor(Math.random() * prefabBackgroundColors.length))]
            },
            {
                name: "DefaultNoteColor",
                buttonText: "Default note color",
                type: "colorButton",
                value: prefabNoteColors[(Math.floor(Math.random() * prefabNoteColors.length))]
            }
        ]
    }).then((result) => {
        if (result.confirmed) {
            createBoardInWorkspace(dispatch, workspaceId, result.values.Title, result.values.BackgroundColor, result.values.DefaultNoteColor);
        }
    })
};

export const setWorkspaceName = (dispatch, workspaceId, newName) => {
    return new Promise((resolve, reject) => {
        if (typeof (workspaceId) != 'number') {
            return;
        }
        getToken(token => {
            superagent.patch(`${url}/api/workspaces/${workspaceId}/name`)
                .set("Authentication", token)
                .send({
                    name: newName
                })
                .then(response => {
                    if (response.error) { reject(response.error) }
                    dispatch({
                        type: "UPDATE_WORKSPACE",
                        payload: {
                            workspaceId: workspaceId,
                            changes: {
                                name: newName
                            }
                        },
                    });

                    resolve(response);
                }, reject)
        }).catch(reject)
    })
};

export const inviteUserByEmail = (dispatch, workspaceId, email) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.post(`${url}/api/workspaces/${workspaceId}/invites/email/${email}`)
                .set("Authentication", token)
                .then(response => {

                    if (response.body.error) {
                        reject({
                            message: response.body.error
                        })
                        return;
                    }

                    dispatch({
                        type: "ADD_WORKSPACE_INVITE",
                        payload: {
                            workspaceId: workspaceId,
                            invite: response.body.data
                        }
                    });
                    resolve();
                }, reject);
        }).catch(reject)
    })
};

export const cancelInvite = (dispatch, workspaceId, inviteId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.delete(`${url}/api/workspaces/${workspaceId}/invites/${inviteId}`)
                .set("Authentication", token)
                .then(response => {
                    dispatch({
                        type: "REMOVE_WORKSPACE_INVITE",
                        payload: {
                            workspaceId: workspaceId,
                            inviteId: inviteId
                        }
                    });
                    resolve();
                }, reject);
        }).catch(reject)
    })
};

export const removeMember = (dispatch, workspaceId, userId, candidate) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.delete(`${url}/api/workspaces/${workspaceId}/members/${userId}`)
                .set("Authentication", token)
                .query(candidate ? {
                    candidate: candidate
                } : {})
                .then(response => {
                    if (!response.body) return;
                    if (response.body.error || !response.body.data) {
                        reject({
                            message: response.body.error
                        })
                        return;
                    }
                    
                    dispatch({
                        type: "REMOVE_WORKSPACE_MEMBER",
                        payload: {
                            workspaceId: workspaceId,
                            userId: userId
                        }
                    });
                    resolve();
                }, reject);
        }).catch(reject)
    })
};

export const transferOwnership = (dispatch, workspaceId, candidate) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.patch(`${url}/api/workspaces/${workspaceId}/owner/transfer/${candidate}`)
                .set("Authentication", token)
                .query({
                    candidate: candidate
                })
                .then(response => {

                    if (response.body.error) {
                        reject({
                            message: response.body.error
                        })
                    }

                    dispatch({
                        type: "ASSIGN_WORKSPACE_OWNER",
                        payload: {
                            workspaceId: workspaceId,
                            userId: candidate
                        }
                    });
                    resolve();
                }, reject);
        }).catch(reject)
    })
}