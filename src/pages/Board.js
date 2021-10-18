import React, { } from 'react';
import { PinNote, PinBoard } from "../components/BoardElements";

import "./Board.scss"

export default function Board(props) {
    document.title = "Pinnote - Board";

    const BoardNotes = [
        {
            title: "aa",
            text: "Some text",
            position: {
                x: 200,
                y: 300
            }
        },
        {
            title: "bb",
            text: "MORE TEXT"
        }
    ];
    for (var i = 0; i < BoardNotes.length; i++) {
        BoardNotes[i] = (<PinNote key={i} data={BoardNotes[i]} />);
    }

    return (
        <PinBoard>
            {BoardNotes}
        </PinBoard>
    );
}