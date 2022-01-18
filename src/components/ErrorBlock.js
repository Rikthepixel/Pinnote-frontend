import { ErrorMessage } from "formik";
import React from "react";

const ErrorBlock = (props) => {
    return (!props.error ?
        <ErrorMessage name={props.name} className="text-danger" component="span" /> :
        <span className="text-danger">{props.error}</span>
    )

}

export default ErrorBlock