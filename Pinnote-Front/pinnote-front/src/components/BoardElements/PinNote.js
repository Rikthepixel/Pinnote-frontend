import React, { useState, createRef, Component } from "react";
import MakeWriteable from "../MakeWriteable";

function disableSelect(e) {
  e.preventDefault();
}

function notePressed(e, target) {
console.log(this)
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

export class PinNote extends Component {
  constructor(props) {
    super(props);
    props.data.color = props.data.color || {};
    props.data.position = props.data.position || {};
    props.data.size = props.data.size || {};

    this.state = {
        colorR: props.data.color.R || defaultState.colorR,
        colorG: props.data.color.G || defaultState.colorG,
        colorB: props.data.color.B || defaultState.colorB,
        positionX: props.data.position.x || defaultState.positionX,
        positionY: props.data.position.y || defaultState.positionY,
        width: props.data.size.width || defaultState.width,
        height: props.data.size.height || defaultState.height,
        title: props.data.title || defaultState.title,
        text: props.data.text || defaultState.text,
    };

    this.HeaderRef = createRef();
    this.NoteDiv = createRef();

  }

  disableDrag() {
    this.HeaderRef.current.onmousedown = null;
  };
  enableDrag() {
    this.HeaderRef.current.onmousedown = function (e) {
      notePressed.call(this, e, this.NoteDiv, this.state, this.setState);
    }.bind(this);
  };

  componentDidMount() {
    this.HeaderRef.current.onmousedown = function(e) {
        notePressed.call(this, e, this.NoteDiv, this.state, this.setState);
    }.bind(this);
  }
    
  render() {
    let state = this.state

    return (
      <div
        className="PinNote"
        ref={this.NoteDiv}
        style={{
          backgroundColor: "rgb(" + [state.colorR, state.colorG, state.colorB].join() + ")",
          width: state.width,
          height: state.height,
          left: state.positionX,
          top: state.positionY,
        }}
      >
        <div className="PinNoteHeader" ref={this.HeaderRef}>
          <MakeWriteable parentRef={this.HeaderRef} editStyle={{ backgroundColor: "#FFF" }} onWriteable={this.disableDrag} onUnWriteable={this.enableDrag}/>
          {state.title}
        </div>
        <div className="PinNoteContent">
          <div className="PinNoteTextContent">{state.text}</div>
        </div>
      </div>
    );
  }
}
