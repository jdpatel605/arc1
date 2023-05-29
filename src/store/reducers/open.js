import { openTypes } from '../actions/types';

const defaultState = {
  openLoader: false,
  codeFlagLoading: false,
  codeFlag: 0,
  orgCodeError: {},
  orgCodeSuccess: {},
  seatError: {},
  notifyFlagLoad: false,
  notifyFlag: 0,
};

export default (state, { type, payload }) => {
  if (typeof state === 'undefined') {
    return defaultState;
  }

  switch (type) {

    // Check org code
    case openTypes.CHECK_ORG_CODE_REQUEST:
      return { ...state, openLoader: true, codeFlagLoading: true, codeFlag: 0 };
    case openTypes.CHECK_ORG_CODE_SUCCESS:
      return { ...state, openLoader: false, codeFlagLoading: false, codeFlag: 1, orgCodeError: [], orgCodeSuccess: payload };
    case openTypes.CHECK_ORG_CODE_FAILED:
      return { ...state, openLoader: false, codeFlagLoading: false, codeFlag: 2, orgCodeError: payload, orgCodeSuccess: [] };

    // Check org code
    case openTypes.SEAT_NOTIFY_REQUEST:
      return { ...state, openLoader: true, notifyFlagLoad: true, notifyFlag: 0 };
    case openTypes.SEAT_NOTIFY_SUCCESS:
      return { ...state, openLoader: false, notifyFlagLoad: false, notifyFlag: 1, seatError: [], seatSuccess: payload };
    case openTypes.SEAT_NOTIFY_FAILED:
      return { ...state, openLoader: false, notifyFlagLoad: false, notifyFlag: 2, seatError: payload, seatSuccess: [] };

    // Reset organization store
    case openTypes.RESET_STORE: {
      return defaultState;
    }

    default:
      return state;
  }
}
