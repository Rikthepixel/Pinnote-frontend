import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup.string().label("Email").email().required(),
    password: yup.string().label("Password").required().min(8)
});

export const registerSchema = yup.object().shape({
    username: yup.string().label("Username").required().min(5).max(30),
    email: yup.string().label("Email").email().required(),
    password: yup.string().label("Password").required().min(8).matches(
        "(?=.*[.!@#\$%\^&\*])",
        "Password must contain at least one special character"
    ).matches("(?=.*[A-Z])", "Password must contain at least one uppercase letter")
        .matches("(?=.*[0-9])", "Password must contain at least one number"),
    confirmPassword: yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Both passwords need to be the same"
        ),
    }).required("Confirm password required")
});

export const PasswordResetSchema = yup.object().shape({
    email: loginSchema.fields.email
});

export const UsernameSchema = yup.object().shape({
    username: registerSchema.fields.username
});

export const EmailSchema = yup.object().shape({
    email: loginSchema.fields.email
});

export const PasswordUpdateSchema = yup.object().shape({
    password: registerSchema.fields.password,
    confirmPassword: registerSchema.confirmPassword
});