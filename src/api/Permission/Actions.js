import { getToken } from ".."
import superagent from "superagent";
import ErrorHandler from "../ErrorHandler";

export const getPermissions = (dispatch) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    }).catch(ErrorHandler)
}

export const getMyWorkspaceBoardPermissions = (dispatch, workspaceId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    }).catch(ErrorHandler)
}

export const grantWorkspacePermissionToUser = (dispatch, workspaceId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    }).catch(ErrorHandler)
}

export const revokeWorkspacePermissionToUser = (dispatch, workspaceId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    }).catch(ErrorHandler)
}

export const grantBoardPermissionToUser = (dispatch, workspaceId, boardId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    }).catch(ErrorHandler)
}

export const revokeBoardPermissionToUser = (dispatch, workspaceId, boardId, userId, permissionId) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            
        }).catch(reject)
    }).catch(ErrorHandler)
}

