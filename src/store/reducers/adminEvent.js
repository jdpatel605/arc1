import { adminEventTypes } from '../actions/types';

const defaultState = {
  adminEventList: [],
  adminEventPageInfo: [],
  loadingAdmEvt: false,
  admEvtListloading: false,
  visibilitySuccess: [],
  visibilityError: [],
  loadingKick: false,
  kickUserSuccess: [],
  kickUserFail: {},
  kickFlag: 0,
}

export default (state, { type, payload }) => {
  if (typeof state === 'undefined') {
    return defaultState;
  }

  switch (type) {
    // Get event list list
    case adminEventTypes.ADM_EVT_LIST_REQUEST:
      return { ...state, loadingAdmEvt: true, admEvtListloading: true };
    case adminEventTypes.ADM_EVT_LIST_SUCCESS:
      if (payload.page_number === 1) {
        state.adminEventList = [];
      }
      return {
        ...state,
        loadingAdmEvt: false,
        admEvtListloading: false,
        adminEventList: state.adminEventList.concat(payload.entries),
        adminEventPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case adminEventTypes.ADM_EVT_LIST_UPDATE:
      return { ...state, adminEventList: payload };
    case adminEventTypes.ADM_EVT_LIST_FAILED:
      return { ...state, loadingAdmEvt: false, adminEventList: [], admEvtListloading: false, errorMessage: payload.message };
    case adminEventTypes.ADM_EVT_LIST_RESET:
      return { ...state, loadingAdmEvt: false, adminEventList: [], admEvtListloading: false };

    // change visibility
    case adminEventTypes.EVT_CHANGE_VISIBILITY_REQUEST: {
      return { ...state, loadingAdmEvt: true, visibilitySuccess: [], visibilityError: [] };
    }
    case adminEventTypes.EVT_CHANGE_VISIBILITY_SUCCESS: {
      return { ...state, loadingAdmEvt: false, visibilitySuccess: payload, visibilityError: [] };
    }
    case adminEventTypes.EVT_CHANGE_VISIBILITY_FAILED: {
      return { ...state, loadingAdmEvt: false, visibilitySuccess: [], visibilityError: payload };
    }

    // Remove user from group
    case adminEventTypes.KICK_USER_FROM_EVENT_REQUEST: {
      return { ...state, loadingAdmEvt: true, loadingKick: true, kickFlag: 0, kickUserSuccess: [] };
    }
    case adminEventTypes.KICK_USER_FROM_EVENT_SUCCESS: {
      return { ...state, loadingAdmEvt: false, loadingKick: false, kickFlag: 1, kickUserSuccess: payload };
    }
    case adminEventTypes.KICK_USER_FROM_EVENT_FAILED: {
      return { ...state, loadingAdmEvt: false, loadingKick: false, kickFlag: 0, kickUserFail: payload };
    }
    case adminEventTypes.KICK_USER_FROM_EVENT_RESET: {
      return { ...state, loadingAdmEvt: false, loadingKick: false, kickFlag: 0, kickUserSuccess: [], kickUserFail: {} };
    }

    default:
      return state;
  }
}
