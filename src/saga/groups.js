import {call, put, takeLatest} from 'redux-saga/effects'
import {groupTypes} from '../store/actions/types'
import {groupServices} from '../services';
import {
  searchMemberSuccess, searchMemberFailed, inviteMemberSuccess, inviteMemberFailed, groupCallInviteMemberSuccess,
  groupCallInviteMemberFailed, createGroupEventSuccess, createGroupEventFailed, joinGroupEventSuccess,
  joinGroupEventFailed, guestJoinGroupEventSuccess, guestJoinGroupEventFailed, createGroupSuccess,
  createGroupFailed, updateGroupSuccess, updateGroupFailed, organizationGroupListSuccess,
  organizationGroupListFailed, groupDetailsSuccess, groupDetailsFailed, groupMemberSuccess,
  groupMemberFailed, joinGroupSuccess, joinGroupFailed, leaveGroupSuccess, leaveGroupFailed,
  deleteGroupSuccess, deleteGroupFailed, muteGroupSuccess, muteGroupFailed, resumeGroupSuccess, resumeGroupFailed,
  groupEditDetailsSuccess, groupEditDetailsFailed, organizationListSuccess, organizationListFailed,
  deleteGroupMemberSuccess, deleteGroupMemberFailed, makeOwnerSuccess, makeOwnerFailed, changeUserRoleSuccess,
  changeUserRoleFailed
} from '../store/actions/group';
import {inviteEventParticipantsSuccess} from '../store/actions';
import {Logger} from './../utils/logger';

const fileLocation = "src\\saga\\groups.js";

// Search group members
function* createGroupRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.createGroup, payload);
    if(data.status === 200) {
      yield put(createGroupSuccess({}));
    } else {
      yield put(createGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'createGroupRequestAsync'})
  }

}
export function* createGroupRequestSaga() {
  yield takeLatest(groupTypes.CREATE_REQUEST, createGroupRequestAsync);
}

// Update group members
function* updateGroupRequestAsync({payload}) {
  try {
    const data = yield call(groupServices.updateGroup, payload);
    if(data.status === 200) {
      yield put(updateGroupSuccess(data.data));
    } else {
      yield put(updateGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'updateGroupRequestAsync'})
  }

}
export function* updateGroupRequestSaga() {
  yield takeLatest(groupTypes.UPDATE_REQUEST, updateGroupRequestAsync);
}

// Search group members
function* searchGroupMemberAsync({payload}) {

  try {
    const data = yield call(groupServices.searchMember, payload);
    if(data.status === 200) {
      yield put(searchMemberSuccess(data.data));
    } else {
      yield put(searchMemberFailed({
        message: "Error while retrieving member details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'searchGroupMemberAsync'})
  }

}
export function* searchGroupMemberSaga() {
  yield takeLatest(groupTypes.SEARCH_MEMBER_REQUEST, searchGroupMemberAsync);
}


// Invite group members
function* inviteGroupMemberAsync({payload}) {

  try {
    const data = yield call(groupServices.inviteMember, payload);
    if(data.status === 200) {
      yield put(inviteMemberSuccess(true));
    } else {
      yield put(inviteMemberFailed({
        message: "Error while retrieving organization details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'inviteGroupMemberAsync'})
  }

}
export function* inviteGroupMemberSaga() {
  yield takeLatest(groupTypes.INVITE_MEMBER_REQUEST, inviteGroupMemberAsync);
}

// Invite group members
function* cancelMemberGroupInvitationAsync({payload}) {

  try {
    const data = yield call(groupServices.cancelMemberInvitation, payload);
    if(data.status === 200) {
      yield put(inviteMemberSuccess(true));
    } else {
      yield put(inviteMemberFailed({
        message: "Error while retrieving organization details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'cancelMemberGroupInvitationAsync'})
  }

}
export function* cancelMemberGroupInvitationSaga() {
  yield takeLatest(groupTypes.CANCEL_MEMBER_INVITATION_REQUEST, cancelMemberGroupInvitationAsync);
}

// Invite group members
function* groupCallInvitationRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.groupCallInvitation, payload);
    if(data.status === 200) {
      yield put(groupCallInviteMemberSuccess(data.data));
      yield put(inviteEventParticipantsSuccess({...payload, type: 'invite'}));
    } else {
      yield put(groupCallInviteMemberFailed({
        message: "Error while inviting group call"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'groupCallInvitationRequestAsync'})
  }

}
export function* groupCallInvitationRequestSaga() {
  yield takeLatest(groupTypes.INVITE_MEMBER_GROUP_CALL_REQUEST, groupCallInvitationRequestAsync);
}

// Invite group members
function* createGroupEventRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.createGroupEvent, payload);

    if(data.status === 200) {
      yield put(createGroupEventSuccess(data.data));
    } else {
      yield put(createGroupEventFailed({
        message: "Error while creating group event"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'createGroupEventRequestAsync'})
  }

}
export function* createGroupEventRequestSaga() {
  yield takeLatest(groupTypes.CREATE_EVENT_REQUEST, createGroupEventRequestAsync);
}

// Join group event
function* joinGroupEventRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.joinGroupEvent, payload);
    
    if(data.status === 200) {
        data.data.eventId = payload.eventId
        data.data.notificationId = payload.notificationId
      yield put(joinGroupEventSuccess(data.data));
    } else {
        data.eventId = payload.eventId
        data.notificationId = payload.notificationId
        
      yield put(joinGroupEventFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'joinGroupEventRequestAsync'})
  }

}
export function* joinGroupEventRequestSaga() {
  yield takeLatest(groupTypes.JOIN_EVENT_REQUEST, joinGroupEventRequestAsync);
}

// Guest join group event
function* guestJoinGroupEventRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.guestJoinGroupEvent, payload);
    if(data.status === 200) {
      yield put(guestJoinGroupEventSuccess(data.data));
    } else {
      const errPayload = {
        type: data.eventJoinError.type,
        message: data.eventJoinError.message
      };
      yield put(guestJoinGroupEventFailed(errPayload));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'guestJoinGroupEventRequestAsync'})
  }

}
export function* guestJoinGroupEventRequestSaga() {
  yield takeLatest(groupTypes.GUEST_JOIN_EVENT_REQUEST, guestJoinGroupEventRequestAsync);
}

// Get Organization group list detail
function* organizationGroupListRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.getOrganizationGroup, payload);
    if(data.status === 200) {
      yield put(organizationGroupListSuccess(data.data));
    } else {
      yield put(organizationGroupListFailed({
        message: "Error while retrieving list details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'organizationGroupListRequestAsync'})
  }

}
export function* organizationGroupListRequestSaga() {
  yield takeLatest(groupTypes.ORG_GRP_LIST_REQUEST, organizationGroupListRequestAsync);
}

// Get single group details
function* groupDetailsRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.getGroupDetails, payload);
    if(data.status === 200) {
      yield put(groupDetailsSuccess(data.data));
    } else {
      yield put(groupDetailsFailed({
        message: "Error while retrieving group details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'groupDetailsRequestAsync'})
  }

}
export function* groupDetailsRequestSaga() {
  yield takeLatest(groupTypes.GROUP_DETAILS_REQUEST, groupDetailsRequestAsync);
}

// Get edit group details
function* groupEditDetailsRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.getEditGroupDetails, payload);
    if(data.status === 200) {
      yield put(groupEditDetailsSuccess(data.data));
    } else {
      yield put(groupEditDetailsFailed({
        message: "Error while retrieving group details"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'groupEditDetailsRequestAsync'})
  }

}
export function* groupEditDetailsRequestSaga() {
  yield takeLatest(groupTypes.GROUP_EDIT_DETAILS_REQUEST, groupEditDetailsRequestAsync);
}

// Get group Member
function* groupMembersRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.getGroupMembers, payload);
    if(data.status === 200) {
      yield put(groupMemberSuccess(data.data));
    } else {
      yield put(groupMemberFailed({
        message: "Error while retrieving group members"
      }));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'groupMembersRequestAsync'})
  }

}
export function* groupMembersRequestSaga() {
  yield takeLatest(groupTypes.GROUP_MEMBER_REQUEST, groupMembersRequestAsync);
}

// Join Group
function* joinGroupRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.joinGroup, payload);
    if(data.status === 200) {
      yield put(joinGroupSuccess(data.data));
    } else {
      yield put(joinGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'joinGroupRequestAsync'})
  }

}
export function* joinGroupRequestSaga() {
  yield takeLatest(groupTypes.JOIN_GROUP_REQUEST, joinGroupRequestAsync);
}

// Leave Group
function* leaveGroupRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.leaveGroup, payload);
    if(data.status === 200) {
      yield put(leaveGroupSuccess(data.data));
    } else {
      yield put(leaveGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'leaveGroupRequestAsync'})
  }

}
export function* leaveGroupRequestSaga() {
  yield takeLatest(groupTypes.LEAVE_GROUP_REQUEST, leaveGroupRequestAsync);
}

// Delete Group
function* deleteGroupRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.deleteGroup, payload);
    if(data.status === 200) {
      yield put(deleteGroupSuccess(data.data));
    } else {
      yield put(deleteGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteGroupRequestAsync'})
  }

}
export function* deleteGroupRequestSaga() {
  yield takeLatest(groupTypes.DELETE_GROUP_REQUEST, deleteGroupRequestAsync);
}

// Delete Group Member
function* deleteGroupMemberRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.deleteGroupMember, payload);
    if(data.status === 200) {
      yield put(deleteGroupMemberSuccess(data.data));
    } else {
      yield put(deleteGroupMemberFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'deleteGroupMemberRequestAsync'})
  }

}
export function* deleteGroupMemberRequestSaga() {
  yield takeLatest(groupTypes.DELETE_GROUP_MEMBER_REQUEST, deleteGroupMemberRequestAsync);
}

// Mute Group
function* muteGroupRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.muteGroup, payload);
    if(data.status === 200) {
      yield put(muteGroupSuccess(data.data));
    } else {
      yield put(muteGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'muteGroupRequestAsync'})
  }

}
export function* muteGroupRequestSaga() {
  yield takeLatest(groupTypes.MUTE_GROUP_REQUEST, muteGroupRequestAsync);
}

// Leave Group
function* resumeGroupRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.resumeGroup, payload);
    if(data.status === 200) {
      yield put(resumeGroupSuccess(data.data));
    } else {
      yield put(resumeGroupFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'resumeGroupRequestAsync'})
  }

}
export function* resumeGroupRequestSaga() {
  yield takeLatest(groupTypes.RESUME_GROUP_REQUEST, resumeGroupRequestAsync);
}

// Get organization list
function* getOrganizationListRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.getOrganizationList, payload);
    if(data.status === 200) {
      yield put(organizationListSuccess(data.data));
    } else {
      yield put(organizationListFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'getOrganizationListRequestAsync'})
  }

}
export function* getOrganizationListRequestSaga() {
  yield takeLatest(groupTypes.ORG_LIST_REQUEST, getOrganizationListRequestAsync);
}

// Make owner
function* makeOwnerRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.makeOwner, payload);
    if(data.status === 200) {
      yield put(makeOwnerSuccess(data.data));
    } else {
      yield put(makeOwnerFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'makeOwnerRequestAsync'})
  }

}
export function* makeOwnerRequestSaga() {
  yield takeLatest(groupTypes.MAKE_OWNER_REQUEST, makeOwnerRequestAsync);
}

// Change User Role
function* changeUserRoleRequestAsync({payload}) {

  try {
    const data = yield call(groupServices.changeUserRole, payload);
    if(data.status === 200) {
      yield put(changeUserRoleSuccess(data.data));
    } else {
      yield put(changeUserRoleFailed(data));
    }
  } catch({message}) {
    Logger.error({fileLocation, message, trace: 'changeUserRoleRequestAsync'})
  }

}
export function* changeUserRoleRequestSaga() {
  yield takeLatest(groupTypes.CHANGE_USER_ROLE_REQUEST, changeUserRoleRequestAsync);
}
