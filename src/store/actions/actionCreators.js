import {
  SET_USERS_LIST, SET_CURRENT_USER, REGISTER_SUCCESS, LOGOUT, GET_ERRORS, GET_RESPONSE, GET_TIMEZONE,
  SET_USER_ORG_LIST, SET_ORG_GRP_LIST, SET_MY_GRP_LIST, SET_GRP_DETLS,
  LEAVE_GRP, MUTE_GRP, UNMUTE_GRP, JOIN_GRP, SEND_INVITE, SEARCH_MEMBER, GROUP_IMAGE, TERMS_OF_SERVICE
} from "./types";

export function setUsersData(data) {
  return {
    type: SET_USERS_LIST,
    payload: data
  }
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    payload: user
  }
}

export function setUserOrgList(org) {
  return {
    type: SET_USER_ORG_LIST,
    payload: org
  }
}

export function setOrgGroupList(group) {
  return {
    type: SET_ORG_GRP_LIST,
    payload: group
  }
}

export function setMyGroupList(group) {
  return {
    type: SET_MY_GRP_LIST,
    payload: group
  }
}

export function leaveGroup(group) {
  return {
    type: LEAVE_GRP,
    payload: group
  }
}

export function groupAvtar(group) {
  return {
    type: GROUP_IMAGE,
    payload: group
  }
}

export function groupMute(group) {
  return {
    type: MUTE_GRP,
    payload: group
  }
}

export function groupUnmute(group) {
  return {
    type: UNMUTE_GRP,
    payload: group
  }
}

export function groupJoin(group) {
  return {
    type: JOIN_GRP,
    payload: group
  }
}

export function searchMember(group) {
  return {
    type: SEARCH_MEMBER,
    payload: group
  }
}

export function sendInvite(group) {
  return {
    type: SEND_INVITE,
    payload: group
  }
}

export function setGroupDetails(details) {
  return {
    type: SET_GRP_DETLS,
    payload: details
  }
}

export function registerSuccess() {
  return {
    type: REGISTER_SUCCESS
  }
}

export function logoutUser() {
  return {
    type: LOGOUT
  }
}

export function getErrors(errors) {
  return {
    type: GET_ERRORS,
    payload: errors
  }
}

export function getResponse(data) {
  return {
    type: GET_RESPONSE,
    payload: data
  }
}

export function getTimezone(data) {
  return {
    type: GET_TIMEZONE,
    payload: data
  }
}

export function getTermsofservice(data) {
  return {
    type: TERMS_OF_SERVICE,
    payload: data
  }
}
