﻿import React, { } from 'react';
import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import "../assets/scss/views/Boards.scss"

export default function Boards(props) {
    document.title = "Pinnote - Boards";

    return (
        <div>
            <div className="BoardGrid">
                <PinBoardItem title="0" />
                <PinBoardItem />
                <PinBoardItem />
                <PinBoardItem />
                <PinBoardItemButton />
            </div>
        </div>
    );
}