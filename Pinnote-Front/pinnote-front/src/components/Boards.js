import React, { useState } from 'react';
import {NavLink} from "react-router-dom";

//CSS
import "./BoardNote.scss";
import "./BoardItem.scss";

export function PinBoardItem(props) {
    console.log(props)
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
        <NavLink to={state.link} className="BoardItem" style={{ backgroundColor: "rgb(" + state.background_color.join() + ")" }}>
            <p>
                {state.title}
            </p>
        </NavLink>
    );
}

export function PinBoard(props) {
    return (
        <div>
            {props.children}
        </div>
    )
}

export function PinNote(props) {
    const [state, setState] = useState({
        background_color: props.backgroundColor || [
            122,
            122,
            122
        ],
        positon: {
            x: 0,
            y: 0
        },
        size: {
            width: 100,
            height: 100
        },
        title: props.title || "",
        text: props.text || ""
    });

    return (
        <div style={{ backgroundColor: "rgb(" + state.background_color.join() + ")", width: state.size.width, height: state.size.height }}>
            demo text
        </div>
    );
}