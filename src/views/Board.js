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
import { confirmationAlert, formAlert, toastAlerts } from "../utils/Alerts";
import { boardSchema } from "../api/Boards/BoardValidators";
import * as yup from "yup";

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
import { useAuth } from "../utils/useAuth";

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
  const [, isAuthLoaded] = useAuth();

  const dispatch = useDispatch();
  const state = useSelector((root) => root.boards.board || {});
  stateRef.current = state;

  const redirectToWorkspace = () => {
    console.log("Set redirect");
    if (workspaceIdRef.current) {
      setRedirect(`/workspaces/${workspaceIdRef.current}`)
    } else {
      setRedirect("/workspaces")
    }
  }

  useEffect(() => {
    console.log('A');
    if (!isAuthLoaded) { return }
    if (parseInt(boardId)) {
      console.log("boardId");
      loadBoard(dispatch, parseInt(boardId))
        .catch((err) => {
          console.log("Catch");
          console.log(err);
          redirectToWorkspace();
        });
    } else {
      console.log("No board Id");
      redirectToWorkspace();
    }

    return () => {
      unloadBoard(dispatch);
    };
  }, [boardId, dispatch, isAuthLoaded]);

  useEffect(() => {
    if (state.workspaceId) {
      workspaceIdRef.current = state.workspaceId
    }
  }, [state.workspaceId]);

  useEffect(() => {
    if (state.state === "removed") {
      redirectToWorkspace();
    }
  }, [state.state])

  useEffect(() => {
    if (
      typeof (setDisplaySelectorDefaultBackgroundColor.current) === "function" &&
      stateRef.current.defaultNoteBackgroundColor != null
    ) {
      setDisplaySelectorDefaultBackgroundColor.current(
        stateRef.current.defaultNoteBackgroundColor
      );
    }
  }, [state.defaultNoteBackgroundColor]);

  useEffect(() => {
    if (
      typeof (setDisplaySelectorBackgroundColor.current) === "function" &&
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
      "menu-extended", menuDiv.current.getAttribute("menu-extended") !== "true"
    );
  };

  const onDeleteClick = () => {
    confirmationAlert({
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
              toastAlerts({
                title: "Error!",
                text: response.error,
                icon: "error"
              })
            }
            redirectToWorkspace();
          })
          .catch((err) => toastAlerts({
            title: "Error!",
            text: err.message,
            icon: "error"
          }));
      }
    });
  };

  const onTitleChangeClick = () => {
    formAlert({
      title: "Change board title",
      text: "What do you want to change the board title to?",
      validator: yup.object().shape({
        title: boardSchema.fields.title
      }),
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: stateRef.current.title,
          placeholder: stateRef.current.title,
        }
      ],
      acceptButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.confirmed) {
        setBoardTitle(result.values.title);
      }
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
                alt=""
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
                alt=""
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
