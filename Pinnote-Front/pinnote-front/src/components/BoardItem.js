import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

//CSS
import "./BoardItem.scss";

export default function BoardItem(props) {
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