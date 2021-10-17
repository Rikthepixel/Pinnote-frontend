import React, { useState, useRef, useEffect } from 'react';
import MakeWriteable from "../MakeWriteable";

function disableSelect(e) {
    e.preventDefault();
}
function noteUnpressed(){
    document.onmousemove = null;
    document.onmouseup = null;
    window.removeEventListener('selectstart', disableSelect);
}

function notePressed(e, target, state, setState) {
    let DomRect = target.getBoundingClientRect()
    let offset = {
        x: DomRect.x - state.positionX, 
        y: DomRect.y - state.positionY
    }
    let handle = {
        x: e.clientX - DomRect.x,
        y: e.clientY - DomRect.y
    }

    document.onmouseup = noteUnpressed;
    document.onmousemove = ev => {
        dragNote(ev, offset, handle, state, setState)
    };
    window.addEventListener('selectstart', disableSelect);
}

function dragNote(e, offset, handle, state, setState) {
    setState({
        ...state,
        positionX: e.pageX - offset.x - (e.pageX - e.clientX) - handle.x,
        positionY: e.pageY - offset.y - (e.pageY - e.clientY) - handle.y
    });
}

const defaultState = {
    colorR: 122,
    colorG: 122,
    colorB: 122,
    positionX: 0,
    positionY: 0,
    width: 200,
    height: 200,
    title: "",
    text: ""
}

export function PinNote(props) {
    props.data.color = props.data.color || {};
    props.data.position = props.data.position || {};
    props.data.size = props.data.size || {};

    const [state, setState] = useState({
        colorR: props.data.color.R || defaultState.colorR,
        colorG: props.data.color.G || defaultState.colorG,
        colorB: props.data.color.B || defaultState.colorB,
        positionX: props.data.position.x || defaultState.positionX,
        positionY: props.data.position.y || defaultState.positionY,
        width: props.data.size.width || defaultState.width,
        height: props.data.size.height || defaultState.height,
        title: props.data.title || defaultState.title,
        text: props.data.text || defaultState.text
    });

    const NoteDiv = useRef(null);
    const HeaderRef = useRef(null);

    function pressedNote(e) {
        notePressed(e, NoteDiv.current, state, setState)
    }

    const disableDrag = e => {
        HeaderRef.current.removeEventListener("mousedown", pressedNote);
    }
    const enableDrag = e => {
        HeaderRef.current.addEventListener("mousedown", pressedNote)
    }

    useEffect(() => {
        HeaderRef.current.addEventListener("mousedown", pressedNote);
    }, []);

    return (
        <div 
        className="PinNote"
        ref={NoteDiv}
        style={{
                backgroundColor: "rgb(" + [state.colorR, state.colorG, state.colorB].join() + ")", 
                width: state.width, 
                height: state.height,
                left: state.positionX,
                top: state.positionY
            }}>
            <div
                className="PinNoteHeader"
                ref={HeaderRef}
            >
                <MakeWriteable parentRef={HeaderRef} editStyle={{backgroundColor: "#FFF"}} onWriteable={disableDrag} onUnWriteable={enableDrag}/>
                {state.title}
                
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