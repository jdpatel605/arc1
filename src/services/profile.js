/**
 * Discover services
 */
import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from './../utils/logger';

export const profileServices = {
  getUserPofile, geCountryData, updateProfile, updatePassword, geTimezoneData, updatePhoneNumber, updateEmailAddress, getSingleProfile, getCurrentUserTimeZone, checkPhoneOTP
}
const fileLocation = "src\\services\\profile.js";
function getUserPofile() {
  try {
    return axios.get(`${API_URL}user/getprofile`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getUserPofile' })
    return { status: 422, message }
  }
}

function geCountryData(data) {
  try {
    return axios.post(`${API_URL}open/countries`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'geCountryData' })
    return { status: 422, message }
  }
}

function geTimezoneData(data) {
  try {
    return axios.post(`${API_URL}open/timezone`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'geTimezoneData' })
    return { status: 422, message }
  }
}

function updateProfile(data) {
  try {
    return axios.post(`${API_URL}user/updateprofile`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updateProfile' })
    return { status: 422, message }
  }
}

function updatePassword(data) {
  try {
    return axios.post(`${API_URL}user/updatepassword`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updatePassword' })
    return { status: 422, message }
  }
}

function updatePhoneNumber(data) {
  try {
    return axios.post(`${API_URL}user/updatephone`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updatePhoneNumber' })
    return { status: 422, message }
  }
}

function checkPhoneOTP(data) {
  try {
    return axios.post(`${API_URL}user/checkphoneotp`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'checkPhoneOTP' })
    return { status: 422, message }
  }
}

function updateEmailAddress(data) {
  try {
    return axios.post(`${API_URL}user/updateemail`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updateEmailAddress' })
    return { status: 422, message }
  }
}

function getSingleProfile(data) {
  try {
    return axios.post(`${API_URL}user/getsingleprofile`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getSingleProfile' })
    return { status: 422, message }
  }
}

function getCurrentUserTimeZone(data) {
  try {
    return axios.get(`${API_URL}user/currenttimezone`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getCurrentUserTimeZone' })
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
