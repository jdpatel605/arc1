import {notificationTypes} from './types';

export const resetNotificationState = () => ({
  type: notificationTypes.RESET_STATE
});

// List notification list
export const notificationListRequest = page => ({
  type: notificationTypes.LIST_REQUEST,
  payload: page
});
export const notificationListSuccess = (data) => ({
  type: notificationTypes.LIST_SUCCESS,
  payload: data
});

export const updateNotificationList = data => ({
  type: notificationTypes.UPDATE_LIST,
  payload: data
});
export const notificationListFailed = (data) => ({
  type: notificationTypes.LIST_FAILED,
  payload: data
});

// Accept Reject notification invite
export const acceptRejectInviteRequest = data => ({
  type: notificationTypes.ACCEPT_REJECT_REQUEST,
  payload: data
});
export const acceptRejectInviteSuccess = (data) => ({
  type: notificationTypes.ACCEPT_REJECT_SUCCESS,
  payload: data
});
export const acceptRejectInviteFailed = (data) => ({
  type: notificationTypes.ACCEPT_REJECT_FAILED,
  payload: data
});

// Delete notification
export const deleteNotificationRequest = id => ({
  type: notificationTypes.DELETE_REQUEST,
  payload: id
});
export const deleteNotificationSuccess = (data) => ({
  type: notificationTypes.DELETE_SUCCESS,
  payload: data
});
export const deleteNotificationFailed = (data) => ({
  type: notificationTypes.DELETE_FAILED,
  payload: data
});

// Read Unread notification state
export const readUnreadNotifRequest = data => ({
  type: notificationTypes.READ_UNREAD_REQUEST,
  payload: data
});
export const readUnreadNotifSuccess = (data) => ({
  type: notificationTypes.READ_UNREAD_SUCCESS,
  payload: data
});
export const readUnreadNotifFailed = (data) => ({
  type: notificationTypes.READ_UNREAD_FAILED,
  payload: data
});

// Unread notifications count
export const unreadNotifCountRequest = () => ({
  type: notificationTypes.UNREAD_COUNT_REQUEST
});
export const unreadNotifCountSuccess = (data) => ({
  type: notificationTypes.UNREAD_COUNT_SUCCESS,
  payload: data
});
export const unreadNotifCountFailed = (data) => ({
  type: notificationTypes.UNREAD_COUNT_FAILED,
  payload: data
});
