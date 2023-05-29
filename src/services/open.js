/**
 * Discover services
 */
import axios from './axiosCommon';
import { API_URL } from '../config';
import { Logger } from './../utils/logger';

const fileLocation = "src\\services\\open.js";

export const openServices = {
  checkOrgcode, seatNotify
}

function checkOrgcode(id) {
  try {
    return axios.get(`${API_URL}open/${id}/chekorgcode`, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'checkOrgcode' })
    return { status: 422, message }
  }
}

function seatNotify(data) {
  try {
    return axios.post(`${API_URL}open/seatnotify`, data, { headers: authHeader() })
      .then(res => res.data)
      .catch(err => err.response.data);
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'seatNotify' })
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
