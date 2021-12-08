import * as yup from "yup"

const boardSchema = yup.object().shape({
    title: yup.string().required().label("Title").max(30),
    backgroundColor: yup.array().label("Background color").of(
        yup.number().required().integer().min(0).max(255)
    ).required().length(3),
});

export const validateBoard = (object) => {
    let errors = {}
    Object.keys(boardSchema.fields).forEach((key) => {
        if (key in object) {
            try {
                boardSchema.validateSyncAt(key, object)
            } catch (error) {
                errors[key] = error.errors
            }
        }
    })
    return errors
}

export default boardSchema