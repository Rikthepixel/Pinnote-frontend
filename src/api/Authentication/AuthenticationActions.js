import auth from "../../utils/FirebaseAuth";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    signOut,
    updateProfile,
    updateEmail as firebaseUpdateEmail,
    updatePassword as firebaseUpdatePassword,
    sendEmailVerification as firebaseSendEmailVerification,
    onAuthStateChanged,
    getIdToken
} from "firebase/auth";
import { clearBoards, clearWorkspaces, clearInvites } from "..";
import superagent from "superagent";
import ErrorHandler from "../ErrorHandler";

const url = process.env.REACT_APP_BACKEND_URL;

const state = {
    user: null,
    token: null,
};

onAuthStateChanged(
    auth,
    (newUser) => { state.user = newUser; },
    ErrorHandler
);

const clearSelf = (dispatch) => {
    dispatch({
        type: "SELF_USER_FETCHED",
        payload: null
    });
}

export const retrieveSelf = (dispatch) => {
    return new Promise((resolve, reject) => {
        getToken(token => {
            superagent.get(`${url}/api/users/self`)
                .set("Authentication", token)
                .then((response) => {

                    if (response.body.error) {
                        reject({
                            message: response.body.error
                        })
                        return;
                    }

                    dispatch({
                        type: "SELF_USER_FETCHED",
                        payload: response.body.data
                    });
                    resolve(response.body);
                }, reject)
        }).catch(reject);
    }).catch(ErrorHandler);
}

export const login = (emailAdress, password) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, emailAdress, password)
            .then((credentials) => {
                resolve(credentials.user);
            })
            .catch(reject);
    });
};

export const register = (displayName, emailAdress, password) => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, emailAdress, password)
            .then((credentials) => {
                updateProfile(credentials.user, {
                    displayName: displayName,
                });
                resolve(credentials.user);
            })
            .catch(reject);
    }).catch(ErrorHandler);
};

export const setUserName = (newUsername) => {
    return new Promise((resolve, reject) => {
        updateProfile(state.user, {
            displayName: newUsername,
        })
            .then(resolve)
            .catch(reject);
    }).catch(ErrorHandler);
};
export const getToken = (onTokenRecieved) => {
    return new Promise((resolve, reject) => {
        if (state.user) {
            getIdToken(state.user)
                .then(token => {
                    if (typeof (onTokenRecieved) === "function") {
                        onTokenRecieved(token)
                    }
                    resolve(token)
                })
                .catch(reject);
        } else {
            reject({
                message: "User is not defined"
            })
        }
    }).catch(ErrorHandler);
}

export const logout = (dispatch) => {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                clearWorkspaces(dispatch);
                clearBoards(dispatch);
                clearInvites(dispatch);
                clearSelf(dispatch)
                resolve();
            })
            .catch(reject);
    }).catch(ErrorHandler);
};

const resolveTrue = (resolve) => {
    resolve({
        result: true,
        message: ""
    })
}

export const sendResetPasswordEmail = (email) => {
    return new Promise((resolve, reject) => {
        firebaseSendPasswordResetEmail(auth, email)
            .then(() => resolveTrue(resolve))
            .catch(reject);
    }).catch(ErrorHandler);
}

export const updateEmail = (email) => {
    return new Promise((resolve, reject) => {
        firebaseUpdateEmail(state.user, email)
            .then(() => resolveTrue(resolve))
            .catch(reject);
    }).catch(ErrorHandler);
}

export const updatePassword = (pass) => {
    return new Promise((resolve, reject) => {
        firebaseUpdatePassword(state.user, pass)
            .then(() => resolveTrue(resolve))
            .catch(reject);
    }).catch(ErrorHandler);
}

export const verifyEmail = () => {
    return new Promise((resolve, reject) => {
        firebaseSendEmailVerification(state.user)
            .then(() => resolveTrue(resolve))
            .catch(reject);
    }).catch(ErrorHandler);
}