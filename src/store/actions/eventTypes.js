export const eventTypes = {

  // Reset store
  RESET_STORE: 'RESET_EVENT_STORE',
  RESET_STORE_LIST: 'RESET_EVENT_STORE_LIST',
  UPDATE_MY_EVENT_LIST: 'UPDATE_MY_EVENT_LIST',
  RESET_MEMBER_LIST: 'RESET_EVENT_MEMBER_LIST',
  RESET_SUBSCRIPTION_STATUS: 'EVENT_RESET_SUBSCRIPTION_STATUS',
  UPDATE_MEMBER_LIST: 'UPDATE_EVENT_MEMBER_LIST',

  // Create an event
  CREATE_REQUEST: 'EVENT_CREATE_REQUEST',
  CREATE_SUCCESS: 'EVENT_CREATE_SUCCESS',
  CREATE_FAILED: 'EVENT_CREATE_FAILED',

  // Delete an event
  DELETE_REQUEST: 'EVENT_DELETE_REQUEST',
  DELETE_SUCCESS: 'EVENT_DELETE_SUCCESS',
  DELETE_RESET: 'EVENT_DELETE_RESET',

  // Create an event
  EDIT_REQUEST: 'EVENT_EDIT_REQUEST',
  EDIT_SUCCESS: 'EVENT_EDIT_SUCCESS',
  EDIT_FAILED: 'EVENT_EDIT_FAILED',
  EDIT_FLAG_UPDATE: 'EVENT_EDIT_FLAG_UPDATE',

  // Fetch an event details
  FETCH_DETAILS_REQUEST: 'EVENT_FETCH_DETAILS_REQUEST',
  FETCH_DETAILS_SUCCESS: 'EVENT_FETCH_DETAILS_SUCCESS',
  FETCH_DETAILS_FAILED: 'EVENT_FETCH_DETAILS_FAILED',
  RESET_FETCH_DETAILS: 'RESET_EVENT_FETCH_DETAILS',

  // Send or cancel member invitation
  INVITE_REQUEST: 'EVENT_INVITE_MEMBER_REQUEST',
  INVITE_SUCCESS: 'EVENT_INVITE_MEMBER_SUCCESS',
  INVITE_FAILED: 'EVENT_INVITE_MEMBER_FAILED',

  // Breakout requests
  BREAKOUT_REQUEST: 'EVENT_BREAKOUT_REQUEST',
  BREAKOUT_SUCCESS: 'EVENT_BREAKOUT_SUCCESS',
  BREAKOUT_FAILED: 'EVENT_BREAKOUT_FAILED',

  // My events list
  MY_LIST_REQUEST: 'EVENT_MY_LIST_REQUEST',
  MY_LIST_SUCCESS: 'EVENT_MY_LIST_SUCCESS',
  MY_LIST_FAILED: 'EVENT_MY_LIST_FAILED',

  // Get organization details
  LIST_REQUEST: 'EVENT_LIST_REQUEST',
  LIST_SUCCESS: 'EVENT_LIST_SUCCESS',
  LIST_FAILED: 'EVENT_LIST_FAILED',

  // Subscribe event for current user
  SUBSCRIBE_REQUEST: 'EVENT_MEMBER_SUBSCRIBE_REQUEST',
  SUBSCRIBE_SUCCESS: 'EVENT_MEMBER_SUBSCRIBE_SUCCESS',
  SUBSCRIBE_FAILED: 'EVENT_MEMBER_SUBSCRIBE_FAILED',

  // Unsubscribe event for current user
  UNSUBSCRIBE_REQUEST: 'EVENT_MEMBER_UNSUBSCRIBE_REQUEST',
  UNSUBSCRIBE_SUCCESS: 'EVENT_MEMBER_UNSUBSCRIBE_SUCCESS',
  UNSUBSCRIBE_FAILED: 'EVENT_MEMBER_UNSUBSCRIBE_FAILED',

  // Get event details
  BY_ID_REQUEST: 'EVENT_DETAILS_BY_ID_REQUEST',
  BY_ID_SUCCESS: 'EVENT_DETAILS_BY_ID_SUCCESS',
  BY_ID_FAILED: 'EVENT_DETAILS_BY_ID_FAILED',
  UPDATE_EVENT_DETAILS: 'UPDATE_EVENT_DETAILS',

  // Member list for event
  MEMBER_LIST_REQUEST: 'EVENT_MEMBER_LIST_REQUEST',
  MEMBER_LIST_SUCCESS: 'EVENT_MEMBER_LIST_SUCCESS',
  MEMBER_LIST_FAILED: 'EVENT_MEMBER_LIST_FAILED',
  UPDATE_MEMBER_COUNT: 'EVENT_UPDATE_MEMBER_COUNT',

  // Event host
  HOST_LIST_REQUEST: 'EVENT_HOST_LIST_REQUEST',
  HOST_LIST_SUCCESS: 'EVENT_HOST_LIST_SUCCESS',
  HOST_LIST_FAILED: 'EVENT_HOST_LIST_FAILED',

  // Event participants list
  PARTICIPANTS_LIST_REQUEST: 'EVENT_PARTICIPANTS_LIST_REQUEST',
  PARTICIPANTS_LIST_SUCCESS: 'EVENT_PARTICIPANTS_LIST_SUCCESS',
  PARTICIPANTS_LIST_FAILED: 'EVENT_PARTICIPANTS_LIST_FAILED',
  UPDATE_PARTICIPANTS_LIST: 'UPDATE_EVENT_PARTICIPANTS_LIST',

  // Invite Event participants
  INVITE_PARTICIPANTS_REQUEST: 'EVENT_INVITE_PARTICIPANTS_REQUEST',
  INVITE_PARTICIPANTS_SUCCESS: 'EVENT_INVITE_PARTICIPANTS_SUCCESS',
  INVITE_PARTICIPANTS_FAILED: 'EVENT_INVITE_PARTICIPANTS_FAILED',

  // Download ICS file content
  ICS_FILE_REQUEST: 'EVENT_ICS_FILE_REQUEST',
  ICS_FILE_SUCCESS: 'EVENT_ICS_FILE_SUCCESS',
  ICS_FILE_FAILED: 'EVENT_ICS_FILE_FAILED',
  ICS_FILE_RESET: 'EVENT_ICS_FILE_RESET',

  // Constant text for display purpose
  LOADING_TEXT: 'Loading...',
  NO_EVENT_FOUND_TEXT: 'No events found'
};
