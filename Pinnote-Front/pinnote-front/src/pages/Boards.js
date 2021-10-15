import React, { } from 'react';
import { BoardItem } from "../components/Boards";

import "./Boards.scss"

export default function Boards(props) {
    document.title = "Pinnote - Boards";

    return (
        <div>
            <div className="BoardGrid">
                <BoardItem title="0" />
                <BoardItem />
                <BoardItem />
                <BoardItem />
            </div>
        </div>
    );
}