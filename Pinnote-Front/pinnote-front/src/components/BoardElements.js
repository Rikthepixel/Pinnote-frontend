import React, { useState, useRef } from 'react';
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
        <NavLink to={state.link} className="PinBoardItem" style={{ backgroundColor: "rgb(" + state.background_color.join() + ")" }}>
            <p>
                {state.title}
            </p>
        </NavLink>
    );
}

export function PinBoard(props) {
    return (
        <div className="PinBoard">
            {props.children}
        </div>
    )
}


function noteUnpressed(){
    document.onmousemove = null;
    document.onmouseup = null;
}
function notePressed(e, target, position, setPosition) {

    let DomRect = target.getBoundingClientRect()
    let offset = {
        x: DomRect.x - position.x, 
        y: DomRect.y - position.y
    }
    let handle = {
        x: e.clientX - DomRect.x,
        y: e.clientY - DomRect.y
    }
    document.onmouseup = noteUnpressed
    document.onmousemove = ev => {
        dragNote(ev, target, offset, handle, setPosition)
    }
}

function dragNote(e, target, offset, handle, setPosition) {
    //To convert client position to page position
    let pcOffsetX = e.pageX - e.clientX
    let pcOffsetY = e.pageY - e.clientY

    setPosition({
        x: e.pageX - offset.x - pcOffsetX - handle.x,
        y: e.pageY - offset.y - pcOffsetY - handle.y
    })
}

const defaultSize = {
    x: 100,
    y: 100
}
const defaultPosition = {
    x: 0,
    y: 0
}
export function PinNote(props) {
    const details = props.data || {}
    details.size = details.size || defaultSize
    details.position = details.position || defaultPosition

    const [state, setState] = useState({
        background_color: details.backgroundColor || [
            122,
            122,
            122
        ],
        title: details.title || "",
        text: details.text || ""
    });

    const [position, setPosition] = useState({
        x: details.position.x || defaultPosition.x,
        y: details.position.y || defaultPosition.y
    })

    const [size, setSize] = useState({
        width: details.size.width || defaultSize.x,
        height: details.size.height || defaultSize.y
    })

    const NoteDiv = useRef(null)

    return (
        <div 
        className="PinNote"
        ref={NoteDiv}
        style={{
                backgroundColor: "rgb(" + state.background_color.join() + ")", 
                width: size.width, 
                height: size.height,
                left: position.x,
                top: position.y
            }}>
            <div
                className="PinNoteHeader"
                onMouseDown={e => { notePressed(e, NoteDiv.current, position, setPosition) }}
                onMouseUp={noteUnpressed}
            >

            </div>
            <div
                className="PinNoteContent"
            >
                <div
                    className="PinNoteTextContent"
                >
                    {state.text}
                </div>
            </div>
        </div>
    );
}