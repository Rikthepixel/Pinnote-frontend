import { combineReducers } from "redux";
import BoardReducer from "./Boards/BoardReducer";
import WorkspaceReducer from "./Workspaces/WorkspaceReducer";
import InviteReducer from "./Invites/Reducer";
import AuthReducer from "./Authentication/Reducer";

let rootReducer = combineReducers({
    boards: BoardReducer,
    workspaces: WorkspaceReducer,
    invites: InviteReducer,
    auth: AuthReducer,
});

export * from "./Boards/BoardActions";
export * from "./Workspaces/WorkspaceActions";
export * from "./Authentication/AuthenticationActions";
export * from "./Invites/Actions";
export default rootReducer;
