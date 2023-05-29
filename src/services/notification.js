/**
 * Notification services
 */
import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from './../utils/logger';

const fileLocation = "src\\services\\notification.js";

export const notificationServices = {
  list, acceptRejectInvite, deleteNotif, readUnreadNotif, unreadNotifCount
}

function list(page) {
  try {
    return axios.get(`${API_URL}notification/list/${page}`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'list' })
    return { status: 422, message }
  }
}

function acceptRejectInvite(data) {
  try {
    return axios.post(`${API_URL}notification/accept-reject`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'acceptRejectInvite' })
    return { status: 422, message }
  }
}

function deleteNotif(id) {
  try {
    return axios.get(`${API_URL}notification/${id}/delete`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'deleteNotif' })
    return { status: 422, message }
  }
}

function readUnreadNotif(data) {
  try {
    return axios.put(`${API_URL}notification/manage-read`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'readUnreadNotif' })
    return { status: 422, message }
  }
}

function unreadNotifCount() {
  try {
    return axios.get(`${API_URL}notification/unread/count`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'unreadNotifCount' })
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
