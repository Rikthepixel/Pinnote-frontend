import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8)
});

export const registerSchema = yup.object().shape({
    userName: yup.string().required().min(5).max(30),
    email: yup.string().email().required(),
    password: yup.string().required().min(8).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
})