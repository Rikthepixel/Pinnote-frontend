import React, { } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import { createPinBoard } from '../api'
import "../assets/scss/views/Boards.scss"


export default function Boards(props) {
    document.title = "Pinnote - Boards";

    const boards = useSelector(state => state.boards.boards)
    const dispatch = useDispatch();

    const renderedBoards = boards.map((element, index) => {
        return <PinBoardItem key={index} boardId={element.boardId} />
    })

    return (
        <div className="page-container">
            <div className="BoardGrid">
                {renderedBoards}
                <PinBoardItemButton onClick={() => {
                    createPinBoard(dispatch)
                }} />
            </div>
        </div>
    );
}