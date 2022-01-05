//Imports
import Board from "../views/Board";
import Workspaces from "../views/Workspaces";
import Workspace from "../views/Workspace";
import Login from "../views/Authentication/Login";
import Register from "../views/Authentication/Register";
import ResetPassword from "../views/Authentication/ResetPassword";

//Routes
export const routes = {
    Workspaces: {
        component: Workspaces,
        path: "/Workspaces",
        exact: true,
        NotAuthenticatedRedirect: "/Login"
    },

    Home: {
        component: Workspaces,
        path: "/" ,
        exact: true,
        NotAuthenticatedRedirect: "/Login"
    },

    Workspace: {
        component: Workspace,
        path: "/Workspaces/:workspaceId",
        exact: true,
        NotAuthenticatedRedirect: "/Login"
    },

    Board: {
        component: Board,
        path: "/Boards/:boardId",
        exact: true,
        NotAuthenticatedRedirect: "/Login"
    },

    Login: {
        component: Login,
        path: "/Login",
        exact: true,
        AuthenticatedRedirect: "/"
    },

    Register: {
        component: Register,
        path: "/Register",
        exact: true,
        AuthenticatedRedirect: "/"
    },

    ResetPassword: {
        component: ResetPassword,
        path: "/PasswordReset",
        exact: true,
        AuthenticatedRedirect: "/"
    }
}