import React from "react";
import './PinNoteToolbar.scss';

export function PinNoteToolbar(props) {
    return (
        <div className="PinNote-Toolbar">
            {props.children}
        </div>
    )
}