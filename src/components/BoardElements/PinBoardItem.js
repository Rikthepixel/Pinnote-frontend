import React from "react";
import { NavLink } from "react-router-dom";
import { getContrastingColor, rgbaToHsva } from "@uiw/color-convert";

//Styling
import "../../assets/scss/components/BoardElements/PinBoardItem.scss";

export const PinBoardItem = (props) => {
    const state = props.board;

    let displayColor = state.backgroundColor;
    let contrastColor = getContrastingColor(
        rgbaToHsva({
            r: displayColor[0],
            g: displayColor[1],
            b: displayColor[2],
        })
    );

    return (
        <NavLink
            to={`/Boards/${state.id}`}
            className="PinBoardItemBase PinBoardItemShadows PinBoardItemRadius"
            invert={contrastColor === "#fff" ? "true" : "false"}
            style={{
                backgroundColor: `rgb(${displayColor.join()})`,
                color: `${contrastColor}`,
            }}
        >
            <p className="p-2 m-0">{state.title}</p>
        </NavLink>
    );
};
