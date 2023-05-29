import { call, put, takeLatest } from 'redux-saga/effects'
import { adminEventTypes } from '../store/actions/types'
import { adminEventServices } from '../services';
import {
  adminEventListSuccess, adminEventListFailed, changeEventVisibilitySuccess, changeEventVisibilityFailed, kickUserFromEventSuccess, kickUserFromEventFailed
} from '../store/actions/adminEventActions';
import { Logger } from '../utils/logger';

const fileLocation = "src\\saga\\adminEvent.js";

// Get Admin group list
function* adminEventListRequestAsync({ payload }) {

  try {
    const data = yield call(adminEventServices.getAdminEvent, payload);
    if (data.status === 200) {
      yield put(adminEventListSuccess(data.data));
    } else {
      yield put(adminEventListFailed({
        message: "Error while retrieving Admin Event list"
      }));
    }
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'adminEventListRequestAsync' })
  }

}
export function* adminEventListRequestSaga() {
  yield takeLatest(adminEventTypes.ADM_EVT_LIST_REQUEST, adminEventListRequestAsync);
}

// Change visibility
function* changeVisibilityRequestAsync({ payload }) {

  try {
    const data = yield call(adminEventServices.changeEventVisibility, payload);
    if (data.status === 200) {
      yield put(changeEventVisibilitySuccess(data.data));
    } else {
      yield put(changeEventVisibilityFailed(data));
    }
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'changeEventVisibilityRequestAsync' })
  }

}
export function* changeVisibilityRequestSaga() {
  yield takeLatest(adminEventTypes.EVT_CHANGE_VISIBILITY_REQUEST, changeVisibilityRequestAsync);
}

// Remove user from group
function* kickUserFromEventRequestAsync({ payload }) {

  try {
    const data = yield call(adminEventServices.kickUserFromEvent, payload);
    if (data.status === 200) {
      yield put(kickUserFromEventSuccess({ ...data.data, group_id: payload.id }));
    } else {
      yield put(kickUserFromEventFailed(data));
    }
  } catch ({ message }) {
    Logger.error({ fileLocation, message, trace: 'kickUserFromEventRequestAsync' })
  }

}
export function* kickUserFromEventRequestSaga() {
  yield takeLatest(adminEventTypes.KICK_USER_FROM_EVENT_REQUEST, kickUserFromEventRequestAsync);
}
