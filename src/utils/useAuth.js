import React, { useContext, useState, useEffect, useRef } from "react"
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import FirebaseAuth from "./FirebaseAuth";

const AuthContext = React.createContext();
const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    onAuthStateChanged(FirebaseAuth,
        newUser => {
            console.log(newUser);
            setUser(newUser);
            if (!loaded) {
                setLoaded(true);
            }
        },
        err => console.log(err)
    )

    const getToken = () => {
        return new Promise((resolve, reject) => {
            if (user) {
                getIdToken(user)
                .then(resolve)
                .catch(reject)
            } else {
                resolve(null);
            }
            
        })
    }

    const values = {
        user: user,
        loaded: loaded,
        getToken: getToken
    }

    return (
        <AuthContext.Provider value={values}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth = (onAuthenticated) => {
    const contextData = useContext(AuthContext);
    const [hookLoaded, setHookLoaded] = useState(false);

    useEffect(() => {
        setHookLoaded(true);
    }, [])
    useEffect(() => {
        if (contextData.loaded) {
            if (typeof(onAuthenticated) === "function") {
                onAuthenticated(contextData.user)
            }
        }
    }, [contextData.loaded])


    return [contextData.user, contextData.loaded && hookLoaded, contextData.getToken]
}

export default AuthProvider
