import React, {useRef} from "react";
import PinNote, { PinBoard } from "../components/BoardElements";
import { PinNoteToolbar } from '../components/PinNoteToolbar';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./Board.scss";

export default function Board(props) {
  document.title = "Pinnote - Board";

  const BoardNotes = [
    {
      title: "aa",
      text: "Some text",
      position: {
        x: 200,
        y: 300,
      },
    },
    {
      title: "bb",
      text: "MORE TEXT",
    },
  ];
  
  const newNoteButton = useRef()

  return (
    <div className="container">
        <PinNoteToolbar>
            <button ref={newNoteButton}>
                + Note
            </button>
        </PinNoteToolbar>
        <PinBoard Notes={BoardNotes} newNoteButton={newNoteButton} />
    </div>
  );
}
