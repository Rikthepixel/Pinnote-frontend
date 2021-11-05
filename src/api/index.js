import { combineReducers } from 'redux';
import BoardReducer from './Boards/BoardReducer';

let rootReducer = combineReducers({
    boards: BoardReducer,
});

export * from './Boards/BoardActions';
export default rootReducer;