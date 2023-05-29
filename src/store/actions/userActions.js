import {adminUserTypes} from './types';

// Get Admin User list Data
export const getAllUsersRequest = (string) => ({
  type: adminUserTypes.GET_ADMIN_USER_REQUEST,
  payload: string
});
export const getAllUsersSuccess = (data) => ({
  type: adminUserTypes.GET_ADMIN_USER_SUCCESS,
  payload: data
});
export const getAllUsersFailed = (data) => ({
  type: adminUserTypes.GET_ADMIN_USER_FAILED,
  payload: data
});
export const updateUserList = (data) => ({
  type: adminUserTypes.UPDATE_ADMIN_USER_LIST,
  payload: data
});

// Get Organization Data
export const getOrganizationDetailRequest = (string) => ({
  type: adminUserTypes.GET_ADMIN_ORG_REQUEST,
  payload: string
});
export const getOrganizationDetailSuccess = (data) => ({
  type: adminUserTypes.GET_ADMIN_ORG_SUCCESS,
  payload: data
});
export const getOrganizationDetailFailed = (data) => ({
  type: adminUserTypes.GET_ADMIN_ORG_FAILED,
  payload: data
});

// Get User detail
export const getAdminUserDetailRequest = (string) => ({
  type: adminUserTypes.GET_ADMIN_USER_DETAIL_REQUEST,
  payload: string
});
export const getAdminUserDetailSuccess = (data) => ({
  type: adminUserTypes.GET_ADMIN_USER_DETAIL_SUCCESS,
  payload: data
});
export const updateUserDetail = (data) => ({
  type: adminUserTypes.UPDATE_ADMIN_USER_DETAIL,
  payload: data
});

export const getAdminUserDetailFailed = (data) => ({
  type: adminUserTypes.GET_ADMIN_USER_DETAIL_FAILED,
  payload: data
});

// Change user role from admin
export const changeAdminUserRoleRequest = (string) => ({
  type: adminUserTypes.CHANGE_ADMIN_USER_ROLE_REQUEST,
  payload: string
});
export const changeAdminUserRoleSuccess = (data) => ({
  type: adminUserTypes.CHANGE_ADMIN_USER_ROLE_SUCCESS,
  payload: data
});
export const changeAdminUserRoleFailed = (data) => ({
  type: adminUserTypes.CHANGE_ADMIN_USER_ROLE_FAILED,
  payload: data
});

// Remove user from org
export const removeUserFromOrgRequest = (string) => ({
  type: adminUserTypes.REMOVE_USER_FROM_ORG_REQUEST,
  payload: string
});
export const removeUserFromOrgSuccess = (data) => ({
  type: adminUserTypes.REMOVE_USER_FROM_ORG_SUCCESS,
  payload: data
});
export const removeUserFromOrgFailed = (data) => ({
  type: adminUserTypes.REMOVE_USER_FROM_ORG_FAILED,
  payload: data
});

// Get Admin Owner User list Data
export const getAllOwnerUsersRequest = (string) => ({
  type: adminUserTypes.GET_OWNER_USER_REQUEST,
  payload: string
});
export const getAllOwnerUsersSuccess = (data) => ({
  type: adminUserTypes.GET_OWNER_USER_SUCCESS,
  payload: data
});
export const getAllOwnerUsersFailed = (data) => ({
  type: adminUserTypes.GET_OWNER_USER_FAILED,
  payload: data
});

export const resetAdminRemoveUser = (data) => ({
  type: adminUserTypes.REMOVE_USER_FROM_ORG_RESET,
  payload: data
});

export const resetAdminChangeRole = (data) => ({
  type: adminUserTypes.CHANGE_ADMIN_USER_ROLE_RESET,
  payload: data
});

// Get all groups to be invited
export const getAllInvitGroupRequest = (string) => ({
  type: adminUserTypes.GET_ALL_ADMIN_GROUP_REQUEST,
  payload: string
});
export const getAllInvitGroupSuccess = (data) => ({
  type: adminUserTypes.GET_ALL_ADMIN_GROUP_SUCCESS,
  payload: data
});
export const getAllInvitGroupFailed = (data) => ({
  type: adminUserTypes.GET_ALL_ADMIN_GROUP_FAILED,
  payload: data
});

export const resetAllInvitGroupUser = (data) => ({
  type: adminUserTypes.GET_ALL_ADMIN_GROUP_RESET,
  payload: data
});

export const updateAllInvitGroupUser = (data) => ({
  type: adminUserTypes.GET_ALL_ADMIN_GROUP_UPDATE,
  payload: data
});

// Get all groups to be invited
export const getUserSessionRequest = (string) => ({
  type: adminUserTypes.GET_USER_SESSION_REQUEST,
  payload: string
});
export const getUserSessionSuccess = (data) => ({
  type: adminUserTypes.GET_USER_SESSION_SUCCESS,
  payload: data
});
export const getUserSessionFailed = (data) => ({
  type: adminUserTypes.GET_USER_SESSION_FAILED,
  payload: data
});

export const resetUserSession = (data) => ({
  type: adminUserTypes.GET_USER_SESSION_RESET,
  payload: data
});

export const updateUserSession = (data) => ({
  type: adminUserTypes.GET_USER_SESSIONP_UPDATE,
  payload: data
});