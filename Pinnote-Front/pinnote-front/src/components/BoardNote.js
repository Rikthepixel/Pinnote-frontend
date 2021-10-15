import React, { useState } from 'react';

//CSS
import "./BoardNote.scss";

export default function BoardNote(props) {
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
        title: props.title || "",
        text: props.text || ""
    });

    return (
        <div>
            demo text
        </div>
    );
}