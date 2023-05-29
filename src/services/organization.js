/**
 * Organization services
 */
import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from './../utils/logger';

const fileLocation = "src\\services\\organization.js";

export const organizationServices = {
  organizationById, checkSubscription, subscribeOrganization, unsubscribeOrganization,
  searchMember, inviteMember, cancelMemberInvitation, checkNotifMute, muteOrgNotif, resumeOrgNotif,
  loadMoreOrgEvents, updateOrganization, getStateList
}

function organizationById(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/details`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'organizationById' })
    return { status: 422, message }
  }
}
function getStateList(country) {
  try {
    return axios.get(`${API_URL}organization/${country}/states`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getStateList' })
    return { status: 422, message }
  }
}
function checkSubscription(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/check-subscription`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'checkSubscription' })
    return { status: 422, message }
  }
}
function subscribeOrganization(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/subscribe`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'subscribeOrganization' })
    return { status: 422, message }
  }
}
function unsubscribeOrganization(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/unsubscribe`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'unsubscribeOrganization' })
    return { status: 422, message }
  }
}

function searchMember({ organization_id, search }) {
  try {
    return axios.get(`${API_URL}organization/search-members/${organization_id}/${search}`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'searchMember' })
    return { status: 422, message }
  }
}

function inviteMember({ organization_id, identifier }) {
  try {
    return axios.get(`${API_URL}organization/invite-member/${organization_id}/${identifier}`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'inviteMember' })
    return { status: 422, message }
  }
}

function cancelMemberInvitation({ organization_id, identifier }) {
  try {
    return axios.get(`${API_URL}organization/cancel-member-invitation/${organization_id}/${identifier}`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'cancelMemberInvitation' })
    return { status: 422, message }
  }
}

function checkNotifMute(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/notifications/status`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'checkNotifMute' })
    return { status: 422, message }
  }
}

function muteOrgNotif(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/notifications/mute`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'muteOrgNotif' })
    return { status: 422, message }
  }
}

function resumeOrgNotif(id) {
  try {
    return axios.get(`${API_URL}organization/${id}/notifications/resume`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'resumeOrgNotif' })
    return { status: 422, message }
  }
}

function loadMoreOrgEvents({ id, page }) {
  try {
    return axios.get(`${API_URL}organization/events/${id}/${page}`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'loadMoreOrgEvents' })
    return { status: 422, message }
  }
}

function updateOrganization({ id, data }) {
  try {
    return axios.patch(`${API_URL}organization/${id}/update`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updateOrganization' })
    return { status: 422, message }
  }
}

// Token and Header
function getToken() {
  return localStorage.getItem('accessToken');
}
function authHeader() {
  return { Authorization: getToken() }
}
