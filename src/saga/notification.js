import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import { notificationTypes } from '../store/actions/types'
import { notificationServices } from '../services';
import { Logger } from './../utils/logger';
import {
  notificationListSuccess, notificationListFailed, deleteNotificationSuccess, deleteNotificationFailed,
  readUnreadNotifSuccess, readUnreadNotifFailed, acceptRejectInviteSuccess, acceptRejectInviteFailed,
  unreadNotifCountSuccess, unreadNotifCountFailed
} from '../store/actions';

const fileLocation = "src\\saga\\notification.js";

// Get notification list detail
function* notificationListRequestAsync({ payload }) {

  try {
    const data = yield call(notificationServices.list, payload);
    if(data.status === 200) {
      yield put(notificationListSuccess(data.data));
    } else {
      yield put(notificationListFailed({
        message: "Error while retrieving list details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'notificationListRequestAsync' })
    yield put(notificationListFailed({ message }));
  }


}
export function* notificationListRequestSaga() {
  yield takeLatest(notificationTypes.LIST_REQUEST, notificationListRequestAsync);
}

// Get notification list detail
function* acceptRejectInviteRequestAsync({ payload }) {

  try {
    const data = yield call(notificationServices.acceptRejectInvite, payload);
    if(data.status === 200) {
      yield put(acceptRejectInviteSuccess(data.data));
    } else {
      yield put(acceptRejectInviteFailed({
        message: "Error while accept/reject notification"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'acceptRejectInviteRequestAsync' })
    yield put(acceptRejectInviteFailed({ message }));
  }


}
export function* acceptRejectInviteRequestSaga() {
  yield takeEvery(notificationTypes.ACCEPT_REJECT_REQUEST, acceptRejectInviteRequestAsync);
}

// Delete notification
function* deleteNotificationAsync({ payload }) {

  try {
    const data = yield call(notificationServices.deleteNotif, payload);
    if(data.status === 200) {
      yield put(deleteNotificationSuccess(data.data));
    } else {
      yield put(deleteNotificationFailed({
        message: "Error while deleting notification"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'deleteNotificationAsync' })
    yield put(deleteNotificationFailed({ message }));
  }

}
export function* deleteNotificationSaga() {
  yield takeEvery(notificationTypes.DELETE_REQUEST, deleteNotificationAsync);
}

// Read and Unread notification
function* readUnreadNotificationAsync({ payload }) {

  try {
    const data = yield call(notificationServices.readUnreadNotif, payload);
    if(data.status === 200) {
      yield put(readUnreadNotifSuccess(data.data));
    } else {
      yield put(readUnreadNotifFailed({
        message: "Error while read unread notification"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'readUnreadNotificationAsync' })
    yield put(readUnreadNotifFailed({ message }));
  }

}
export function* readUnreadNotificationSaga() {
  // yield takeLatest(notificationTypes.READ_UNREAD_REQUEST, readUnreadNotificationAsync);
  yield takeEvery(notificationTypes.READ_UNREAD_REQUEST, readUnreadNotificationAsync);
}

// Unread notifications count
function* unreadNotifCountRequestAsync() {

  try {
    const data = yield call(notificationServices.unreadNotifCount);
    if(data.status === 200) {
      yield put(unreadNotifCountSuccess(data.data));
    } else {
      yield put(unreadNotifCountFailed({
        message: "Error while unread notifications count"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'unreadNotifCountRequestAsync' })
    yield put(unreadNotifCountFailed({ message }));
  }

}
export function* unreadNotifCountRequestSaga() {
  yield takeEvery(notificationTypes.UNREAD_COUNT_REQUEST, unreadNotifCountRequestAsync);
}
