import React, { useState, useRef } from 'react';

export function PinBoard(props) {
    return (
        <div className="PinBoard">
            {props.children}
        </div>
    )
}