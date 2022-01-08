import React, { Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { CogIcon } from "../assets/img/icons";

import { setWorkspaceName, transferOwnership } from "../api";
import { workspacePatchNameSchema, workspaceOwnerTransferSchema } from "../api/Workspaces/WorkspaceValidators";
import { FormAlert } from "../utils/Alerts";

const SettingsTab = (props) => {

    const user = useSelector(root => root.auth.user || {})
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

    const onTransferOwnershipClick = () => {
        FormAlert({
            title: "Transfer ownership",
            text: "Who do you want to assign as the new owner",
            validator: workspaceOwnerTransferSchema,
            inputs: [
                {
                    name: "candidate",
                    type: "select",
                    value: "",
                    children: props.workspace.users.map((member, index) => (
                        <Fragment key={`${index} ${member.id}`}>
                            {index === 0 && <option>
                                None
                            </option>}
                            {props.ownerId !== member.id && <option value={member.id}>
                                {member.email}
                            </option>}
                        </Fragment>))
                }
            ],
            acceptButtonText: "Transfer",
            cancelButtonText: "Cancel",
        }).then(result => {
            if (result.confirmed) {
                transferOwnership(
                    dispatch,
                    props.workspaceId,
                    parseInt(result.values.candidate)
                );
            }
        })
    }

    return (
        <Fragment>
            <header className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="ps-2 section-header">
                    <img className="me-2" alt="" src={CogIcon} />
                    Settings
                </h2>
            </header>
            <article className="w-100 d-flex flex-column gap-3">
                <Button
                    className="w-50"
                    onClick={onNameChangeClick}
                >
                    Change name
                </Button>
                {props.ownerId === user.id && <Button
                    className="w-50"
                    onClick={onTransferOwnershipClick}
                >
                    Transfer ownership
                </Button>}
            </article>
        </Fragment>
    )
};

export default SettingsTab;