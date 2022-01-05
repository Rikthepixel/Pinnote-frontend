import React, { useRef, useState } from "react";
import { CheckIcon, CheckIconGreen, CloseIconRed, CogIcon, EditIcon } from "../assets/img/icons";
import { useAuth } from "../utils/useAuth";
import { FormAlert } from "../utils/Alerts";

import "../assets/scss/views/MySettings.scss";
import { Button } from "react-bootstrap";
import { setUserName, verifyEmail, updateEmail, updatePassword } from "../api";
import { EmailSchema, PasswordUpdateSchema, UsernameSchema } from "../api/Authentication/AuthenticationValidators";
import Swal from "sweetalert2";

const MySettings = () => {
    const userRef = useRef();
    const [user, isAuthLoaded] = useAuth();
    const [_, forceUpdate] = useState();

    userRef.current = user || {
        displayName: "Unknown",
        email: "Unknown",
        emailVerified: false,
    };

    return (
        <div className="w-100 h-100 d-flex flex-row justify-content-center px-4 pt-4">
            <article className="px-4 pt-4 w-80">
                <h2 className="section-header d-flex align-items-center">
                    <img className="me-2" alt="" src={CogIcon} />
                    Settings
                </h2>
                <h3 className="account-details-header"> Account details </h3>
                <section className="account-details d-flex flex-column gap-2">
                    <div>
                        <div className="details">
                            <label>Username:</label>
                            <span>{userRef.current.displayName}</span>
                        </div>
                        <div className="actions">
                            <Button
                                onClick={() => FormAlert({
                                    title: "Change username",
                                    text: "What do you want to change your username to?",
                                    validator: UsernameSchema,
                                    inputs: [
                                        {
                                            name: 'username',
                                            type: 'text',
                                            value: userRef.current.displayName,
                                            placeholder: userRef.current.displayName,
                                        }
                                    ],
                                    acceptButtonText: "Confirm",
                                    cancelButtonText: "Cancel",
                                }).then((result) => {
                                    if (result.confirmed) {
                                        setUserName(result.values.username)
                                            .then(() => {
                                                Swal.fire({
                                                    title: 'Success!',
                                                    text: `Your username has been changed to ${result.values.username}`,
                                                    icon: 'success',
                                                    position: "top",
                                                    toast: true,
                                                    showConfirmButton: false,
                                                    timer: 5000
                                                })
                                                forceUpdate({})
                                            })
                                            .catch(err => {
                                                Swal.fire({
                                                    title: 'Error!',
                                                    text: err.message,
                                                    icon: 'error',
                                                    position: "top",
                                                    toast: true,
                                                    showConfirmButton: false,
                                                    timer: 4000
                                                })
                                            });
                                        return;
                                    }
                                })}
                            >
                                <img src={EditIcon} className="icon img-invert me-2" alt="" />
                                Change
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="details">
                            <label> Email: </label>
                            <span>{userRef.current.email}</span>
                            <div
                                className={`ms-2 d-flex align-items-center justify-content-center gap-1 
                                    ${userRef.current.emailVerified ? "text-success" : "text-danger"}`}
                            >
                                <img
                                    src={userRef.current.emailVerified ? CheckIconGreen : CloseIconRed}
                                    className="icon"
                                    alt=""
                                />
                                {userRef.current.emailVerified ? "Verified" : "Unverified"}
                            </div>
                        </div>
                        <div className="actions">
                            <Button variant="success" onClick={() => verifyEmail()
                                .then(resp => {
                                    if (resp.result) {
                                        Swal.fire({
                                            title: 'Success!',
                                            text: `Verification email has been successfully sent to ${userRef.current.email}`,
                                            icon: 'success',
                                            position: "top",
                                            toast: true,
                                            showConfirmButton: false,
                                            timer: 5000
                                        })
                                    } else {
                                        Swal.fire({
                                            title: 'Error!',
                                            text: resp.message,
                                            icon: 'error',
                                            position: "top",
                                            toast: true,
                                            showConfirmButton: false,
                                            timer: 4000
                                        })
                                    }
                                })}>
                                <img src={CheckIcon} className="icon img-invert me-2" alt="" />
                                Verify
                            </Button>
                            <Button
                                onClick={() => FormAlert({
                                    title: "Change email address",
                                    text: "What do you want to change your email address to?",
                                    validator: EmailSchema,
                                    inputs: [
                                        {
                                            name: 'email',
                                            type: 'text',
                                            value: userRef.current.email,
                                            placeholder: userRef.current.email,
                                        }
                                    ],
                                    acceptButtonText: "Confirm",
                                    cancelButtonText: "Cancel",
                                }).then((result) => {
                                    if (result.confirmed) {
                                        updateEmail(result.values.email)
                                            .then(resp => {
                                                if (resp.result) {
                                                    Swal.fire({
                                                        title: 'Success!',
                                                        text: `An email has been sent ${result.values.username}`,
                                                        icon: 'success',
                                                        position: "top",
                                                        toast: true,
                                                        showConfirmButton: false,
                                                        timer: 5000
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        title: 'Error!',
                                                        text: resp.message,
                                                        icon: 'error',
                                                        position: "top",
                                                        toast: true,
                                                        showConfirmButton: false,
                                                        timer: 4000
                                                    })
                                                };
                                            })
                                    }
                                })}
                            >
                                <img src={EditIcon} className="icon img-invert me-2" alt="" />
                                Change
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="details">
                            <label> Password: </label>
                            <span>*********</span>
                        </div>
                        <div className="actions">
                            <Button
                                onClick={() => FormAlert({
                                    title: "Change password",
                                    text: "What do you want to change your password to?",
                                    validator: PasswordUpdateSchema,
                                    inputs: [
                                        {
                                            name: "password",
                                            type: "password",
                                            value: "",
                                            placeholder: "Password",
                                        },
                                        {
                                            name: "confirmPasssword",
                                            type: "password",
                                            value: "",
                                            placeholder: "Confirm password",
                                        }
                                    ],
                                    acceptButtonText: "Confirm",
                                    cancelButtonText: "Cancel",
                                }).then((result) => {
                                    if (result.confirmed) {
                                        updatePassword(result.values.password)
                                            .then(resp => {
                                                if (resp.result) {
                                                    Swal.fire({
                                                        title: 'Success!',
                                                        text: "Password has successfully been changes",
                                                        icon: 'success',
                                                        position: "top",
                                                        toast: true,
                                                        showConfirmButton: false,
                                                        timer: 5000
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        title: 'Error!',
                                                        text: resp.message,
                                                        icon: 'error',
                                                        position: "top",
                                                        toast: true,
                                                        showConfirmButton: false,
                                                        timer: 4000
                                                    })
                                                };
                                            })
                                    }
                                })}
                            >
                                <img src={EditIcon} className="icon img-invert me-2" alt="" />
                                Change
                            </Button>
                        </div>
                    </div>
                </section>
            </article>
        </div >
    );
};

export default MySettings;
