import React, { Component, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import PinNote from "./PinNote";
import { createPinNote, deletePinNote } from "../../api";

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

  function deleteNote(noteId) {
    console.log(noteId)
    dispatch(deletePinNote(props.boardId, noteId))
  }

  useEffect(() => {
    if (NoteButton && NoteButton.current) {
      NoteButton.current.addEventListener("click", createNote);
    }
  }, [])

  const renderedNotes = Notes.map((element, i) => {
    return <PinNote key={element.noteId} data={element} onDelete={deleteNote} />
  })

  return (
    <div ref={boardRef} className="PinBoard">
      {renderedNotes}
    </div>
  );
}