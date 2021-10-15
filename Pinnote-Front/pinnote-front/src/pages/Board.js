import React, { } from 'react';
import { PinNote, PinBoard } from "../components/Boards";

import "./Board.scss"

export default function Board(props) {
    document.title = "Pinnote - Board";

    let BoardNoteInfos = [
        {
            text: "Some text"
        },
        {
            text: "MORE TEXT"
        }
    ];
    const BoardNotes = [];
    for (var i = 0; i < BoardNoteInfos.length; i++) {
        let NoteProps = BoardNoteInfos[i];
        BoardNotes.push(<PinNote text={NoteProps.text} />);
    }

    return (
        <PinBoard>
            {BoardNotes}
        </PinBoard>
    );
}