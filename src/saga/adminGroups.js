import {call, put, takeLatest} from 'redux-saga/effects'
import {adminGroupTypes} from '../store/actions/types'
import {adminGroupServices} from '../services';
import {
  adminGroupListSuccess, adminGroupListFailed, changeVisibilitySuccess, changeVisibilityFailed, assignNewGroupOwnerSuccess, assignNewGroupOwnerFailed, inviteToGroupMemberListSuccess, inviteToGroupMemberListFailed, inviteGroupMemberSuccess, inviteGroupMemberFailed, cancleInviteGroupMemberSuccess, cancleInviteGroupMemberFailed, deleteAdminGroupSuccess, deleteAdminGroupFailed, adminGroupDetailsSuccess, adminGroupDetailsFailed, adminEditGroupDetailsSuccess, adminEditGroupDetailsFailed, detailsGroupMemberListSuccess, detailsGroupMemberListFailed, promoteUserRoleSuccess, promoteUserRoleFailed, kickUserFromGroupSuccess, kickUserFromGroupFailed, groupEventListSuccess, groupEventListFailed, deleteGroupEventSuccess, deleteGroupEventFailed, inviteGroupEventSuccess, inviteGroupEventFailed, createAdminEventSuccess, createAdminEventFailed, editAdminEventSuccess, editAdminEventFailed, createAdminGroupSuccess, createAdminGroupFailed, updateAdminGroupSuccess, updateAdminGroupFailed } from '../store/actions/adminGroupActions';
import {Logger} from './../utils/logger';

const fileLocation = "src\\saga\\groups.js";

// Get Admin group list
function* adminGroupListRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.getAdminGroup, payload);
    if(data.status === 200) {
      yield put(adminGroupListSuccess(data.data));
    } else {
      yield put(adminGroupListFailed({
        message: "Error while retrieving Admin Group list"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'adminGroupListRequestAsync'})
  }

}
export function* adminGroupListRequestSaga() {
  yield takeLatest(adminGroupTypes.ADM_GRP_LIST_REQUEST, adminGroupListRequestAsync);
}

// Change visibility
function* changeVisibilityRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.changeVisibility, payload);
    if(data.status === 200) {
      yield put(changeVisibilitySuccess(data.data));
    } else {
      yield put(changeVisibilityFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'changeVisibilityRequestAsync'})
  }

}
export function* changeVisibilityRequestSaga() {
  yield takeLatest(adminGroupTypes.CHANGE_VISIBILITY_REQUEST, changeVisibilityRequestAsync);
}

// Assign new group owner
function* assignNewGroupOwnerRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.assignNewGroupOwner, payload);
    if(data.status === 200) {
      yield put(assignNewGroupOwnerSuccess({...data.data, group_id: payload.group_id}));
    } else {
      yield put(assignNewGroupOwnerFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'assignNewGroupOwnerRequestAsync'})
  }

}
export function* assignNewGroupOwnerRequestSaga() {
  yield takeLatest(adminGroupTypes.ASSIGN_NEW_GROUP_OWNER_REQUEST, assignNewGroupOwnerRequestAsync);
}

// Invite group member list
function* inviteToGroupMemberListRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.inviteToGroupMemberList, payload);
    if(data.status === 200) {
      yield put(inviteToGroupMemberListSuccess(data.data));
    } else {
      yield put(inviteToGroupMemberListFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteToGroupMemberListRequestAsync'})
  }

}
export function* inviteToGroupMemberListRequestSaga() {
  yield takeLatest(adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_REQUEST, inviteToGroupMemberListRequestAsync);
}

// Invite group member
function* inviteGroupMemberRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.inviteGroupMember, payload);
    if(data.status === 200) {
      yield put(inviteGroupMemberSuccess({...data.data, group_id: payload.group_id }));
    } else {
      yield put(inviteGroupMemberFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteGroupMemberRequestAsync'})
  }

}
export function* inviteGroupMemberRequestSaga() {
  yield takeLatest(adminGroupTypes.INVITE_GROUP_MEMBER_REQUEST, inviteGroupMemberRequestAsync);
}

// Cancle invite group member
function* cancleInviteGroupMemberRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.cancleInviteGroupMember, payload);
    if(data.status === 200) {
      yield put(cancleInviteGroupMemberSuccess({...data.data, group_id: payload.group_id }));
    } else {
      yield put(cancleInviteGroupMemberFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'cancleInviteGroupMemberRequestAsync'})
  }

}
export function* cancleInviteGroupMemberRequestSaga() {
  yield takeLatest(adminGroupTypes.CANCLE_INVITE_GROUP_MEMBER_REQUEST, cancleInviteGroupMemberRequestAsync);
}

// Delete admin group
function* deleteAdminGroupRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.deleteAdminGroup, payload);
    if(data.status === 200) {
      yield put(deleteAdminGroupSuccess(data.data));
    } else {
      yield put(deleteAdminGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteAdminGroupRequestAsync'})
  }

}
export function* deleteAdminGroupRequestSaga() {
  yield takeLatest(adminGroupTypes.DELETE_ADM_GRP_REQUEST, deleteAdminGroupRequestAsync);
}

// Admin group details
function* adminGroupDetailsRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.adminGroupDetails, payload);
    if(data.status === 200) {
      yield put(adminGroupDetailsSuccess(data.data));
    } else {
      yield put(adminGroupDetailsFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'adminGroupDetailsRequestAsync'})
  }

}
export function* adminGroupDetailsRequestSaga() {
  yield takeLatest(adminGroupTypes.ADM_GRP_DETAILS_REQUEST, adminGroupDetailsRequestAsync);
}

// Admin edit group details
function* adminEditGroupDetailsRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.adminEditGroupDetails, payload);
    if(data.status === 200) {
      yield put(adminEditGroupDetailsSuccess(data.data));
    } else {
      yield put(adminEditGroupDetailsFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'adminEditGroupDetailsRequestAsync'})
  }

}
export function* adminEditGroupDetailsRequestSaga() {
  yield takeLatest(adminGroupTypes.ADM_EDIT_GRP_DETAILS_REQUEST, adminEditGroupDetailsRequestAsync);
}

// Admin group member details
function* detailsGroupMemberListRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.detailsGroupMemberList, payload);
    if(data.status === 200) {
      yield put(detailsGroupMemberListSuccess(data.data));
    } else {
      yield put(detailsGroupMemberListFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'detailsGroupMemberListRequestAsync'})
  }

}
export function* detailsGroupMemberListRequestSaga() {
  yield takeLatest(adminGroupTypes.GRP_DETAILS_MEMBER_LIST_REQUEST, detailsGroupMemberListRequestAsync);
}

// Change user role
function* promoteUserRoleRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.promoteUserRole, payload);
    if(data.status === 200) {
      yield put(promoteUserRoleSuccess({...data.data, group_id: payload.id}));
    } else {
      yield put(promoteUserRoleFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'promoteUserRoleRequestAsync'})
  }

}
export function* promoteUserRoleRequestSaga() {
  yield takeLatest(adminGroupTypes.PROMOTE_USER_ROLE_REQUEST, promoteUserRoleRequestAsync);
}

// Remove user from group
function* kickUserFromGroupRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.kickUserFromGroup, payload);
    if(data.status === 200) {
      yield put(kickUserFromGroupSuccess({...data.data, group_id: payload.id}));
    } else {
      yield put(kickUserFromGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'kickUserFromGroupRequestAsync'})
  }

}
export function* kickUserFromGroupRequestSaga() {
  yield takeLatest(adminGroupTypes.KICK_USER_FROM_GROUP_REQUEST, kickUserFromGroupRequestAsync);
}

// Group event list
function* groupEventListRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.groupEventList, payload);
    if(data.status === 200) {
      yield put(groupEventListSuccess(data.data));
    } else {
      yield put(groupEventListFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'groupEventListRequestAsync'})
  }

}
export function* groupEventListRequestSaga() {
  yield takeLatest(adminGroupTypes.GROUP_EVENT_LIST_REQUEST, groupEventListRequestAsync);
}

// Group event list
function* deleteGroupEventRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.deleteGroupEvent, payload);
    if(data.status === 200) {
      yield put(deleteGroupEventSuccess(data.data));
    } else {
      yield put(deleteGroupEventFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteGroupEventRequestAsync'})
  }

}
export function* deleteGroupEventRequestSaga() {
  yield takeLatest(adminGroupTypes.DELETE_GROUP_EVENT_REQUEST, deleteGroupEventRequestAsync);
}

// Invite group event
function* inviteGroupEventRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.inviteGroupEvent, payload);
    if(data.status === 200) {
      yield put(inviteGroupEventSuccess(data.data));
    } else {
      yield put(inviteGroupEventFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteGroupEventRequestAsync'})
  }

}
export function* inviteGroupEventRequestSaga() {
  yield takeLatest(adminGroupTypes.INVITE_GROUP_EVENT_REQUEST, inviteGroupEventRequestAsync);
}

// Create an event
function* createAdminEventRequestWorker({ payload }) {

  try {
    const data = yield call(adminGroupServices.createAdminEvent, payload);
    if(data.status === 200) {
      yield put(createAdminEventSuccess(data.data));
    } else {
      let message = 'Error while creating an event'
      if(data.message.message === 'name has already been taken') {
        message = 'Event name has already been taken';
      }
      yield put(createAdminEventFailed({ message }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'createAdminEventRequestWorker' })
    yield put(createAdminEventFailed({ message }));
  }
}
export function* createAdminEventRequestWatcher() {
  yield takeLatest(adminGroupTypes.CREATE_ADMIN_EVENT_REQUEST, createAdminEventRequestWorker);
}

// Edit an event
function* editAdminEventRequestWorker({ payload }) {

  try {
    const data = yield call(adminGroupServices.editAdminEvent, payload);
    if(data.status === 200) {
      yield put(editAdminEventSuccess(data.data));
    } else {
      let message = 'Error while creating an event'
      if(data.message.message === 'name has already been taken') {
        message = 'Event name has already been taken';
      }
      yield put(editAdminEventFailed({ message }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'editAdminEventRequestWorker' });
    yield put(editAdminEventFailed({ message }));
  }
}
export function* editAdminEventRequestWatcher() {
  yield takeLatest(adminGroupTypes.EDIT_ADMIN_EVENT_REQUEST, editAdminEventRequestWorker);
}

// Create an admin group
function* createAdminGroupRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.createAdminGroup, payload);
    if(data.status === 200) {
      yield put(createAdminGroupSuccess(data.data));
    } else {
      yield put(createAdminGroupFailed(data.data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'createAdminGroupRequestAsync'})
  }

}
export function* createAdminGroupRequestSaga() {
  yield takeLatest(adminGroupTypes.CREATE_ADMIN_GROUP_REQUEST, createAdminGroupRequestAsync);
}

// Update an admin group
function* updateAdminGroupRequestAsync({payload}) {

  try {
    const data = yield call(adminGroupServices.updateAdminGroup, payload);
    if(data.status === 200) {
      yield put(updateAdminGroupSuccess(data.data));
    } else {
      yield put(updateAdminGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'updateAdminGroupRequestAsync'})
  }

}
export function* updateAdminGroupRequestSaga() {
  yield takeLatest(adminGroupTypes.UPDATE_ADMIN_GROUP_REQUEST, updateAdminGroupRequestAsync);
}
