import { combineReducers } from 'redux';

import { reduce as CallbackListReducer } from './CallbackListState';

// Register your redux store under a unique namespace
export const namespace = 'callback';

// Combine the reducers
export default combineReducers({
  callbackList: CallbackListReducer,
});