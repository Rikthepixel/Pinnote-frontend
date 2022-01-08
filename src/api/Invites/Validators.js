import * as yup from "yup";

export const InviteByEmail = yup.object().shape({
    email: yup.string().label("Email").email().required()
})