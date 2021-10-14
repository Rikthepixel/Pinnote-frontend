import React, { Component } from 'react';
import BoardItem from "../components/BoardItem";

import "./Boards.css"

export default class Boards extends Component {
    componentDidMount() {
        document.title = "Pinnote - Boards";
    }

    render() {

        return (
            <div>
                <div className="BoardGrid">
                    <BoardItem />
                    <BoardItem />
                    <BoardItem />
                    <BoardItem />
                </div>
            </div>
        );
    }
}