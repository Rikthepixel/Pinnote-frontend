import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormControl, Button } from "react-bootstrap";
import { PinBoardItem } from "./BoardElements";
import { createBoardInWorkspacePopup } from "../api";
import { BoardIcon, PlusIcon } from "../assets/img/icons";

const BoardTab = (props) => {

    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [displayBoards, setDisplayBoards] = useState([]);

    useEffect(() => {
        setDisplayBoards(props.boards.filter(board => {
            return board.title.toLowerCase().includes(searchText.toLowerCase());
        }));
    }, [props.boards, searchText])

    return (
        <Fragment>
            <header className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="ps-2 section-header">
                    <img className="me-2" alt="" src={BoardIcon} />
                    Boards
                </h2>
                <div className="d-flex gap-2">
                    <FormControl
                        placeholder="Filter by name"
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Button
                        className="text-nowrap d-flex align-items-center justify-content-center"
                        onClick={() => createBoardInWorkspacePopup(dispatch, props.workspaceId)}
                    >
                        <img className="img-invert h-1-0em me-1" alt="" src={PlusIcon} />
                        Board
                    </Button>
                </div>
            </header>
            <article className="w-100 d-flex flex-wrap gap-3">
                {displayBoards.map((board, bIndex) => (
                    <PinBoardItem key={`${board.id}-${bIndex}`} board={board} />
                ))}
            </article>
        </Fragment>
    )
};

export default BoardTab;