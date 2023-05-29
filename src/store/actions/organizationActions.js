import { organizationTypes } from './types';

export const resetOrganizationStore = () => ({
  type: organizationTypes.RESET_STORE,
});

export const organizationByIdRequest = (id) => ({
  type: organizationTypes.BY_ID_REQUEST,
  payload: id
});
export const organizationByIdSuccess = (data) => ({
  type: organizationTypes.BY_ID_SUCCESS,
  payload: data
});
export const organizationByIdFailed = (data) => ({
  type: organizationTypes.BY_ID_FAILED,
  payload: data
});

export const updateOrganizationRequest = (data) => ({
  type: organizationTypes.UPDATE_REQUEST,
  payload: data
});
export const updateOrganizationSuccess = (data) => ({
  type: organizationTypes.UPDATE_SUCCESS,
  payload: data
});
export const updateOrganizationFailed = (data) => ({
  type: organizationTypes.UPDATE_FAILED,
  payload: data
});

// Get State List
export const getStateListRequest = (data) => ({
  type: organizationTypes.ORG_STATE_LIST_REQUEST,
  payload: data
});
export const getStateListSuccess = (data) => ({
  type: organizationTypes.ORG_STATE_LIST_SUCCESS,
  payload: data
});
export const getStateListFailed = (data) => ({
  type: organizationTypes.ORG_STATE_LIST_FAILED,
  payload: data
});

// Check current user organization subscription
export const checkOrganizationSubscriptionRequest = (id) => ({
  type: organizationTypes.CHECK_SUBSCRIPTION_REQUEST,
  payload: id
});
export const checkOrganizationSubscriptionSuccess = (data) => ({
  type: organizationTypes.CHECK_SUBSCRIPTION_SUCCESS,
  payload: data
});
export const checkOrganizationSubscriptionFailed = (data) => ({
  type: organizationTypes.CHECK_SUBSCRIPTION_FAILED,
  payload: data
});

// Check current user organization subscription
export const manageOrganizationSubscriptionRequest = (payload) => ({
  type: organizationTypes.MANAGE_SUBSCRIPTION_REQUEST,
  payload: payload
});
export const manageOrganizationSubscriptionSuccess = (data) => ({
  type: organizationTypes.MANAGE_SUBSCRIPTION_SUCCESS,
  payload: data
});
export const manageOrganizationSubscriptionFailed = (data) => ({
  type: organizationTypes.MANAGE_SUBSCRIPTION_FAILED,
  payload: data
});

export const resetOrganizationMemberInvitation = () => ({
  type: organizationTypes.RESET_MEMBER_INVITATION,
});

export const searchOrganizationMemberRequest = payload => ({
  type: organizationTypes.SEARCH_MEMBER_REQUEST,
  payload: payload
});
export const searchOrganizationMemberSuccess = payload => ({
  type: organizationTypes.SEARCH_MEMBER_SUCCESS,
  payload: payload
});
export const searchOrganizationMemberFailed = payload => ({
  type: organizationTypes.SEARCH_MEMBER_FAILED,
  payload: payload
});

export const inviteOrganizationMemberRequest = payload => ({
  type: organizationTypes.INVITE_MEMBER_REQUEST,
  payload: payload
});
export const inviteOrganizationMemberSuccess = payload => ({
  type: organizationTypes.INVITE_MEMBER_SUCCESS,
  payload: payload
});
export const inviteOrganizationMemberFailed = payload => ({
  type: organizationTypes.INVITE_MEMBER_FAILED,
  payload: payload
});

export const cancelOrganizationMemberInvitationRequest = payload => ({
  type: organizationTypes.CANCEL_MEMBER_INVITATION_REQUEST,
  payload: payload
});
export const cancelOrganizationMemberInvitationSuccess = payload => ({
  type: organizationTypes.CANCEL_MEMBER_INVITATION_SUCCESS,
  payload: payload
});
export const cancelOrganizationMemberInvitationFailed = payload => ({
  type: organizationTypes.CANCEL_MEMBER_INVITATION_FAILED,
  payload: payload
});

// Check organization mute flag
export const checkOrgNotifMuteRequest = id => ({
  type: organizationTypes.CHECK_NOTIFICATION_MUTE_REQUEST,
  payload: id
});
export const checkOrgNotifMuteSuccess = (data) => ({
  type: organizationTypes.CHECK_NOTIFICATION_MUTE_SUCCESS,
  payload: data
});
export const checkOrgNotifMuteFailed = (data) => ({
  type: organizationTypes.CHECK_NOTIFICATION_MUTE_FAILED,
  payload: data
});

// Manage organization notification mute flag
export const manageOrgNotifRequest = (payload) => ({
  type: organizationTypes.MANAGE_NOTIFICATION_MUTE_REQUEST,
  payload: payload
});
export const manageOrgNotifSuccess = (data) => ({
  type: organizationTypes.MANAGE_NOTIFICATION_MUTE_SUCCESS,
  payload: data
});
export const manageOrgNotifFailed = (data) => ({
  type: organizationTypes.MANAGE_NOTIFICATION_MUTE_FAILED,
  payload: data
});

// Load more organization events
export const loadMoreOrgEventsRequest = (payload) => ({
  type: organizationTypes.LOAD_MORE_EVENTS_REQUEST,
  payload: payload
});
export const loadMoreOrgEventsSuccess = (data) => ({
  type: organizationTypes.LOAD_MORE_EVENTS_SUCCESS,
  payload: data
});
export const loadMoreOrgEventsFailed = (data) => ({
  type: organizationTypes.LOAD_MORE_EVENTS_FAILED,
  payload: data
});
export const updateOrgEventList = (data) => ({
  type: organizationTypes.UPDATE_EVENTS_LIST,
  payload: data
});
