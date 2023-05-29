import {GET_ERRORS} from '../actions/types';
const INIT_STATE = {}

export default function (state, action) {
  if(typeof state === 'undefined') {
    return INIT_STATE;
  }
  switch(action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
