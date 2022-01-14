import superagent from "superagent";
import { toastAlerts } from "../../utils/Alerts";

const url = process.env.REACT_APP_ATTACHMENT_URL;

export const uploadFiles = (files) => {
    return new Promise((resolve, reject) => {

        const uploadPromises = []
        files.forEach(file => {
            uploadPromises.push(new Promise((fileResolve, fileReject) => {
                superagent.post(`${url}/api/attachments/`)
                    .attach("File", file, {
                        filename: file.name,
                    }).then(response => {
                        if (response.created) {
                            let result = response.body[0];

                            result.displayName = file.name;
                            result.link = `${url}/api/attachments/${result.identifier}`

                            fileResolve(result);
                        }
                    }, reject)
            }).catch(reject))
        });

        Promise.all(uploadPromises)
            .catch(reject)
            .then(resolve)
    }).catch(err => toastAlerts({
        title: "Error!",
        message: err.message,
        icon: "error"
    }));
}