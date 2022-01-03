import auth from "../../utils/FirebaseAuth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const getUserDetails = () => {

}

export const login = (dispatch, emailAdress, password) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, emailAdress, password)
            .then(credentials => {
                dispatch({
                    type: "LOGIN",
                    payload: credentials
                })
                resolve();
            })
            .catch(reject)
    })
}

export const register = (dispatch, emailAdress, password) => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, emailAdress, password)
            .then(credentials => {
                dispatch({
                    type: "REGISTER",
                    payload: credentials
                });
                resolve();
            })
            .catch(reject)
    })
}

export const logout = (dispatch) => {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                dispatch({
                    type: "LOGOUT"
                });
                resolve();
            }).catch(reject);
    })
}



