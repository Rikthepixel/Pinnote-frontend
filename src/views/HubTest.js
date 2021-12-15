import React, { useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const HubTest = () => {
    const connection = useRef();
    useEffect(() => {
        let conn = new HubConnectionBuilder()
            .withUrl("/boardHub")
            .build();

        conn.on("SubscribeAccepted", (board) => {
            console.log(board);
        })

        conn.start()
            .then(() => {
                conn.invoke("Subscribe", 2)
            })
            .catch((err) => {
                console.log(err);
            });

        connection.current = conn
    }, [])

    return (
        <div>

        </div>
    )
}
export default HubTest;