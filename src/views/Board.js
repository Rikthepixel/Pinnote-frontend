import React, { useRef, useState } from "react";
import { useParams, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import { PinBoard, PinNoteToolbar } from "../components/BoardElements";
import MakeWriteable from "../components/MakeWriteable";
import ColorSelectorButton from "../components/ColorSelectorButton";

import { updatePinBoard, removePinBoard } from '../api'

import MoreIcon from "../assets/img/icons/MoreIcon.svg";
import CloseIcon from "../assets/img/icons/CloseIcon.svg";
import TrashIcon from "../assets/img/icons/TrashIcon.svg";
import BrushIcon from "../assets/img/icons/BrushIcon.svg";
import NoteIcon from "../assets/img/icons/NoteIcon.svg";

import "reactjs-popup/dist/index.css";
import "../assets/scss/views/Board.scss";

export default function Board(props) {
  document.title = "Pinnote - Board";

  const { boardId } = useParams();

  const toolbarTitleRef = useRef();
  const menuDiv = useRef();
  const newNoteButton = useRef();

  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState({
    redirect: false,
    link: ""
  })

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

  function toggleMenu() {
    menuDiv.current.setAttribute("menu-extended", !(menuDiv.current.getAttribute("menu-extended") === 'true'))
  }

  function updateTitle(div) {
    dispatch(updatePinBoard(boardId, {
      title: div.textContent
    }))
  }

  function updateColor(color, save) {
    dispatch(updatePinBoard(boardId, save ? 
      {  background_color: color }
      : { draft_background_color: color }
      ))
  }

  function updateNoteColor(color, save) {
    dispatch(updatePinBoard(boardId, {
      default_note_background_color: color
    }))
  }

  function removeBoard() {
    setRedirect({
      redirect: true,
      link: "/Boards"
    })
    dispatch(removePinBoard(boardId))
  }

  if (redirect.redirect) {
    return <Redirect to={redirect.link} />
  }

  return (
    <div className="page-container overflow-hidden position-relative">
      <div className="pinBoard-Menu" ref={menuDiv}>
        <div className="d-flex border-2 border-bottom border-secondary w-100 p-2">
          <div className="d-flex align-items-center justify-content-center w-100">
            <label className="d-inline-flex align-items-center fs-4">
              Board settings
            </label>
          </div>
          <Button
            className="bg-transparent border-0"
            onClick={toggleMenu}
          >
            <img
              alt="X"
              src={CloseIcon}
              className="text-black"
            />
          </Button>
        </div>

        <div className="pinBoard-Menu-Content p-3"> 
          <ColorSelectorButton 
            variant="primary"
            className="w-100"
            text="Change background color"
            icon={BrushIcon}
            color={state.background_color}
            onCancel={(oldColor, setDisplayColor) => {
              setDisplayColor(state.background_color);
              updateColor(null, false);
            }}
            onChange={(newColor) => {
              updateColor(newColor, false)
            }}
            onSave={(newColor) => {
              state.draft_background_color = null;
              updateColor(newColor, true);
            }}
          />
          <ColorSelectorButton 
            variant="primary"
            className="w-100"
            text="Change default note color"
            icon={NoteIcon}
            color={state.default_note_background_color}
            onCancel={updateNoteColor}
            onSave={updateNoteColor}
          />

          <Button variant="danger" className="w-100" onClick={removeBoard}>
            <div className="d-flex align-items-center justify-content-center">
              <img
                className="me-1"
                src={TrashIcon}
                style={{
                  filter: "invert(100%)",
                  aspectRatio: "1",
                  height: "1.2rem"
                }}
              />
              Close board
            </div>
          </Button>
        </div>
      </div>
      <div className="pinBoard-Main-Container page-container"
        style={{
          backgroundColor: `rgb(${state.draft_background_color ? state.draft_background_color.join() : state.background_color.join()})`
        }}>
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
          <Button
            onClick={toggleMenu}
          >
            <img
              src={MoreIcon}
              alt="..."
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
    </div>
  );

}
