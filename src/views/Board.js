import React, { useRef, useState, useEffect } from "react";
import { useParams, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";

import { PinBoard, PinNoteToolbar } from "../components/BoardElements";
import ColorSelectorButton from "../components/ColorSelectorButton";

import {
  deleteBoard,
  loadBoard,
  unloadBoard,
  setBoardTitle,
  setBoardColor,
  setBoardNoteColor,
} from "../api";
import { ConfirmationAlert, SingleFormAlert } from "../utils/Alerts";
import { validateBoard } from "../api/Boards/BoardValidators";

import {
  MoreIcon,
  CloseIcon,
  TrashIcon,
  BrushIcon,
  NoteIcon,
  EditIcon,
  PlusIcon
} from "../assets/img/icons";

import "../assets/scss/views/Board.scss";

const Board = (props) => {
  const { boardId } = useParams();

  const menuDiv = useRef();
  const newNoteButton = useRef();
  const setDisplaySelectorBackgroundColor = useRef();
  const setDisplaySelectorDefaultBackgroundColor = useRef();
  const workspaceIdRef = useRef();
  const stateRef = useRef();

  const [redirect, setRedirect] = useState("");
  const [draftBackgroundColor, setDraftBackgroundColor] = useState();

  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return state.boards.board || {};
  });
  stateRef.current = state;

  useEffect(() => {
    if (parseInt(boardId)) {
      loadBoard(dispatch, parseInt(boardId))
        .catch(() => {
          setRedirect('/workspaces');
        });
    } else {
      setRedirect('/workspaces');
    }


    return () => {
      unloadBoard(dispatch);
    };
  }, []);

  useEffect(() => {
    if (state.workspaceId) {
      workspaceIdRef.current = state.workspaceId
    }
  }, [state.workspaceId]);

  useEffect(() => {
    if (
      typeof setDisplaySelectorDefaultBackgroundColor.current == "function" &&
      stateRef.current.defaultNoteBackgroundColor != null
    ) {
      setDisplaySelectorDefaultBackgroundColor.current(
        stateRef.current.defaultNoteBackgroundColor
      );
    }
  }, [state.defaultNoteBackgroundColor]);

  useEffect(() => {
    if (
      typeof setDisplaySelectorBackgroundColor.current == "function" &&
      stateRef.current.backgroundColor != null
    ) {
      setDraftBackgroundColor(null);
      setDisplaySelectorBackgroundColor.current(
        stateRef.current.backgroundColor
      );
    }
  }, [state.backgroundColor]);

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
      errors = setBoardTitle(title);
    }
    return errors.title || [];
  };

  const onDeleteClick = () => {
    ConfirmationAlert({
      title: "Delete this board?",
      text: "You won't be able to revert this!",
      timer: 10000,
      acceptButtonText: "Yes, delete board",
      cancelButtonText: "No, keep board",

      acceptPopup: true,
      acceptedTitle: "Deleted",
      acceptedText: "Your board has been deleted",

      cancelPopup: true,
      cancelledTitle: "Cancelled",
      cancelledText: "Your board was not deleted",
    }).then((result) => {
      if (result) {
        deleteBoard(dispatch, parseInt(boardId))
          .then((response) => {
            if (response.error) {
              return;
            }
            setRedirect(`/workspaces/${workspaceIdRef.current}`);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  console.log(stateRef.current);

  const onTitleChangeClick = () => {
    SingleFormAlert({
      title: "Change board title",
      text: "What do you want to change the board title to?",
      inputPlaceholder: stateRef.current.title || "",
      inputValue: stateRef.current.title || "",
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

  let displayColor = (draftBackgroundColor
    ? draftBackgroundColor
    : state.backgroundColor) || [123, 123, 123];

  document.title = `Pinnote - ${state.title || "Board"}`;
  return (

    <div className="flex-grow-1 overflow-hidden position-relative">
      <aside className="pinBoard-Menu" ref={menuDiv}>
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
              onMount={(setDisplayColor) =>
                (setDisplaySelectorBackgroundColor.current = setDisplayColor)
              }
              onCancel={(_, setDisplayColor) => {
                setDisplayColor(state.backgroundColor);
                setDraftBackgroundColor(null);
              }}
              onChange={(color) => setDraftBackgroundColor(color)}
              onSave={(color) => {
                setDraftBackgroundColor(color);
                setBoardColor(color[0], color[1], color[2]);
              }}
            />
          )}

          {state.defaultNoteBackgroundColor && (
            <ColorSelectorButton
              variant="primary"
              className="w-100"
              text="Note color"
              icon={NoteIcon}
              color={state.defaultNoteBackgroundColor}
              onMount={(setDisplayColor) =>
              (setDisplaySelectorDefaultBackgroundColor.current =
                setDisplayColor)
              }
              onCancel={(color, setDisplayColor) =>
                setDisplayColor(state.defaultNoteBackgroundColor)
              }
              onSave={(color) =>
                setBoardNoteColor(color[0], color[1], color[2])
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
      </aside>
      <article
        className="pinBoard-Main-Container page-container"
        style={{ backgroundColor: `rgb(${displayColor.join()})` }}
      >
        <PinNoteToolbar>
          <div className="me-auto pinBoard-Toolbar-Title">{state.title}</div>
          <Button className="d-flex align-items-center" ref={newNoteButton}>
            <img className="BoardButtonImage me-1 img-invert" alt="+" src={PlusIcon} />
            Note
          </Button>
          <Button onClick={toggleMenu}>
            <img src={MoreIcon} alt="..." className="me-1 img-invert" />
            Menu
          </Button>
        </PinNoteToolbar>
        <PinBoard newNoteButton={newNoteButton} />
      </article>
    </div>
  );
};

export default Board;
