import { workspaceDTOtoWorkspace, boardDTOtoBoard } from "../DtoHelpers";
import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

export const fetchMyWorkspaces = (dispatch) => {
    axios.get(`${url}/api/workspaces/`)
        .then((response) => {
            dispatch({
                type: "WORKSPACES_FETCHED",
                payload: response.data.map(workspaceDto => workspaceDTOtoWorkspace(workspaceDto))
            });
        })
        .catch((err) => {
            console.error(err);
        })
}

export const createBoardInWorkspace = (dispatch, workspaceId, title, backgroundColor, noteColor) => {
    if (typeof(workspaceId) != 'number') {
        return;
    }
    axios.post(`${url}/api/workspaces/${workspaceId}/Boards`, {
        title: title,
        backgroundColorR: backgroundColor[0],
        backgroundColorG: backgroundColor[1],
        backgroundColorB: backgroundColor[2],
        defaultNoteColorR: noteColor[0],
        defaultNoteColorG: noteColor[1],
        defaultNoteColorB: noteColor[2],
        visibilityId: 1
    })
    .then((response) => {
        dispatch({
            type: "CREATE_BOARD_IN_WORKSPACE",
            payload: boardDTOtoBoard(response.data),
        });
    })
    .catch((err) => {
        console.error(err);
    })
};