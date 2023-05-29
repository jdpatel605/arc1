/**
 * Auth Service
 */
import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from './../utils/logger';

const fileLocation = "src\\services\\AuthService.js";

const AuthService = {
  login: function (email, password) {
    try {
      return axios.post(`${API_URL}open/login`, { email: email, password: password })
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:login' })
      return { status: 422, message }
    }
  },
  register: function (data) {
    try {
      return axios.post(`${API_URL}signup`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:register' })
      return { status: 422, message }
    }
  },
  countries: function (data) {
    try {
      return axios.post(`${API_URL}open/countries`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:countries' })
      return { status: 422, message }
    }
  },
  timezone: function (data) {
    try {
      return axios.post(`${API_URL}open/timezone`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:timezone' })
      return { status: 422, message }
    }
  },
  confirmOtp: function (data) {
    try {
      return axios.post(`${API_URL}signup/confirm`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:confirmOtp' })
      return { status: 422, message }
    }
  },
  sendForgotPasswordOtp: function (data) {
    try {
      return axios.post(`${API_URL}open/send-reset-link`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:sendForgotPasswordOtp' })
      return { status: 422, message }
    }
  },
  verifyPasswordOtp: function (data) {
    try {
      return axios.post(`${API_URL}open/verify-reset-password`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:verifyPasswordOtp' })
      return { status: 422, message }
    }
  },
  resendOtp: function (data) {
    try {
      return axios.post(`${API_URL}open/resend-otp`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:resendOtp' })
      return { status: 422, message }
    }
  },
  passwordReset: function (data) {
    try {
      return axios.post(`${API_URL}open/reset-password`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:passwordReset' })
      return { status: 422, message }
    }
  },
  getProfile: function (data) {
    try {
      return axios.post(`${API_URL}user/profile`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:getProfile' })
      return { status: 422, message }
    }
  },
  getMyOrg: function (data) {
    try {
      return axios.post(`${API_URL}user/organizations`, data)
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:getMyOrg' })
      return { status: 422, message }
    }
  },
  logout: function () {

    // Clear local storage
    const items = { ...localStorage };
    for (const key in items) {
      localStorage.removeItem(key);
    }

  },
  getToken: function () {
    return localStorage.getItem('accessToken');
  },
  saveToken: function (token) {
    localStorage.setItem('accessToken', token);
  },
  authHeader: function () {
    return { Authorization: this.getToken() }
  },
  authImageHeader: function () {
    return { Authorization: this.getToken(), 'content-type': 'multipart/form-data' }
  },
  termsofservice: function () {
    try {
      return axios.get(`${API_URL}open/termsofservice`, '')
        .then(res => res.data)
        .catch(err => err.response.data);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:gettermsofservice' })
      return { status: 422, message }
    }
  }
}
export default AuthService
