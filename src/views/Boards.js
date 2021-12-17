import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import { createBoard, fetchMyWorkspaces } from '../api'
import "../assets/scss/views/Boards.scss"


const Boards = (props) => {
    document.title = "Pinnote - Boards";

    const boards = useSelector(state => state.boards.boards || [])
    const dispatch = useDispatch();

    useEffect(() => {
        fetchMyWorkspaces(dispatch);
    }, [])

    return (
        <div className="page-container">
            <div className="BoardGrid">
                {boards.map((board, index) => {
                    return <PinBoardItem key={index} boardId={board.id} />
                })}
                <PinBoardItemButton onClick={() => {
                    createBoard(dispatch, 1)
                }} />
            </div>
        </div>
    );
}

export default Boards