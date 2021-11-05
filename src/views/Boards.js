import React, { Component } from 'react';
import { PinBoardItem, PinBoardItemButton } from "../components/BoardElements";
import "../assets/scss/views/Boards.scss"

export default class Boards extends Component {
    
    constructor(props) {
        super(props)
        document.title = "Pinnote - Boards";

        this.state = {
            boards: []
        }
    }

    createBoard = function() {
        this.state.boards.push({
            title: this.state.boards.length,
            background_color: [
                128,
                128,
                128 
            ]
        })
        this.setState({
            ...this.state
        })
    }.bind(this)

    render() {
        let boards = [];
        for (let index = 0; index < this.state.boards.length; index++) {
            const element = this.state.boards[index];
            boards.push(<PinBoardItem key={index} title={element.title} background_color={element.background_color} />)
        }

        return (
            <div className="page-container">
                <div className="BoardGrid">
                    {boards}
                    <PinBoardItemButton onClick={this.createBoard} />
                </div>
            </div>
        );
    }

}