import React, { useRef, useEffect, Fragment, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Popover, OverlayTrigger } from "react-bootstrap";

import { getContrastingColor, rgbaToHsva } from '@uiw/color-convert'

import MakeWriteable from "../MakeWriteable";

import { updatePinNote, deletePinNote } from "../../api";
import ColorSelectorButton from "../ColorSelectorButton";

import MoreIcon from "../../assets/img/icons/MoreIcon.svg";
import BrushIcon from "../../assets/img/icons/BrushIcon.svg";
import TrashIcon from "../../assets/img/icons/TrashIcon.svg";

//Styling
import "../../assets/scss/components/BoardElements/PinNote.scss";

function disableSelect(e) {
  e.preventDefault();
}

const PinNote = (props) => {
  const dispatch = useDispatch();
  const HeaderRef = useRef();
  const NoteDiv = useRef();

  const offsetRef = useRef({
    x: null,
    y: null
  });

  const state = useSelector(state => {
    let note = null;
    state.boards.boards.every(_board => {
      if (props.boardId != _board.boardId) {
        return true;
      }

      _board.notes.every(_note => {
        if (props.noteId != _note.noteId) {
          return true;
        }

        note = _note;
        return false;
      })

      return false;
    })
    return note;
  })

  const positionRef = useRef(state.position)

  const onDelete = () => {
    deletePinNote(dispatch, props.boardId, props.noteId)
  }

  let setColorDisplay = null;
  const updateColor = (color, save) => {
    updatePinNote(dispatch, props.boardId, props.noteId,
      save ? { background_color: color } : { draft_background_color: color }
    )
  }

  const disableDrag = () => {
    HeaderRef.current.onmousedown = null;
  };

  const enableDrag = () => {
    HeaderRef.current.onmousedown = function (e) {
      let Rect = NoteDiv.current.getBoundingClientRect();
      let handle = {
        x: e.clientX - Rect.x,
        y: e.clientY - Rect.y,
      };

      window.addEventListener("selectstart", disableSelect);
      document.onmousemove = function (e) {
        let movementOffset = {
          x: 0,
          y: 0
        }

        let newPosition = {
          x: e.pageX - offsetRef.current.x - handle.x - (e.pageX - e.clientX),
          y: e.pageY - offsetRef.current.y - handle.y - (e.pageX - e.clientX),
        }

        let setOffset = (x, y) => {
          movementOffset.x = x;
          movementOffset.y = y;
        }

        if (typeof (props.onMove) == "function") {
          props.onMove(newPosition, positionRef.current, state.width, state.height, setOffset)
        }

        updatePinNote(dispatch, props.boardId, props.noteId, {
          position: {
            x: newPosition.x + movementOffset.x,
            y: newPosition.y + movementOffset.y
          }
        });
      };

      document.onmouseup = function (e) {
        document.onmouseup = null;
        document.onmousemove = null;
        window.removeEventListener("selectstart", disableSelect);
      };
    };
  };

  useEffect(() => {
    let Rect = NoteDiv.current.getBoundingClientRect();
    positionRef.current = state.position
    offsetRef.current = {
      x: Rect.x - state.position.x,
      y: Rect.y - state.position.y,
    };
  }, [state.position]) //Update offset, if size or position of parent changes, offset changes

  useEffect(() => {
    enableDrag()
    if (typeof (props.onMount) == "function") {
      props.onMount(state.position, state.width, state.height)
    }
  }, []) //Initial drag enable

  let displayColor = state.draft_background_color ? state.draft_background_color : state.background_color
  let contrastColor = getContrastingColor(rgbaToHsva({
    r: displayColor[0],
    g: displayColor[1],
    b: displayColor[2]
  }))

  return (
    <div
      className="pinNote"
      ref={NoteDiv}
      style={{
        backgroundColor: `rgb(${displayColor.join()})`,
        width: `${state.width}px`,
        height: `${state.height}px`,
        left: state.position.x - state.width / 2,
        top: state.position.y - state.height / 2,
      }}
    >
      <div className="pinNote-Header">
        <div
          className="pinNote-Header-Title"
          ref={HeaderRef}
          style={{
            color: contrastColor
          }}
        >
          <MakeWriteable
            parentRef={HeaderRef}
            editStyle={{
              backgroundColor: "#FFF",
              color: "black"
            }}
            onWriteable={disableDrag}
            onUnWriteable={(element) => {
              updatePinNote(dispatch, props.boardId, props.noteId, {
                title: element.textContent
              })
              enableDrag()
            }}
          />
          {state.title}
        </div>

        <OverlayTrigger
          trigger="click"
          placement="right-start"
          onToggle={(shown) => {
            if (!shown) {
              enableDrag();
              if (typeof (setColorDisplay) == "function") {
                setColorDisplay(state.background_color);
                updateColor(null, false);
              }
              return
            }

            disableDrag();
          }}
          overlay={
            <Popover
              className="p-2"
            >
              <ColorSelectorButton
                variant="primary"
                className="w-100 p-0"
                selectorClassName="p-1 pb-2"
                text="Change color"
                icon={BrushIcon}
                color={state.background_color}
                onOpen={(setDisplayColor) => {
                  setColorDisplay = setDisplayColor
                }}
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
              <Dropdown.Divider />
              <Button
                className="w-100"
                variant="danger"
                onClick={function () { onDelete(state.noteId) }}
              >
                <img
                  className="me-1"
                  src={TrashIcon}
                  style={{
                    filter: "invert(100%)",
                    aspectRatio: "1",
                    height: "1.2rem"
                  }}
                />
                Delete note
              </Button>
            </Popover>
          }
        >
          <button className="pinNote-Header-Action">
            <img
              src={MoreIcon}
              alt="..."
              style={{
                filter: contrastColor == "#fff" && "invert(100%)"
              }}
            />
          </button>
        </OverlayTrigger>
      </div>
      <div className="pinNote-Content">
        <textarea
          className="pinNote-TextContent"
          defaultValue={state.text}
          style={{
            color: contrastColor
          }}
        ></textarea>
      </div>
    </div >
  );
}

export default PinNote