//Imports
import Boards from "../views/Boards";
import Board from "../views/Board";
import Workspace from "../views/Workspace";

//Routes
export const routes = {
    Boards: {
        component: Boards,
        path: "/Boards",
        exact: true
    },

    Home: {
        component: Boards,
        path: "/" ,
        exact: true 
    },

    Board: {
        component: Board,
        path: "/Boards/:boardId",
        exact: true
    },

    Workspaces: {
        component: Workspace,
        path: "/Workspaces/:workspaceId",
        exact: true
    }
}