import * as yup from "yup";
import { vector2Schema, rgbColorSchema } from "../../utils/Validators";

const noteSchema = yup.object().shape({
    id: yup.number().required().integer(),
    title: yup.string().max(100),
    text: yup.string(),
    position: vector2Schema.required(),
    backgroundColor: rgbColorSchema.required(),
    width: yup.number().default(200).required(),
    height: yup.number().default(200).required()
});

const boardSchema = yup.object().shape({
    id: yup.number().required().integer(),
    title: yup.string().required().label("Title").max(30),
    backgroundColor: rgbColorSchema.required().label("Background color"),
    defaultNoteColor: rgbColorSchema.required().label("Default note color"),
    notes: yup.array().label("Notes").of(noteSchema).required().length(3),
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
};

export default boardSchema;