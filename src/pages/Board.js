import React, {useRef} from "react";
import { PinBoard } from "../components/BoardElements";
import { PinNoteToolbar } from '../components/PinNoteToolbar';
import { Button } from 'react-bootstrap';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./Board.scss";

export default function Board(props) {
  document.title = "Pinnote - Board";

  const BoardNotes = [
    {
      noteId: Math.random(1, 99999),
      title: "aa",
      text: "Some text",
      position: {
        x: 200,
        y: 300,
      },
    },
    {
      noteId: Math.random(1, 99999),
      title: "bb",
      text: "MORE TEXT",
    },
  ];
  
  const newNoteButton = useRef()

  return (
    <div className="page-container">
        <PinNoteToolbar>
            <Button ref={newNoteButton}>
                + Note
            </Button>
        </PinNoteToolbar>
        <PinBoard Notes={BoardNotes} newNoteButton={newNoteButton} />
    </div>
  );
}
