import {call, put, takeLatest} from 'redux-saga/effects'
import {organizationTypes} from '../store/actions/types'
import {organizationServices} from '../services';
import {Logger} from './../utils/logger';
import {
  organizationByIdSuccess, organizationByIdFailed, searchOrganizationMemberSuccess,
  updateOrganizationSuccess, updateOrganizationFailed,
  checkOrganizationSubscriptionSuccess, checkOrganizationSubscriptionFailed,
  manageOrganizationSubscriptionSuccess, manageOrganizationSubscriptionFailed,
  searchOrganizationMemberFailed, inviteOrganizationMemberSuccess, inviteOrganizationMemberFailed,
  cancelOrganizationMemberInvitationSuccess, cancelOrganizationMemberInvitationFailed,
  checkOrgNotifMuteSuccess, checkOrgNotifMuteFailed, manageOrgNotifSuccess, manageOrgNotifFailed,
  loadMoreOrgEventsSuccess, loadMoreOrgEventsFailed, getStateListSuccess, getStateListFailed
} from '../store/actions';

const fileLocation = "src\\saga\\organization.js";

// Get organization detail by Id
function* organizationByIdAsync({payload}) {
  try {
    const data = yield call(organizationServices.organizationById, payload);
    if(data.status === 200) {
      yield put(organizationByIdSuccess(data.data));
    } else {
      yield put(organizationByIdFailed({
        message: "Error while retrieving organization details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'organizationByIdAsync'})
    yield put(organizationByIdFailed({message}));
  }
}
export function* organizationByIdSaga() {
  yield takeLatest(organizationTypes.BY_ID_REQUEST, organizationByIdAsync);
}

// Check organization subscription for current user
function* checkOrganizationSubscriptionAsync({payload}) {
  try {
    const data = yield call(organizationServices.checkSubscription, payload);
    if(data.status === 200) {
      yield put(checkOrganizationSubscriptionSuccess(data.data));
    } else {
      yield put(checkOrganizationSubscriptionFailed({
        message: "Error while checking organization subscription"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'checkOrganizationSubscriptionAsync'})
    yield put(checkOrganizationSubscriptionFailed({message}));
  }
}
export function* checkOrganizationSubscriptionSaga() {
  yield takeLatest(organizationTypes.CHECK_SUBSCRIPTION_REQUEST, checkOrganizationSubscriptionAsync);
}

// Check organization subscription for current user
function* manageOrganizationSubscriptionAsync({payload}) {

  try {
    let data;
    if(payload.status === "subscribe") {
      data = yield call(organizationServices.unsubscribeOrganization, payload.id);
    } else {
      data = yield call(organizationServices.subscribeOrganization, payload.id);
    }
    if(data.status === 200) {
      yield put(manageOrganizationSubscriptionSuccess(data));
    } else {
      yield put(manageOrganizationSubscriptionFailed({
        is_subscribed: data.is_subscribed,
        message: "Error while subscribing organization"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'manageOrganizationSubscriptionAsync'})
    yield put(manageOrganizationSubscriptionFailed({
      is_subscribed: null, message
    }));
  }


}
export function* manageOrganizationSubscriptionSaga() {
  yield takeLatest(organizationTypes.MANAGE_SUBSCRIPTION_REQUEST, manageOrganizationSubscriptionAsync);
}

// Search organization members
function* searchOrganizationMemberAsync({payload}) {

  try {
    const data = yield call(organizationServices.searchMember, payload);
    if(data.status === 200) {
      const membersList = data.data.entries ? data.data.entries : [];
      yield put(searchOrganizationMemberSuccess(membersList));
    } else {
      yield put(searchOrganizationMemberFailed({
        message: "Error while retrieving search member details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'searchOrganizationMemberAsync'})
    yield put(searchOrganizationMemberFailed({message}));
  }


}
export function* searchOrganizationMemberSaga() {
  yield takeLatest(organizationTypes.SEARCH_MEMBER_REQUEST, searchOrganizationMemberAsync);
}

// Invite organization members
function* inviteOrganizationMemberAsync({payload}) {

  try {
    const data = yield call(organizationServices.inviteMember, payload);
    if(data.status === 200) {
      yield put(inviteOrganizationMemberSuccess(true));
    } else {
      yield put(inviteOrganizationMemberFailed({
        message: "Error while retrieving invite member details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteOrganizationMemberAsync'})
    yield put(inviteOrganizationMemberFailed({message}));
  }

}
export function* inviteOrganizationMemberSaga() {
  yield takeLatest(organizationTypes.INVITE_MEMBER_REQUEST, inviteOrganizationMemberAsync);
}

// Invite organization members
function* cancelOrganizationMemberInvitationAsync({payload}) {

  try {
    const data = yield call(organizationServices.cancelMemberInvitation, payload);
    if(data.status === 200) {
      yield put(cancelOrganizationMemberInvitationSuccess(true));
    } else {
      yield put(cancelOrganizationMemberInvitationFailed({
        message: "Error while retrieving member details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'cancelOrganizationMemberInvitationAsync'})
    yield put(cancelOrganizationMemberInvitationFailed({message}));
  }

}
export function* cancelOrganizationMemberInvitationSaga() {
  yield takeLatest(organizationTypes.CANCEL_MEMBER_INVITATION_REQUEST, cancelOrganizationMemberInvitationAsync);
}

// Check organization subscription for current user
function* checkOrgNotifMuteRequestAsync({payload}) {

  try {
    const data = yield call(organizationServices.checkNotifMute, payload);
    if(data.status === 200) {
      yield put(checkOrgNotifMuteSuccess({muted: data.muted}));
    } else {
      yield put(checkOrgNotifMuteFailed({
        message: "Error while checking notification mute status",
        muted: false
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'checkOrgNotifMuteRequestAsync'})
    yield put(checkOrgNotifMuteFailed({message, muted: false}));
  }

}
export function* checkOrgNotifMuteRequestSaga() {
  yield takeLatest(organizationTypes.CHECK_NOTIFICATION_MUTE_REQUEST, checkOrgNotifMuteRequestAsync);
}

// Check organization subscription for current user
function* manageOrgNotifMuteAsync({payload}) {

  try {
    let data;
    if(payload.muted === true) {
      data = yield call(organizationServices.muteOrgNotif, payload.id);
    } else {
      data = yield call(organizationServices.resumeOrgNotif, payload.id);
    }
    if(data.status === 200) {
      yield put(manageOrgNotifSuccess(data));
    } else {
      yield put(manageOrgNotifFailed({
        muted: false,
        message: "Error while organization notification mute"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'manageOrgNotifMuteAsync'})
    yield put(manageOrgNotifFailed({muted: false, message}));
  }

}
export function* manageOrgNotifMuteSaga() {
  yield takeLatest(organizationTypes.MANAGE_NOTIFICATION_MUTE_REQUEST, manageOrgNotifMuteAsync);
}


// Check organization subscription for current user
function* loadMoreOrgEventsAsync({payload}) {

  try {
    const data = yield call(organizationServices.loadMoreOrgEvents, payload);
    if(data.status === 200) {
      yield put(loadMoreOrgEventsSuccess(data.data));
    } else {
      yield put(loadMoreOrgEventsFailed({
        message: "Error while loading organization events"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'loadMoreOrgEventsAsync'})
    yield put(loadMoreOrgEventsFailed({message}));
  }

}
export function* loadMoreOrgEventsSaga() {
  yield takeLatest(organizationTypes.LOAD_MORE_EVENTS_REQUEST, loadMoreOrgEventsAsync);
}

// Update organization details
function* updateOrganizationDetailsWorker({payload}) {

  try {
    const data = yield call(organizationServices.updateOrganization, payload);
    if(data.status === 200) {
      yield put(updateOrganizationSuccess(data.data));
    } else {
      yield put(updateOrganizationFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'updateOrganizationDetailsWorker'})
    yield put(updateOrganizationFailed({message}));
  }

}
export function* updateOrganizationDetailsWatcher() {
  yield takeLatest(organizationTypes.UPDATE_REQUEST, updateOrganizationDetailsWorker);
}

// Get state list
function* getStateListRequestAsync({payload}) {

  try {
    const data = yield call(organizationServices.getStateList, payload);
    if(data.status === 200) {
      yield put(getStateListSuccess(data.data));
    } else {
      yield put(getStateListFailed({
        message: "Error while retrieving state list"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getStateListRequestAsync'})
  }

}
export function* getStateListRequestSaga() {
  yield takeLatest(organizationTypes.ORG_STATE_LIST_REQUEST, getStateListRequestAsync);
}
