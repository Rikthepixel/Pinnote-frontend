import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Workspace = (props) => {
    const { workspaceId } = useParams();
    const state = useSelector(state => state.workspaces.workspace || {})
    
    useEffect(() => {
        
    }, [])

    document.title = `Pinnote - ${state.name || "Workspace"}`;
    return (
        <div className="w-100 d-flex justify-content-center">
            <div className="m-4 p-4">
                <h1>{state.name}</h1>
            </div>
        </div>
    );
};
export default Workspace;