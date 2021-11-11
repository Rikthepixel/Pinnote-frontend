import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import PinNote from "./PinNote";
import { createPinNote } from "../../api";

//Styling
import "../../assets/scss/components/BoardElements/PinBoard.scss";

export function PinBoard(props) {
  const NoteButton = props.newNoteButton
  const boardRef = useRef();
  const dispatch = useDispatch();

  const Notes = useSelector(state => {
    let Notes = null;
    state.boards.boards.every((board) => {
      if (props.boardId != board.boardId) {
        return true;
      }
      Notes = board.notes;
      return false;
    })
    return Notes
  })

  function createNote(e) {
    let boardElement = boardRef.current;
    let DomRect = boardElement.getBoundingClientRect();

    dispatch(createPinNote(props.boardId, {
      x: DomRect.width / 2 + boardElement.scrollLeft,
      y: DomRect.height / 2 + boardElement.scrollTop,
    }));
  }

  useEffect(() => {
    if (NoteButton && NoteButton.current) {
      NoteButton.current.addEventListener("click", createNote);
    }
  }, [NoteButton])

  const renderedNotes = Notes.map((note, i) => {
    return <PinNote key={note.noteId} noteId={note.noteId} boardId={props.boardId} />
  })

  return (
    <div ref={boardRef} className="PinBoard">
      {renderedNotes}
    </div>
  );
}