import Swal from 'sweetalert2';

export const ConfirmationAlert = (config) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: config.ConfirmationTitle,
            text: config.ConfirmationText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: config.AcceptButtonText,
            cancelButtonText: config.CancelButtonText,
            reverseButtons: true,
            heightAuto: false
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true)
                Swal.fire({
                    title: config.AcceptedTitle,
                    text: config.AcceptedText,
                    icon: 'success',
                    heightAuto: false
                })
            } else if (result.isDismissed) {
                resolve(false)
                Swal.fire({
                    title: config.CancelledTitle,
                    text: config.CancelledText,
                    icon: 'error',
                    heightAuto: false
                })
            }
        })
    })
}