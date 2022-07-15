
import {getScheduledCallback, deleteScheduledCallback, updateScheduledCallback, addScheduledCallback } from '../helpers'

export const CALLBACK_ACTIONS = {
     ADD_CALLBACK : "ADD_CALLBACK",
     GET_CALLBACKS : "GET_CALLBACKS",
     UPDATE_CALLBACK : "UPDATE_CALLBACK",
     DELETE_CALLBACK : "DELETE_CALLBACK",
}

const initialState = {
  callbacks: []
};

export class Actions {
  // static dismissBar = () => ({ type: ACTION_DISMISS_BAR });

  static updateCallback = (callback) => ({
    type: CALLBACK_ACTIONS.UPDATE_CALLBACK,
    payload: callback
  });

  static addCallback = (callback) => {
    
  try {
  // const resp = addScheduledCallback(callback);
   
    return {
    type: CALLBACK_ACTIONS.ADD_CALLBACK,
    payload: callback
  }

    
  } catch (err) {
    console.log(err);
  };
}

  static deleteCallback = (callback) =>
  {
    try {
      const res = deleteScheduledCallback(callback);
      return {
      type: CALLBACK_ACTIONS.DELETE_CALLBACK,
      payload: callback.id
    }
    } catch (err) {
      console.log(err);
    }
  };

  static getCallbacks = (workerSid) =>  {
    try {
      const res = getScheduledCallback(workerSid);
      return {
        type: CALLBACK_ACTIONS.GET_CALLBACKS,
        payload: res
      }
    } catch (err) {
      console.log(err);
    }
  };
}


export function reduce(state = initialState, action) {

 const { type, payload } = action;
 
 switch (type) {

  case `${CALLBACK_ACTIONS.ADD_CALLBACK}`:

    return {
      ...state,
      callbacks: [...state.callbacks, action.payload],
    };

    // case `${CALLBACK_ACTIONS.ADD_CALLBACK}_FULFILLED`:

    //   return {
    //     ...state,
    //     callbacks: [...state.callbacks, action.payload],
    //   };

    case CALLBACK_ACTIONS.GET_CALLBACKS:
      return payload;

    // redux-promise pending state
    case `${CALLBACK_ACTIONS.GET_CALLBACKS}_PENDING`:
      return state;
    // success state:
    case `${CALLBACK_ACTIONS.GET_CALLBACKS}_FULFILLED`:
      return { ...state, callbacks: action.payload };
    // failure state:
    case `${CALLBACK_ACTIONS.GET_CALLBACKS}_REJECTED`:
      return {
        ...state,
        error: action.payload.error,
      };

    case CALLBACK_ACTIONS.UPDATE_CALLBACK:
      return {
        ...state,
        callbacks: state.callbacks.map((callback) => {
          if (callback.id === action.payload.id) {
            return action.payload;
          }
          return callback;
        }),
      };

    case CALLBACK_ACTIONS.DELETE_CALLBACK:
      return {
        ...state,
        callbacks: state.callbacks.filter(
          (callback) => callback.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
