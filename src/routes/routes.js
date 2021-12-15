//Imports
import Boards from "../views/Boards";
import Board from "../views/Board";
import HubTest from "../views/HubTest";

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

    ConnectionTest: {
        component: HubTest,
        path: "/Test",
        exact: true
    }
}