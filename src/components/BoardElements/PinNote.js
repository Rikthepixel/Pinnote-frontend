import React, { useState, createRef, Component } from "react";
import MakeWriteable from "../MakeWriteable";

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
      positionX: e.pageX - offset.x - (e.pageX - e.clientX) - handle.x,
      positionY: e.pageY - offset.y - (e.pageY - e.clientY) - handle.y,
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
    let data = props.data || {}
    data.color = data.color || {};
    data.position = data.position || {};
    data.size = data.size || {};

    this.state = {
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
      notePressed.call(this, e, this.NoteDiv, this.state, this.setState);
    }.bind(this);
  }.bind(this);

  componentDidMount() {
    this.HeaderRef.current.onmousedown = function (e) {
      notePressed.call(this, e, this.NoteDiv, this.state, this.setState);
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
          left: state.positionX,
          top: state.positionY,
        }}
      >
        <div className="pinNote-Header" ref={this.HeaderRef}>
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
        <div className="pinNote-Content">
          <div className="pinNote-TextContent" contenteditable="true">
            {state.text}
          </div>
        </div>
      </div>
    );
  }
}
