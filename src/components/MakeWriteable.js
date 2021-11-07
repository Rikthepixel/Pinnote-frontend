import React, { useState, useRef, useEffect } from 'react';

function WriteableEvent (e, divRef, editStyle, editClassNames, onWriteable, onUnWriteable, onEventType, onEventFunc ){
    let div = divRef.current;

    console.log("aa")

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
        div.addEventListener(onEventType, onEventFunc)
    }

    let onKeyDown = e => {
        if (e.keyCode === 13) {
            div.blur();
            e.preventDefault();
            Exit();
        }
    }

    div.removeEventListener(onEventType, onEventFunc)
    div.addEventListener("blur", Exit);
    div.addEventListener("keydown", onKeyDown);
}

export default function MakeWriteable(props) {
    const div = props.parentRef;
    const editClassNames = props.editClassName || ""
    const editStyle = props.editStyle || {};
    const onEvent = props.onEvent != "dblclick" && props.onEvent != "click" ? "dblclick" : props.onEvent

    useEffect(() => {
        let onEventFunc = function(e) {
            WriteableEvent(e, div, editStyle, editClassNames, props.onWriteable, props.onUnWriteable, onEvent, onEventFunc)
        }
        div.current.addEventListener(onEvent, onEventFunc)
    }, []);

    return ("");
}