import React, { Fragment, useEffect, useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { cancelInvite, inviteUserByEmail } from "../api";
import { InviteByEmail } from "../api/Invites/Validators";
import { UsersIcon, PlusIcon } from "../assets/img/icons";
import { ConfirmationAlert, FormAlert, ToastAlerts } from "../utils/Alerts";

const MembersTab = (props) => {

    const [searchText, setSearchText] = useState("");
    const [displayMembers, setDisplayMembers] = useState([]);
    const [displayInvitees, setDisplayInvitees] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        setDisplayMembers(props.members.filter(user => {
            return user.username.toLowerCase().includes(searchText.toLowerCase());
        }));
    }, [props.members, searchText])
    useEffect(() => {
        setDisplayInvitees(props.invitees.filter(invitee => {
            return invitee.user.username.toLowerCase().includes(searchText.toLowerCase())
        }))
    }, [props.invitees, searchText])
    console.log(displayInvitees);
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
                        onClick={() => FormAlert({
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
                                    .catch(err => ToastAlerts({
                                        title: "Error!",
                                        icon: "error",
                                        text: err.message,
                                    }))
                            }
                        })}
                    >
                        <img className="img-invert h-1-0em me-1" alt="" src={PlusIcon} />
                        Member
                    </Button>
                </div>
            </header>
            <article className="d-flex flex-column gap-2 mt-4">
                {displayMembers.map((user, index) => (
                    <div
                        key={index}
                        className="UserItem"
                        style={{ backgroundColor: "var(--bs-gray-200)" }}
                    >
                        <div className="NameDetails">
                            <b>{user.username}</b>
                            <div>{user.email}</div>
                        </div>
                        <Button variant="danger">
                            Remove
                        </Button>
                    </div>
                ))}
            </article>
            <header className="d-flex align-items-center justify-content-between mb-3 mt-5">
                <h2 className="ps-2 section-header">
                    <img className="me-2" alt="" src={UsersIcon} />
                    Invitees
                </h2>
            </header>
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
                            onClick={() => ConfirmationAlert({
                                title: "Cancel invite",
                                text: `Are you sure you want to cancel the invitation of ${invite.user.username}`,
                                acceptButtonText: "Cancel invitation",
                                cancelButtonText: "Keep invitiation"
                            }).then(result => {
                                if (result) {
                                    cancelInvite(dispatch, props.workspaceId, invite.id)
                                        .catch(err => ToastAlerts({
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
        </Fragment>
    )
};

export default MembersTab