import React from "react";
import '../../assets/scss/components/BoardElements/PinNoteToolbar.scss';

export const PinNoteToolbar = (props) => {
    return (
        <div className="PinNote-Toolbar">
            {props.children}
        </div>
    )
}