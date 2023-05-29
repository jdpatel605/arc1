import { adminGroupTypes } from '../actions/types';

const defaultState = {
  loadingAdmGrp: false,
  admGrpListloading: false,
  adminGroupList: [],
  adminGroupPageInfo: [],
  visibilitySuccess: [],
  visibilityError: [],
  deleteGroupSuccess: [],
  deleteGroupError: [],
  adminGroupDetails: [],
  editGroupDetails: [],
  detailsMemLoading: false,
  detailsMemList: [],
  detailsMemPageInfo: [],
  loadingRole: false,
  changeRoleSuccess: [],
  changeRoleError: [],
  loadingKick: false,
  kickUserSuccess: [],
  kickUserFail: {},
  kickFlag: 0,
  grpEventLoading: false,
  grpEventList: [],
  grpEventPageInfo: [],
  deleteGrpEventSuccess: [],
  deleteGrpEventError: [],
  deleteGrpEventFlag:0,
  inviteGrpEventSuccess: [],
  inviteGrpEventError: [],
  inviteGrpEventFlag:0,
  inviteMemLoading: false,
  inviteMemList: [],
  inviteMemPageInfo: [],
  inviteGrpMemberSuccess: [],
  inviteGrpMemberError: [],
  inviteGrpMemberFlag:0,
  canInviteGrpMemberSuccess: [],
  canInviteGrpMemberError: [],
  canInviteGrpMemberFlag:0,
  loadingOwnerGrp: false,
  OwnerGrpFlag: 0,
  OwnerGrpSuccess: [],
  OwnerGrpError: [],
  eventCreateLoading: false,
  eventCreateFlag: 0,
  modalEventDetails: [],
  eventEditFlag: 0,
  eventCreateError: [],
  groupCreateLoading: false,
  groupCreateFlag: 0,
  groupCreateError: [],
  updateGrpFlag: 0,
  updateGrpFlagLoading:false,
  updateGrpSuccess: [],
  updateGrpError: [],
}

export default (state, { type, payload }) => {
  if (typeof state === 'undefined') {
    return defaultState;
  }

  switch (type) {
    // Get organization list list
    case adminGroupTypes.ADM_GRP_LIST_REQUEST:
      return { ...state, loadingAdmGrp: true, admGrpListloading: true };
    case adminGroupTypes.ADM_GRP_LIST_SUCCESS:
      if (payload.page_number === 1) {
        state.adminGroupList = [];
      }
      return {
        ...state,
        loadingAdmGrp: false,
        admGrpListloading: false,
        adminGroupList: state.adminGroupList.concat(payload.entries),
        adminGroupPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case adminGroupTypes.ADM_GRP_LIST_UPDATE:
      return { ...state, adminGroupList: payload };
    case adminGroupTypes.ADM_GRP_LIST_FAILED:
      return { ...state, loadingAdmGrp: false, adminGroupList: [], admGrpListloading: false, errorMessage: payload.message };

    // Change visibility
    case adminGroupTypes.CHANGE_VISIBILITY_REQUEST: {
      return { ...state, loadingAdmGrp: true, visibilitySuccess:[], visibilityError: [] };
    }
    case adminGroupTypes.CHANGE_VISIBILITY_SUCCESS: {
      return { ...state, loadingAdmGrp: false, visibilitySuccess: payload, visibilityError: [] };
    }
    case adminGroupTypes.CHANGE_VISIBILITY_FAILED: {
      return { ...state, loadingAdmGrp: false, visibilitySuccess: [], visibilityError: payload };
    }
    
    // Assign new group owner
    case adminGroupTypes.ASSIGN_NEW_GROUP_OWNER_REQUEST: {
      return { ...state, loadingAdmGrp: true, loadingOwnerGrp: true, OwnerGrpFlag: 0, OwnerGrpSuccess:[], OwnerGrpError: [] };
    }
    case adminGroupTypes.ASSIGN_NEW_GROUP_OWNER_SUCCESS: {
      return { ...state, loadingAdmGrp: false, loadingOwnerGrp: false, OwnerGrpFlag: 1, OwnerGrpSuccess: payload, OwnerGrpError: [] };
    }
    case adminGroupTypes.ASSIGN_NEW_GROUP_OWNER_FAILED: {
      return { ...state, loadingAdmGrp: false, loadingOwnerGrp: false, OwnerGrpFlag: 2, OwnerGrpSuccess: [], OwnerGrpError: payload };
    }

    // Invite group member list
    case adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_REQUEST:
      return { ...state, loadingAdmGrp: true, inviteMemLoading: true };
    case adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_SUCCESS:
      if (payload.page_number === 1) {
        state.inviteMemList = [];
      }
      return {
        ...state,
        loadingAdmGrp: false,
        inviteMemLoading: false,
        inviteMemList: state.inviteMemList.concat(payload.entries),
        inviteMemPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_UPDATE:
      return { ...state, inviteMemList: payload };
    case adminGroupTypes.INVITE_TO_GROUP_MEMBER_LIST_FAILED:
      return { ...state, loadingAdmGrp: false, inviteMemLoading: false, inviteMemList: [], inviteMemPageInfo: [] };

    // Invite group member
    case adminGroupTypes.INVITE_GROUP_MEMBER_REQUEST: {
      return { ...state, loadingAdmGrp: true, inviteGrpMemberFlag: 0, inviteGrpMemberSuccess:[], inviteGrpMemberError: [] };
    }
    case adminGroupTypes.INVITE_GROUP_MEMBER_SUCCESS: {
      return { ...state, loadingAdmGrp: false, inviteGrpMemberFlag: 1, inviteGrpMemberSuccess: payload, inviteGrpMemberError: [] };
    }
    case adminGroupTypes.INVITE_GROUP_MEMBER_FAILED: {
      return { ...state, loadingAdmGrp: false, inviteGrpMemberFlag: 2, inviteGrpMemberSuccess: [], inviteGrpMemberError: payload };
    }
    
    // Cancle invite group member
    case adminGroupTypes.CANCLE_INVITE_GROUP_MEMBER_REQUEST: {
      return { ...state, loadingAdmGrp: true, canInviteGrpMemberFlag: 0, canInviteGrpMemberSuccess:[], canInviteGrpMemberError: [] };
    }
    case adminGroupTypes.CANCLE_INVITE_GROUP_MEMBER_SUCCESS: {
      return { ...state, loadingAdmGrp: false, canInviteGrpMemberFlag: 1, canInviteGrpMemberSuccess: payload, canInviteGrpMemberError: [] };
    }
    case adminGroupTypes.CANCLE_INVITE_GROUP_MEMBER_FAILED: {
      return { ...state, loadingAdmGrp: false, canInviteGrpMemberFlag: 2, canInviteGrpMemberSuccess: [], canInviteGrpMemberError: payload };
    }

    // Delete admin group
    case adminGroupTypes.DELETE_ADM_GRP_REQUEST: {
      return { ...state, loadingAdmGrp: true, deleteGroupSuccess:[], deleteGroupError: [] };
    }
    case adminGroupTypes.DELETE_ADM_GRP_SUCCESS: {
      return { ...state, loadingAdmGrp: false, deleteGroupSuccess: payload, deleteGroupError: [] };
    }
    case adminGroupTypes.DELETE_ADM_GRP_FAILED: {
      return { ...state, loadingAdmGrp: false, deleteGroupSuccess: [], deleteGroupError: payload };
    }
    
    // Admin group details
    case adminGroupTypes.ADM_GRP_DETAILS_REQUEST: {
      return { ...state, loadingAdmGrp: true, adminGroupDetails:[] };
    }
    case adminGroupTypes.ADM_GRP_DETAILS_SUCCESS: {
      return { ...state, loadingAdmGrp: false, adminGroupDetails: payload };
    }
    case adminGroupTypes.ADM_GRP_DETAILS_FAILED: {
      return { ...state, loadingAdmGrp: false, adminGroupDetails: [] };
    }

    // Admin edit group details
    case adminGroupTypes.ADM_EDIT_GRP_DETAILS_REQUEST: {
      return { ...state, loadingAdmGrp: true, editGroupDetails:[] };
    }
    case adminGroupTypes.ADM_EDIT_GRP_DETAILS_SUCCESS: {
      return { ...state, loadingAdmGrp: false, editGroupDetails: payload };
    }
    case adminGroupTypes.ADM_EDIT_GRP_DETAILS_FAILED: {
      return { ...state, loadingAdmGrp: false, editGroupDetails: [] };
    }

    // Admin group member list
    case adminGroupTypes.GRP_DETAILS_MEMBER_LIST_REQUEST:
      return { ...state, loadingAdmGrp: true, detailsMemLoading: true };
    case adminGroupTypes.GRP_DETAILS_MEMBER_LIST_SUCCESS:
      if (payload.page_number === 1) {
        state.detailsMemList = [];
      }
      return {
        ...state,
        loadingAdmGrp: false,
        detailsMemLoading: false,
        detailsMemList: state.detailsMemList.concat(payload.entries),
        detailsMemPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case adminGroupTypes.GRP_DETAILS_MEMBER_LIST_UPDATE:
      return { ...state, detailsMemList: payload };
    case adminGroupTypes.GRP_DETAILS_MEMBER_LIST_FAILED:
      return { ...state, loadingAdmGrp: false, detailsMemLoading: false, detailsMemList: [], detailsMemPageInfo: [] };
    case adminGroupTypes.GRP_DETAILS_MEMBER_LIST_RESET:
      return { ...state, loadingAdmGrp: false, detailsMemLoading: false, detailsMemList: [], detailsMemPageInfo: [] };

    // Admin group details
    case adminGroupTypes.PROMOTE_USER_ROLE_REQUEST: {
      return { ...state, loadingAdmGrp: true, loadingRole: true, changeRoleSuccess:[] , changeRoleError: []};
    }
    case adminGroupTypes.PROMOTE_USER_ROLE_SUCCESS: {
      return { ...state, loadingAdmGrp: false, loadingRole: false, changeRoleSuccess: payload };
    }
    case adminGroupTypes.PROMOTE_USER_ROLE_FAILED: {
      return { ...state, loadingAdmGrp: false, loadingRole: false, changeRoleError: payload };
    }
    case adminGroupTypes.PROMOTE_USER_ROLE_RESET: {
      return { ...state, loadingAdmGrp: false, loadingRole: false, changeRoleSuccess: [], changeRoleError: [] };
    }
    
    // Remove user from group
    case adminGroupTypes.KICK_USER_FROM_GROUP_REQUEST: {
      return { ...state, loadingAdmGrp: true, loadingKick: true, kickFlag: 0, kickUserSuccess:[] };
    }
    case adminGroupTypes.KICK_USER_FROM_GROUP_SUCCESS: {
      return { ...state, loadingAdmGrp: false, loadingKick: false, kickFlag: 1, kickUserSuccess: payload };
    }
    case adminGroupTypes.KICK_USER_FROM_GROUP_FAILED: {
      return { ...state, loadingAdmGrp: false, loadingKick: false, kickFlag: 2, kickUserFail: payload };
    }
    case adminGroupTypes.KICK_USER_FROM_GROUP_RESET: {
      return { ...state, loadingAdmGrp: false, loadingKick: false, kickFlag: 0, kickUserSuccess: [], kickUserFail: {} };
    }

    // Admin group member list
    case adminGroupTypes.GROUP_EVENT_LIST_REQUEST:
      return { ...state, loadingAdmGrp: true, grpEventLoading: true };
    case adminGroupTypes.GROUP_EVENT_LIST_SUCCESS:
      if (payload.page_number === 1) {
        state.grpEventList = [];
      }
      return {
        ...state,
        loadingAdmGrp: false,
        grpEventLoading: false,
        grpEventList: state.grpEventList.concat(payload.entries),
        grpEventPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case adminGroupTypes.GROUP_EVENT_LIST_UPDATE:
      return { ...state, grpEventList: payload };
    case adminGroupTypes.GROUP_EVENT_LIST_FAILED:
      return { ...state, loadingAdmGrp: false, grpEventLoading: false, grpEventList: [], grpEventPageInfo: [] };
    
    // Delete group event
    case adminGroupTypes.DELETE_GROUP_EVENT_REQUEST: {
      return { ...state, loadingAdmGrp: true, deleteGrpEventFlag: 0, deleteGrpEventSuccess:[], deleteGrpEventError: [] };
    }
    case adminGroupTypes.DELETE_GROUP_EVENT_SUCCESS: {
      return { ...state, loadingAdmGrp: false, deleteGrpEventFlag: 1, deleteGrpEventSuccess: payload, deleteGrpEventError: [] };
    }
    case adminGroupTypes.DELETE_GROUP_EVENT_FAILED: {
      return { ...state, loadingAdmGrp: false, deleteGrpEventFlag: 2, deleteGrpEventSuccess: [], deleteGrpEventError: payload };
    }
    
    // Invite group event
    case adminGroupTypes.INVITE_GROUP_EVENT_REQUEST: {
      return { ...state, loadingAdmGrp: true, inviteGrpEventFlag: 0, inviteGrpEventSuccess:[], inviteGrpEventError: [] };
    }
    case adminGroupTypes.INVITE_GROUP_EVENT_SUCCESS: {
      return { ...state, loadingAdmGrp: false, inviteGrpEventFlag: 1, inviteGrpEventSuccess: payload, inviteGrpEventError: [] };
    }
    case adminGroupTypes.INVITE_GROUP_EVENT_FAILED: {
      return { ...state, loadingAdmGrp: false, inviteGrpEventFlag: 2, inviteGrpEventSuccess: [], inviteGrpEventError: payload };
    }

    // Create an admin event
    case adminGroupTypes.CREATE_ADMIN_EVENT_REQUEST: {
      return {...state, loadingAdmGrp: true, eventCreateLoading: true, eventCreateFlag: 0, modalEventDetails: {}};
    }
    case adminGroupTypes.CREATE_ADMIN_EVENT_SUCCESS: {
      return {...state, loadingAdmGrp: false, eventCreateLoading: false, eventCreateFlag: 1, modalEventDetails: payload};
    }
    case adminGroupTypes.CREATE_ADMIN_EVENT_FAILED: {
      return {
        ...state,
        loadingAdmGrp: false,
        eventCreateLoading: false,
        eventCreateFlag: 2,
        modalEventDetails: {},
        eventCreateError: payload.message
      };
    }
    
    // Edit an admin event
    case adminGroupTypes.EDIT_ADMIN_EVENT_FLAG_UPDATE: {
      return {...state, loadingAdmGrp: true, eventEditFlag: payload};
    }
    case adminGroupTypes.EDIT_ADMIN_EVENT_REQUEST: {
      return {...state, loadingAdmGrp: false, eventCreateLoading: true, eventEditFlag: 0, modalEventDetails: {}};
    }
    case adminGroupTypes.EDIT_ADMIN_EVENT_SUCCESS: {
      return {...state, loadingAdmGrp: false, eventCreateLoading: false, eventEditFlag: 1, modalEventDetails: payload};
    }
    case adminGroupTypes.EDIT_ADMIN_EVENT_FAILED: {
      return {
        ...state,
        loadingAdmGrp: false,
        eventCreateLoading: false,
        eventEditFlag: 2,
        modalEventDetails: {},
        eventCreateError: payload.message
      };
    }
    
    // Create an admin group
    case adminGroupTypes.CREATE_ADMIN_GROUP_REQUEST: {
      return {...state, loadingAdmGrp: true, groupCreateLoading: true, groupCreateFlag: 0, groupCreateError: []};
    }
    case adminGroupTypes.CREATE_ADMIN_GROUP_SUCCESS: {
      return {...state, loadingAdmGrp: false, groupCreateLoading: false, groupCreateFlag: 1, groupCreateError: []};
    }
    case adminGroupTypes.CREATE_ADMIN_GROUP_FAILED: {
      return {
        ...state,
        loadingAdmGrp: false,
        groupCreateLoading: false,
        groupCreateFlag: 2,
        groupCreateError: payload
      };
    }
    
    // Update an admin group
    case adminGroupTypes.UPDATE_ADMIN_GROUP_REQUEST:
      return { ...state, loadingAdmGrp: true, updateGrpFlag: 0, updateGrpFlagLoading: true, updateGrpSuccess: [], updateGrpError: [] };
    case adminGroupTypes.UPDATE_ADMIN_GROUP_SUCCESS:
      return { ...state, loadingAdmGrp: false, updateGrpFlag: 1, updateGrpFlagLoading: false, updateGrpSuccess: payload };
    case adminGroupTypes.UPDATE_ADMIN_GROUP_FAILED:
      return { ...state, loadingAdmGrp: false, updateGrpFlag: 2, updateGrpFlagLoading: false, updateGrpError: payload };
    
    case adminGroupTypes.RESET_SOME_GRP_STATE: {
      return { ...state, adminGroupDetails: [] };
    }
    
    case adminGroupTypes.RESET_ADM_GRP_STATE: {
      return defaultState;
    }

    default:
      return state;
  }
}
