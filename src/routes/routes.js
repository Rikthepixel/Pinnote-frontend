//Imports
import Board from "../views/Board";
import Workspaces from "../views/Workspaces";
import Workspace from "../views/Workspace";
import Login from "../views/Login";

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

    Logout: {
        component: Login,
        path: "/Login",
        exact: true
    }
}