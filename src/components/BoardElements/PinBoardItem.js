import React, { } from 'react';
import { useSelector } from 'react-redux';
import {NavLink} from "react-router-dom";

//Styling
import "../../assets/scss/components/BoardElements/PinBoardItem.scss"

export function PinBoardItem(props) {
    const state = useSelector(state => {
        let Board = null;
        state.boards.boards.every((board) => {
          if (props.boardId != board.boardId) {
            return true;
          }
          Board = board;
          return false;
        })
    
        return Board
      })

    return (
        <NavLink to={`/Boards/${state.boardId}`} className="PinBoardItem" style={{ backgroundColor: `rgb(${state.background_color.join()})` }}>
            <p>
                {state.title}
            </p>
        </NavLink>
    );
}

export function PinBoardItemButton(props) {
    return (
        <button className="PinBoardItemButton" type="button" onClick={props.onClick}>
            <p>
                Create new board
            </p>
        </button>
    );
}