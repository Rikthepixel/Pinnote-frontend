import sweetalert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

import "./Alerts.css";

const Swal = withReactContent(sweetalert2);

const defaults = {
    customClass: { container: "PriorityAlert" },
    heightAuto: false,
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


export const SingleFormAlert = (config) => {
    return new Promise((resolve) => {
        Swal.fire({
            ...defaults,
            title: config.title,
            text: config.text,
            timer: config.timer,
            showCancelButton: true,
            confirmButtonText: config.acceptButtonText,
            cancelButtonText: config.cancelButtonText,
            input: config.inputType || 'text',
            inputAttributes: config.inputAttributes || {
                autocapitalize: 'off'
            },
            inputValue: config.inputValue,
            didOpen: () => {
                const input = Swal.getInput()
                input.oninput = () => {
                    let value = input.value;
                    if (typeof (config.validate) != 'function') {
                        return value;
                    }
    
                    let validationResult = config.validate(value)
                    if (validationResult.isValid == true) {
                        Swal.resetValidationMessage();
                        return validationResult.value || value;
                    }
                    
                    input.value = validationResult.value
                    Swal.showValidationMessage(validationResult.error);
                }
            },
            inputPlaceholder: config.inputPlaceholder,
            preConfirm: (value) => {
                if (typeof (config.validate) != 'function') {
                    return value
                }

                let validationResult = config.validate(value)
                if (validationResult.isValid == true) {
                    return validationResult.value || value
                }
                Swal.showValidationMessage(validationResult.error)
            }
        }).then((result) => {
            let returnValue = {
                confirmed: null,
                value: result.value
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