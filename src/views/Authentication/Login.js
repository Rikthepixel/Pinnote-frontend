import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { Field, Formik, Form as FormikForm } from "formik";
import ErrorBlock from "../../components/ErrorBlock";

import { UserIcon } from "../../assets/img/icons";
import { loginSchema } from "../../api/Authentication/AuthenticationValidators";
import { useAuth } from "../../utils/useAuth";
import { login } from "../../api";
import { toastAlerts } from "../../utils/Alerts";

const Login = (props) => {
    const [redirect, setRedirect] = useState("");

    if (redirect) {
        return <Redirect to={redirect} />;
    }

    return (
        <div className="w-100 h-100 d-flex flex-row justify-content-center px-4 pt-4">
            <article className="px-4 pt-4 w-80">
                <h2 className="section-header d-flex align-items-center justify-content-center">
                    <img className="me-2" alt="" src={UserIcon} />
                    Log into Pinnote
                </h2>
                <div className="d-flex align-items-center justify-content-center">
                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        validationSchema={loginSchema}
                        onSubmit={(values) => login(values.email, values.password).then(() => {
                                setRedirect("/Workspaces");
                            }).catch((err) => toastAlerts({
                                icon: "error",
                                title: "Error!",
                                message: err.message
                            }))}
                    >
                        {(formProps) => {
                            return (
                                <FormikForm className="mt-1 w-50">
                                    <Form.Group id="email" className="mb-4">
                                        <Form.Label>Email: </Form.Label>
                                        <Field
                                            name="email"
                                            className="form-control"
                                            type="email"
                                            placeholder="example@company.com"
                                        />
                                        <ErrorBlock name="email" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Group id="password" className="mb-4">
                                            <Form.Label>Password:</Form.Label>
                                            <Field
                                                name="password"
                                                className="form-control"
                                                type="password"
                                                placeholder="Password"
                                            />
                                            <ErrorBlock name="password" />
                                            <Link to="/PasswordReset" className="d-block small mt-1">
                                                Forgot password?
                                            </Link>
                                        </Form.Group>
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                        disabled={
                                            Object.keys(formProps.errors || {}).length > 0
                                                ? true
                                                : null
                                        }
                                    >
                                        Log in
                                    </Button>
                                </FormikForm>
                            );
                        }}
                    </Formik>
                </div>
                <div className="d-flex justify-content-center gap-2 mt-5">
                    <div>Don't have an account?</div>
                    <Link to="/Register">Register here</Link>
                </div>
            </article>
        </div>
    );
};

export default Login;
