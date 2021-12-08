import {useEffect } from 'react';

const MakeWriteable = (props) => {
    const divRef = props.parentRef;
    const editClassNames = props.editClassName
    const editStyle = props.editStyle;
    const onEventType = props.onEvent != "dblclick" && props.onEvent != "click" ? "dblclick" : props.onEvent

    useEffect(() => {
        let onEventFunc = function(e) {
            let div = divRef.current;
            
            div.contentEditable = "true";
            div.focus();
        
            let originalClassNames = div.className ;
            div.className += editClassNames || "";
        
            let originalStyle = {};
            for (const [key, value] of Object.entries(editStyle || {})) {
                originalStyle[key] = div.style[key] || "";
                div.style[key] = value;
            }
        
            if (typeof(props.onWriteable) == "function") {
                props.onWriteable(divRef.current)
            }
            
            let Exit = (e) => {
                div.removeEventListener("keydown", onKeyDown);
                div.removeEventListener("blur", Exit);
                div.removeEventListener("input", onInput)
                
                div.contentEditable = "false";
        
                div.className = originalClassNames;
                for (const [key, value] of Object.entries(originalStyle)) {
                    div.style[key] = value;
                }
        
                if (typeof(props.onUnWriteable) == "function") {
                    let validationResult = props.onUnWriteable(e.target)
                    if (validationResult === false) {
                        div.textContent = props.text
                    }
                }
                div.addEventListener(onEventType, onEventFunc)
            }
        
            let onKeyDown = e => {
                if (e.keyCode === 13) {
                    div.blur();
                    e.preventDefault();
                    Exit(e);
                }
            }
        
            let previousState = div.textContent
            let onInput = e => {
                if (typeof(props.onChange) == 'function') {
                    let validationResult = props.onChange(e.target.textContent)
                    if (validationResult === false) {
                        e.target.textContent = previousState
                    }
                    previousState = e.target.textContent
                }
            }
        
            div.removeEventListener(onEventType, onEventFunc)
            div.addEventListener("blur", Exit);
            div.addEventListener("keydown", onKeyDown);
            div.addEventListener("input", onInput)
        }
        divRef.current.addEventListener(onEventType, onEventFunc)

        if (props.text) {
            divRef.current.textContent = props.text
        }
    }, []);

    return "";
}

export default MakeWriteable