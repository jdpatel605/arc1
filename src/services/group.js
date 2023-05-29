/**
 * Group services
 */
import axios from './axiosCommon';
import {API_URL} from '../config';
import {Logger} from './../utils/logger';

const fileLocation = "src\\services\\group.js";

export const groupServices = {
  createGroup, updateGroup, searchMember, inviteMember, cancelMemberInvitation, groupCallInvitation, createGroupEvent,
  joinGroupEvent, guestJoinGroupEvent, getOrganizationGroup, getGroupDetails, getGroupMembers, joinGroup, leaveGroup, deleteGroup, muteGroup, resumeGroup, getEditGroupDetails, getOrganizationList, deleteGroupMember, makeOwner, changeUserRole
}

function createGroup(data) {
  try {
    return axios.post(`${API_URL}group/create`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'createGroup'})
    return {status: 422, message}

  }
}
function updateGroup(data) {
  try {
    return axios.post(`${API_URL}group/update`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'updateGroup'})
    return {status: 422, message}

  }
}
function searchMember({organization_id, group_id, page, search}) {
  try {
    return axios.get(`${API_URL}group/search-members/${organization_id}/${group_id}/${page}/${search}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'searchMember'})
    return {status: 422, message}

  }
}

function inviteMember({group_id, identifier}) {
  try {
    return axios.get(`${API_URL}group/invite-member/${group_id}/${identifier}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteMember'})
    return {status: 422, message}

  }
}

function cancelMemberInvitation({group_id, identifier}) {
  try {
    return axios.get(`${API_URL}group/cancel-member-invitation/${group_id}/${identifier}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'cancelMemberInvitation'})
    return {status: 422, message}

  }
}

function groupCallInvitation(data) {
  try {
    return axios.post(`${API_URL}meeting/invite-member`, data, {headers: authGroupCallHeader(data.eventId)})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'groupCallInvitation'})
    return {status: 422, message}

  }
}

function createGroupEvent(data) {
  try {
    return axios.post(`${API_URL}group/create-event`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'createGroupEvent'})
    return {status: 422, message}

  }
}

function joinGroupEvent(data) {
  try {
    return axios.post(`${API_URL}meeting/join`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'joinGroupEvent'})
    return {status: 422, message}

  }
}

function guestJoinGroupEvent(data) {
  try {
    return axios.post(`${API_URL}meeting/guest-join`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'guestJoinGroupEvent'})
    return {status: 422, message}

  }
}

function getOrganizationGroup(data) {
  try {
    return axios.get(`${API_URL}group/grouplist`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getOrganizationGroup'})
    return {status: 422, message}

  }
}

function getGroupDetails(data) {
  try {
    return axios.get(`${API_URL}group/groupextended`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getGroupDetails'})
    return {status: 422, message}

  }
}

function getEditGroupDetails(data) {
  try {
    return axios.get(`${API_URL}group/groupextended`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getEditGroupDetails'})
    return {status: 422, message}

  }
}

function getGroupMembers(data) {
  try {
    return axios.get(`${API_URL}group/searchgroupmember`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getGroupMembers'})
    return {status: 422, message}

  }
}

function joinGroup(data) {
  try {
    return axios.post(`${API_URL}group/joingroup`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'joinGroup'})
    return {status: 422, message}

  }
}

function leaveGroup(id) {
  try {
    return axios.delete(`${API_URL}group/leaveGroup/${id}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'leaveGroup'})
    return {status: 422, message}

  }
}

function deleteGroup(id) {
  try {
    return axios.delete(`${API_URL}group/deletegroup/${id}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteGroup'})
    return {status: 422, message}

  }
}

function deleteGroupMember(data) {
  try {
    return axios.post(`${API_URL}group/deletegroupmember`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteGroupMember'})
    return {status: 422, message}

  }
}

function muteGroup(data) {
  try {
    return axios.post(`${API_URL}group/mutegroup`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'muteGroup'})
    return {status: 422, message}

  }
}

function resumeGroup(id) {
  try {
    return axios.delete(`${API_URL}group/unmutegroup/${id}`, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'resumeGroup'})
    return {status: 422, message}

  }
}

function makeOwner(data) {
  try {
    return axios.post(`${API_URL}group/makeowner`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'makeOwner'})
    return {status: 422, message}

  }
}

function changeUserRole(data) {
  try {
    return axios.post(`${API_URL}group/changeuserrole`, data, {headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'changeUserRole'})
    return {status: 422, message}

  }
}

function getOrganizationList(data) {
  try {
    return axios.get(`${API_URL}group/organizationlist`, {params: data, headers: authHeader()})
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getOrganizationList'})
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
