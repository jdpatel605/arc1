import { call, put, takeLatest } from 'redux-saga/effects'
import { adminUserTypes } from '../store/actions/types'
import { adminUserServices } from '../services';
import { Logger } from './../utils/logger';
import {
  getAllUsersSuccess, getAllUsersFailed, getOrganizationDetailSuccess, getOrganizationDetailFailed, getAdminUserDetailSuccess, 
  getAdminUserDetailFailed, changeAdminUserRoleSuccess, changeAdminUserRoleFailed, removeUserFromOrgFailed, removeUserFromOrgSuccess,
  getAllOwnerUsersSuccess, getAllOwnerUsersFailed, getAllInvitGroupFailed, getAllInvitGroupSuccess, getUserSessionFailed, getUserSessionSuccess
} from '../store/actions';

const fileLocation = "src\\saga\\adminUsers.js";

// Get all admin users
function* allUsersAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.getAllUsers, payload);
    if(data.status === 200) {
      yield put(getAllUsersSuccess(data.data));
    } else {
      yield put(getAllUsersFailed({
        message: "Error while retrieving all user details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'allUsersAsync' })
    yield put(getAllUsersFailed({ message }));
  }
}
export function* allUserSaga() {
  yield takeLatest(adminUserTypes.GET_ADMIN_USER_REQUEST, allUsersAsync);
}

// Get admin org detail
function* orgDetailAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.getAdminOrgDetail, payload);
    if(data.status === 200) {
      yield put(getOrganizationDetailSuccess(data.data));
    } else {
      yield put(getAllUsersFailed({
        message: "Error while retrieving all user details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'orgDetailAsync' })
    yield put(getOrganizationDetailFailed({ message }));
  }
}
export function* adminOrgDetailSaga() {
  yield takeLatest(adminUserTypes.GET_ADMIN_ORG_REQUEST, orgDetailAsync);
}

// Get admin user detail
function* userDetailAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.getAdminUserDetail, payload);
    if(data.status === 200) {
      yield put(getAdminUserDetailSuccess(data.data));
    } else {
      yield put(getAdminUserDetailFailed({
        message: "Error while retrieving user details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'userDetailAsync' })
    yield put(getAdminUserDetailFailed({ message }));
  }
}
export function* adminUserDetailSaga() {
  yield takeLatest(adminUserTypes.GET_ADMIN_USER_DETAIL_REQUEST, userDetailAsync);
}

// Change admin user role
function* changeUserRoleAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.changeAdminUserRole, payload);
    if(data.status === 200) {
      yield put(changeAdminUserRoleSuccess({...data.data, ...payload}));
    } else {
      yield put(changeAdminUserRoleFailed({ ...data.message, ...payload}));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'changeUserRoleAsync' })
    yield put(changeAdminUserRoleFailed({ message , ...payload}));
  }
}
export function* changeUserRoleSaga() {
  yield takeLatest(adminUserTypes.CHANGE_ADMIN_USER_ROLE_REQUEST, changeUserRoleAsync);
}

// Remove user from org
function* removeUserFromOrgAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.removeUserFromOrg, payload);
    if(data.status === 200) {
      yield put(removeUserFromOrgSuccess({...data.data, ...payload}));
    } else {
      yield put(removeUserFromOrgFailed({ ...data.message, ...payload}));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'removeUserFromOrgAsync' })
    yield put(removeUserFromOrgFailed({ message , ...payload}));
  }
}
export function* removeUserFromOrgSaga() {
  yield takeLatest(adminUserTypes.REMOVE_USER_FROM_ORG_REQUEST, removeUserFromOrgAsync);
}

// Get all admin owner users
function* allOwnerUsersAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.getAllUsers, payload);
    if(data.status === 200) {
      yield put(getAllOwnerUsersSuccess(data.data));
    } else {
      yield put(getAllOwnerUsersFailed({
        message: "Error while retrieving all user details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'allOwnerUsersAsync' })
    yield put(getAllOwnerUsersFailed({ message }));
  }
}
export function* allOwnerUserSaga() {
  yield takeLatest(adminUserTypes.GET_OWNER_USER_REQUEST, allOwnerUsersAsync);
}

// Get all groups to be invited
function* allOwnerGroupsAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.getAllGroups, payload);
    if(data.status === 200) {
      yield put(getAllInvitGroupSuccess(data.data));
    } else {
      yield put(getAllInvitGroupFailed({
        message: "Error while retrieving all group list"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'allOwnerGroupsAsync' })
    yield put(getAllInvitGroupFailed({ message }));
  }
}
export function* allOwnerGroupSaga() {
  yield takeLatest(adminUserTypes.GET_ALL_ADMIN_GROUP_REQUEST, allOwnerGroupsAsync);
}

// Get user session
function* getUserSessionAsync({ payload }) {
  try {
    const data = yield call(adminUserServices.getUserSession, payload);
    if(data.status === 200) {
      yield put(getUserSessionSuccess(data.data));
    } else {
      yield put(getUserSessionFailed({
        message: "Error while retrieving user session"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'getUserSessionAsync' })
    yield put(getUserSessionFailed({ message }));
  }
}
export function* getUserSessionSaga() {
  yield takeLatest(adminUserTypes.GET_USER_SESSION_REQUEST, getUserSessionAsync);
}