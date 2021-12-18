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
    let contrastColor = getContrastingColor(rgbaToHsva({
        r: displayColor[0],
        g: displayColor[1],
        b: displayColor[2]
    }))

    return (
        <NavLink 
            to={`/Boards/${state.id}`}
            className="PinBoardItem"
            invert={contrastColor === "#fff" ? "true" : "false"}
            style={{
                backgroundColor: `rgb(${displayColor.join()})`,
                color: `${contrastColor}`
            }}

        >

            <p>
                {state.title}
            </p>
        </NavLink>
    );
}

export const PinBoardItemButton = (props) => {
    return (
        <div className="PinBoardItem PinBoardItemButton" onClick={props.onClick} >
            <p>
                + Board
            </p>
        </div>
    );
}