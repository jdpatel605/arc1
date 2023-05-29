import { call, put, takeLatest } from 'redux-saga/effects'
import { profileTypes } from '../store/actions/types'
import { profileServices } from '../services';
import { Logger } from './../utils/logger';
import {
  getProfileSuccess, getProfileFailed, getCountrySuccess, getCountryFailed, updateProfileSuccess,
  updateProfileFailed, updatePasswordSuccess, updatePasswordFailed, getTimezoneSuccess,
  getTimezoneFailed, updatePhoneSuccess, updatePhoneFailed, singleProfileSuccess, singleProfileFailed,
  currentUserTimezoneSuccess, currentUserTimezoneFailed, updateEmailSuccess, updateEmailFailed, checkPhoneOTPSuccess,
  checkPhoneOTPFailed
} from '../store/actions';

const fileLocation = "src\\saga\\profile.js";

// Get User Profile Data
function* getProfileAsync({ payload }) {
  try {
    const data = yield call(profileServices.getUserPofile, payload);
    if(data.status === 200) {
      yield put(getProfileSuccess(data.data));
    } else {
      yield put(getProfileFailed({
        message: "Error while retrieving user details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getProfileAsync' })
    yield put(getProfileFailed({ message }));
  }
}
export function* getProfileSaga() {
  yield takeLatest(profileTypes.GET_PROFILE_REQUEST, getProfileAsync);
}

// Get all Country
function* getCountrDataAsync({ payload }) {
  try {
    const data = yield call(profileServices.geCountryData, payload);
    if(data.status === 200) {
      yield put(getCountrySuccess(data.data));
    } else {
      yield put(getCountryFailed({
        message: "Error while retrieving user details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getCountrDataAsync' })
    yield put(getCountryFailed({ message }));
  }
}
export function* getCountrySaga() {
  yield takeLatest(profileTypes.GET_COUNTRY_REQUEST, getCountrDataAsync);
}

// Update profile data
function* updateProfileAsync({ payload }) {
  try {
    const data = yield call(profileServices.updateProfile, payload);
    if(data.status === 200) {
      yield put(updateProfileSuccess(data));
    } else {
      yield put(updateProfileFailed(data));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updateProfileAsync' })
  }
}
export function* updateProfileSaga() {
  yield takeLatest(profileTypes.UPDATE_PROFILE_REQUEST, updateProfileAsync);
}

// Update password data
function* updatePasswordAsync({ payload }) {
  try {
    const data = yield call(profileServices.updatePassword, payload);
    if(data.status === 200) {
      yield put(updatePasswordSuccess(data));
    } else {
      yield put(updatePasswordFailed(data));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updatePasswordAsync' })
  }
}
export function* updatePasswordSaga() {
  yield takeLatest(profileTypes.UPDATE_PASSWORD_REQUEST, updatePasswordAsync);
}

// Get timezone from country
function* getTimezoneDataAsync({ payload }) {
  try {
    const data = yield call(profileServices.geTimezoneData, payload);
    if(data.status === 200) {
      yield put(getTimezoneSuccess(data.data));
    } else {
      yield put(getTimezoneFailed({
        message: "Error while retrieving timezone details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getTimezoneDataAsync' })
    yield put(getTimezoneFailed({ message }));
  }
}
export function* getTimezoneySaga() {
  yield takeLatest(profileTypes.GET_TIMEZONE_REQUEST, getTimezoneDataAsync);
}

// Update phone data
function* updatePhoneAsync({ payload }) {
  try {
    const data = yield call(profileServices.updatePhoneNumber, payload);
    if(data.status === 200) {
      yield put(updatePhoneSuccess(data));
    } else {
      yield put(updatePhoneFailed(data));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updatePhoneAsync' })
  }
}
export function* updatePhoneSaga() {
  yield takeLatest(profileTypes.UPDATE_PHONE_REQUEST, updatePhoneAsync);
}

// Check phone otp data
function* checkPhoneOTPAsync({ payload }) {
  try {
    const data = yield call(profileServices.checkPhoneOTP, payload);
    if(data.status === 200) {
      yield put(checkPhoneOTPSuccess(data));
    } else {
      yield put(checkPhoneOTPFailed(data));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'checkPhoneOTPAsync' })
  }
}
export function* checkPhoneOTPSaga() {
  yield takeLatest(profileTypes.CHECK_PHONE_OTP_REQUEST, checkPhoneOTPAsync);
}

// Update email data
function* updateEmailAsync({ payload }) {
  try {
    const data = yield call(profileServices.updateEmailAddress, payload);
    if(data.status === 200) {
      yield put(updateEmailSuccess(data));
    } else {
      yield put(updateEmailFailed(data));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'updateEmailAsync' })
  }
}
export function* updateEmailSaga() {
  yield takeLatest(profileTypes.UPDATE_EMAIL_REQUEST, updateEmailAsync);
}

// Get single profile data
function* singleProfileAsync({ payload }) {
  try {
    const data = yield call(profileServices.getSingleProfile, payload);
    if(data.status === 200) {
      yield put(singleProfileSuccess(data.data));
    } else {
      yield put(singleProfileFailed(data));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'singleProfileAsync' })
  }
}
export function* singleProfileSaga() {
  yield takeLatest(profileTypes.SINGLE_PROFILE_REQUEST, singleProfileAsync);
}

// Get current user time zone
function* currentUserTimezoneAsync({ payload }) {
  try {
    const data = yield call(profileServices.getCurrentUserTimeZone, payload);
    if(data.status === 200) {
      yield put(currentUserTimezoneSuccess(data.data));
    } else {
      yield put(currentUserTimezoneFailed(data));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'currentUserTimezoneAsync' })
  }
}
export function* currentUserTimezoneSaga() {
  yield takeLatest(profileTypes.CURRENT_USER_TIMEZONE_REQUEST, currentUserTimezoneAsync);
}
