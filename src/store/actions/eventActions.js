import {eventTypes} from './types';

export const resetEventStore = () => ({
  type: eventTypes.RESET_STORE,
});

export const resetEventList = () => ({
  type: eventTypes.RESET_STORE_LIST,
});

// Update my event list
export const updateMyEventList = (data) => ({
  type: eventTypes.UPDATE_MY_EVENT_LIST,
  payload: data
});

// Create an event
export const createEventRequest = (data) => ({
  type: eventTypes.CREATE_REQUEST,
  payload: data
});
export const createEventSuccess = (data) => ({
  type: eventTypes.CREATE_SUCCESS,
  payload: data
});
export const createEventFailed = (data) => ({
  type: eventTypes.CREATE_FAILED,
  payload: data
});

// Edit an event
export const editEventRequest = (data) => ({
  type: eventTypes.EDIT_REQUEST,
  payload: data
});
export const editEventSuccess = (data) => ({
  type: eventTypes.EDIT_SUCCESS,
  payload: data
});
export const editEventFailed = (data) => ({
  type: eventTypes.EDIT_FAILED,
  payload: data
});
export const editEventFlagUpdate = flag => ({
  type: eventTypes.EDIT_FLAG_UPDATE,
  payload: flag
});


// Delete an event
export const deleteEventRequest = payload => ({
  type: eventTypes.DELETE_REQUEST, payload
});
export const deleteEventSuccess = payload => ({
  type: eventTypes.DELETE_SUCCESS, payload
});
export const deleteEventReset = payload => ({
  type: eventTypes.DELETE_RESET, payload
});

// Fetch an event details
export const fetchDetailsRequest = id => ({
  type: eventTypes.FETCH_DETAILS_REQUEST,
  payload: id
});
export const fetchDetailsSuccess = (data) => ({
  type: eventTypes.FETCH_DETAILS_SUCCESS,
  payload: data
});
export const fetchDetailsFailed = (data) => ({
  type: eventTypes.FETCH_DETAILS_FAILED,
  payload: data
});
export const resetEventFetchDetails = () => ({
  type: eventTypes.RESET_FETCH_DETAILS
});

// My event list
export const myEventsListRequest = (data) => ({
  type: eventTypes.MY_LIST_REQUEST,
  payload: data
});
export const myEventsListSuccess = (data) => ({
  type: eventTypes.MY_LIST_SUCCESS,
  payload: data
});
export const myEventsListFailed = (data) => ({
  type: eventTypes.MY_LIST_FAILED,
  payload: data
});

export const eventsListRequest = id => ({
  type: eventTypes.LIST_REQUEST,
  payload: id
});
export const eventsListSuccess = (data) => ({
  type: eventTypes.LIST_SUCCESS,
  payload: data
});
export const eventsListFailed = (data) => ({
  type: eventTypes.LIST_FAILED,
  payload: data
});

// Get event by Id - group call
export const eventsByIdRequest = id => ({
  type: eventTypes.BY_ID_REQUEST,
  payload: id
});
export const eventsByIdSuccess = (data) => ({
  type: eventTypes.BY_ID_SUCCESS,
  payload: data
});
export const eventsByIdFailed = (data) => ({
  type: eventTypes.BY_ID_FAILED,
  payload: data
});
export const eventsDetailsUpdate = (data) => ({
  type: eventTypes.UPDATE_EVENT_DETAILS,
  payload: data
});

// Get event by Id - extended
export const eventsExtendedRequest = id => ({
  type: eventTypes.EXTENDED_REQUEST,
  payload: id
});
export const eventsExtendedSuccess = (data) => ({
  type: eventTypes.EXTENDED_SUCCESS,
  payload: data
});
export const eventsExtendedFailed = (data) => ({
  type: eventTypes.EXTENDED_FAILED,
  payload: data
});

// Subscribe event for member
export const subscribeEventRequest = id => ({
  type: eventTypes.SUBSCRIBE_REQUEST,
  payload: id
});
export const subscribeEventSuccess = (data) => ({
  type: eventTypes.SUBSCRIBE_SUCCESS,
  payload: data
});
export const subscribeEventFailed = (data) => ({
  type: eventTypes.SUBSCRIBE_FAILED,
  payload: data
});

// Unsubscribe event for member
export const unsubscribeEventRequest = id => ({
  type: eventTypes.UNSUBSCRIBE_REQUEST,
  payload: id
});
export const unsubscribeEventSuccess = (data) => ({
  type: eventTypes.UNSUBSCRIBE_SUCCESS,
  payload: data
});
export const unsubscribeEventFailed = (data) => ({
  type: eventTypes.UNSUBSCRIBE_FAILED,
  payload: data
});
export const resetEventSubscriptionStatus = () => ({
  type: eventTypes.RESET_SUBSCRIPTION_STATUS
});

// Invite member for an event
export const inviteMemberEventRequest = data => ({
  type: eventTypes.INVITE_REQUEST,
  payload: data
});
export const inviteMemberEventSuccess = (data) => ({
  type: eventTypes.INVITE_SUCCESS,
  payload: data
});
export const inviteMemberEventFailed = (data) => ({
  type: eventTypes.INVITE_FAILED,
  payload: data
});

// Breakout member for an event
export const createBreakoutRequest = data => ({
  type: eventTypes.BREAKOUT_REQUEST,
  payload: data
});
export const createBreakoutSuccess = (data) => ({
  type: eventTypes.BREAKOUT_SUCCESS,
  payload: data
});
export const createBreakoutFailed = (data) => ({
  type: eventTypes.BREAKOUT_FAILED,
  payload: data
});

// Event members list
export const resetEventMemberList = () => ({
  type: eventTypes.RESET_MEMBER_LIST
});
export const updateEventMemberList = payload => ({
  type: eventTypes.UPDATE_MEMBER_LIST,
  payload
});
export const eventMemberListRequest = payload => ({
  type: eventTypes.MEMBER_LIST_REQUEST,
  payload
});
export const eventMemberListSuccess = (data) => ({
  type: eventTypes.MEMBER_LIST_SUCCESS,
  payload: data
});
export const eventMemberListFailed = (data) => ({
  type: eventTypes.MEMBER_LIST_FAILED,
  payload: data
});
export const eventUpdateMemberCount = (count) => ({
  type: eventTypes.UPDATE_MEMBER_COUNT,
  payload: count
});

// Event host list
export const eventHostListRequest = payload => ({
  type: eventTypes.HOST_LIST_REQUEST,
  payload
});
export const eventHostListSuccess = (data) => ({
  type: eventTypes.HOST_LIST_SUCCESS,
  payload: data
});
export const eventHostListFailed = (data) => ({
  type: eventTypes.HOST_LIST_FAILED,
  payload: data
});

// Event participants list
export const eventParticipantsListRequest = payload => ({
  type: eventTypes.PARTICIPANTS_LIST_REQUEST,
  payload
});
export const eventParticipantsListSuccess = (data) => ({
  type: eventTypes.PARTICIPANTS_LIST_SUCCESS,
  payload: data
});
export const eventParticipantsListFailed = (data) => ({
  type: eventTypes.PARTICIPANTS_LIST_FAILED,
  payload: data
});
export const eventParticipantsListReset = (data) => ({
  type: eventTypes.PARTICIPANTS_LIST_FAILED,
  payload: data
});
export const updateEventParticipantsList = (data) => ({
  type: eventTypes.UPDATE_PARTICIPANTS_LIST,
  payload: data
});

// Invite Event participants
export const inviteEventParticipantsRequest = payload => ({
  type: eventTypes.INVITE_PARTICIPANTS_REQUEST,
  payload
});
export const inviteEventParticipantsSuccess = (data) => ({
  type: eventTypes.INVITE_PARTICIPANTS_SUCCESS,
  payload: data
});
export const inviteEventParticipantsFailed = (data) => ({
  type: eventTypes.INVITE_PARTICIPANTS_FAILED,
  payload: data
});

// Invite Event participants
export const eventICSFileRequest = payload => ({
  type: eventTypes.ICS_FILE_REQUEST,
  payload
});
export const eventICSFileSuccess = (data) => ({
  type: eventTypes.ICS_FILE_SUCCESS,
  payload: data
});
export const eventICSFileFailed = (data) => ({
  type: eventTypes.ICS_FILE_FAILED,
  payload: data
});
export const eventICSFileReset = (data) => ({
  type: eventTypes.ICS_FILE_RESET,
  payload: data
});
