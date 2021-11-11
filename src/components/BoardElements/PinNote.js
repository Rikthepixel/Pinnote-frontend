import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getContrastingColor, rgbaToHsva } from '@uiw/color-convert'
import Popup from "reactjs-popup";

import MakeWriteable from "../MakeWriteable";
import { DropdownButton, ButtonGroup, Dropdown, Button } from "react-bootstrap";
import { updatePinNote, deletePinNote } from "../../api";
import ColorSelectorButton from "../ColorSelectorButton";

import MoreIcon from "../../assets/img/icons/MoreIcon.svg";
import BrushIcon from "../../assets/img/icons/BrushIcon.svg";

//Styling
import "../../assets/scss/components/BoardElements/PinNote.scss";

function disableSelect(e) {
  e.preventDefault();
}

function PinNote(props) {
  const dispatch = useDispatch();
  const HeaderRef = useRef();
  const NoteDiv = useRef();

  let offset = {
    x: null,
    y: null
  };

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

  function onDelete() {
    dispatch(deletePinNote(props.boardId, props.noteId))
  }

  let setColorDisplay = null;
  function updateColor(color, save) {
    dispatch(updatePinNote(props.boardId, props.noteId, save ?
      { background_color: color } :
      { draft_background_color: color }
    ))
  }

  function disableDrag() {
    HeaderRef.current.onmousedown = null;
  };

  function enableDrag() {
    HeaderRef.current.onmousedown = function (e) {
      let Rect = NoteDiv.current.getBoundingClientRect();
      let handle = {
        x: e.clientX - Rect.x,
        y: e.clientY - Rect.y,
      };

      window.addEventListener("selectstart", disableSelect);
      document.onmousemove = function (e) {
        dispatch(updatePinNote(props.boardId, props.noteId, {
          position: {
            x: e.pageX - offset.x - handle.x - (e.pageX - e.clientX),
            y: e.pageY - offset.y - handle.y - (e.pageX - e.clientX),
          }
        }));
      };

      document.onmouseup = function (e) {
        document.onmouseup = null;
        document.onmousemove = null;
        window.removeEventListener("selectstart", disableSelect);
      };
    };
  };

  function onUnWriteable(element) {
    dispatch(updatePinNote(props.boardId, props.noteId, {
      title: element.textContent
    }))
    enableDrag()
  }

  useEffect(() => {
    let Rect = NoteDiv.current.getBoundingClientRect();
    offset = {
      x: Rect.x - state.position.x,
      y: Rect.y - state.position.y,
    };
  }, [state.position]) //Update offset, if size or position of parent changes, offset changes

  useEffect(() => {
    enableDrag()
  }, []) //Initial drag enable

  return (
    <div
      className="pinNote"
      ref={NoteDiv}
      style={{
        backgroundColor:
          `rgb(${state.draft_background_color ? state.draft_background_color.join() : state.background_color.join()})`,
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
            color: `${getContrastingColor(rgbaToHsva({
              r: state.background_color[0],
              g: state.background_color[1],
              b: state.background_color[2]
            }))}`
          }}
        >
          <MakeWriteable
            parentRef={HeaderRef}
            editStyle={{
              backgroundColor: "#FFF",
              color: "black"
            }}
            onWriteable={disableDrag}
            onUnWriteable={onUnWriteable}
          />
          {state.title}
        </div>

        <Popup
          trigger={() => (
            <button className="pinNote-Header-Action">
              <img
                src={MoreIcon}
                placeholder="..."
              />
            </button>
          )}
          onClose={() => {
            if (typeof(setColorDisplay) == "function") {
              setColorDisplay(state.background_color);
              updateColor(null, false);
            }
          }}
          position="right top"
          closeOnDocumentClick
          className="primairy"
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
          <Button className="w-100" variant="danger" onClick={function () { onDelete(state.noteId) }}> Delete </Button>
        </Popup>
      </div>
      <div className="pinNote-Content">
        <textarea
          className="pinNote-TextContent"
          defaultValue={state.text}
          style={{
            color: `${getContrastingColor(rgbaToHsva({
              r: state.background_color[0],
              g: state.background_color[1],
              b: state.background_color[2]
            }))}`
          }}
        ></textarea>
      </div>
    </div >
  );
}

export default PinNote