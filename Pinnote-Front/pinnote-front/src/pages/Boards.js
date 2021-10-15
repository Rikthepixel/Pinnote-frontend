import React, { } from 'react';
import { PinBoardItem } from "../components/Boards";

import "./Boards.scss"

export default function Boards(props) {
    document.title = "Pinnote - Boards";

    return (
        <div>
            <div className="BoardGrid">
                <PinBoardItem title="0" />
                <PinBoardItem />
                <PinBoardItem />
                <PinBoardItem />
            </div>
        </div>
    );
}