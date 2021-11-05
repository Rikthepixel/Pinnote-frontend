import React, { createRef, Component } from "react";
import { PinBoard, PinNoteToolbar } from "../components/BoardElements";
import MakeWriteable from "../components/MakeWriteable";
import { Button } from "react-bootstrap";
import "reactjs-popup/dist/index.css";
import "../assets/scss/views/Board.scss";

export default class Board extends Component {
  constructor(props) {
    super(props)
    document.title = "Pinnote - Board";

    this.state = {
      title: "My board",
      notes: [
        {
          noteId: Math.random(1, 99999),
          title: "aa",
          text: "Some text",
          position: {
            x: 200,
            y: 300,
          },
        },
        {
          noteId: Math.random(1, 99999),
          title: "bb",
          text: "MORE TEXT",
        },
      ],
    }

    this.toolbarTitleRef = createRef();
    this.newNoteButton = createRef();
  }

  updateTitle = function(div) {
    this.setState({
      ...this.state,
      title: div.textContent
    })
  }.bind(this)

  render() {
    return (
      <div className="page-container">
        <PinNoteToolbar>
          <div className="me-auto">
            <div className="pinBoard-Toolbar-Title" ref={this.toolbarTitleRef}>
              <MakeWriteable
                parentRef={this.toolbarTitleRef}
                editStyle={{
                  backgroundColor: "#FFF",
                }}
                onUnWriteable={this.updateTitle}
              />
              {this.state.title}
            </div>
          </div>
          <Button ref={this.newNoteButton}>+ Note</Button>
        </PinNoteToolbar>
        <PinBoard Notes={this.state.notes} newNoteButton={this.newNoteButton} />
      </div>
    );
  }
  
}
