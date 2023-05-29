import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import { eventTypes } from '../store/actions/types'
import { eventServices } from '../services';
import { Logger } from './../utils/logger';
import {
  eventsListSuccess, eventsListFailed, myEventsListFailed, myEventsListSuccess, unsubscribeEventFailed,
  unsubscribeEventSuccess, inviteMemberEventFailed, inviteMemberEventSuccess, createEventSuccess, createEventFailed,
  eventMemberListSuccess, eventMemberListFailed, eventHostListSuccess, eventHostListFailed, editEventFailed,
  editEventSuccess, fetchDetailsSuccess, fetchDetailsFailed, eventsByIdFailed, eventsByIdSuccess,
  eventParticipantsListFailed, eventParticipantsListSuccess, inviteEventParticipantsSuccess,
  inviteEventParticipantsFailed, subscribeEventSuccess, subscribeEventFailed,
  createBreakoutSuccess, createBreakoutFailed, eventICSFileFailed, eventICSFileSuccess,
  deleteEventReset, deleteEventSuccess
} from '../store/actions';

const fileLocation = "src\\saga\\event.js";

// Create an event
function* createEventRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.createEvent, payload);
    if(data.status === 200) {
      yield put(createEventSuccess(data.data));
    } else {
      let message = 'Error while creating an event'
      if(data.message.message === 'name has already been taken') {
        message = 'Event name has already been taken';
      }
      yield put(createEventFailed({ message }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'createEventRequestWorker' })
    yield put(createEventFailed({ message }));
  }


}
export function* createEventRequestWatcher() {
  yield takeLatest(eventTypes.CREATE_REQUEST, createEventRequestWorker);
}

// Edit an event
function* editEventRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.editEvent, payload);
    if(data.status === 200) {
      yield put(editEventSuccess(data.data));
    } else {
      let message = 'Error while creating an event'
      if(data.message.message === 'name has already been taken') {
        message = 'Event name has already been taken';
      }
      yield put(editEventFailed({ message }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'editEventRequestWorker' });
    yield put(editEventFailed({ message }));
  }


}
export function* editEventRequestWatcher() {
  yield takeLatest(eventTypes.EDIT_REQUEST, editEventRequestWorker);
}

// Delete an event
function* deleteEventRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.deleteEvent, payload);
    if(data.status === 200) {
      yield put(deleteEventSuccess(data.data));
    } else {
      yield put(deleteEventReset({
        flag: 2,
        message: "Error while deleting event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'deleteEventRequestWorker' });
    yield put(deleteEventReset({
      flag: 2,
      message: "Error while deleting event"
    }));
  }


}
export function* deleteEventRequestWatcher() {
  yield takeLatest(eventTypes.DELETE_REQUEST, deleteEventRequestWorker);
}

// Get my event lists
function* myEventListRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.myEventList, payload);
    if(data.status === 200) {
      yield put(myEventsListSuccess(data.data));
    } else {
      yield put(myEventsListFailed({
        message: "Error while retrieving event listing"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'useEffect' })
    yield put(myEventsListFailed({ message }));
  }


}
export function* myEventListRequestWatcher() {
  yield takeLatest(eventTypes.MY_LIST_REQUEST, myEventListRequestWorker);
}

// Get event lists
function* eventListRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.eventList, payload);
    if(data.status === 200) {
      yield put(eventsListSuccess(data.data));
    } else {
      yield put(eventsListFailed({
        message: "Error while retrieving event listing"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventListRequestWorker' });
    yield put(eventsListFailed({ message }));
  }

}
export function* eventListRequestWatcher() {
  yield takeLatest(eventTypes.LIST_REQUEST, eventListRequestWorker);
}

// Get event by Id
function* eventByIdRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.eventById, payload);
    if(data.status === 200) {
      yield put(eventsByIdSuccess(data.data));
    } else {
      yield put(eventsByIdFailed({
        message: "Error while retrieving event details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventByIdRequestWorker' });
    yield put(eventsByIdFailed({ message }));
  }

}
export function* eventByIdRequestWatcher() {
  yield takeLatest(eventTypes.BY_ID_REQUEST, eventByIdRequestWorker);
}

// Get event by Id
function* fetchEventDetailsRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.eventById, payload);
    if(data.status === 200) {
      yield put(fetchDetailsSuccess(data.data));
    } else {
      yield put(fetchDetailsFailed({
        message: "Error while retrieving event details"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'fetchEventDetailsRequestWorker' });
    yield put(fetchDetailsFailed({ message }));
  }

}
export function* fetchEventDetailsRequestWatcher() {
  yield takeLatest(eventTypes.FETCH_DETAILS_REQUEST, fetchEventDetailsRequestWorker);
}

// Event subscribe
function* subscribeEventRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.subscribeEvent, payload);
    if(data.status === 200) {
      yield put(subscribeEventSuccess(data.data.event));
    } else {
      yield put(subscribeEventFailed({
        message: "Error while event subscription"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'subscribeEventRequestWorker' })
    yield put(subscribeEventFailed({ message }));
  }

}
export function* subscribeEventRequestWatcher() {
  yield takeLatest(eventTypes.SUBSCRIBE_REQUEST, subscribeEventRequestWorker);
}

// Event unsubscribe
function* unsubscribeEventRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.unsubscribeEvent, payload);
    if(data.status === 200) {
      yield put(unsubscribeEventSuccess(data.data.event));
    } else {
      yield put(unsubscribeEventFailed({
        message: "Error while event subscription"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'unsubscribeEventRequestWorker' })
    yield put(unsubscribeEventFailed({ message }));
  }

}
export function* unsubscribeEventRequestWatcher() {
  yield takeLatest(eventTypes.UNSUBSCRIBE_REQUEST, unsubscribeEventRequestWorker);
}

// Event invite member
function* inviteMemberEventRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.inviteMember, payload);
    if(data.status === 200) {
      yield put(inviteMemberEventSuccess(data.data));
    } else {
      yield put(inviteMemberEventFailed({
        message: "Error while inviting member for event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'inviteMemberEventRequestWorker' })
    yield put(inviteMemberEventFailed({ message }));
  }

}
export function* inviteMemberEventRequestWatcher() {
  yield takeEvery(eventTypes.INVITE_REQUEST, inviteMemberEventRequestWorker);
}

// Event breakout request
function* breakoutEventRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.createBreakoutEvent, payload);
    if(data.status === 200) {
      data.data.invited_user_id = payload.userId
      yield put(createBreakoutSuccess(data.data));
    } else {
      yield put(createBreakoutFailed({
        message: "Error while creating breakout for event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'breakoutEventRequestWorker' })
    yield put(createBreakoutFailed({ message }));
  }

}
export function* breakoutEventRequestWatcher() {
  yield takeLatest(eventTypes.BREAKOUT_REQUEST, breakoutEventRequestWorker);
}

// Event member list
function* eventMemberListRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.memberList, payload);
    if(data.status === 200) {
      yield put(eventMemberListSuccess(data.data));
    } else {
      yield put(eventMemberListFailed({
        message: "Error while member list for event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventMemberListRequestWorker' })
    yield put(eventMemberListFailed({ message }));
  }

}
export function* eventMemberListRequestWatcher() {
  yield takeLatest(eventTypes.MEMBER_LIST_REQUEST, eventMemberListRequestWorker);
}

// Event host list
function* eventHostListRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.hostList, payload);
    if(data.status === 200) {
      yield put(eventHostListSuccess(data.data));
    } else {
      yield put(eventHostListFailed({
        message: "Error while host list for event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventHostListRequestWorker' })
    yield put(eventHostListFailed({ message }));
  }

}
export function* eventHostListRequestWatcher() {
  yield takeLatest(eventTypes.HOST_LIST_REQUEST, eventHostListRequestWorker);
}

// Event participants list
function* eventParticipantsListRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.participantsList, payload);
    if(data.status === 200) {
      yield put(eventParticipantsListSuccess(data.data));
    } else {
      yield put(eventParticipantsListFailed({
        message: "Error while participants list for event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventParticipantsListRequestWorker' })
    yield put(eventParticipantsListFailed({ message }));
  }

}
export function* eventParticipantsListRequestWatcher() {
  yield takeLatest(eventTypes.PARTICIPANTS_LIST_REQUEST, eventParticipantsListRequestWorker);
}

// Event participants invitation
function* eventParticipantsInvitationRequestWorker({ payload }) {

  try {
    const data = yield call(eventServices.participantsInvitation, payload);
    if(data.status === 200) {
      yield put(inviteEventParticipantsSuccess(data.data));
    } else {
      yield put(inviteEventParticipantsFailed({
        message: "Error while participants invitation for event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventParticipantsInvitationRequestWorker' })
    yield put(inviteEventParticipantsFailed({ message }));
  }

}
export function* eventParticipantsInvitationRequestWatcher() {
  yield takeEvery(eventTypes.INVITE_PARTICIPANTS_REQUEST, eventParticipantsInvitationRequestWorker);
}

// Event participants invitation
function* eventICSFileContentRequestAsync({ payload }) {

  try {
    const data = yield call(eventServices.ICSFileContent, payload);
    if(data.status === 200) {
      yield put(eventICSFileSuccess(data.data));
    } else {
      yield put(eventICSFileFailed({
        message: "Error while fetching ICS content for event"
      }));
    }
  } catch({ message }) {
    Logger.error({ fileLocation, message, trace: 'eventICSFileContentRequestAsync' })
    yield put(eventICSFileFailed({ message }));
  }

}
export function* eventICSFileContentRequestSaga() {
  yield takeEvery(eventTypes.ICS_FILE_REQUEST, eventICSFileContentRequestAsync);
}
