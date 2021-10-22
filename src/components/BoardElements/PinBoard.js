import React, { useState, useRef } from "react";
import PinNote from './PinNote';

export function PinBoard(props) {
    const [state, setState] = useState({
        Notes: props.Notes || []
    })
    
    const BoardNotes = []
    for (var i = 0; i < state.Notes.length; i++) {
        BoardNotes[i] = <PinNote key={i} data={state.Notes[i]} />;
    }

    return <div className="PinBoard">{BoardNotes}</div>;
}
