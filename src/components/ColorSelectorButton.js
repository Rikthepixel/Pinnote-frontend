import React, { useState, useEffect, useRef } from "react";
import ColorSelector from "./ColorSelector";
import { Button } from "react-bootstrap";

const ColorSelectorButton = (props) => {
    const [shown, setShow] = useState(false);
    let initialColor = props.color
    const [displayColor, setDisplayColor] = useState(initialColor || [0, 0, 0])
    const setWheelColor = useRef();

    const setColor = (color) => {
        setDisplayColor(color);
        if (typeof(setWheelColor.current) == 'function') {
            setWheelColor.current(color)
        }
    }

    const closeHandle = () => {
        setShow(false)
    }

    const toggleSelector = () => {
        setShow(!shown)
        if (!shown == false) {
            onCancel()
        } else {
            onOpen()
        }
    }

    const onInternalMount = (setColor) => {
        setWheelColor.current = setColor;
    }

    const onOpen = () => {
        if (typeof (props.onOpen) == "function") {
            props.onOpen(setColor)
        }
    }

    const onMount = () => {
        if (typeof (props.onMount) == "function") {
            props.onMount(setColor)
        }
    }

    const onCancel = (oldColor, newColor) => {
        setColor(initialColor);
        if (typeof (props.onCancel) == "function") {
            props.onCancel(initialColor, setColor)
        }
    }

    const onSave = (newColor, oldColor) => {
        setColor(newColor);
        if (typeof (props.onSave) == "function") {
            props.onSave(newColor, setColor)
        }
    }

    const onChange = (newColor) => {
        setColor(newColor);
        if (typeof (props.onChange) == "function") {
            props.onChange(newColor, setColor)
        }
    }

    useEffect(() => {
        onMount()
    }, [])

    return <div ref={props.ref} className={`${props.className} ${props.variant ? `bg-${props.variant}` : "bg-primary"} rounded`}>
        <Button className="w-100" onClick={toggleSelector}>
            <div className="d-flex align-items-center justify-content-center">
                {props.icon &&
                    <img
                        alt=""
                        className="me-1"
                        src={props.icon}
                        style={{
                            filter: "invert(100%)",
                            aspectRatio: "1",
                            height: "1.2rem"
                        }}
                    />}
                <p className="m-0 me-1">
                    {props.text}
                </p>
                <div style={{
                    aspectRatio: "1",
                    backgroundColor: `rgb(${displayColor.join()})`,
                    height: "1em",
                    borderRadius: "50%",
                    border: "0.1em solid black"
                }}>
                </div>
            </div>
        </Button>
        <ColorSelector
            className={`mt-1 ${props.selectorClassName ? props.selectorClassName : "p-3"} `}

            open={shown}
            closeHandle={closeHandle}

            color={displayColor}
            onMount={onInternalMount}
            onCancel={onCancel}
            onSave={onSave}
            onChange={onChange}
        />
    </div>
}

export default ColorSelectorButton