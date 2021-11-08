import React, { useRef } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import { PinBoard, PinNoteToolbar } from "../components/BoardElements";
import MakeWriteable from "../components/MakeWriteable";

import { updatePinBoard } from '../api'

import MoreIcon from "../assets/img/icons/MoreIcon.svg";
import "reactjs-popup/dist/index.css";
import "../assets/scss/views/Board.scss";

export default function Board(props) {
  document.title = "Pinnote - Board";

  const { boardId } = useParams();

  const toolbarTitleRef = useRef();
  const newNoteButton = useRef();

  const dispatch = useDispatch();
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


  function updateTitle(div) {
    dispatch(updatePinBoard(boardId, {
      title: div.textContent
    }))
  }

  return (
    <div className="page-container">
      <PinNoteToolbar>
        <div className="pinBoard-Toolbar-Title me-auto" ref={toolbarTitleRef}>
          <MakeWriteable
            parentRef={toolbarTitleRef}
            editStyle={{
              backgroundColor: "#FFF",
            }}
            onEvent="click"
            onUnWriteable={updateTitle}
          />
          {state.title}
        </div>
        <Button ref={newNoteButton}>+ Note</Button>
        <Button>
          <img
            src={MoreIcon}
            placeholder="..."
            className="me-1"
            style={{
              filter: "invert(100%)"
            }}
          />
          Menu
        </Button>
      </PinNoteToolbar>
      <PinBoard boardId={boardId} newNoteButton={newNoteButton} />
    </div>
  );

}
