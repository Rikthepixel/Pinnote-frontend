import React, { } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getContrastingColor, rgbaToHsva } from '@uiw/color-convert'
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
        <NavLink to={`/Boards/${state.boardId}`} className="PinBoardItem"
            style={{
                backgroundColor: `rgb(${state.background_color.join()})`,
                color: `${getContrastingColor(rgbaToHsva({
                    r: state.background_color[0],
                    g: state.background_color[1],
                    b: state.background_color[2]
                }))}`,
                border: `0.1em solid black`
            
            }}>

            <p>
                {state.title}
            </p>
        </NavLink>
    );
}

export function PinBoardItemButton(props) {
    return (
        <button className="PinBoardItem PinBoardItemButton" type="button" onClick={props.onClick}
            style={{
                border: `0.1em solid black`
            }}
        >
            <p>
                Create new board
            </p>
        </button>
    );
}