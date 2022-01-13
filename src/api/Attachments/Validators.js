import * as yup from "yup";

export const imagesSchema = yup.object().shape({
    files: yup.array().of(
        yup.mixed()
            .test('fileType', "One or more images is in an unsupported Format", file => {
                if (typeof(file.type) !== "string") {
                    return false;
                }
                
                return file.type.split("/")[0] === "image"
            })
            .label("File")
    ).required().min(1, "Please upload at least 1 image").label("Image")
})