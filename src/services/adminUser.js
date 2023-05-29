/**
 * Discover services
 */
import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from './../utils/logger';

const fileLocation = "src\\services\\adminUser.js";

export const adminUserServices = {
  getAllUsers, getAdminOrgDetail, getAdminUserDetail, changeAdminUserRole, removeUserFromOrg, getAllGroups, getUserSession
}

function getAllUsers(data) {
  try {
    return axios.get(`${API_URL}admin/${getAdminToken()}/alluser`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAllUsers' })
    return { status: 422, message }
  }
}

function getAllGroups(data) {
  try {
    return axios.get(`${API_URL}admin/${getAdminToken()}/all-groups`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAllGroups' })
    return { status: 422, message }
  }
}

function getAdminOrgDetail(data) {
  try {
    return axios.get(`${API_URL}admin/${getAdminToken()}/orgdetail`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAdminOrgDetail' })
    return { status: 422, message }
  }
}

function getAdminUserDetail(data) {
  try {
    return axios.get(`${API_URL}admin/${getAdminToken()}/userdetail`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAdminUserDetail' })
    return { status: 422, message }
  }
}

function changeAdminUserRole(data) {
  try {
    return axios.post(`${API_URL}admin/${getAdminToken()}/${data.user_id}/changerole`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'changeAdminUserRole' })
    return { status: 422, message }
  }
}

function removeUserFromOrg(data) {
  try {
    return axios.post(`${API_URL}admin/${getAdminToken()}/${data.user_id}/remove-org-user`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'removeUserFromOrg' })
    return { status: 422, message }
  }
}

function getUserSession(data) {
  try {
    return axios.get(`${API_URL}open/get-user-session`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAdminUserDetail' })
    return { status: 422, message }
  }
}

// Token and Header
function getToken() {
  return localStorage.getItem('accessToken');
}
function getAdminToken() {
  return localStorage.getItem('admin_identifier');
}
function authHeader() {
  return { Authorization: getToken() }
}
