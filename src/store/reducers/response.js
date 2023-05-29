import { GET_RESPONSE, GET_TIMEZONE, TERMS_OF_SERVICE } from '../actions/types';
const INIT_STATE = {
}

export default function (state, action) {
  if (typeof state === 'undefined') {
    return INIT_STATE;
  }

  switch (action.type) {
    case GET_RESPONSE:
      return action.payload;
    case GET_TIMEZONE:
      return action.payload;
    case TERMS_OF_SERVICE:
      return action.payload;
    default:
      return state;
  }
}
