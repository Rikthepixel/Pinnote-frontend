import React, { useState, useRef, useEffect } from "react";
import PinNote from './PinNote';

export function PinBoard(props) {
    const [state, setState] = useState({
        Notes: props.Notes || []
    })

    useEffect(function() {
        let NoteButton = props.newNoteButton || {}
        if (NoteButton.current) {
            NoteButton.current.addEventListener("click", function(e) {

                let onClick = function(e) {
                    let boardElement = boardRef.current;
                    state.Notes.push({
                        position: {
                            x: e.layerX + boardElement.scrollLeft,
                            y: e.layerY + boardElement.scrollTop
                        },
                        title: "",
                        text: "",
                    })
        
                    setState({
                        ...state,
                    })

                    boardRef.current.removeEventListener("click", onClick)
                }

                boardRef.current.addEventListener("click", onClick)
            })
        }
    }, [])
    
    const boardRef = useRef();
    const BoardNotes = []
    for (var i = 0; i < state.Notes.length; i++) {
        BoardNotes[i] = <PinNote key={i} data={state.Notes[i]} />;
    }

    return <div ref={boardRef} className="PinBoard">{BoardNotes}</div>;
}
