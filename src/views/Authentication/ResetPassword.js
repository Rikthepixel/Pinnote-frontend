import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import ErrorBlock from "../../components/ErrorBlock";
import { sendResetPasswordEmail } from "../../api";
import Countdown from "react-countdown";

import { UserIcon } from "../../assets/img/icons";
import { PasswordResetSchema } from "../../api/Authentication/AuthenticationValidators";
import { toastAlerts } from "../../utils/Alerts";

const ResetPassword = () => {
    const lastEmailReciever = useRef("");
    const [sendText, setSendText] = useState("Send email")
    const [countdown, setCountdown] = useState(0);

    return (
        <div className="w-100 h-100 d-flex flex-row justify-content-center px-4 pt-4">
            <article className="px-4 pt-4 w-80">
                <h2 className="section-header d-flex align-items-center justify-content-center">
                    <img className="me-2" alt="" src={UserIcon} />
                    Reset password
                </h2>
                <div className="d-flex align-items-center justify-content-center">
                    <Formik
                        initialValues={{
                            email: "",
                        }}
                        validationSchema={PasswordResetSchema}
                        onSubmit={(values) => sendResetPasswordEmail(values.email)
                            .then(response => {
                                lastEmailReciever.current = values.email;
                                if (response.result === false) {
                                    toastAlerts({
                                        title: "Error!",
                                        text: response.message,
                                        icon: "error"
                                    });
                                } else {
                                    toastAlerts({
                                        title: "Success!",
                                        text: `An email has been successfully sent to ${values.email}`,
                                        icon: "success",
                                        timer: 10000
                                    });
                                }
                                setSendText("Resend email")
                                setCountdown(Date.now() + 30000);
                            })}
                    >
                        {(formProps) => {
                            return (
                                <FormikForm className="mt-1 w-50"
                                    onChange={e => {
                                        if (e.target.name === "email" && lastEmailReciever.current) {
                                            if (lastEmailReciever.current === e.target.value) {
                                                setSendText("Resend email")
                                            } else {
                                                setSendText("Send email")
                                            }
                                        }
                                    }}
                                >
                                    <div className="d-flex justify-content-center w-100 fw-light mb-4 mt-2">
                                        Please enter the email address associated with your account and we'll send a link to reset your password.
                                    </div>

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
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                        disabled={
                                            Object.keys(formProps.errors || {}).length > 0 ? true : (countdown > 0 ? true : null)
                                        }
                                    >
                                        {countdown > 0 ?
                                            <Countdown
                                                date={countdown}
                                                onComplete={() => setCountdown(0)}
                                                renderer={props => {
                                                    return <span>Retry in: {props.seconds}</span>
                                                }}
                                            /> : sendText
                                        }
                                    </Button>
                                    <div className="fw-light text-center mt-4">
                                        You will recieve an email from the following address:
                                        <div><u>noreply@pinnote-aa89a.firebaseapp.com</u></div>
                                    </div>
                                </FormikForm>
                            );
                        }}
                    </Formik>
                </div>
            </article>
        </div>
    );
};
export default ResetPassword;
