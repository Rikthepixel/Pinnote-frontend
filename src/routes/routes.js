//Imports
import Board from "../views/Board";
import Workspaces from "../views/Workspaces";
import Workspace from "../views/Workspace";

//Routes
export const routes = {
    Workspaces: {
        component: Workspaces,
        path: "/Workspaces",
        exact: true
    },

    Workspaces: {
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
}