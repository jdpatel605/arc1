import axios from './axiosCommon';
import {API_URL} from '../config';

const groupCall = {
  getMeeting,
}

export default groupCall

function getMeeting(data) {
  return axios.post(`${API_URL}meeting`, data)
}
