import { getToken } from ".."
import superagent from "superagent";

export const getPermissions = (dispatch) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    })
}

export const getMyWorkspaceBoardPermissions = (dispatch, workspaceId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    })
}

export const grantWorkspacePermissionToUser = (dispatch, workspaceId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    })
}

export const revokeWorkspacePermissionToUser = (dispatch, workspaceId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    })
}

export const grantBoardPermissionToUser = (dispatch, workspaceId, boardId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    })
}

export const revokeBoardPermissionToUser = (dispatch, workspaceId, boardId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        })
    })
}

