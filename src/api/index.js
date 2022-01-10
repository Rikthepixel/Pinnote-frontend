import { combineReducers } from "redux";
import BoardReducer from "./Boards/BoardReducer";
import WorkspaceReducer from "./Workspaces/WorkspaceReducer";
import InviteReducer from "./Invites/Reducer";
import AuthReducer from "./Authentication/Reducer";
import PermissionReducer from "./Permission/Reducer";

let rootReducer = combineReducers({
    boards: BoardReducer,
    workspaces: WorkspaceReducer,
    invites: InviteReducer,
    auth: AuthReducer,
    permissions: PermissionReducer
});

export * from "./Boards/BoardActions";
export * from "./Workspaces/WorkspaceActions";
export * from "./Authentication/AuthenticationActions";
export * from "./Invites/Actions";
export * from "./Permission/Actions";

export default rootReducer;
