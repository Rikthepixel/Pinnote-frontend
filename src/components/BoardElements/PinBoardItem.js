import React, { } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getContrastingColor, rgbaToHsva } from '@uiw/color-convert'
//Styling
import "../../assets/scss/components/BoardElements/PinBoardItem.scss"

export const PinBoardItem = (props) => {
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

    let displayColor = state.background_color

    return (
        <NavLink to={`/Boards/${state.boardId}`} className="PinBoardItem"
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