import React, { useState } from 'react';
import {NavLink} from "react-router-dom";

//CSS
import "./BoardElements.scss";

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
    });

    const [position, setPosition] = useState({
        x: props.position.x || 0,
        y: props.position.y || 0
    })

    const [size, setSize] = useState({
        width: props.size.width || 100,
        height: props.size.height || 100
    })

    const [] = useState({
        title: props.title || "",
        text: props.text || ""
    })

    return (
        <div 
        className=""
        onMouseDown={}
        style={{
            backgroundColor: "rgb(" + state.background_color.join() + ")", 
            width: size.width, 
            height: size.height,
            position: 
            }}>
            demo text
        </div>
    );
}