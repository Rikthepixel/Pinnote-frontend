import React, {  } from 'react';

//CSS
import "./Error.css";

export default function Navbar(props) {
    document.title = "Pinnote - Error";

    let statuscode = props.statuscode || "404";
    let error = props.error || "page not found";
    return (
        <div className="Error-Container">
            <div className="Error-back">
                <div className="Error-aspectRatio">
                    <div className="Error-main">
                        {statuscode}
                    </div>
                    <div className="Error">
                        {error}
                    </div>
                </div>
            </div>
        </div>
    );
}