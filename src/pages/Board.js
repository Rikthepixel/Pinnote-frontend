﻿import React from "react";
import { PinNote, PinBoard } from "../components/BoardElements";
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
  for (var i = 0; i < BoardNotes.length; i++) {
    BoardNotes[i] = <PinNote key={i} data={BoardNotes[i]} />;
  }

  return (
    <div>
      <div className="BoardsPage-Header" >
        <button>
            aaa
        </button>
      </div>
      <PinBoard>{BoardNotes}</PinBoard>
    </div>
  );
}
