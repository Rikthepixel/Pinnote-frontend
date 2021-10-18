import React, { useState, useRef, useEffect } from 'react';

function onDoubleClick(e, divRef, editStyle, editClassNames, onWriteable, onUnWriteable){
    let div = divRef.current;

    div.contentEditable = "true";
    div.focus();

    let originalClassNames = div.className ;
    div.className += editClassNames;

    let originalStyle = {};
    for (const [key, value] of Object.entries(editStyle)) {
        originalStyle[key] = div.style[key] || "";
        div.style[key] = value;
    }

    if (typeof(onWriteable) == "function") {
        onWriteable(divRef.current)
    }
    
    let Exit = () => {
        div.removeEventListener("keydown", onKeyDown);
        div.removeEventListener("blur", Exit);

        div.contentEditable = "false";

        div.className = originalClassNames;
        for (const [key, value] of Object.entries(originalStyle)) {
            div.style[key] = value;
        }

        if (typeof(onUnWriteable) == "function") {
            onUnWriteable(divRef.current)
        }
    }

    let onKeyDown = e => {
        if (e.keyCode === 13) {
            div.blur();
            e.preventDefault();
            Exit();
        }
    }

    div.addEventListener("blur", Exit);
    div.addEventListener("keydown", onKeyDown);
}

export default function MakeWriteable(props) {
    const div = props.parentRef;
    const editClassNames = props.editClassName || ""
    const editStyle = props.editStyle || {};    

    useEffect(() => {
        div.current.addEventListener('dblclick', e => { onDoubleClick(e, div, editStyle, editClassNames, props.onWriteable, props.onUnWriteable)  })
    }, []);

    return ("");
}