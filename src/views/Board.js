import React, { useRef, useState } from "react";
import { useParams, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button, Alert } from "react-bootstrap";

import { PinBoard, PinNoteToolbar } from "../components/BoardElements";
import MakeWriteable from "../components/MakeWriteable";
import ColorSelectorButton from "../components/ColorSelectorButton";

import { updatePinBoard, removePinBoard } from '../api'
import { ConfirmationAlert, SingleFormAlert } from '../utils/Alerts';
import boardSchema, { validateBoard } from "../api/Boards/BoardValidators";

import {
  MoreIcon, CloseIcon, TrashIcon,
  BrushIcon, NoteIcon, EditIcon
} from "../assets/img/icons";

import "../assets/scss/views/Board.scss";

const Board = (props) => {
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
  const [fieldErrors, setFieldErrors] = useState({})

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

  const toggleMenu = () => {
    menuDiv.current.setAttribute("menu-extended", !(menuDiv.current.getAttribute("menu-extended") === 'true'))
  }

  const updateColor = (color, save) => {
    updatePinBoard(dispatch, boardId,
      save ? { backgroundColor: color } : { draftBackgroundColor: color }
    )
  }

  const updateNoteColor = color => {
    updatePinBoard(dispatch, boardId,
      { defaultNoteBackgroundColor: color }
    )
  }

  const validateBoardTitle = newTitle => {
    let errors = validateBoard({ title: newTitle.trim() })
    setFieldErrors({
      ...fieldErrors,
      title: errors.title
    })
    return errors.title || []
  }

  const updateBoardTitle = newTitle => {
    let errors = updatePinBoard(dispatch, boardId, { title: newTitle.trim() });
    setFieldErrors({
      ...fieldErrors,
      title: errors.title
    })
    return errors.title
  }

  const onDeleteClick = () => {
    ConfirmationAlert({
      title: "Are you sure you want to delete this board?",
      text: "You won't be able to revert this!",
      timer: 10000,
      acceptButtonText: "Yes, delete the board",
      cancelButtonText: "No, keep the board",

      acceptPopup: true,
      acceptedTitle: "Deleted",
      acceptedText: "Your board has been deleted",

      cancelPopup: true,
      cancelledTitle: "Cancelled",
      cancelledText: "Your board was not deleted",
    }).then((result) => {
      if (result) {
        setRedirect({
          redirect: true,
          link: "/Boards"
        })
        removePinBoard(dispatch, boardId)
      }
    })
  }

  const onTitleChangeClick = () => {
    SingleFormAlert({
      title: "Change board title",
      text: "What do you want to change the board name to?",
      inputPlaceholder: state.title,
      acceptButtonText: "Confirm",
      cancelButtonText: "Cancel",
      validate: value => {
        let result = { isValid: true, value: value, error: "" }
        let errors = validateBoardTitle(value)
        if (errors.length != 0) {
          result.isValid = false
          result.error = errors[0]

          if (value.length > 30) {
            result.value = value.substring(0, 30)
          }
        }
        return result;
      },
    }).then(result => {
      if (result.confirmed) {
        updateBoardTitle(result.value)
      }
    })
  }

  if (redirect.redirect) {
    return <Redirect to={redirect.link} />
  }

  let displayColor = state.draftBackgroundColor ? state.draftBackgroundColor : state.backgroundColor

  return (
    <div className="page-container overflow-hidden position-relative">
      <div className="pinBoard-Menu" ref={menuDiv}>
        <div className="d-flex w-100 p-2">
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

          <Button
            variant="primary"
            className="w-100"
            onClick={onTitleChangeClick}
          >
            <div className="d-flex align-items-center justify-content-center">
              <img
                className="me-1"
                src={EditIcon}
                style={{
                  filter: "invert(100%)",
                  aspectRatio: "1",
                  height: "1.2rem"
                }}
              />
              Change title
            </div>
          </Button>

          <ColorSelectorButton
            variant="primary"
            className="w-100"
            text="Background color"
            icon={BrushIcon}
            color={state.backgroundColor}
            onCancel={(oldColor, setDisplayColor) => {
              setDisplayColor(state.backgroundColor);
              updateColor(null, false);
            }}
            onChange={(newColor) => {
              updateColor(newColor, false)
            }}
            onSave={(newColor) => {
              state.draftBackgroundColor = null;
              updateColor(newColor, true);
            }}
          />

          <ColorSelectorButton
            variant="primary"
            className="w-100"
            text="Default note color"
            icon={NoteIcon}
            color={state.defaultNoteBackgroundColor}
            onCancel={updateNoteColor}
            onSave={updateNoteColor}
          />

          <Button
            variant="danger"
            className="w-100"
            onClick={onDeleteClick}
          >
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
              Delete board
            </div>
          </Button>
        </div>
      </div>
      <div className="pinBoard-Main-Container page-container"
        style={{
          backgroundColor: `rgb(${displayColor.join()})`
        }}>
        <PinNoteToolbar>
          <div className="me-auto d-flex">
            <div className="pinBoard-Toolbar-Title " ref={toolbarTitleRef}>
              <MakeWriteable
                text={state.title}
                parentRef={toolbarTitleRef}
                editStyle={{
                  backgroundColor: "#FFF",
                }}
                onEvent="click"
                onChange={text => validateBoardTitle(text).length == 0}
                onUnWriteable={(div) => {
                  if (validateBoardTitle(div.textContent).length == 0) {
                    updateBoardTitle(state.title);
                    return;
                  }
                  updateBoardTitle(div.textContent);
                }}
              />
            </div>
            {fieldErrors.title && <Alert
              className="m-0 ms-1 p-0 pe-1 ps-1 d-flex align-items-center"
              variant="danger"
            >
              {fieldErrors.title[0]}
            </Alert>}
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

export default Board;