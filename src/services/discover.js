/**
 * Discover services
 */
import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from './../utils/logger';

const fileLocation = "src\\services\\discover.js";

export const discoverServices = {
  getAllDiscover, getDefaultDiscover, getOrgDiscover, getGrpDiscover, getEvtDiscover, getPplDiscover
}

function getAllDiscover(data) {
  try {
    return axios.get(`${API_URL}discover/alldiscover`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getAllDiscover' })
    return { status: 422, message }
  }
}

function getDefaultDiscover(data) {
  try {
    return axios.get(`${API_URL}discover/defaultdiscover`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getDefaultDiscover' })
    return { status: 422, message }
  }
}

function getOrgDiscover(data) {
  try {
    return axios.get(`${API_URL}discover/organizationdiscover`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getOrgDiscover' })
    return { status: 422, message }
  }
}

function getGrpDiscover(data) {
  try {
    return axios.get(`${API_URL}discover/groupdiscover`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getGrpDiscover' })
    return { status: 422, message }
  }
}

function getEvtDiscover(data) {
  try {
    return axios.get(`${API_URL}discover/eventdiscover`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getEvtDiscover' })
    return { status: 422, message }
  }
}

function getPplDiscover(data) {
  try {
    return axios.get(`${API_URL}discover/peoplediscover`, { params: data, headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getPplDiscover' })
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
