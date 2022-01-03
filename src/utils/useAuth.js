import React, { useContext, useState } from "react"
import { onAuthStateChanged } from "firebase/auth";
import FirebaseAuth from "./FirebaseAuth";

const AuthContext = React.createContext();
const AuthProvider = (props) => {
    const [user, setUser] = useState(null);

    onAuthStateChanged(FirebaseAuth,
        newUser => setUser(newUser),
        err => console.log(err)
    )

    const values = {
        user: user
    }

    return (
        <AuthContext.Provider value={values}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const contextData = useContext(AuthContext);
    return [contextData.user]
}

export default AuthProvider
