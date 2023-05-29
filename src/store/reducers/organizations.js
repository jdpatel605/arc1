import {SET_USER_ORG_LIST} from "../actions/types";
const initState = {
  loading: false,
  org: {entries: []}
}
const organizations = (state, action) => {
  if(typeof state === 'undefined') {
    return initState;
  }

  switch(action.type) {
    case SET_USER_ORG_LIST:
      return {loading: action.payload.loading, org: action.payload.data, first: action.payload.first};
    default:
      return state;
  }
}
export default organizations;
