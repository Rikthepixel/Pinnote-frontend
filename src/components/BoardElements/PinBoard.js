import React, { useEffect, useRef } from "react";
import { useSelector } from 'react-redux';

import PinNote from "./PinNote";
import { createPinNote } from "../../api";

//Styling
import "../../assets/scss/components/BoardElements/PinBoard.scss";

export const PinBoard = (props) => {
  const NoteButton = props.newNoteButton
  const boardRef = useRef();

  const Notes = useSelector(state => {
    return (state.boards.board || {}).notes || []
  })

  const createNote = (e) => {
    let boardElement = boardRef.current;
    let DomRect = boardElement.getBoundingClientRect();

    createPinNote(
      DomRect.width / 2 + boardElement.scrollLeft,
      DomRect.height / 2 + boardElement.scrollTop
    );
  }

  useEffect(() => {
    if (NoteButton && NoteButton.current) {
      NoteButton.current.addEventListener("click", createNote);
    }
  }, [NoteButton])

  const renderedNotes = Notes.map((note, i) => {
    return <PinNote
      key={note.id}
      noteId={note.id}
      boardId={props.boardId}

      onMove={(Position, oldPosition, width, height, setOffset) => {
        let offsetX = 0
        let offsetY = 0
        if (Position.x - (width / 2) <= 0) {
          offsetX = -(Position.x - width / 2)
        }
        if (Position.y - (height / 2) <= 0) {
          offsetY = -(Position.y - height / 2)
        }
        setOffset(offsetX, offsetY)
      }}

    />
  })

  return (
    <div ref={boardRef} className="PinBoard">
      {renderedNotes}
    </div>
  );
}