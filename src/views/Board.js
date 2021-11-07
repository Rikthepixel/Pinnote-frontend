import React, { useRef } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import { PinBoard, PinNoteToolbar } from "../components/BoardElements";
import MakeWriteable from "../components/MakeWriteable";
import "reactjs-popup/dist/index.css";
import "../assets/scss/views/Board.scss";

import { updateBoardTitle } from '../api'


export default function Board(props) {
  document.title = "Pinnote - Board";

  const { boardId } = useParams();
  const toolbarTitleRef = useRef();
  const newNoteButton = useRef();

  const state = useSelector(state => {
    let Board = null;
    state.boards.boards.every((board) => {
      if (boardId != board.boardId) {
        return true;
      }
      Board = board;
      return false;
    })

    return Board
  })
  const title = useSelector(state => {
    let Board = null;
    state.boards.boards.every((board) => {
      if (boardId != board.boardId) {
        return true;
      }
      Board = board;
      return false;
    })

    return Board.title
  })

  const dispatch = useDispatch();
  function updateTitle(div) {
    let action = updateBoardTitle(boardId, div.textContent)
    console.log(action)
    dispatch(action)
  }

  return (
    <div className="page-container">
      <PinNoteToolbar>
        <div className="me-auto">
          <div className="pinBoard-Toolbar-Title" ref={toolbarTitleRef}>
            <MakeWriteable
              parentRef={toolbarTitleRef}
              editStyle={{
                backgroundColor: "#FFF",
              }}
              onUnWriteable={updateTitle}
            />
            {title}
          </div>
        </div>
        <Button ref={newNoteButton}>+ Note</Button>
      </PinNoteToolbar>
      <PinBoard boardId={boardId} newNoteButton={newNoteButton} />
    </div>
  );

}
