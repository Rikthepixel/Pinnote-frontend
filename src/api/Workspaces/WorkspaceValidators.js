import * as yup from "yup";

export const workspacePatchNameSchema = yup.object().shape({
    name: yup.string().max(30),
})