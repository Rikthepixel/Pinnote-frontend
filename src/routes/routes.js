//Imports
import Boards from "../views/Boards";
import Board from "../views/Board";

//Routes
export const routes = {
    Boards: {
        component: Boards,
        path: "/Boards"
    },

    Home: {
        component: Boards,
        path: "/"  
    },

    Board: {
        component: Board,
        path: "/Boards/:id"
    }
}