import { call, put, takeLatest } from 'redux-saga/effects'
import { discoverTypes } from '../store/actions/types'
import { discoverServices } from '../services';
import { Logger } from './../utils/logger';
import {
  allDiscoverSuccess, allDiscoverFailed, defaultDiscoverSuccess, defaultDiscoverFailed,
  organizationDiscoverSuccess, organizationDiscoverFailed, groupDiscoverSuccess,
  groupDiscoverFailed, eventDiscoverSuccess, eventDiscoverFailed, peopleDiscoverSuccess,
  peopleDiscoverFailed
} from '../store/actions';

const fileLocation = "src\\saga\\discover.js";

// Get all discover
function* allDiscoverAsync({ payload }) {
  try {
    const data = yield call(discoverServices.getAllDiscover, payload);
    if(data.status === 200) {
      yield put(allDiscoverSuccess(data.data));
    } else {
      yield put(allDiscoverFailed({
        message: "Error while retrieving all discover details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'allDiscoverAsync' })
    yield put(allDiscoverFailed({ message }));
  }
}
export function* allDiscoverSaga() {
  yield takeLatest(discoverTypes.ALL_DISCOVER_REQUEST, allDiscoverAsync);
}

// Get default discover
function* defaultDiscoverAsync({ payload }) {
  try {
    const data = yield call(discoverServices.getDefaultDiscover, payload);
    if(data.status === 200) {
      yield put(defaultDiscoverSuccess(data.data));
    } else {
      yield put(defaultDiscoverFailed({
        message: "Error while retrieving all discover details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'defaultDiscoverAsync' })
    yield put(defaultDiscoverFailed({ message }));
  }
}
export function* defaultDiscoverSaga() {
  yield takeLatest(discoverTypes.DEFAULT_DISCOVER_REQUEST, defaultDiscoverAsync);
}

// Get organization discover
function* orgDiscoverAsync({ payload }) {
  try {
    const data = yield call(discoverServices.getOrgDiscover, payload);
    if(data.status === 200) {
      yield put(organizationDiscoverSuccess(data.data));
    } else {
      yield put(organizationDiscoverFailed({
        message: "Error while retrieving organization discover details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'orgDiscoverAsync' })
    yield put(organizationDiscoverFailed({ message }));
  }
}
export function* orgDiscoverSaga() {
  yield takeLatest(discoverTypes.ORG_DISCOVER_REQUEST, orgDiscoverAsync);
}

// Get group discover
function* grpDiscoverAsync({ payload }) {
  try {
    const data = yield call(discoverServices.getGrpDiscover, payload);
    if(data.status === 200) {
      yield put(groupDiscoverSuccess(data.data));
    } else {
      yield put(groupDiscoverFailed({
        message: "Error while retrieving group discover details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'grpDiscoverAsync' })
    yield put(groupDiscoverFailed({ message }));
  }
}
export function* grpDiscoverSaga() {
  yield takeLatest(discoverTypes.GRP_DISCOVER_REQUEST, grpDiscoverAsync);
}

// Get event discover
function* evtDiscoverAsync({ payload }) {
  try {
    const data = yield call(discoverServices.getEvtDiscover, payload);
    if(data.status === 200) {
      yield put(eventDiscoverSuccess(data.data));
    } else {
      yield put(eventDiscoverFailed({
        message: "Error while retrieving event discover details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'evtDiscoverAsync' })
    yield put(eventDiscoverFailed({ message }));
  }
}
export function* evtDiscoverSaga() {
  yield takeLatest(discoverTypes.EVT_DISCOVER_REQUEST, evtDiscoverAsync);
}

// Get people discover
function* pplDiscoverAsync({ payload }) {
  try {
    const data = yield call(discoverServices.getPplDiscover, payload);
    if(data.status === 200) {
      yield put(peopleDiscoverSuccess(data.data));
    } else {
      yield put(peopleDiscoverFailed({
        message: "Error while retrieving people discover details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'pplDiscoverAsync' })
    yield put(peopleDiscoverFailed({ message }));
  }
}
export function* pplDiscoverSaga() {
  yield takeLatest(discoverTypes.PPL_DISCOVER_REQUEST, pplDiscoverAsync);
}
