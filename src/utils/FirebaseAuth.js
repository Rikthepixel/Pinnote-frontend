import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

export const app = initializeApp({
  apiKey: "AIzaSyANEUeZ8ZywkS1kiUct7rk50F5rrzAdG3U",
  authDomain: "pinnote-aa89a.firebaseapp.com",
  projectId: "pinnote-aa89a",
  storageBucket: "pinnote-aa89a.appspot.com",
  messagingSenderId: "461751639115",
  appId: "1:461751639115:web:be92fa0b6aa9dadb7181ce"
});

const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence)

export default auth;