import { combineReducers, } from 'redux';
import instanceReducer from './instanceReducer';
import statusReducer from './statusReducer.js';

export default combineReducers({
  instance: instanceReducer,
  status: statusReducer,
});
