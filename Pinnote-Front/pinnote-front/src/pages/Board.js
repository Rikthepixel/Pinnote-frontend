import React, { } from 'react';
import { PinNote, PinBoard } from "../components/BoardElements";

import "./Board.scss"

export default function Board(props) {
    document.title = "Pinnote - Board";

    let BoardNoteInfos = [
        {
            text: "Some text",
            position: {
                x: 200,
                y: 300
            }
        },
        {
            text: "MORE TEXT"
        }
    ];
    const BoardNotes = [];
    for (var i = 0; i < BoardNoteInfos.length; i++) {
        let NoteProps = BoardNoteInfos[i];
        BoardNotes.push(<PinNote key={i} data={NoteProps} />);
    }

    return (
        <PinBoard>
            {BoardNotes}
        </PinBoard>
    );
}