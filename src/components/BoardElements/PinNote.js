import React, { useRef, useEffect, Fragment, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Popover, OverlayTrigger } from "react-bootstrap";

import { getContrastingColor, rgbaToHsva } from '@uiw/color-convert'

import MakeWriteable from "../MakeWriteable";

import { updatePinNote, deletePinNote } from "../../api";
import ColorSelectorButton from "../ColorSelectorButton";

import { MoreIcon, BrushIcon, TrashIcon, EditIcon } from "../../assets/img/icons";
import { noteSchema, validateNote } from "../../api/Boards/BoardValidators";
import { SingleFormAlert } from "../../utils/Alerts";
//Styling
import "../../assets/scss/components/BoardElements/PinNote.scss";

function disableSelect(e) {
  e.preventDefault();
}

const MovingPopover = React.forwardRef(
  ({ popper, children, show: _, ...props }, ref) => {
    useEffect(() => {
      popper.scheduleUpdate();
    }, [children, popper]);

    return (
      <Popover ref={ref} {...props}>
        {children}
      </Popover>
    );
  },
);

const PinNote = (props) => {
  const dispatch = useDispatch();
  const HeaderRef = useRef();
  const NoteDiv = useRef();
  const offsetRef = useRef({
    x: null,
    y: null
  });
  const stateRef = useRef();

  const state = useSelector(state => {
    let note = {};
    ((state.boards.board || {}).notes || []).every((_note) => {
      if (_note.id == props.noteId) {
        note = _note
        return false;
      }
      return true;
    })
    return note;
  })
  stateRef.current = state

  const positionRef = useRef(state.position)

  const onDelete = () => {
    deletePinNote(dispatch, props.noteId)
  }

  const updateTitle = (title = "", validate) => {
    let errors = {}
    title = title.trim()

    if (validate) {
      errors = validateNote({ title: title })
    } else {
      errors = updatePinNote(dispatch, props.noteId, { title: title });
    }
    return errors.title || []
  }

  const onTitleChangeClick = () => {
    SingleFormAlert({
      title: "Change note title",
      text: "What do you want to change the note title to?",
      inputPlaceholder: state.title,
      inputValue: state.title,
      acceptButtonText: "Confirm",
      cancelButtonText: "Cancel",
      validate: value => {
        let result = { isValid: true, value: value, error: "" }
        let errors = updateTitle(value, true)
        if (errors.length != 0) {
          result.isValid = false
          result.error = errors[0]
          if (value.length > 100) {
            result.value = value.substring(0, 100)
          }
        }
        return result;
      },
    }).then(result => {
      if (result.confirmed) {
        updateTitle(result.value);
        return
      }
      updateTitle(stateRef.current.title);
    })
  }

  let setColorDisplay = null;
  const updateColor = (color, save) => {
    updatePinNote(dispatch, props.noteId,
      save ? { backgroundColor: color } : { draftBackgroundColor: color }
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
        const state = stateRef.current
        let Rect = NoteDiv.current.getBoundingClientRect();
        let newPosition = {
          x: e.pageX - (Rect.x - state.position.x) - handle.x - (e.pageX - e.clientX),
          y: e.pageY - (Rect.y - state.position.y) - handle.y - (e.pageX - e.clientX),
        }

        let movementOffset = {
          x: 0,
          y: 0
        }
        let setOffset = (x, y) => {
          movementOffset.x = x;
          movementOffset.y = y;
        }        

        if (typeof (props.onMove) == "function") {
          props.onMove(newPosition, state.position, state.width, state.height, setOffset)
        }

        updatePinNote(dispatch, props.noteId, {
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
    enableDrag()
    if (typeof (props.onMount) == "function") {
      props.onMount(state.position, state.width, state.height)
    }
  }, []) //Initial drag enable

  let displayColor = state.draftBackgroundColor ? state.draftBackgroundColor : state.backgroundColor
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
            onUnWriteable={(text, setText) => {
              let errors = updatePinNote(dispatch, props.noteId, {
                title: text
              })
              if (errors.title) { setText(state.title) }
              enableDrag();
            }}
          />
          {state.title}
        </div>

        <OverlayTrigger
          trigger="click"
          placement="right-start"
          rootClose
          onToggle={(shown) => {
            if (!shown) {
              if (typeof (setColorDisplay) == "function") {
                setColorDisplay(state.backgroundColor);
                updateColor(null, false);
              }
              return
            }
          }}
          overlay={
            <MovingPopover
              className="p-2 d-flex align-items-center justify-content-center flex-column gap-2"
            >
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
                className="w-100 p-0"
                selectorClassName="p-1 pb-2"
                text="Change color"
                icon={BrushIcon}
                color={state.backgroundColor}
                onOpen={(setDisplayColor) => {
                  setColorDisplay = setDisplayColor
                }}
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
              <Dropdown.Divider className="m-0 w-100" />
              <Button
                className="w-100"
                variant="danger"
                onClick={onDelete}
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
            </MovingPopover>
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