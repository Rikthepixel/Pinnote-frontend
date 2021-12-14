import React, { useRef, useState, useEffect } from "react";
import { useParams, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import { PinBoard, PinNoteToolbar } from "../components/BoardElements";
import ColorSelectorButton from "../components/ColorSelectorButton";

import { updatePinBoard, removePinBoard, loadBoard } from "../api";
import { ConfirmationAlert, SingleFormAlert } from "../utils/Alerts";
import { validateBoard } from "../api/Boards/BoardValidators";

import {
  MoreIcon,
  CloseIcon,
  TrashIcon,
  BrushIcon,
  NoteIcon,
  EditIcon,
} from "../assets/img/icons";

import "../assets/scss/views/Board.scss";

const Board = (props) => {
  document.title = "Pinnote - Board";

  const { boardId } = useParams();

  const menuDiv = useRef();
  const newNoteButton = useRef();

  const [redirect, setRedirect] = useState("");

  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return state.boards.board || {};
  });

  useEffect(() => {
    loadBoard(dispatch, boardId);
  }, []);

  const toggleMenu = () => {
    menuDiv.current.setAttribute(
      "menu-extended",
      !(menuDiv.current.getAttribute("menu-extended") === "true")
    );
  };

  const updateBoardTitle = (title = "", validate) => {
    let errors;
    title = title.trim();

    if (validate) {
      errors = validateBoard({ title: title });
    } else {
      console.log(title);
      errors = updatePinBoard(dispatch, boardId, { title: title });
    }
    return errors.title || [];
  };

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
        setRedirect("/Boards");
        removePinBoard(dispatch, boardId);
      }
    });
  };

  const onTitleChangeClick = () => {
    SingleFormAlert({
      title: "Change board title",
      text: "What do you want to change the board title to?",
      inputPlaceholder: state.title,
      inputValue: state.title,
      acceptButtonText: "Confirm",
      cancelButtonText: "Cancel",
      validate: (value) => {
        let result = { isValid: true, value: value, error: "" };
        let errors = updateBoardTitle(value, true);
        if (errors.length != 0) {
          result.isValid = false;
          result.error = errors[0];

          if (value.length > 30) {
            result.value = value.substring(0, 30);
          }
        }
        return result;
      },
    }).then((result) => {
      if (result.confirmed) {
        updateBoardTitle(result.value);
        return;
      }
      updateBoardTitle(state.title);
    });
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  let displayColor = (state.draftBackgroundColor
    ? state.draftBackgroundColor
    : state.backgroundColor) || [123, 123, 123];

  return (
    <div className="page-container overflow-hidden position-relative">
      <div className="pinBoard-Menu" ref={menuDiv}>
        <div className="d-flex w-100 p-2">
          <div className="d-flex align-items-center justify-content-center w-100">
            <label className="d-inline-flex align-items-center fs-4">
              Board settings
            </label>
          </div>
          <Button className="bg-transparent border-0" onClick={toggleMenu}>
            <img alt="X" src={CloseIcon} className="text-black" />
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
                  height: "1.2rem",
                }}
              />
              Change title
            </div>
          </Button>

          {state.backgroundColor && (
            <ColorSelectorButton
              variant="primary"
              className="w-100"
              text="Background color"
              icon={BrushIcon}
              color={state.backgroundColor}
              onCancel={(_, setDisplayColor) => {
                setDisplayColor(state.backgroundColor);
                updatePinBoard(dispatch, boardId, {
                  draftBackgroundColor: null,
                });
              }}
              onChange={(color) =>
                updatePinBoard(dispatch, boardId, {
                  draftBackgroundColor: color,
                })
              }
              onSave={(color) =>
                updatePinBoard(dispatch, boardId, {
                  draftBackgroundColor: null,
                  backgroundColor: color,
                })
              }
            />
          )}

          {state.defaultNoteBackgroundColor && (
            <ColorSelectorButton
              variant="primary"
              className="w-100"
              text="Note color"
              icon={NoteIcon}
              color={state.defaultNoteBackgroundColor}
              onCancel={(color) =>
                updatePinBoard(dispatch, boardId, {
                  defaultNoteBackgroundColor: color,
                })
              }
              onSave={(color) =>
                updatePinBoard(dispatch, boardId, {
                  defaultNoteBackgroundColor: color,
                })
              }
            />
          )}

          <Button variant="danger" className="w-100" onClick={onDeleteClick}>
            <div className="d-flex align-items-center justify-content-center">
              <img
                className="me-1"
                src={TrashIcon}
                style={{
                  filter: "invert(100%)",
                  aspectRatio: "1",
                  height: "1.2rem",
                }}
              />
              Delete board
            </div>
          </Button>
        </div>
      </div>
      <div
        className="pinBoard-Main-Container page-container"
        style={{
          backgroundColor: `rgb(${displayColor.join()})`,
        }}
      >
        <PinNoteToolbar>
          <div className="me-auto pinBoard-Toolbar-Title">{state.title}</div>
          <Button ref={newNoteButton}>+ Note</Button>
          <Button onClick={toggleMenu}>
            <img
              src={MoreIcon}
              alt="..."
              className="me-1"
              style={{
                filter: "invert(100%)",
              }}
            />
            Menu
          </Button>
        </PinNoteToolbar>
        <PinBoard newNoteButton={newNoteButton} />
      </div>
    </div>
  );
};

export default Board;
