import React, { Fragment, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, FormControl } from "react-bootstrap";
import { CogIcon } from "../assets/img/icons";

import { setWorkspaceName } from "../api";
import { workspacePatchNameSchema } from "../api/Workspaces/WorkspaceValidators";
import { FormAlert } from "../utils/Alerts";

const SettingsTab = (props) => {
    
    const dispatch = useDispatch();
    const workspaceRef = useRef(props.workspace);
    workspaceRef.current = props.workspace;

    const onNameChangeClick = () => {
        FormAlert({
            title: "Change workspace name",
            text: "What do you want to change the workspace name to?",
            validator: workspacePatchNameSchema,
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    value: workspaceRef.current.name,
                    placeholder: workspaceRef.current.name,
                }
            ],
            acceptButtonText: "Confirm",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.confirmed) {
                setWorkspaceName(dispatch, parseInt(props.workspaceId), result.values.name);
                return;
            }
        });
    };

    return (
        <Fragment>
            <header className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="ps-2 section-header">
                    <img className="me-2" alt="" src={CogIcon} />
                    Settings
                </h2>
                <div className="d-flex gap-1">
                    <FormControl
                        placeholder="Filter by name"
                    />
                </div>
            </header>
            <article className="w-100 d-flex flex-column gap-3">
                <Button 
                    className="w-50"
                    onClick={onNameChangeClick}
                >
                    Change name
                </Button>
            </article>
        </Fragment>
    )
};

export default SettingsTab;