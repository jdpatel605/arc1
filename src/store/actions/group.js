import {groupTypes} from './types';

// New saga based method for group creation
export const createGroupRequest = payload => ({
  type: groupTypes.CREATE_REQUEST,
  payload: payload
});
export const createGroupSuccess = payload => ({
  type: groupTypes.CREATE_SUCCESS,
  payload: payload
});
export const createGroupFailed = payload => ({
  type: groupTypes.CREATE_FAILED,
  payload: payload
});

export const updateGroupRequest = payload => ({
  type: groupTypes.UPDATE_REQUEST,
  payload: payload
});
export const updateGroupSuccess = payload => ({
  type: groupTypes.UPDATE_SUCCESS,
  payload: payload
});
export const updateGroupFailed = payload => ({
  type: groupTypes.UPDATE_FAILED,
  payload: payload
});

export const resetMemberInvitation = () => ({
  type: groupTypes.RESET_MEMBER_INVITATION,
});

export const searchMemberRequest = payload => ({
  type: groupTypes.SEARCH_MEMBER_REQUEST,
  payload: payload
});
export const searchMemberSuccess = payload => ({
  type: groupTypes.SEARCH_MEMBER_SUCCESS,
  payload: payload
});
export const searchMemberFailed = payload => ({
  type: groupTypes.SEARCH_MEMBER_FAILED,
  payload: payload
});

export const inviteMemberRequest = payload => ({
  type: groupTypes.INVITE_MEMBER_REQUEST,
  payload: payload
});
export const inviteMemberSuccess = payload => ({
  type: groupTypes.INVITE_MEMBER_SUCCESS,
  payload: payload
});
export const inviteMemberFailed = payload => ({
  type: groupTypes.INVITE_MEMBER_FAILED,
  payload: payload
});

export const cancelMemberInvitationRequest = payload => ({
  type: groupTypes.CANCEL_MEMBER_INVITATION_REQUEST,
  payload: payload
});
export const cancelMemberInvitationSuccess = payload => ({
  type: groupTypes.CANCEL_MEMBER_INVITATION_SUCCESS,
  payload: payload
});
export const cancelMemberInvitationFailed = payload => ({
  type: groupTypes.CANCEL_MEMBER_INVITATION_FAILED,
  payload: payload
});

export const groupCallInviteMemberRequest = payload => ({
  type: groupTypes.INVITE_MEMBER_GROUP_CALL_REQUEST,
  payload: payload
});
export const groupCallInviteMemberSuccess = payload => ({
  type: groupTypes.INVITE_MEMBER_GROUP_CALL_SUCCESS,
  payload: payload
});
export const groupCallInviteMemberFailed = payload => ({
  type: groupTypes.INVITE_MEMBER_GROUP_CALL_FAILED,
  payload: payload
});

export const createGroupEventRequest = payload => ({
  type: groupTypes.CREATE_EVENT_REQUEST,
  payload: payload
});
export const createGroupEventSuccess = payload => ({
  type: groupTypes.CREATE_EVENT_SUCCESS,
  payload: payload
});
export const createGroupEventFailed = payload => ({
  type: groupTypes.CREATE_EVENT_FAILED,
  payload: payload
});

export const joinGroupEventRequest = payload => ({
  type: groupTypes.JOIN_EVENT_REQUEST,
  payload: payload
});
export const joinGroupEventSuccess = payload => ({
  type: groupTypes.JOIN_EVENT_SUCCESS,
  payload: payload
});
export const joinGroupEventFailed = payload => ({
  type: groupTypes.JOIN_EVENT_FAILED,
  payload: payload
});

export const guestJoinGroupEventRequest = payload => ({
  type: groupTypes.GUEST_JOIN_EVENT_REQUEST,
  payload: payload
});
export const guestJoinGroupEventSuccess = payload => ({
  type: groupTypes.GUEST_JOIN_EVENT_SUCCESS,
  payload: payload
});
export const guestJoinGroupEventFailed = payload => ({
  type: groupTypes.GUEST_JOIN_EVENT_FAILED,
  payload: payload
});

// Organization list
export const organizationGroupListRequest = page => ({
  type: groupTypes.ORG_GRP_LIST_REQUEST,
  payload: page
});
export const organizationGroupListSuccess = (data) => ({
  type: groupTypes.ORG_GRP_LIST_SUCCESS,
  payload: data
});
export const organizationGroupListUpdate = data => ({
  type: groupTypes.ORG_GRP_LIST_UPDATE,
  payload: data
});
export const organizationGroupListFailed = (data) => ({
  type: groupTypes.ORG_GRP_LIST_FAILED,
  payload: data
});

// Get group details
export const groupDetailsRequest = payload => ({
  type: groupTypes.GROUP_DETAILS_REQUEST,
  payload: payload
});
export const groupDetailsSuccess = payload => ({
  type: groupTypes.GROUP_DETAILS_SUCCESS,
  payload: payload
});
export const groupDetailsFailed = payload => ({
  type: groupTypes.GROUP_DETAILS_FAILED,
  payload: payload
});

// Get group edit details
export const groupEditDetailsRequest = payload => ({
  type: groupTypes.GROUP_EDIT_DETAILS_REQUEST,
  payload: payload
});
export const groupEditDetailsSuccess = payload => ({
  type: groupTypes.GROUP_EDIT_DETAILS_SUCCESS,
  payload: payload
});
export const groupEditDetailsFailed = payload => ({
  type: groupTypes.GROUP_EDIT_DETAILS_FAILED,
  payload: payload
});

// Get group member
export const groupMemberRequest = payload => ({
  type: groupTypes.GROUP_MEMBER_REQUEST,
  payload: payload
});
export const groupMemberSuccess = payload => ({
  type: groupTypes.GROUP_MEMBER_SUCCESS,
  payload: payload
});
export const groupMemberFailed = payload => ({
  type: groupTypes.GROUP_MEMBER_FAILED,
  payload: payload
});

// Join Group
export const joinGroupRequest = payload => ({
  type: groupTypes.JOIN_GROUP_REQUEST,
  payload: payload
});
export const joinGroupSuccess = payload => ({
  type: groupTypes.JOIN_GROUP_SUCCESS,
  payload: payload
});
export const joinGroupFailed = payload => ({
  type: groupTypes.JOIN_GROUP_FAILED,
  payload: payload
});

// Leave Group
export const leaveGroupRequest = payload => ({
  type: groupTypes.LEAVE_GROUP_REQUEST,
  payload: payload
});
export const leaveGroupSuccess = payload => ({
  type: groupTypes.LEAVE_GROUP_SUCCESS,
  payload: payload
});
export const leaveGroupFailed = payload => ({
  type: groupTypes.LEAVE_GROUP_FAILED,
  payload: payload
});

// Delete Group
export const deleteGroupRequest = payload => ({
  type: groupTypes.DELETE_GROUP_REQUEST,
  payload: payload
});
export const deleteGroupSuccess = payload => ({
  type: groupTypes.DELETE_GROUP_SUCCESS,
  payload: payload
});
export const deleteGroupFailed = payload => ({
  type: groupTypes.DELETE_GROUP_FAILED,
  payload: payload
});

// Resume Group
export const resumeGroupRequest = payload => ({
  type: groupTypes.RESUME_GROUP_REQUEST,
  payload: payload
});
export const resumeGroupSuccess = payload => ({
  type: groupTypes.RESUME_GROUP_SUCCESS,
  payload: payload
});
export const resumeGroupFailed = payload => ({
  type: groupTypes.RESUME_GROUP_FAILED,
  payload: payload
});

// Mute Group
export const muteGroupRequest = payload => ({
  type: groupTypes.MUTE_GROUP_REQUEST,
  payload: payload
});
export const muteGroupSuccess = payload => ({
  type: groupTypes.MUTE_GROUP_SUCCESS,
  payload: payload
});
export const muteGroupFailed = payload => ({
  type: groupTypes.MUTE_GROUP_FAILED,
  payload: payload
});

// Get organization list
export const organizationListRequest = payload => ({
  type: groupTypes.ORG_LIST_REQUEST,
  payload: payload
});
export const organizationListSuccess = payload => ({
  type: groupTypes.ORG_LIST_SUCCESS,
  payload: payload
});
export const organizationListFailed = payload => ({
  type: groupTypes.ORG_LIST_FAILED,
  payload: payload
});

// Delete Group member
export const deleteGroupMemberRequest = payload => ({
  type: groupTypes.DELETE_GROUP_MEMBER_REQUEST,
  payload: payload
});
export const deleteGroupMemberSuccess = payload => ({
  type: groupTypes.DELETE_GROUP_MEMBER_SUCCESS,
  payload: payload
});
export const deleteGroupMemberFailed = payload => ({
  type: groupTypes.DELETE_GROUP_MEMBER_FAILED,
  payload: payload
});

// Make Owner
export const makeOwnerRequest = payload => ({
  type: groupTypes.MAKE_OWNER_REQUEST,
  payload: payload
});
export const makeOwnerSuccess = payload => ({
  type: groupTypes.MAKE_OWNER_SUCCESS,
  payload: payload
});
export const makeOwnerFailed = payload => ({
  type: groupTypes.MAKE_OWNER_FAILED,
  payload: payload
});

// Change user role
export const changeUserRoleRequest = payload => ({
  type: groupTypes.CHANGE_USER_ROLE_REQUEST,
  payload: payload
});
export const changeUserRoleSuccess = payload => ({
  type: groupTypes.CHANGE_USER_ROLE_SUCCESS,
  payload: payload
});
export const changeUserRoleFailed = payload => ({
  type: groupTypes.CHANGE_USER_ROLE_FAILED,
  payload: payload
});

export const resetGroupState = () => ({
  type: groupTypes.RESET_GRP_STATE
});
