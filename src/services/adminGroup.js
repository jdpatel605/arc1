/**
 * Group services
 */
import axios from './axiosCommon';
import {API_URL} from '../config';
import {Logger} from './../utils/logger';

const fileLocation = "src\\services\\adminGroup.js";

export const adminGroupServices = {
  getAdminGroup, changeVisibility, assignNewGroupOwner, inviteToGroupMemberList, inviteGroupMember, cancleInviteGroupMember, deleteAdminGroup, adminGroupDetails, adminEditGroupDetails, detailsGroupMemberList, promoteUserRole, kickUserFromGroup, groupEventList, deleteGroupEvent, inviteGroupEvent, createAdminEvent, editAdminEvent, createAdminGroup, updateAdminGroup
}

// Get Admin group list
function getAdminGroup(data) {
  try {
    return axios.get(`${API_URL}adminGroup/list`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getAdminGroup'})
    return {status: 422, message}

  }
}

// Change visibility
function changeVisibility({ id, data }) {
  try {
    return axios.post(`${API_URL}adminGroup/${id}/visibility`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'changeVisibility'})
    return {status: 422, message}

  }
}

// Assign new group owner
function assignNewGroupOwner(data) {
  try {
    return axios.post(`${API_URL}adminGroup/assign-group-woner`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'assignNewGroupOwner'})
    return {status: 422, message}

  }
}

// Invite group member list
function inviteToGroupMemberList(data) {
  try {
    return axios.post(`${API_URL}adminGroup/invitememberlist`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteToGroupMemberList'})
    return {status: 422, message}

  }
}

// Invite group member
function inviteGroupMember({group_id, identifier}) {
  try {
    return axios.get(`${API_URL}adminGroup/invite-member/${group_id}/${identifier}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteMember'})
    return {status: 422, message}

  }
}

// Cancle invite group member
function cancleInviteGroupMember({group_id, identifier}) {
  try {
    return axios.get(`${API_URL}adminGroup/cancel-member-invitation/${group_id}/${identifier}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'cancelMemberInvitation'})
    return {status: 422, message}

  }
}

// Delete admin group
function deleteAdminGroup(id) {
  try {
    return axios.delete(`${API_URL}adminGroup/${id}/delete`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteAdminGroup'})
    return {status: 422, message}

  }
}

// Admin group details
function adminGroupDetails(id) {
  try {
    return axios.get(`${API_URL}adminGroup/${id}/extend`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'adminGroupDetails'})
    return {status: 422, message}

  }
}

// Admin edit group details
function adminEditGroupDetails(id) {
  try {
    return axios.get(`${API_URL}adminGroup/${id}/extend`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'adminEditGroupDetails'})
    return {status: 422, message}

  }
}

// Admin group member list
function detailsGroupMemberList(data) {
  try {
    return axios.get(`${API_URL}adminGroup/memberlist`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'detailsGroupMemberList'})
    return {status: 422, message}

  }
}

// Change user role
function promoteUserRole(data) {
  try {
    return axios.post(`${API_URL}adminGroup/role`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'promoteUserRole'})
    return {status: 422, message}

  }
}

// Remove user from group
function kickUserFromGroup(data) {
  try {
    return axios.post(`${API_URL}adminGroup/kick`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteGroupEvent'})
    return {status: 422, message}

  }
}

// Group event list
function groupEventList(data) {
  try {
    return axios.get(`${API_URL}adminGroup/eventlist`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'groupEventList'})
    return {status: 422, message}

  }
}

// Delete group event
function deleteGroupEvent(data) {
  try {
    return axios.post(`${API_URL}adminGroup/deleteevent`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteGroupEvent'})
    return {status: 422, message}

  }
}

// Invite group event
function inviteGroupEvent({type, data}) {
  try {
    return axios.post(`${API_URL}adminGroup/eventinvitation/${type}`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteGroupEvent'})
    return {status: 422, message}

  }
}

// Create an admin event
function createAdminEvent({ id, hostType, data }) {
  try {
    return axios.post(`${API_URL}adminGroup/${hostType}/${id}/create-event`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'createEvent' })
    return { status: 422, message }
  }
}

// Edit an admin event
function editAdminEvent({ id, data }) {
  try {
    return axios.patch(`${API_URL}adminGroup/${id}/update-event`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'editEvent' })
    return { status: 422, message }
  }
}

// Create an admin group
function createAdminGroup(data) {
  try {
    return axios.post(`${API_URL}adminGroup/create-group`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'createAdminGroup'})
    return {status: 422, message}

  }
}

// Update an admin group
function updateAdminGroup(data) {
  try {
    return axios.post(`${API_URL}adminGroup/update-group`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'createAdminGroup'})
    return {status: 422, message}

  }
}

// Token and Header
function getToken() {
  return localStorage.getItem('accessToken');
}
function authHeader() {
  return {Authorization: getToken()}
}
function authGroupCallHeader(id) {
  // Get the access token based on event id stored in localStorage
  const token = localStorage.getItem(id);
  return {
    Authorization: token
  }
}
