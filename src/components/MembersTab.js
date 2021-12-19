import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormControl, Button } from "react-bootstrap";
import { UsersIcon, PlusIcon } from "../assets/img/icons";

const MembersTab = (props) => {

    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [displayMembers, setDisplayMembers] = useState([]);

    useEffect(() => {
        setDisplayMembers(props.members.filter(user => {
            return user.username.toLowerCase().includes(searchText.toLowerCase());
        }));
    }, [props.members, searchText])

    return (
        <Fragment>
            <header className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="ps-2 section-header">
                    <img className="me-2" src={UsersIcon} />
                    Members
                </h2>
                <div className="d-flex gap-2">
                    <FormControl
                        placeholder="Filter by name"
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Button className="text-nowrap d-flex align-items-center justify-content-center">
                        <img className="img-invert h-1-0em me-1" src={PlusIcon} />
                        Member
                    </Button>
                </div>
            </header>
            <article className="d-flex flex-column gap-2 mt-4">
                {displayMembers.map((user, index) => (
                    <div
                        key={index}
                        className="UserItem"
                        style={{ backgroundColor: index % 2 == 0 ? "var(--bs-gray-200)" : "var(--bs-gray-300)" }}
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
        </Fragment>
    )
};

export default MembersTab