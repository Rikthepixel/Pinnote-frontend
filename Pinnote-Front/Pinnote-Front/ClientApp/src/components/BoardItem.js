import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

//CSS
import "./BoardItem.css";

export default class BoardItem extends Component {

    state = {
        background_image: "",
        background_color: [
            32,
            121,
            199,
        ],
        title: "aaa"
    }

    render() {
        let currentState = this.state;
        let rgb = currentState.background_color;
        let title = currentState.title

        return (
            <div className="BoardItem" style={{ backgroundColor: "rgb(" + rgb.join() + ")" }}>
                <p>
                    { title }
                </p>
            </div>
        );
    }
}