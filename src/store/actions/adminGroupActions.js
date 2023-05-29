import {adminGroupTypes} from './types';

// Admin Group list
export const adminGroupListRequest = page => ({
  type: adminGroupTypes.ADM_GRP_LIST_REQUEST,
  payload: page
});
export const adminGroupListSuccess = (data) => ({
  type: adminGroupTypes.ADM_GRP_LIST_SUCCESS,
  payload: data
});
export const adminGroupListUpdate = data => ({
  type: adminGroupTypes.ADM_GRP_LIST_UPDATE,
  payload: data
});
export const adminGroupListFailed = (data) => ({
  type: adminGroupTypes.ADM_GRP_LIST_FAILED,
  payload: data
});

// Change visibility
export const changeVisibilityRequest = page => ({
  type: adminGroupTypes.CHANGE_VISIBILITY_REQUEST,
  payload: page
});
export const changeVisibilitySuccess = (data) => ({
  type: adminGroupTypes.CHANGE_VISIBILITY_SUCCESS,
  payload: data
});
export const changeVisibilityFailed = (data) => ({
  type: adminGroupTypes.CHANGE_VISIBILITY_FAILED,
  payload: data
});

// Assign new group owner
export const assignNewGroupOwnerRequest = page => ({
  type: adminGroupTypes.ASSIGN_NEW_GROUP_OWNER_REQUEST,
  payload: page
});
export const assignNewGroupOwnerSuccess = (data) => ({
  type: adminGroupTypes.ASSIGN_NEW_GROUP_OWNER_SUCCESS,
  payload: data
});
export const assignNewGroupOwnerFailed = (data) => ({
  type: adminGroupTypes.ASSIGN_NEW_GROUP_OWNER_FAILED,
  payload: data
});

// Invite group member list
export const inviteToGroupMemberListRequest = payload => ({
  type: adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_REQUEST,
  payload: payload
});
export const inviteToGroupMemberListSuccess = payload => ({
  type: adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_SUCCESS,
  payload: payload
});
export const inviteToGroupMemberListUpdate = data => ({
  type: adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_UPDATE,
  payload: data
});
export const inviteToGroupMemberListFailed = payload => ({
  type: adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_FAILED,
  payload: payload
});

// Invite group member
export const inviteGroupMemberRequest = payload => ({
  type: adminGroupTypes.INVITE_GROUP_MEMBER_REQUEST,
  payload: payload
});
export const inviteGroupMemberSuccess = payload => ({
  type: adminGroupTypes.INVITE_GROUP_MEMBER_SUCCESS,
  payload: payload
});
export const inviteGroupMemberFailed = payload => ({
  type: adminGroupTypes.INVITE_GROUP_MEMBER_FAILED,
  payload: payload
});

// Cancle invite group member
export const cancleInviteGroupMemberRequest = payload => ({
  type: adminGroupTypes.CANCLE_INVITE_GROUP_MEMBER_REQUEST,
  payload: payload
});
export const cancleInviteGroupMemberSuccess = payload => ({
  type: adminGroupTypes.CANCLE_INVITE_GROUP_MEMBER_SUCCESS,
  payload: payload
});
export const cancleInviteGroupMemberFailed = payload => ({
  type: adminGroupTypes.CANCLE_INVITE_GROUP_MEMBER_FAILED,
  payload: payload
});

// Delete admin group
export const deleteAdminGroupRequest = page => ({
  type: adminGroupTypes.DELETE_ADM_GRP_REQUEST,
  payload: page
});
export const deleteAdminGroupSuccess = (data) => ({
  type: adminGroupTypes.DELETE_ADM_GRP_SUCCESS,
  payload: data
});
export const deleteAdminGroupFailed = (data) => ({
  type: adminGroupTypes.DELETE_ADM_GRP_FAILED,
  payload: data
});

// Admin group details
export const adminGroupDetailsRequest = page => ({
  type: adminGroupTypes.ADM_GRP_DETAILS_REQUEST,
  payload: page
});
export const adminGroupDetailsSuccess = (data) => ({
  type: adminGroupTypes.ADM_GRP_DETAILS_SUCCESS,
  payload: data
});
export const adminGroupDetailsFailed = (data) => ({
  type: adminGroupTypes.ADM_GRP_DETAILS_FAILED,
  payload: data
});

// Admin edit group details
export const adminEditGroupDetailsRequest = page => ({
  type: adminGroupTypes.ADM_EDIT_GRP_DETAILS_REQUEST,
  payload: page
});
export const adminEditGroupDetailsSuccess = (data) => ({
  type: adminGroupTypes.ADM_EDIT_GRP_DETAILS_SUCCESS,
  payload: data
});
export const adminEditGroupDetailsFailed = (data) => ({
  type: adminGroupTypes.ADM_EDIT_GRP_DETAILS_FAILED,
  payload: data
});

// Admin group member list
export const detailsGroupMemberListRequest = page => ({
  type: adminGroupTypes.GRP_DETAILS_MEMBER_LIST_REQUEST,
  payload: page
});
export const detailsGroupMemberListSuccess = (data) => ({
  type: adminGroupTypes.GRP_DETAILS_MEMBER_LIST_SUCCESS,
  payload: data
});
export const detailsGroupMemberListUpdate = data => ({
  type: adminGroupTypes.GRP_DETAILS_MEMBER_LIST_UPDATE,
  payload: data
});
export const detailsGroupMemberListFailed = (data) => ({
  type: adminGroupTypes.GRP_DETAILS_MEMBER_LIST_FAILED,
  payload: data
});
export const detailsGroupMemberListReset = (data) => ({
  type: adminGroupTypes.GRP_DETAILS_MEMBER_LIST_RESET,
  payload: data
});

// Change user role
export const promoteUserRoleRequest = page => ({
  type: adminGroupTypes.PROMOTE_USER_ROLE_REQUEST,
  payload: page
});
export const promoteUserRoleSuccess = (data) => ({
  type: adminGroupTypes.PROMOTE_USER_ROLE_SUCCESS,
  payload: data
});
export const promoteUserRoleFailed = (data) => ({
  type: adminGroupTypes.PROMOTE_USER_ROLE_FAILED,
  payload: data
});
export const promoteUserRoleReset = (data) => ({
  type: adminGroupTypes.PROMOTE_USER_ROLE_RESET,
  payload: data
});

// Remove user from group
export const kickUserFromGroupRequest = page => ({
  type: adminGroupTypes.KICK_USER_FROM_GROUP_REQUEST,
  payload: page
});
export const kickUserFromGroupSuccess = (data) => ({
  type: adminGroupTypes.KICK_USER_FROM_GROUP_SUCCESS,
  payload: data
});
export const kickUserFromGroupFailed = (data) => ({
  type: adminGroupTypes.KICK_USER_FROM_GROUP_FAILED,
  payload: data
});
export const kickUserFromGroupReset = (data) => ({
  type: adminGroupTypes.KICK_USER_FROM_GROUP_RESET,
  payload: data
});

// Group event list
export const groupEventListRequest = page => ({
  type: adminGroupTypes.GROUP_EVENT_LIST_REQUEST,
  payload: page
});
export const groupEventListSuccess = (data) => ({
  type: adminGroupTypes.GROUP_EVENT_LIST_SUCCESS,
  payload: data
});
export const groupEventListFailed = (data) => ({
  type: adminGroupTypes.GROUP_EVENT_LIST_FAILED,
  payload: data
});
export const groupEventListUpdate = (data) => ({
  type: adminGroupTypes.GROUP_EVENT_LIST_UPDATE,
  payload: data
});

// Delete group event
export const deleteGroupEventRequest = page => ({
  type: adminGroupTypes.DELETE_GROUP_EVENT_REQUEST,
  payload: page
});
export const deleteGroupEventSuccess = (data) => ({
  type: adminGroupTypes.DELETE_GROUP_EVENT_SUCCESS,
  payload: data
});
export const deleteGroupEventFailed = (data) => ({
  type: adminGroupTypes.DELETE_GROUP_EVENT_FAILED,
  payload: data
});

// Delete group event
export const inviteGroupEventRequest = page => ({
  type: adminGroupTypes.INVITE_GROUP_EVENT_REQUEST,
  payload: page
});
export const inviteGroupEventSuccess = (data) => ({
  type: adminGroupTypes.INVITE_GROUP_EVENT_SUCCESS,
  payload: data
});
export const inviteGroupEventFailed = (data) => ({
  type: adminGroupTypes.INVITE_GROUP_EVENT_FAILED,
  payload: data
});

// Create an admin event
export const createAdminEventRequest = (data) => ({
  type: adminGroupTypes.CREATE_ADMIN_EVENT_REQUEST,
  payload: data
});
export const createAdminEventSuccess = (data) => ({
  type: adminGroupTypes.CREATE_ADMIN_EVENT_SUCCESS,
  payload: data
});
export const createAdminEventFailed = (data) => ({
  type: adminGroupTypes.CREATE_ADMIN_EVENT_FAILED,
  payload: data
});

// Edit an admin event
export const editAdminEventRequest = (data) => ({
  type: adminGroupTypes.EDIT_ADMIN_EVENT_REQUEST,
  payload: data
});
export const editAdminEventSuccess = (data) => ({
  type: adminGroupTypes.EDIT_ADMIN_EVENT_SUCCESS,
  payload: data
});
export const editAdminEventFailed = (data) => ({
  type: adminGroupTypes.EDIT_ADMIN_EVENT_FAILED,
  payload: data
});
export const editAdminEventFlagUpdate = flag => ({
  type: adminGroupTypes.EDIT_ADMIN_EVENT_FLAG_UPDATE,
  payload: flag
});

// Create an admin group
export const createAdminGroupRequest = (data) => ({
  type: adminGroupTypes.CREATE_ADMIN_GROUP_REQUEST,
  payload: data
});
export const createAdminGroupSuccess = (data) => ({
  type: adminGroupTypes.CREATE_ADMIN_GROUP_SUCCESS,
  payload: data
});
export const createAdminGroupFailed = (data) => ({
  type: adminGroupTypes.CREATE_ADMIN_GROUP_FAILED,
  payload: data
});

// Update an admin group
export const updateAdminGroupRequest = (data) => ({
  type: adminGroupTypes.UPDATE_ADMIN_GROUP_REQUEST,
  payload: data
});
export const updateAdminGroupSuccess = (data) => ({
  type: adminGroupTypes.UPDATE_ADMIN_GROUP_SUCCESS,
  payload: data
});
export const updateAdminGroupFailed = (data) => ({
  type: adminGroupTypes.UPDATE_ADMIN_GROUP_FAILED,
  payload: data
});

export const resetSomeAdminGroupState = () => ({
  type: adminGroupTypes.RESET_SOME_GRP_STATE
});

export const resetAdminGroupState = () => ({
  type: adminGroupTypes.RESET_ADM_GRP_STATE
});
