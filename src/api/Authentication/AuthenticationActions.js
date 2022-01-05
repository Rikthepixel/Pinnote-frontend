import auth from "../../utils/FirebaseAuth";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
    getIdToken,
} from "firebase/auth";
import { clearBoards, clearWorkspaces } from "..";

const state = {
    user: null,
    token: null,
};

onAuthStateChanged(
    auth,
    (newUser) => {
        console.log(newUser);
        state.user = newUser;
    },
    (err) => console.log(err)
);

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
    });
};

export const setUserName = (newUsername) => {
    return new Promise((resolve, reject) => {
        updateProfile(state.user, {
            displayName: newUsername,
        })
            .then(() => resolve())
            .catch(reject);
    });
};

export const getToken = (onTokenRecieved) => {
    return new Promise((resolve, reject) => {
        if (state.user) {
            getIdToken(state.user)
            .then(token => {
                if (typeof(onTokenRecieved) === "function") {
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
    })
}

export const logout = (dispatch) => {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                clearWorkspaces(dispatch);
                clearBoards(dispatch);
                resolve();
            })
            .catch(reject);
    });
};
