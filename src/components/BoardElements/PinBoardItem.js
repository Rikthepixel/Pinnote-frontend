import React, { } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getContrastingColor, rgbaToHsva } from '@uiw/color-convert'
//Styling
import "../../assets/scss/components/BoardElements/PinBoardItem.scss"

export const PinBoardItem = (props) => {
    const state = useSelector(state => {
        let board = null;
        state.boards.boards.every((_board) => {
            if (props.boardId == _board.id) {
                board = _board;
                return false;
            }
            return true;
        })
        return board
    })

    let displayColor = state.backgroundColor

    return (
        <NavLink to={`/Boards/${state.id}`} className="PinBoardItem"
            style={{
                backgroundColor: `rgb(${displayColor.join()})`,
                color: `${getContrastingColor(rgbaToHsva({
                    r: displayColor[0],
                    g: displayColor[1],
                    b: displayColor[2]
                }))}`,
                border: `0.1em solid black`

            }}>

            <p>
                {state.title}
            </p>
        </NavLink>
    );
}

export const PinBoardItemButton = (props) => {
    return (
        <button className="PinBoardItem PinBoardItemButton" type="button" onClick={props.onClick}
            style={{
                border: `0.1em solid black`
            }}
        >
            <p>
                + Board
            </p>
        </button>
    );
}