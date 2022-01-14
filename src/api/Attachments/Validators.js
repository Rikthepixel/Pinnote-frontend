import * as yup from "yup";

export const imagesSchema = yup.object().shape({
    files: yup.array().of(
        yup.mixed().label("File")
    ).required().min(1, "Please upload at least 1 file").label("Files")
})