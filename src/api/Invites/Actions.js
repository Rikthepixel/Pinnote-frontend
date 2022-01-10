import superagent from "superagent";
import { getToken } from "..";

const url = process.env.REACT_APP_BACKEND_URL;

export const clearInvites = (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: "INVITES_FETCHED",
            payload: []
        });
        resolve();
    });
};

export const fetchInvites = (dispatch) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.get(`${url}/api/users/self/invites`)
                .set("Authentication", token)
                .then(response => {
                    dispatch({
                        type: "INVITES_FETCHED",
                        payload: response.body
                    });
                    resolve(response.body);
                }, reject);
        }).catch(reject);
    })
};

const removeInviteDispatch = (dispatch, id, resolve) => {
    dispatch({
        type: "REMOVE_INVITE",
        payload: id
    });
    resolve();
}

export const acceptInvite = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.post(`${url}/api/users/self/invites/${id}`)
                .set("Authentication", token)
                .then(() => removeInviteDispatch(dispatch, id, resolve), reject);
        }).catch(reject)
    })
};

export const rejectInvite = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.delete(`${url}/api/users/self/invite/${id}`)
                .set("Authentication", token)
                .then(() => removeInviteDispatch(dispatch, id, resolve), reject);
        }).catch(reject)
    })
}