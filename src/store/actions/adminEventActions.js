import { adminEventTypes } from './types';

// Admin Event list
export const adminEventListRequest = page => ({
  type: adminEventTypes.ADM_EVT_LIST_REQUEST,
  payload: page
});
export const adminEventListSuccess = (data) => ({
  type: adminEventTypes.ADM_EVT_LIST_SUCCESS,
  payload: data
});
export const adminEventListUpdate = data => ({
  type: adminEventTypes.ADM_EVT_LIST_UPDATE,
  payload: data
});
export const adminEventListFailed = (data) => ({
  type: adminEventTypes.ADM_EVT_LIST_FAILED,
  payload: data
});
export const adminEventListReset = () => ({
  type: adminEventTypes.ADM_EVT_LIST_RESET,
  payload: {}
});

// Change visibility
export const changeEventVisibilityRequest = page => ({
  type: adminEventTypes.EVT_CHANGE_VISIBILITY_REQUEST,
  payload: page
});
export const changeEventVisibilitySuccess = (data) => ({
  type: adminEventTypes.EVT_CHANGE_VISIBILITY_SUCCESS,
  payload: data
});
export const changeEventVisibilityFailed = (data) => ({
  type: adminEventTypes.EVT_CHANGE_VISIBILITY_FAILED,
  payload: data
});

// Remove user from EVENT
export const kickUserFromEventRequest = page => ({
  type: adminEventTypes.KICK_USER_FROM_EVENT_REQUEST,
  payload: page
});
export const kickUserFromEventSuccess = (data) => ({
  type: adminEventTypes.KICK_USER_FROM_EVENT_SUCCESS,
  payload: data
});
export const kickUserFromEventFailed = (data) => ({
  type: adminEventTypes.KICK_USER_FROM_EVENT_FAILED,
  payload: data
});
export const kickUserFromEventReset = (data) => ({
  type: adminEventTypes.KICK_USER_FROM_EVENT_RESET,
  payload: data
});