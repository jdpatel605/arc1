import {organizationTypes} from '../actions/types';

const defaultState = {
  loadingOrg: false,
  memberLoading: false,
  refreshMemberList: 0,
  errorMessage: '',
  successMessage: '',
  organizationId: '',
  currentOrg: {},
  is_subscribed: null,
  list: [],
  eventsList: [],
  membersList: [],
  stateList: [],
  memberInvitationFlag: false,
  errors: [],
  muted: false,
  orgPageInfo: {},
  loadEventFlag: false,
  updateFlag: false,
  updateFlagLoading: false,
  editOrgError: [],
  codeFlagLoading: false,
  codeFlag: false,
  orgCodeError: {},
};

export default (state, {type, payload}) => {
  if(typeof state === 'undefined') {
    return defaultState;
  }

  switch(type) {

    // Get organization by Id
    case organizationTypes.BY_ID_REQUEST:
      return {...state, loadingOrg: true};
    case organizationTypes.BY_ID_SUCCESS:
      return {
        ...state,
        loadingOrg: false,
        currentOrg: payload,
      };
    case organizationTypes.BY_ID_FAILED:
      return {
        ...state,
        loadingOrg: false,
        errorMessage: payload.message
      };

    // Get organization by Id
    case organizationTypes.UPDATE_REQUEST:
      return {...state, updateFlag: 0, updateFlagLoading: true, editOrgError: []};
    case organizationTypes.UPDATE_SUCCESS:
      return {
        ...state,
        updateFlag: 1,
        updateFlagLoading: false,
        editOrgError: []
      };
    case organizationTypes.UPDATE_FAILED:
      return {
        ...state,
        updateFlag: 2,
        updateFlagLoading: false,
        editOrgError: payload
      };

    // Check organization subscription
    case organizationTypes.ORG_STATE_LIST_REQUEST:
      return {...state, loadingOrg: true, stateList: []};
    case organizationTypes.ORG_STATE_LIST_SUCCESS:
      return {
        ...state,
        loadingOrg: false,
        stateList: payload,
      };
    case organizationTypes.ORG_STATE_LIST_FAILED:
      return {
        ...state,
        loadingOrg: false,
        stateList: []
      };

    // Check organization subscription
    case organizationTypes.CHECK_SUBSCRIPTION_REQUEST:
      return {...state, loadingOrg: true};
    case organizationTypes.CHECK_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        loadingOrg: false,
        is_subscribed: payload.is_subscribed,
        muted: payload.is_muted,
      };
    case organizationTypes.CHECK_SUBSCRIPTION_FAILED:
      return {
        ...state,
        loadingOrg: false,
        is_subscribed: payload.is_subscribed,
        muted: payload.is_muted,
        errorMessage: payload.message
      };

    // Manage organization subscription
    case organizationTypes.MANAGE_SUBSCRIPTION_REQUEST:
      return {...state, loadingOrg: true, organizationId: ''};
    case organizationTypes.MANAGE_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        loadingOrg: false,
        is_subscribed: payload.is_subscribed,
        organizationId: payload.organizationId,
      };
    case organizationTypes.MANAGE_SUBSCRIPTION_FAILED:
      return {
        ...state,
        loadingOrg: false,
        is_subscribed: payload.is_subscribed,
        errorMessage: payload.message
      };
    case organizationTypes.SEARCH_MEMBER_REQUEST:
      return {...state, memberLoading: true};
    case organizationTypes.SEARCH_MEMBER_SUCCESS:
      return {...state, memberLoading: false, membersList: payload};
    case organizationTypes.SEARCH_MEMBER_FAILED:
      return {...state, memberLoading: false, membersList: []};
    case organizationTypes.INVITE_MEMBER_REQUEST:
      return {...state, memberLoading: true, refreshMemberList: 0};
    case organizationTypes.INVITE_MEMBER_SUCCESS:
      return {...state, memberLoading: false, memberInvitationFlag: payload, refreshMemberList: 1};
    case organizationTypes.INVITE_MEMBER_FAILED:
      return {...state, memberLoading: false, memberInvitationFlag: false, refreshMemberList: 0};
    case organizationTypes.CANCEL_MEMBER_INVITATION_REQUEST:
      return {...state, memberLoading: true, refreshMemberList: 0};
    case organizationTypes.CANCEL_MEMBER_INVITATION_SUCCESS:
      return {...state, memberLoading: false, memberInvitationFlag: payload, refreshMemberList: 1};
    case organizationTypes.CANCEL_MEMBER_INVITATION_FAILED:
      return {...state, memberLoading: false, memberInvitationFlag: false, refreshMemberList: 0};

    // Reset member invitation
    case organizationTypes.RESET_MEMBER_INVITATION:
      return {...state, memberLoading: false, memberInvitationFlag: false, membersList: []};

    // Check organization mute status
    // case organizationTypes.CHECK_NOTIFICATION_MUTE_REQUEST:
    //   return { ...state, loading: true };
    // case organizationTypes.CHECK_NOTIFICATION_MUTE_SUCCESS:
    //   return { ...state, loading: false, muted: payload.muted };
    // case organizationTypes.CHECK_NOTIFICATION_MUTE_FAILED:
    //   return { ...state, loading: false, muted: payload.muted, errorMessage: payload.message };

    // Manage organization mute status
    case organizationTypes.MANAGE_NOTIFICATION_MUTE_REQUEST:
      return {...state, loadingOrg: true};
    case organizationTypes.MANAGE_NOTIFICATION_MUTE_SUCCESS:
      return {...state, loadingOrg: false, muted: payload.muted};
    case organizationTypes.MANAGE_NOTIFICATION_MUTE_FAILED:
      return {...state, loadingOrg: false, muted: payload.muted, errorMessage: payload.message};

    // Load more organization events
    case organizationTypes.LOAD_MORE_EVENTS_REQUEST:
      return {...state, loadingOrg: true, loadEventFlag: true};
    case organizationTypes.LOAD_MORE_EVENTS_SUCCESS:
      if(payload.page_number === 1) {
        state.eventsList = [];
      }
      return {
        ...state,
        loadingOrg: false,
        loadEventFlag: false,
        eventsList: state.eventsList.concat(payload.entries),
        orgPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case organizationTypes.LOAD_MORE_EVENTS_FAILED:
      return {...state, loadingOrg: false, loadEventFlag: false, errorMessage: payload.message};
    case organizationTypes.UPDATE_EVENTS_LIST: {
      return {...state, eventsList: payload};
    }

    // Reset organization store
    case organizationTypes.RESET_STORE: {
      return defaultState;
    }

    default:
      return state;
  }
}
