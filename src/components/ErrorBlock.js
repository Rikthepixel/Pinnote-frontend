import { ErrorMessage } from "formik";
import React from "react";

const ErrorBlock = (props) => {
    return <ErrorMessage name={props.name} className="text-danger" component="span">

    </ErrorMessage>
}

export default ErrorBlock