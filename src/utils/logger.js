
import axios from './../services/axiosCommon';
import { API_URL } from './../config';
import { Helper } from './helper';

export const Logger = {
  info, error
}

function info(params) {
  dispatchLogAction({ ...params, level: 'INFO' });
}
function error(params) {
  dispatchLogAction({ ...params, level: 'ERROR' });
}

function dispatchLogAction(data) {
  axios.post(`${API_URL}open/error-log`, data, { headers: Helper.authHeader() })
    .then(res => res)
    .catch(err => err);
}