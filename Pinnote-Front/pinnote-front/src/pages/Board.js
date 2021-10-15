import React, { } from 'react';
import BoardNote from "../components/BoardNote";

import "./Board.css"

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
        BoardNotes.push(<BoardNote text={NoteProps.text} />);
    } 

    return (
        <div>
            {BoardNotes}
        </div>
    );
}