import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from '../utils/logger';
const fileLocation = "src\\services\\adminEvent.js";

export const adminEventServices = {
  getAdminEvent, changeEventVisibility, kickUserFromEvent
}

// Get Admin Event list
function getAdminEvent(data) {
  try {
    return axios.get(`${API_URL}adminEvent/allevent`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAdminEvent' })
    return { status: 422, message }

  }
}

// Change visibility
function changeEventVisibility({ id, data }) {
  try {
    return axios.patch(`${API_URL}adminEvent/eventprivacy`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAdminEvent' })
    return { status: 422, message }

  }
}

// Remove user from Event
function kickUserFromEvent(data) {
  try {
    return axios.post(`${API_URL}adminEvent/kickmember`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'deleteEventEvent' })
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
