import {openTypes} from './types';

// Reset reducer
export const resetOpenStore = () => ({
  type: openTypes.RESET_STORE,
});

// Check organization code
export const checkOrgCodeRequest = (payload) => ({
  type: openTypes.CHECK_ORG_CODE_REQUEST,
  payload: payload
});
export const checkOrgCodeSuccess = (data) => ({
  type: openTypes.CHECK_ORG_CODE_SUCCESS,
  payload: data
});
export const checkOrgCodeFailed = (data) => ({
  type: openTypes.CHECK_ORG_CODE_FAILED,
  payload: data
});

// Request for seat
export const seatNofitifyRequest = (payload) => ({
  type: openTypes.SEAT_NOTIFY_REQUEST,
  payload: payload
});
export const seatNofitifySuccess = (data) => ({
  type: openTypes.SEAT_NOTIFY_SUCCESS,
  payload: data
});
export const seatNofitifyFailed = (data) => ({
  type: openTypes.SEAT_NOTIFY_FAILED,
  payload: data
});
