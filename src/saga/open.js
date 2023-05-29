import { call, put, takeLatest } from 'redux-saga/effects'
import { openTypes } from '../store/actions/types'
import { openServices } from '../services';
import { Logger } from './../utils/logger';
import {
  checkOrgCodeSuccess, checkOrgCodeFailed, seatNofitifySuccess, seatNofitifyFailed
} from '../store/actions';

const fileLocation = "src\\saga\\open.js";

// Check organization code
function* checkOrgCodeRequestAsync({ payload }) {

  try {
    const data = yield call(openServices.checkOrgcode, payload);
    if (data.status === 200) {
      yield put(checkOrgCodeSuccess(data.data));
    } else {
      yield put(checkOrgCodeFailed(data));
    }
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'checkOrgCodeRequestAsync' })
  }

}
export function* checkOrgCodeRequestSaga() {
  yield takeLatest(openTypes.CHECK_ORG_CODE_REQUEST, checkOrgCodeRequestAsync);
}

// Send request for seat notify
function* seatNotifyRequestAsync({ payload }) {

  try {
    const data = yield call(openServices.seatNotify, payload);
    if (data.status === 200) {
      yield put(seatNofitifySuccess(data.data));
    } else {
      yield put(seatNofitifyFailed(data));
    }
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'seatNotifyRequestAsync' })
  }

}
export function* seatNotifyRequestSaga() {
  yield takeLatest(openTypes.SEAT_NOTIFY_REQUEST, seatNotifyRequestAsync);
}