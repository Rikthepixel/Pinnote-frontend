import React, { createRef, Component } from "react";
import MakeWriteable from "../MakeWriteable";
import MoreIcon from "../../img/MoreIcon.svg";
import Popup from "reactjs-popup";
import { DropdownButton, ButtonGroup, Dropdown, Button } from "react-bootstrap";

function disableSelect(e) {
  e.preventDefault();
}

function notePressed(e, target) {
  let DomRect = target.current.getBoundingClientRect();
  let offset = {
    x: DomRect.x - this.state.positionX,
    y: DomRect.y - this.state.positionY,
  };
  let handle = {
    x: e.clientX - DomRect.x,
    y: e.clientY - DomRect.y,
  };

  window.addEventListener("selectstart", disableSelect);
  document.onmousemove = function (e) {
    this.setState({
      ...this.state,
      positionX: e.pageX - offset.x - handle.x - (e.pageX - e.clientX),
      positionY: e.pageY - offset.y - handle.y - (e.pageY - e.clientY),
    });
  }.bind(this);
  document.onmouseup = function (e) {
    document.onmouseup = null;
    document.onmousemove = null;
    window.removeEventListener("selectstart", disableSelect);
  }.bind(this);
}

const defaultState = {
  colorR: 122,
  colorG: 122,
  colorB: 122,
  positionX: 0,
  positionY: 0,
  width: 200,
  height: 200,
  title: "",
  text: "",
};

export default class PinNote extends Component {
  constructor(props) {
    super(props);
    let data = props.data || {};
    data.color = data.color || {};
    data.position = data.position || {};
    data.size = data.size || {};

    this.onDelete = props.onDelete;

    this.state = {

      noteId: data.noteId,
      colorR: data.color.R || defaultState.colorR,
      colorG: data.color.G || defaultState.colorG,
      colorB: data.color.B || defaultState.colorB,
      positionX: data.position.x || defaultState.positionX,
      positionY: data.position.y || defaultState.positionY,
      width: data.size.width || defaultState.width,
      height: data.size.height || defaultState.height,
      title: data.title || defaultState.title,
      text: data.text || defaultState.text,
    };

    this.HeaderRef = createRef();
    this.NoteDiv = createRef();
  }

  disableDrag = function () {
    this.HeaderRef.current.onmousedown = null;
  }.bind(this);

  enableDrag = function () {
    this.HeaderRef.current.onmousedown = function (e) {
      notePressed.call(this, e, this.NoteDiv);
    }.bind(this);
  }.bind(this);

  componentDidMount() {
    this.HeaderRef.current.onmousedown = function (e) {
      notePressed.call(this, e, this.NoteDiv);
    }.bind(this);
  }

  render() {
    let state = this.state;

    return (
      <div
        className="pinNote"
        ref={this.NoteDiv}
        style={{
          backgroundColor:
            "rgb(" + [state.colorR, state.colorG, state.colorB].join() + ")",
          width: state.width,
          height: state.height,
          left: state.positionX - state.width / 2,
          top: state.positionY - state.height / 2,
        }}
      >
        <div className="pinNote-Header">
          <div className="pinNote-Header-Title" ref={this.HeaderRef}>
            <MakeWriteable
              parentRef={this.HeaderRef}
              editStyle={{
                backgroundColor: "#FFF",
              }}
              onWriteable={this.disableDrag}
              onUnWriteable={this.enableDrag}
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
            <button onClick={this.onDelete}> Popup content </button>
            <Dropdown.Divider />
            <Button className="w-100" variant="danger" onClick={this.onDelete}> Delete </Button>
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
}
