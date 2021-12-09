import sweetalert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
const Swal = withReactContent(sweetalert2);

export const ConfirmationAlert = (config) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: config.title,
            text: config.text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: config.acceptButtonText,
            cancelButtonText: config.cancelButtonText,
            reverseButtons: true,
            heightAuto: false,
            timer: config.timer
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true)
                if (config.acceptPopup) {
                    Swal.fire({
                        title: config.acceptedTitle,
                        text: config.acceptedText,
                        timer: config.acceptPopupTimer || 5000,
                        icon: 'success',
                        heightAuto: false
                    })
                }
            } else if (result.isDismissed) {
                resolve(false)
                if (config.cancelPopup) {
                    Swal.fire({
                        title: config.cancelledTitle,
                        text: config.cancelledText,
                        timer: config.cancelPopupTimer || 5000,
                        icon: 'error',
                        heightAuto: false
                    })
                }
            }
        })
    })
}


export const SingleFormAlert = (config) => {
    return new Promise((resolve) => {
        Swal.fire({
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
            heightAuto: false,
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
                        title: config.acceptedTitle,
                        text: config.acceptedText,
                        icon: 'success',
                        heightAuto: false
                    })
                }
            } else if (result.isDismissed) {
                returnValue.confirmed = false
                if (config.cancelPopup) {
                    Swal.fire({
                        title: config.cancelledTitle,
                        text: config.cancelledText,

                        icon: 'error',
                        heightAuto: false
                    })
                }
            }

            resolve(returnValue)
        })
    })
}