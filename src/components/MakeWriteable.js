import {useEffect } from 'react';

const MakeWriteable = (props) => {
    const divRef = props.parentRef;
    const editClassNames = props.editClassName
    const editStyle = props.editStyle;
    const onEventType = props.onEvent !== "dblclick" && props.onEvent !== "click" ? "dblclick" : props.onEvent

    useEffect(() => {
        const div = divRef.current;

        let setText = (newText = "") => {
            div.textContent = newText
        }

        if (typeof(props.onMount) === "function"){
            props.onMount(setText);
        }

        let text = props.text || div.textContent
        if (text) {
            setText(text)
        }

        let onEventFunc = function(e) {
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
                props.onWriteable(divRef.current.textContent)
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
                    let validationResult = props.onUnWriteable(e.target.textContent, setText)
                    if (validationResult === false) {
                        setText(text)
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
                    let target = e.target
                    let validationResult = props.onChange(target.textContent)
                    if (validationResult === false) {
                        setText(previousState)
                    }
                    previousState = target.textContent
                }
            }
        
            div.removeEventListener(onEventType, onEventFunc)
            div.addEventListener("blur", Exit);
            div.addEventListener("keydown", onKeyDown);
            div.addEventListener("input", onInput)
        }
        div.addEventListener(onEventType, onEventFunc)

        return () => {
            div.removeEventListener(onEventType, onEventFunc)
        }
    }, [divRef, editClassNames, editStyle, onEventType, props]);

    return "";
}

export default MakeWriteable