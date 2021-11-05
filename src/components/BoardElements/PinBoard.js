import React, { Component } from "react";
import PinNote from "./PinNote";

//Styling
import "../../assets/scss/components/BoardElements/PinBoard.scss";

export class PinBoard extends Component {
  constructor(props) {
    super(props);
    this.boardRef = React.createRef();

    this.NoteButton = props.newNoteButton
    this.state = {
      Notes: props.Notes || [],
    };
  }

  componentDidMount() {
    let NoteButton = this.NoteButton || {};
    if (NoteButton.current) {
      NoteButton.current.addEventListener("click", function (e){
        let boardElement = this.boardRef.current;
        let DomRect = boardElement.getBoundingClientRect();

        this.state.Notes.push({
          noteId: Math.random(1, 99999),
          position: {
            x: DomRect.width / 2 + boardElement.scrollLeft,
            y: DomRect.height / 2 + boardElement.scrollTop,
          },
          title: "",
          text: "",
        });

        this.setState({
          ...this.state,
        });
      }.bind(this));
    }
  }

  onDelete = function(id) {
    let Notes = this.state.Notes;
    for (let index = 0; index < Notes.length; index++) {
        if (Notes[index].noteId == id) {
            Notes.splice(index, 1);
        }
    }

    this.setState({
        ...this.state,
        Notes: Notes,
    });
  }.bind(this);

  render() {
    let onDelete = this.onDelete
    let BoardNotes = [];
    let Notes = this.state.Notes
    for (var i = 0; i < Notes.length; i++) {
      let element = Notes[i];
      BoardNotes[i] = (
        <PinNote key={element.noteId} data={element} onDelete={function(){
            onDelete(element.noteId)
        }} />
      );
    }

    return (
      <div ref={this.boardRef} className="PinBoard">
        {BoardNotes}
      </div>
    );
  }
}