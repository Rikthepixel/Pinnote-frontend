import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePinNote, deletePinNote } from "../../api";

import MakeWriteable from "../MakeWriteable";
import MoreIcon from "../../assets/img/icons/MoreIcon.svg";
import Popup from "reactjs-popup";
import { DropdownButton, ButtonGroup, Dropdown, Button } from "react-bootstrap";

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
          `rgb(${state.background_color.join()})`,
        width: `${state.width}px`,
        height: `${state.height}px`,
        left: state.position.x - state.width / 2,
        top: state.position.y - state.height / 2,
      }}
    >
      <div className="pinNote-Header">
        <div className="pinNote-Header-Title" ref={HeaderRef}>
          <MakeWriteable
            parentRef={HeaderRef}
            editStyle={{
              backgroundColor: "#FFF",
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
          position="right top"
          closeOnDocumentClick
          className="primairy"
        >
          <Dropdown.Divider />
          <Button className="w-100" variant="danger" onClick={function () { onDelete(state.noteId) }}> Delete </Button>
        </Popup>
      </div>
      <div className="pinNote-Content">
        <textarea
          className="pinNote-TextContent"
          defaultValue={state.text}
        ></textarea>
      </div>
    </div>
  );
}

export default PinNote