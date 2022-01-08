import * as yup from "yup";

export const workspacePatchNameSchema = yup.object().shape({
    name: yup.string().max(30),
});

export const workspaceOwnerTransferSchema = yup.object().shape({
    candidate: yup.number().label("Candidate").required().integer()
});