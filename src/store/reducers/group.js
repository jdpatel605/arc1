import { groupTypes } from '../actions/types';

const defaultState = {
  loadingGrp: false,
  memberLoading: false,
  memberInvitationFlag: false,
  refreshMemberList: 0,
  groupLoding: false,
  loadingJoinGrp: false,
  groupMemLoding: false,
  createEventLoading: false,
  membersList: [],
  guestEventJoinData: {},
  guestEventJoinError: {},
  eventJoinData: {},
  eventJoinDataError: {},
  globalEventJoinData: {},
  globalEventJoinDataError: {},
  createGroupError: {},
  createGroupData: {},
  createFlag: 1,
  createFlagLoading: false,
  updateGroupError: {},
  updateGroupData: {},
  updateFlag: 1,
  updateFlagLoading: false,
  groupMemberPageInfo: {},
  grpListloading: false,
  groupList: [],
  groupDetails: [],
  groupDetailError: [],
  groupEditDetails: [],
  groupEditDetailError: [],
  groupMemLoading: false,
  groupMemList: [],
  groupMemPageInfo: [],
  joinGroupSuccess: [],
  joinGroupError: [],
  leaveGroupSuccess: [],
  leaveGroupError: [],
  deleteGroupSuccess: [],
  deleteGroupError: [],
  deleteGroupMemSuccess: [],
  deleteGroupMemError: [],
  resumeGroupSuccess: [],
  resumeGroupError: [],
  muteGroupSuccess: [],
  muteGroupError: [],
  ownerSuccess: [],
  ownerError: [],
  roleSuccess: [],
  roleError: [],
  orgList: [],
  orgListError: [],
  inviteRes: {},
}

export default (state, { type, payload }) => {
  if (typeof state === 'undefined') {
    return defaultState;
  }

  switch (type) {
    // Get organization list list
    case groupTypes.ORG_GRP_LIST_REQUEST:
      return { ...state, loadingGrp: true, grpListloading: true, ownerSuccess: 0 };
    case groupTypes.ORG_GRP_LIST_SUCCESS:
      if (payload.page_number === 1) {
        state.groupList = [];
      }
      return {
        ...state,
        loadingGrp: false,
        grpListloading: false,
        groupList: state.groupList.concat(payload.entries),
        groupPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case groupTypes.ORG_GRP_LIST_UPDATE:
      return { ...state, groupList: payload };
    case groupTypes.ORG_GRP_LIST_FAILED:
      return { ...state, loadingGrp: false, groupList: [], grpListloading: false, errorMessage: payload.message };

    // Get group Details
    case groupTypes.GROUP_DETAILS_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.GROUP_DETAILS_SUCCESS:
      return { ...state, loadingGrp: false, groupDetails: payload };
    case groupTypes.GROUP_DETAILS_FAILED:
      return { ...state, loadingGrp: false, groupDetailError: payload };

    // Get group edit Details
    case groupTypes.GROUP_EDIT_DETAILS_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.GROUP_EDIT_DETAILS_SUCCESS:
      return { ...state, loadingGrp: false, groupEditDetails: payload };
    case groupTypes.GROUP_EDIT_DETAILS_FAILED:
      return { ...state, loadingGrp: false, groupEditDetailError: payload };

    // Get group member 
    case groupTypes.GROUP_MEMBER_REQUEST:
      return { ...state, groupMemLoading: true };
    case groupTypes.GROUP_MEMBER_SUCCESS:
      if (payload.page_number === 1) {
        state.groupMemList = [];
      }
      return {
        ...state,
        groupMemLoading: false,
        groupMemList: state.groupMemList.concat(payload.entries),
        groupMemPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case groupTypes.GROUP_MEMBER_FAILED:
      return { ...state, groupMemLoading: false, groupMemList: [], groupMemPageInfo: {} };

    // Join Group
    case groupTypes.JOIN_GROUP_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.JOIN_GROUP_SUCCESS:
      return { ...state, loadingGrp: false, joinGroupSuccess: payload };
    case groupTypes.JOIN_GROUP_FAILED:
      return { ...state, loadingGrp: false, joinGroupError: payload };

    // Leave Group
    case groupTypes.LEAVE_GROUP_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.LEAVE_GROUP_SUCCESS:
      return { ...state, loadingGrp: false, leaveGroupSuccess: payload };
    case groupTypes.LEAVE_GROUP_FAILED:
      return { ...state, loadingGrp: false, leaveGroupError: payload };

    // Delete Group
    case groupTypes.DELETE_GROUP_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.DELETE_GROUP_SUCCESS:
      return { ...state, loadingGrp: false, deleteGroupSuccess: payload };
    case groupTypes.DELETE_GROUP_FAILED:
      return { ...state, loadingGrp: false, deleteGroupError: payload };

    // Delete Group Member
    case groupTypes.DELETE_GROUP_MEMBER_REQUEST:
      return { ...state, loadingGrp: true, refreshMemberList: 0 };
    case groupTypes.DELETE_GROUP_MEMBER_SUCCESS:
      return { ...state, loadingGrp: false, deleteGroupMemSuccess: payload, refreshMemberList: 1 };
    case groupTypes.DELETE_GROUP_MEMBER_FAILED:
      return { ...state, loadingGrp: false, deleteGroupMemError: payload, refreshMemberList: 0 };

    // Resume Group
    case groupTypes.RESUME_GROUP_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.RESUME_GROUP_SUCCESS:
      return { ...state, loadingGrp: false, resumeGroupSuccess: payload };
    case groupTypes.RESUME_GROUP_FAILED:
      return { ...state, loadingGrp: false, resumeGroupError: payload };

    // Mute Group
    case groupTypes.MUTE_GROUP_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.MUTE_GROUP_SUCCESS:
      return { ...state, loadingGrp: false, muteGroupSuccess: payload };
    case groupTypes.MUTE_GROUP_FAILED:
      return { ...state, loadingGrp: false, muteGroupError: payload };

    // Make Owner
    case groupTypes.MAKE_OWNER_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.MAKE_OWNER_SUCCESS:
      return { ...state, loadingGrp: false, ownerSuccess: 1 };
    case groupTypes.MAKE_OWNER_FAILED:
      return { ...state, loadingGrp: false, ownerError: 0 };

    // Change User role
    case groupTypes.CHANGE_USER_ROLE_REQUEST:
      return { ...state, loadingGrp: true };
    case groupTypes.CHANGE_USER_ROLE_SUCCESS:
      return { ...state, loadingGrp: false, roleSuccess: payload };
    case groupTypes.CHANGE_USER_ROLE_FAILED:
      return { ...state, loadingGrp: false, roleError: payload };

    case groupTypes.CREATE_REQUEST:
      return { ...state, createFlag: 1, createFlagLoading: true };
    case groupTypes.CREATE_SUCCESS:
      return { ...state, createFlag: 2, createFlagLoading: false, createGroupData: payload };
    case groupTypes.CREATE_FAILED:
      return { ...state, createFlag: 3, createFlagLoading: false, createGroupError: payload };
    case groupTypes.UPDATE_REQUEST:
      return { ...state, updateFlag: 1, updateFlagLoading: true };
    case groupTypes.UPDATE_SUCCESS:
      return { ...state, updateFlag: 2, updateFlagLoading: false, updateGroupData: payload };
    case groupTypes.UPDATE_FAILED:
      return { ...state, updateFlag: 3, updateFlagLoading: false, updateGroupError: payload };
    case groupTypes.SEARCH_MEMBER_REQUEST:
      return { ...state, memberLoading: true };
    case groupTypes.SEARCH_MEMBER_SUCCESS:
      if (payload.page_number === 1) {
        state.membersList = [];
      }
      return {
        ...state,
        memberLoading: false,
        membersList: state.membersList.concat(payload.entries),
        groupMemberPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case groupTypes.SEARCH_MEMBER_FAILED:
      return { ...state, memberLoading: false, membersList: [], groupMemberPageInfo: {} };
    case groupTypes.INVITE_MEMBER_REQUEST:
      return { ...state, memberLoading: true, refreshMemberList: 0 };
    case groupTypes.INVITE_MEMBER_SUCCESS:
      return { ...state, memberLoading: false, memberInvitationFlag: payload, refreshMemberList: 1 };
    case groupTypes.INVITE_MEMBER_FAILED:
      return { ...state, memberLoading: false, memberInvitationFlag: false, refreshMemberList: 0 };
    case groupTypes.CANCEL_MEMBER_INVITATION_REQUEST:
      return { ...state, memberLoading: true, refreshMemberList: 0 };
    case groupTypes.CANCEL_MEMBER_INVITATION_SUCCESS:
      return { ...state, memberLoading: false, memberInvitationFlag: payload, refreshMemberList: 1 };
    case groupTypes.CANCEL_MEMBER_INVITATION_FAILED:
      return { ...state, memberLoading: false, memberInvitationFlag: false, refreshMemberList: 0 };
    case groupTypes.RESET_MEMBER_INVITATION:
      return { ...state, memberLoading: false, memberInvitationFlag: false, membersList: [] };
    case groupTypes.INVITE_MEMBER_GROUP_CALL_REQUEST:
      return { ...state, memberLoading: true };
    case groupTypes.INVITE_MEMBER_GROUP_CALL_SUCCESS:
      return { ...state, memberLoading: false, inviteRes: { flag: 1 } };
    case groupTypes.INVITE_MEMBER_GROUP_CALL_FAILED:
      return { ...state, memberLoading: false, inviteRes: { flag: 0 } };

    // Create event
    case groupTypes.CREATE_EVENT_REQUEST: {
      return { ...state, createEventLoading: true };
    }
    case groupTypes.CREATE_EVENT_SUCCESS: {
      return { ...state, createEventLoading: false, eventJoinData: payload };
    }
    case groupTypes.CREATE_EVENT_FAILED: {
      return { ...state, createEventLoading: false, eventJoinDataError: payload };
    }

    // Join event
    case groupTypes.JOIN_EVENT_REQUEST: {
      return { ...state, loadingJoinGrp: true };
    }
    case groupTypes.JOIN_EVENT_SUCCESS: {
      return { ...state, loadingJoinGrp: false, globalEventJoinData: payload };
    }
    case groupTypes.JOIN_EVENT_FAILED: {
      return { ...state, loadingJoinGrp: false, globalEventJoinDataError: payload };
    }

    // Guest Join event
    case groupTypes.GUEST_JOIN_EVENT_REQUEST: {
      return { ...state, loadingGrp: true };
    }
    case groupTypes.GUEST_JOIN_EVENT_SUCCESS: {
      return { ...state, loadingGrp: false, guestEventJoinData: payload };
    }
    case groupTypes.GUEST_JOIN_EVENT_FAILED: {
      return { ...state, loadingGrp: false, guestEventJoinError: payload };
    }

    // Get organization list
    case groupTypes.ORG_LIST_REQUEST: {
      return { ...state, loadingGrp: true };
    }
    case groupTypes.ORG_LIST_SUCCESS: {
      return { ...state, loadingGrp: false, orgList: payload };
    }
    case groupTypes.ORG_LIST_FAILED: {
      return { ...state, loadingGrp: false, orgListError: payload };
    }

    case groupTypes.RESET_GRP_STATE: {
      return defaultState;
    }

    default:
      return state;
  }
}
