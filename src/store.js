import { createStore } from 'redux';
import rootReducer from './api';

const store = createStore(rootReducer);
export default store;