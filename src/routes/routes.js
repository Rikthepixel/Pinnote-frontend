//Imports
import Board from "../views/Board";
import Workspaces from "../views/Workspaces";
import Workspace from "../views/Workspace";
import Login from "../views/Authentication/Login";
import Register from "../views/Authentication/Register";

//Routes
export const routes = {
    Workspaces: {
        component: Workspaces,
        path: "/Workspaces",
        exact: true
    },

    Home: {
        component: Workspaces,
        path: "/" ,
        exact: true 
    },

    Workspace: {
        component: Workspace,
        path: "/Workspaces/:workspaceId",
        exact: true
    },

    Board: {
        component: Board,
        path: "/Boards/:boardId",
        exact: true
    },

    Login: {
        component: Login,
        path: "/Login",
        exact: true
    },

    Register: {
        component: Register,
        path: "/Register",
        exact: true
    }
}