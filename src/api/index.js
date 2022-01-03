import { combineReducers } from 'redux';
import BoardReducer from './Boards/BoardReducer';
import WorkspaceReducer from './Workspaces/WorkspaceReducer';

let rootReducer = combineReducers({
    boards: BoardReducer,
    workspaces: WorkspaceReducer
});

export * from './Boards/BoardActions';
export * from './Workspaces/WorkspaceActions';
export * from './Authentication/AuthenticationActions';
export default rootReducer;