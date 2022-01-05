import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Popover, OverlayTrigger } from "react-bootstrap";

import { getContrastingColor, rgbaToHsva } from '@uiw/color-convert'

import MakeWriteable from "../MakeWriteable";

import { deletePinNote, setNoteColor, setNotePosition, setNoteText, setNoteTitle } from "../../api";
import ColorSelectorButton from "../ColorSelectorButton";

import { MoreIcon, BrushIcon, TrashIcon, EditIcon } from "../../assets/img/icons";
import { noteSchema, validateNote } from "../../api/Boards/BoardValidators";
import * as yup from "yup";
import { FormAlert } from "../../utils/Alerts";
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
  const setColorSelectorDisplay = useRef();
  const stateRef = useRef();
  const setTitleText = useRef();

  const [draftBackgroundColor, setDraftBackgroundColor] = useState();
  const state = useSelector(state => {
    let note = {};
    ((state.boards.board || {}).notes || []).every((_note) => {
      if (parseInt(_note.id) === parseInt(props.noteId)) {
        note = _note
        return false;
      }
      return true;
    })
    return note;
  })
  stateRef.current = state


  const updateTitle = (title = "", validate) => {
    let errors = {};
    if (title == null) { title = "" }
    title = title.trim();

    if (validate) {
      errors = validateNote({ title: title })
    } else {
      errors = setNoteTitle(props.noteId, title);
    }
    return errors.title || []
  }

  useEffect(() => {
    setTitleText.current(stateRef.current.title);
  }, [stateRef.current.title])

  const onTitleChangeClick = () => {
    FormAlert({
      title: "Change note title",
      text: "What do you want to change the note title to?",
      validator: yup.object().shape({
        title: noteSchema.fields.title
      }),
      inputs: [
        {
          name: "title",
          type: "text",
          value: stateRef.current.title,
          placeholder: stateRef.current.title,
        }
      ],
      acceptButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then(result => {
      if (result.confirmed) {
        updateTitle(result.values.title);
        return
      }
    })
  }

  const disableDrag = () => {
    HeaderRef.current.onmousedown = null;
  };

  const enableDrag = () => {
    HeaderRef.current.onmousedown = function (e) {
      let Rect = NoteDiv.current.getBoundingClientRect();
      let handleX = e.clientX - Rect.x
      let handleY = e.clientY - Rect.y
      window.addEventListener("selectstart", disableSelect);
      document.onmousemove = function (e) {
        const state = stateRef.current
        let Rect = NoteDiv.current.getBoundingClientRect();
        let newPositionX = e.pageX - handleX - (Rect.x - state.positionX) - (e.pageX - e.clientX)
        let newPositionY = e.pageY - handleY - (Rect.y - state.positionY) - (e.pageX - e.clientX)

        let [movementOffsetX, movementOffsetY] = [0, 0];
        let setOffset = (x, y) => {
          movementOffsetX = x;
          movementOffsetY = y;
        }

        if (typeof (props.onMove) == "function") {
          props.onMove({
            x: newPositionX,
            y: newPositionY
          }, {
            x: state.positionX,
            y: state.positionY
          },
            state.width || 200,
            state.height || 200,
            setOffset
          )
        }

        setNotePosition(
          dispatch,
          props.noteId,
          newPositionX + movementOffsetX,
          newPositionY + movementOffsetY
        );
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

  let displayColor = draftBackgroundColor ? draftBackgroundColor : state.backgroundColor
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
        width: `${state.width || 200}px`,
        height: `${state.height || 200}px`,
        left: state.positionX - (state.width || 200) / 2,
        top: state.positionY - (state.height || 200) / 2,
      }}
    >
      <div className="pinNote-Header">
        <div
          className="pinNote-Header-Title"
          ref={HeaderRef}
          style={{ color: contrastColor }}
        >
          <MakeWriteable
            parentRef={HeaderRef}
            editStyle={{ backgroundColor: "#FFF", color: "black" }}
            onMount={(setText) => setTitleText.current = setText}
            onWriteable={disableDrag}
            onUnWriteable={(text, setText) => {
              let errors = setNoteTitle(props.noteId, text)
              if (errors.title) { setText(stateRef.current.title) }
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
            if (!shown && typeof (setColorSelectorDisplay.current) == "function") {
              setColorSelectorDisplay.current(state.backgroundColor);
              setDraftBackgroundColor(null);
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
                    alt=""
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
                onOpen={(setColor) => { setColorSelectorDisplay.current = setColor }}
                onCancel={(_, setDisplayColor) => {
                  setDisplayColor(state.backgroundColor);
                  setDraftBackgroundColor(null);
                }}
                onChange={color => setDraftBackgroundColor(color)}
                onSave={color => {
                  setDraftBackgroundColor(null);
                  setNoteColor(props.noteId, color[0], color[1], color[2]);
                }}
              />
              <Dropdown.Divider className="m-0 w-100" />
              <Button
                className="w-100"
                variant="danger"
                onClick={() => deletePinNote(props.noteId)}
              >
                <img
                  className="me-1" src={TrashIcon} alt=""
                  style={{ filter: "invert(100%)", aspectRatio: "1", height: "1.2rem" }}
                />
                Delete note
              </Button>
            </MovingPopover>
          }
        >
          <button className="pinNote-Header-Action">
            <img
              src={MoreIcon} alt="..."
              style={{ filter: contrastColor === "#fff" && "invert(100%)" }}
            />
          </button>
        </OverlayTrigger>
      </div>
      <div className="pinNote-Content">
        <textarea
          className="pinNote-TextContent"
          value={state.text || ""}
          style={{ color: contrastColor }}
          onChange={(e) => setNoteText(props.noteId, e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default PinNote