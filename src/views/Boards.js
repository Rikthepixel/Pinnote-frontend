import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import { getAllBoards, createBoard } from '../api'
import "../assets/scss/views/Boards.scss"


export default function Boards(props) {
    document.title = "Pinnote - Boards";

    const boards = useSelector(state => state.boards.boards)
    const dispatch = useDispatch();
    console.log(createBoard)

    const renderedBoards = boards.map((element, index) => {
        return <PinBoardItem key={index} title={element.title} background_color={element.background_color} />
    })

    return (
        <div className="page-container">
            <div className="BoardGrid">
                {renderedBoards}
                <PinBoardItemButton onClick={() => {
                    dispatch(createBoard())
                }} />
            </div>
        </div>
    );
}