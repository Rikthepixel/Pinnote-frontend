import React, { useState, useEffect, useRef, Fragment } from "react";
import { rgbaToHsva, hsvaToRgba } from '@uiw/color-convert'
import Hue from '@uiw/react-color-hue';
import Slider from '@uiw/react-color-slider';
import Saturation from '@uiw/react-color-saturation';
import { Button } from "react-bootstrap"

import "../assets/scss/components/ColorSelector.scss"

const ColorSelector = (props) => {
    let originalColor = props.color;
    let open = props.open;

    if (typeof (open) != 'boolean') {
        open = true;
    }

    const RGBARef = useRef();
    const HSVARef = useRef();
    const parentDiv = useRef();
    const [HSVA, setHSVA] = useState(rgbaToHsva({
        r: props.color[0],
        g: props.color[1],
        b: props.color[2],
        a: 1
    }))
    const RGBA = hsvaToRgba(HSVA);

    RGBARef.current = RGBA
    HSVARef.current = HSVA;

    const setColor = (color) => {
        if (
            RGBA.r == color[1] &&
            RGBA.g == color[2] &&
            RGBA.b == color[3]
        ) {
            return
        }

        setHSVA(rgbaToHsva({
            r: color[0],
            g: color[1],
            b: color[2],
            a: 1
        }))
    }

    const closeSelector = () => {
        if (typeof (props.closeHandle) == "function") {
            props.closeHandle()
        }
    }

    const onMount = () => {
        if (typeof (props.onMount) == 'function') {
            props.onMount(setColor)
        }
    }

    const onSave = () => {
        let newColor = hsvaToRgba(HSVA)
        closeSelector()

        if (typeof (props.onSave) == "function") {
            props.onSave([
                newColor.r,
                newColor.g,
                newColor.b
            ], originalColor)
        }
    }

    useEffect(() => {
        onMount();
    }, [])

    const onCancel = () => {
        let newColor = hsvaToRgba(HSVA)
        closeSelector()
        if (typeof (props.onCancel) == "function") {
            props.onCancel(originalColor, [
                newColor.r,
                newColor.g,
                newColor.b
            ])
        }
    }

    return (
        <div ref={parentDiv} className={`${open ? "" : "d-none"} ${props.className}`} >
            <div className='d-flex gap-3 flex-column justify-content-center align-items-center' style={{
                backgroundColor: "var(--bs-info)",
                padding: "0.5em",
                border: "0.1rem solid var(--bs-dark)",
                borderRadius: "0.5em"
            }}>
                <div className="w-100 d-flex gap-2">
                    <Hue
                        direction="vertical"
                        width="1rem"
                        height="auto"
                        hue={HSVA.h}
                        onChange={(newHue) => {
                            let newHSVA = {
                                ...HSVA,
                                ...newHue
                            }
                            setHSVA(newHSVA)

                            let rgba = hsvaToRgba(newHSVA)
                            if (typeof (props.onChange) == "function") {
                                props.onChange([
                                    rgba.r,
                                    rgba.g,
                                    rgba.b
                                ])
                            }
                        }}
                    />
                    <div className="d-flex flex-column w-100" style={{ gap: "0.3rem" }}>
                        <Saturation
                            hsva={HSVA}
                            style={{
                                aspectRatio: "1",
                                height: "auto",
                                width: "unset"
                            }}
                            onChange={(hsva) => {
                                let newHSVA = {
                                    ...hsva,
                                    h: HSVARef.current.h,
                                    a: 1
                                }

                                setHSVA(newHSVA)
                                let rgba = hsvaToRgba(newHSVA)

                                if (typeof (props.onChange) == "function") {
                                    props.onChange([
                                        rgba.r,
                                        rgba.g,
                                        rgba.b
                                    ])
                                }
                            }}
                        />
                        {props.hasSliders &&
                            <Fragment>
                                <Slider
                                    color={HSVA}
                                    onChange={(color) => {
                                        let newHSVA = {
                                            ...color.hsv,
                                            a: 1
                                        }

                                        setHSVA(newHSVA)
                                        let rgba = hsvaToRgba(newHSVA)

                                        if (typeof (props.onChange) == "function") {
                                            props.onChange([
                                                rgba.r,
                                                rgba.g,
                                                rgba.b
                                            ])
                                        }
                                    }}
                                    lightness={[
                                        68, 76, 84, 92, 99
                                    ]}
                                />
                                <Slider
                                    color={HSVA}
                                    onChange={(color) => {
                                        let newHSVA = {
                                            ...color.hsv,
                                            a: 1
                                        }

                                        setHSVA(newHSVA)
                                        let rgba = hsvaToRgba(newHSVA)

                                        if (typeof (props.onChange) == "function") {
                                            props.onChange([
                                                rgba.r,
                                                rgba.g,
                                                rgba.b
                                            ])
                                        }
                                    }}
                                    lightness={[
                                        52, 44, 36, 28, 20
                                    ]}
                                />
                            </Fragment>}
                    </div>
                    <div
                        style={{
                            width: "1rem",
                            height: "auto",
                            backgroundColor: `rgb(${RGBA.r}, ${RGBA.g}, ${RGBA.b})`
                        }}
                    >

                    </div>
                </div>

                {(props.onSave || props.onCancel) && <div className="d-flex align-items-center justify-content-between gap-2 w-100">
                    {props.onSave &&
                        <Button
                            variant="success"
                            className="w-100"
                            onClick={onSave}
                        >
                            Save
                        </Button>
                    }
                    {props.onCancel &&
                        <Button
                            variant="danger"
                            className="w-100"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    }
                </div>}
            </div>
        </div>
    );
}

export default ColorSelector