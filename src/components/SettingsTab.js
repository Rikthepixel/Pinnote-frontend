import React, { Fragment } from "react";
import { FormControl } from "react-bootstrap";
import { CogIcon } from "../assets/img/icons";

const SettingsTab = (props) => {
    return (
        <Fragment>
            <header className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="ps-2 section-header">
                    <img className="me-2" src={CogIcon} />
                    Settings
                </h2>
                <div className="d-flex gap-1">
                    <FormControl
                        placeholder="Filter by name"
                    />
                </div>
            </header>
        </Fragment>
    )
};

export default SettingsTab;