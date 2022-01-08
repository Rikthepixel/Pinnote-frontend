import sweetalert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { Fragment } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { Button, FormLabel } from 'react-bootstrap';
import ColorSelector from '../components/ColorSelector';
import ColorSelectorButton from '../components/ColorSelectorButton';

import "./Alerts.css";


const Swal = withReactContent(sweetalert2);

const defaults = {
    customClass: { container: "PriorityAlert" },
    heightAuto: false,
}

export const ToastAlerts = (config) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: config.title,
            text: config.text,
            icon: config.icon,
            position: "top",
            toast: true,
            showConfirmButton: false,
            timer: config.timer || 5000
        }).then(resolve);
    })
}

export const ConfirmationAlert = (config) => {
    return new Promise((resolve) => {
        Swal.fire({
            ...defaults,
            title: config.title,
            text: config.text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: config.acceptButtonText,
            cancelButtonText: config.cancelButtonText,
            timer: config.timer
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true)
                if (config.acceptPopup) {
                    Swal.fire({
                        ...defaults,
                        title: config.acceptedTitle,
                        text: config.acceptedText,
                        timer: config.acceptPopupTimer || 5000,
                        icon: 'success',
                    })
                }
            } else if (result.isDismissed) {
                resolve(false)
                if (config.cancelPopup) {
                    Swal.fire({
                        ...defaults,
                        title: config.cancelledTitle,
                        text: config.cancelledText,
                        timer: config.cancelPopupTimer || 5000,
                        icon: 'error',
                    })
                }
            }
        })
    })
}

const ErrorBlock = (props) => {
    return (
        <ErrorMessage name={props.name} render={(msg) => {
            return (
                <div className="text-danger">
                    {msg}
                </div>
            )
        }}></ErrorMessage>
    )
}

const multiFormCustomFields = {
    color: (input) => {
        console.log("color");
        return (
            <ColorSelector
                className="w-100 overflow-hidden"
                color={input.value}
                onChange={(color) => {
                    console.log(color);
                }}
            >

            </ColorSelector>
        )
    },

    colorButton: (input) => {
        return (
            <FieldArray
                name={input.name}
                render={(arrayHelper) => {
                    return (
                        <ColorSelectorButton
                            className="w-100 overflow-hidden"
                            color={input.value}
                            icon={input.buttonIcon}
                            text={input.buttonText}
                            onChange={(color) => {
                                color.forEach((value, index) => {
                                    arrayHelper.replace(index, color[index])
                                })
                            }}
                        />
                    )
                }}
            />
        )
    }
}

const multiFormCustom = {
    title: (input) => {
        return (
            <h4 className='m-0'>
                {input.title}
            </h4>
        )
    },

    explanation: (input) => {
        return (
            <b className='m-0'>
                {input.text}
            </b>
        )
    },

    page: (input) => {
        return (
            <div>
                
            </div>
        )
    }
}

export const FormAlert = (config) => {

    if (typeof (config.inputs) != "object") {
        return;
    }

    let initialValues = {}
    config.inputs = config.inputs.map((input) => {
        input.type = input.type || "text"
        input.value = input.value || "";
        input.placeholder = input.placeholder || ""
        input.name = input.name || `${input.type}-${input.value}-${input.placeholder}-${Math.ceil(Math.random() * 1000)}`;
        initialValues[input.name] = input.value
        return input
    })

    if (typeof (config.showConfirmButton) != 'boolean') {
        config.showConfirmButton = true
    }

    if (typeof (config.showCancelButton) != 'boolean') {
        config.showCancelButton = false
    }

    config.acceptButtonText = config.acceptButtonText || "Confirm"
    config.cancelButtonText = config.cancelButtonText || "Cancel"

    let submittedValues = null;

    return new Promise((resolve) => {
        Swal.fire({
            ...defaults,
            title: config.title,
            text: config.text,
            timer: config.timer,

            icon: 'question',

            showCancelButton: true,
            showConfirmButton: true,

            customClass: {
                htmlContainer: "overflow-visible",
                container: "PriorityAlert",
                actions: "d-none"
            },

            html: (
                <Formik
                    initialValues={initialValues}
                    validationSchema={config.validator}
                    onSubmit={(values) => {
                        submittedValues = values
                        Swal.getConfirmButton().click();
                    }}
                >
                    {({ errors, handleSubmit }) => (
                        <Form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
                            {config.inputs.map((input, index) => {
                                let formPartConstructor = multiFormCustom[input.type];
                                if (typeof (formPartConstructor) == 'function') {
                                    return (
                                        <Fragment key={index}>
                                            {formPartConstructor(input)}
                                        </Fragment>
                                    )
                                }
                                let customFieldConstructor = multiFormCustomFields[input.type];

                                return (
                                    <div className={`d-flex flex-column ${input.className} gap-1`} key={index}>
                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                            {input.label && <FormLabel className="text-nowrap m-0" htmlFor={input.name}>{input.label}</FormLabel>}
                                            {typeof (customFieldConstructor) != 'function'
                                                ? <Field
                                                    type={input.type}
                                                    className="form-control"
                                                    name={input.name}
                                                    placeholder={input.placeholder}
                                                >
                                                    {input.children}
                                                </Field>
                                                : customFieldConstructor(input)
                                            }
                                        </div>
                                        <ErrorBlock name={input.name}></ErrorBlock>
                                    </div>

                                )
                            })}
                            <div className="swal2-actions d-flex">
                                {config.showConfirmButton && <Button
                                    type="submit"
                                    variant="primary"
                                    className="swal2-styled"

                                    disabled={(Object.keys(errors).length > 0) ? true : null}
                                >
                                    {config.acceptButtonText}
                                </Button>}
                                {config.showCancelButton && <Button
                                    variant="danger"
                                    className="swal2-styled"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        Swal.getCancelButton().click();
                                    }}
                                >
                                    {config.cancelButtonText}
                                </Button>}
                            </div>
                        </Form>
                    )}
                </Formik>
            ),
            didOpen: () => {
                Swal.getConfirmButton().style.display = "none";
                Swal.getCancelButton().style.display = "none";
            },
        }).then((result) => {
            let returnValue = {
                confirmed: null,
                values: submittedValues
            }
            if (result.isConfirmed) {
                returnValue.confirmed = true
                if (config.acceptPopup) {
                    Swal.fire({
                        ...defaults,
                        title: config.acceptedTitle,
                        text: config.acceptedText,
                        icon: 'success',
                    })
                }
            } else if (result.isDismissed) {
                returnValue.confirmed = false
                if (config.cancelPopup) {
                    Swal.fire({
                        ...defaults,
                        title: config.cancelledTitle,
                        text: config.cancelledText,
                        icon: 'error',
                    })
                }
            }

            resolve(returnValue)
        })
    })
}