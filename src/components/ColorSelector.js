import React, { useState, useEffect, useRef } from "react";
import { rgbaToHsva, hsvaToRgba } from '@uiw/color-convert'
import Hue from '@uiw/react-color-hue';
import Slider from '@uiw/react-color-slider';
import { Button } from "react-bootstrap"


const ColorSelector = (props) => {
    let originalColor = props.color;
    const parentDiv = useRef();
    const [HSVA, setHSVA] = useState(rgbaToHsva({
        r: props.color[0],
        g: props.color[1],
        b: props.color[2],
        a: 1
    }))

    const setColor = (color) => {
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
        if (typeof(props.onMount) == 'function') {
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
        <div ref={parentDiv} className={`${props.open ? "" : "d-none"} ${props.className} `} >
            <div className={`d-flex gap-3`} style={{
                flexDirection: "column",
                backgroundColor: "var(--bs-info)",
                padding: "0.5em",
                border: "0.1rem solid var(--bs-dark)",
                borderRadius: "0.5em"
            }}>
                <Hue
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
                <div style={{
                    display: "flex",
                    gap: "0.3rem",
                    flexDirection: "column"
                }}>
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
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2">
                    <Button
                        variant="success"
                        className="w-100"
                        onClick={onSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="danger"
                        className="w-100"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ColorSelector