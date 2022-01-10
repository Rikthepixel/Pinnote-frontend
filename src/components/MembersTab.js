import React, { Fragment, useEffect, useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { cancelInvite, inviteUserByEmail, removeMember } from "../api";
import { InviteByEmail } from "../api/Invites/Validators";
import { workspaceOwnerTransferSchema } from "../api/Workspaces/WorkspaceValidators";
import { UsersIcon, PlusIcon, UserPlusIcon, StarIcon } from "../assets/img/icons";
import { confirmationAlert, formAlert, toastAlerts } from "../utils/Alerts";

const toastError = (message) => toastAlerts({
    title: "Error!",
    text: message,
    icon: "error"
})

const MembersTab = (props) => {

    const [searchText, setSearchText] = useState("");
    const [displayMembers, setDisplayMembers] = useState([]);
    const [displayInvitees, setDisplayInvitees] = useState([]);
    const user = useSelector(root => root.auth.user || {})

    const dispatch = useDispatch();

    useEffect(() => {
        setDisplayMembers(props.members.filter(_user => {
            return _user.username.toLowerCase().includes(searchText.toLowerCase());
        }));
    }, [props.members, searchText])
    useEffect(() => {
        setDisplayInvitees(props.invitees.filter(_invitee => {
            return _invitee.user.username.toLowerCase().includes(searchText.toLowerCase())
        }))
    }, [props.invitees, searchText])

    return (
        <Fragment>
            <header className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="ps-2 section-header">
                    <img className="me-2" alt="" src={UsersIcon} />
                    Members
                </h2>
                <div className="d-flex gap-2">
                    <FormControl
                        placeholder="Filter by name"
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Button className="text-nowrap d-flex align-items-center justify-content-center"
                        onClick={() => formAlert({
                            title: "Invite",
                            text: "Who do you want to invite?",
                            validator: InviteByEmail,
                            inputs: [
                                {
                                    name: "email",
                                    type: "text",
                                    value: "",
                                    placeholder: "Email"
                                }
                            ],
                            acceptButtonText: "Invite",
                            cancelButtonText: "Cancel",
                        }).then((result) => {
                            if (result.confirmed) {
                                inviteUserByEmail(dispatch, props.workspaceId, result.values.email)
                                    .catch(err => toastAlerts({
                                        title: "Error!",
                                        icon: "error",
                                        text: err.message,
                                    }))
                            }
                        })}
                    >
                        <img className="img-invert h-1-0em me-1" alt="" src={PlusIcon} />
                        Invite member
                    </Button>
                </div>
            </header>
            <article className="d-flex flex-column gap-2 mt-4">
                {displayMembers.map((_user, index) => (
                    <div
                        key={index}
                        className="UserItem"
                        style={{ backgroundColor: "var(--bs-gray-200)" }}
                    >
                        <div className="NameDetails">
                            <b className="d-flex align-items-center gap-2">
                                {_user.id === props.ownerId && <img alt="Owner " src={StarIcon} className="h-1-0em w-1-0em d-inline" />}
                                <b className="m-0">{_user.username}</b>
                            </b>
                            <div>{_user.email}</div>
                        </div>
                        {(_user.id != props.ownerId || _user.id == user.id) && <Button variant="danger"
                            onClick={() => confirmationAlert(_user.id == user.id ? {
                                title: "Leave workspace",
                                text: `Are you sure you want to leave this workspace?${props.members.length === 1 && " This will also delete the workspace, its boards and its notes"}`,
                                acceptButtonText: "Leave workspace",
                                cancelButtonText: "Stay in workspace"
                            } : {
                                title: "Remove member",
                                text: `Are you sure you want to remove ${_user.username}?`,
                                acceptButtonText: "Remove member",
                                cancelButtonText: "Keep member"
                            }).then(result => {
                                if (result) {
                                    if (_user.id === props.ownerId && props.members.length > 1) {
                                        formAlert({
                                            title: "Transfer ownership",
                                            text: "Who do you want to assign as the new owner",
                                            validator: workspaceOwnerTransferSchema,
                                            inputs: [
                                                {
                                                    name: "candidate",
                                                    type: "select",
                                                    value: "",
                                                    children: props.members.map((member, memberIndex) => (
                                                        <Fragment key={`${memberIndex} ${member.id}`}>
                                                            {memberIndex === 0 && <option>
                                                                None
                                                            </option>}
                                                            {_user.id !== member.id && <option value={member.id}>
                                                                {member.email}
                                                            </option>}
                                                        </Fragment>))
                                                }
                                            ],
                                            acceptButtonText: "Transfer",
                                            cancelButtonText: "Cancel",
                                        }).then(candidateResult => {
                                            if (candidateResult.confirmed) {
                                                removeMember(
                                                    dispatch,
                                                    props.workspaceId,
                                                    _user.id,
                                                    parseInt(candidateResult.values.candidate)
                                                ).catch(err => toastError(err.message));
                                            }
                                        })

                                    } else {
                                        removeMember(
                                            dispatch,
                                            props.workspaceId,
                                            _user.id
                                        ).catch((err) => toastError(err.message));
                                    }
                                }
                            })}
                        >
                            {_user.id == user.id ? "Leave" : "Remove"}
                        </Button>}
                    </div>
                ))}
            </article>
            <header className="d-flex align-items-center justify-content-between mb-3 mt-5">
                <h2 className="ps-2 section-header">
                    <img className="me-2" alt="" src={UserPlusIcon} />
                    Invitees
                </h2>
            </header>
            <article className="d-flex flex-column gap-2 mt-4">
                {displayInvitees.map((invite, index) => (
                    <div
                        key={`${index} ${invite.id}`}
                        className="UserItem"
                        style={{ backgroundColor: "var(--bs-gray-200)" }}
                    >
                        <div className="NameDetails">
                            <b>{invite.user.username}</b>
                            <div>{invite.user.email}</div>
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => confirmationAlert({
                                title: "Cancel invite",
                                text: `Are you sure you want to cancel the invitation of ${invite.user.username}`,
                                acceptButtonText: "Cancel invitation",
                                cancelButtonText: "Keep invitiation"
                            }).then(result => {
                                if (result) {
                                    cancelInvite(dispatch, props.workspaceId, invite.id)
                                        .catch(err => toastAlerts({
                                            title: "Error!",
                                            text: err.message,
                                            icon: "error"
                                        }));
                                }
                            })}
                        >
                            Cancel invite
                        </Button>
                    </div>
                ))}
            </article>

        </Fragment>
    )
};

export default MembersTab