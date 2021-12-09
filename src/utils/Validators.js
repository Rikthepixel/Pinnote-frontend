import * as yup from "yup";
export const vector2Schema = yup.object().shape({
    x: yup.number().default(0),
    y: yup.number().default(0)
});

export const rgbColorSchema = yup.array().of(
    yup.number().required().integer().min(0).max(255)
).length(3);