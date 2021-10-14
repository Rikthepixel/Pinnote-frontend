import React, { Component } from 'react';

//CSS
import "./Error.css";

export default class Navbar extends Component {
    componentDidMount() {
        document.title = "Pinnote - Error";
    }

    render() {
        let statuscode = this.props.statuscode || "404";
        let error = this.props.error || "page not found";

        return (
            <div className="Error-Container">
                <div className="Error-back">
                    <div className="Error-main">
                        {statuscode}
                    </div>
                    <div className="Error">
                        {error}
                    </div>
                </div>
            </div>
        );
    }
}