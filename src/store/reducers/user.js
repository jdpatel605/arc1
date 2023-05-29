import {SET_CURRENT_USER, SET_USERS_LIST, LOGOUT, adminUserTypes} from "../actions/types";
import AuthService from "../../services/AuthService";
const defaultState = {
  loadingDis: false,
  errorMessage: '',
  successMessage: '',
  first: true,
  errors: [],
  orgDetailLoading: false,
  orgDetailFlag: 0,
  orgDetail: {},
  list: [],
  listLoading: false,
  listPageInfo: [],
  totalPage: 1,
  adminUserDetails: {},
  userDetailLoading: false,
  changeRoleDetail: {},
  changeRoleFlag: 0,
  removeUserFlag: 0,
  removeUserData: {},
  
  ownerList: [],
  ownerListLoading: false,
  ownerListPageInfo: [],
  ownerTotalPage: 1,
  
  ownerGroupList: [],
  ownerGroupListLoading: false,
  ownerGroupListPageInfo: [],
  ownerGroupTotalPage: 1,
  
  sessionDetail: {},
  sessionLoading: false,
};

const user = (state, {type, payload}) => {
  if(typeof state === 'undefined') {
    return defaultState;
  }

  switch(type) {
    case SET_USERS_LIST:
      return {
        ...state,
        userlist: payload
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        profile: payload
      };
    case LOGOUT:
      AuthService.logout()
      return {
        isAuthenticated: false,
        profile: {}
      };
    // Get all admin user details
    case adminUserTypes.GET_ADMIN_USER_REQUEST:
      return {...state, loadingDis: true, listLoading: true,};
    case adminUserTypes.GET_ADMIN_USER_SUCCESS:
      if(payload.page_number === 1) {
        state.list = [];
        if(payload.total_pages > state.totalPage || !state.totalPage) {
          state.totalPage = payload.total_pages
        }
      }
      
      var listData = []
      if(payload && payload.entries.length > 0) {
        listData = listData.concat(payload.entries);
      }
      return {
        ...state,
        loadingDis: false,
        listLoading: false,
        list: state.list.concat(listData),
        listPageInfo: {
          total_pages: state.totalPage,
        }
      };
    case adminUserTypes.GET_ADMIN_USER_FAILED:
      return {...state, loadingDis: false, listLoading: false, list: [], listPageInfo: []};
      
    case adminUserTypes.GET_ADMIN_ORG_REQUEST:
      return {...state, loadingDis: true, orgDetailLoading: false, orgDetailFlag: 0, orgDetail: {} };
      
    case adminUserTypes.GET_ADMIN_ORG_SUCCESS:
      return {...state, loadingDis: false, orgDetailLoading: false, orgDetailFlag: 1, orgDetail: payload};
      
    case adminUserTypes.GET_ADMIN_ORG_FAILED:
      return {...state, loadingDis: false, orgDetailLoading: false, orgDetailFlag: 2, orgDetail: payload };
    
    case adminUserTypes.GET_ADMIN_USER_DETAIL_REQUEST:
      return {...state, loadingDis: true, userDetailLoading: true, adminUserDetails: {} };
      
    case adminUserTypes.GET_ADMIN_USER_DETAIL_SUCCESS:
      return {...state, loadingDis: false, userDetailLoading: false, adminUserDetails: payload};
      
    case adminUserTypes.GET_ADMIN_USER_DETAIL_FAILED:
      return {...state, loadingDis: false, userDetailLoading: false, adminUserDetails: {} };
      
    case adminUserTypes.CHANGE_ADMIN_USER_ROLE_REQUEST:
      return {...state, loadingDis: true, changeRoleFlag: 0, changeRoleDetail: {} };
      
    case adminUserTypes.CHANGE_ADMIN_USER_ROLE_SUCCESS:
      return {...state, loadingDis: false, changeRoleFlag: 1, changeRoleDetail: payload};
      
    case adminUserTypes.CHANGE_ADMIN_USER_ROLE_FAILED:
      return {...state, loadingDis: false, changeRoleFlag: 2, changeRoleDetail: payload };
      
    case adminUserTypes.CHANGE_ADMIN_USER_ROLE_RESET:
      return {...state, loadingDis: false, changeRoleFlag: 0, changeRoleDetail: {} };
      
    case adminUserTypes.UPDATE_ADMIN_USER_LIST:
      return {...state, list: payload, listLoading: false };
      
    case adminUserTypes.UPDATE_ADMIN_USER_DETAIL:
      return {...state, adminUserDetails: payload };
      
    case adminUserTypes.REMOVE_USER_FROM_ORG_REQUEST:
      return {...state, loadingDis: true, removeUserFlag: 0 };
      
    case adminUserTypes.REMOVE_USER_FROM_ORG_SUCCESS:
      return {...state, loadingDis: false, removeUserFlag: 1, listLoading: true, removeUserData: payload};
      
    case adminUserTypes.REMOVE_USER_FROM_ORG_FAILED:
      return {...state, loadingDis: false, removeUserFlag: 2 ,removeUserData: payload};
      
    case adminUserTypes.REMOVE_USER_FROM_ORG_RESET:
      return {...state, loadingDis: false, removeUserFlag: 0 ,removeUserData: {} };
      
    // Get all user list to assign owner
    case adminUserTypes.GET_OWNER_USER_REQUEST:
      return {...state, loadingDis: true, ownerListLoading: true,};
    case adminUserTypes.GET_OWNER_USER_SUCCESS:
      if(payload.page_number === 1) {
        state.ownerList = [];
        if(payload.total_pages > state.ownerTotalPage || !state.ownerTotalPage) {
          state.ownerTotalPage = payload.total_pages
        }
      }
      
      var listData = []
      if(payload && payload.entries.length > 0) {
        listData = listData.concat(payload.entries);
      }
      return {
        ...state,
        loadingDis: false,
        ownerListLoading: false,
        ownerList: state.ownerList.concat(listData),
        ownerListPageInfo: {
          total_pages: state.ownerTotalPage,
          total_entries: payload.total_entries,
        }
      };
    case adminUserTypes.GET_OWNER_USER_FAILED:
      return {...state, loadingDis: false, ownerListLoading: false, ownerList: [], ownerListPageInfo: []};
      
    // Get all groups to be invited
    case adminUserTypes.GET_ALL_ADMIN_GROUP_REQUEST:
      return {...state, loadingDis: true, ownerGroupListLoading: true,};
      
    case adminUserTypes.GET_ALL_ADMIN_GROUP_SUCCESS:
        state.ownerGroupList = [];
//      if(payload.page_number === 1) {
//        state.ownerGroupList = [];
//        if(payload.total_pages > state.ownerGroupTotalPage || !state.ownerGroupTotalPage) {
//          state.ownerGroupTotalPage = payload.total_pages
//        }
//      }
      
//      var listData = []
//      if(payload && payload.entries.length > 0) {
//        listData = listData.concat(payload.entries);
//      }
      var listData = []
      var totalEntries = 0
      if(payload && payload.organization && payload.organization.groups.length > 0) {
        listData = listData.concat(payload.organization.groups);
        totalEntries = payload.organization.groups_count
      }
      return {
        ...state,
        loadingDis: false,
        ownerGroupListLoading: false,
        ownerGroupList: state.ownerGroupList.concat(listData),
        ownerGroupListPageInfo: {
          total_pages: state.ownerGroupTotalPage,
          total_entries: totalEntries,
        }
      };
    case adminUserTypes.GET_ALL_ADMIN_GROUP_FAILED:
      return {...state, loadingDis: false, ownerGroupListLoading: false, ownerGroupList: [], ownerGroupListPageInfo: {} };
      
    case adminUserTypes.GET_ALL_ADMIN_GROUP_RESET:
      return {...state, loadingDis: false, ownerGroupListLoading: false, ownerGroupList: [], ownerGroupListPageInfo: { total_pages: 1, total_entries: 0 } };
      
    case adminUserTypes.GET_ALL_ADMIN_GROUP_UPDATE:
      return {...state, loadingDis: false, ownerGroupListLoading: false, ownerGroupList: payload  };
    
    // Get user session 
    case adminUserTypes.GET_USER_SESSION_REQUEST:
      return {...state, loadingDis: true, sessionLoading: true,};
      
    case adminUserTypes.GET_USER_SESSION_SUCCESS:
      return {
        ...state,
        loadingDis: false,
        sessionLoading: false,
        sessionDetail: payload
      };
    case adminUserTypes.GET_USER_SESSION_FAILED:
      return {...state, loadingDis: false, sessionLoading: false, sessionDetail: {} };
      
    case adminUserTypes.GET_USER_SESSION_RESET:
      return {...state, loadingDis: false, sessionLoading: false, sessionDetail: {} };
      
    case adminUserTypes.GET_USER_SESSIONP_UPDATE:
      return {...state, loadingDis: false, sessionLoading: false, sessionDetail: payload };
      
    default:
      return state;
  }
}
export default user;
