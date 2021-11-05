import React, { useState, useRef } from 'react';
import {NavLink} from "react-router-dom";

//Styling
import "../../assets/scss/components/BoardElements/PinBoardItem.scss"

export function PinBoardItem(props) {
    const [state, setState] = useState({
        background_image: props.backgroundImage || "",
        background_color: props.backgroundColor || [
            122,
            122,
            122
        ],
        title: props.title || "Unknown title",
        link: props.link || "/Boards/Id"
    });

    return (
        <NavLink to={state.link} className="PinBoardItem" style={{ backgroundColor: "rgb(" + state.background_color.join() + ")" }}>
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