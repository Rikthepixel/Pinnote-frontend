import { workspaceDTOtoWorkspace, boardDTOtoBoard } from "../DtoHelpers";
import { FormAlert } from "../../utils/Alerts";
import { createBoardSchema } from "../Boards/BoardValidators";
import superagent from "superagent";

const url = process.env.REACT_APP_BACKEND_URL;
const prefabBackgroundColors = [
    [180, 84, 84],
    [84, 136, 180],
    [180, 76, 198],
    [160, 222, 159],
    [243, 232, 204],
    [148, 219, 233]
]

const prefabNoteColors = [
    [207, 38, 38],
    [207, 197, 38],
    [67, 217, 51],
    [14, 123, 209],
    [12, 10, 177],
    [177, 10, 166],
    [222, 56, 117],
    [192, 11, 69]
]


export const fetchMyWorkspaces = (dispatch) => {
    return new Promise((resolve, reject) => {
        superagent.get(`${url}/api/workspaces/`)
            .then((response) => {
                const boards = response.body.map(workspaceDto => workspaceDTOtoWorkspace(workspaceDto));
                dispatch({
                    type: "WORKSPACES_FETCHED",
                    payload: boards
                });
                resolve(boards);
            }, reject);
    })
}


export const fetchWorkspace = (dispatch, id) => {
    return new Promise((resolve, reject) => {
        superagent.get(`${url}/api/workspaces/${id}`)
            .then((response) => {
                dispatch({
                    type: "WORKSPACE_FETCHED",
                    payload: workspaceDTOtoWorkspace(response.body)
                });
                resolve(response.body);
            }, reject);
    })
}

export const createBoardInWorkspace = (dispatch, workspaceId, title, backgroundColor, noteColor) => {
    return new Promise((resolve, reject) => {
        if (typeof (workspaceId) != 'number') {
            return;
        }
        superagent.post(`${url}/api/workspaces/${workspaceId}/Boards`)
            .send({
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
                const board = boardDTOtoBoard(response.body);
                dispatch({
                    type: "CREATE_BOARD_IN_WORKSPACE",
                    payload: board,
                });
                resolve(board);
            }, reject);
    })
};


export const createBoardInWorkspacePopup = (dispatch, workspaceId) => {
    FormAlert({
        validator: createBoardSchema,
        title: "Create a board",

        acceptButtonText: "Create board!",
        cancelButtonText: "Cancel",

        showCancelButton: true,
        inputs: [
            {
                type: "title",
                title: "Title"
            },
            {
                name: "Title",
                type: "text",
                value: "",
                placeholder: "board title",
                className: "mb-4"
            },
            {
                type: "page"
            },
            {
                type: "title",
                title: "Colors"
            },
            {
                name: "BackgroundColor",
                buttonText: "Background color",
                type: "colorButton",
                value: prefabBackgroundColors[(Math.floor(Math.random() * prefabBackgroundColors.length))]
            },
            {
                name: "DefaultNoteColor",
                buttonText: "Default note color",
                type: "colorButton",
                value: prefabNoteColors[(Math.floor(Math.random() * prefabNoteColors.length))]
            }
        ]
    }).then((result) => {
        if (result.confirmed) {
            createBoardInWorkspace(dispatch, workspaceId, result.values.Title, result.values.BackgroundColor, result.values.DefaultNoteColor);
        }
    })
}

export const setWorkspaceName = (dispatch, workspaceId, newName) => {
    return new Promise((resolve, reject) => {
        if (typeof (workspaceId) != 'number') {
            return;
        }
        superagent.patch(`${url}/api/workspaces/${workspaceId}/name`)
            .send({
                name: newName
            })
            .then(response => {
                console.log(response);
                if (response.error) { reject(response.error) }
                dispatch({
                    type: "UPDATE_WORKSPACE",
                    payload: {
                        workspaceId: workspaceId,
                        changes: {
                            name: newName
                        }
                    },
                });

                resolve(response);
            }, reject)
    })
}