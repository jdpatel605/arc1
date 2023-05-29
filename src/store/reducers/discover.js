import {discoverTypes} from '../actions/types';

const defaultState = {
  loadingDis: false,
  errorMessage: '',
  successMessage: '',
  first: true,
  errors: [],
  listLoading: false,
  list: [],
  listPageInfo: [],
  totalPage: 1,
  grpLoading: false,
  groupList: [],
  groupPageInfo: [],
  eventLoading: false,
  eventList: [],
  eventPageInfo: [],
  peopleLoading: false,
  peopleList: [],
  peoplePageInfo: [],
};

export default (state, {type, payload}) => {
  if(typeof state === 'undefined') {
    return defaultState;
  }

  switch(type) {

    // Get all discover details
    case discoverTypes.ALL_DISCOVER_REQUEST:
      return {...state, loadingDis: true, listLoading: true,};
    case discoverTypes.ALL_DISCOVER_SUCCESS:
      if(payload.groups.page_number === 1) {
        state.list = [];
        state.groupList = [];
        state.eventList = [];
        state.peopleList = [];
        if(payload && payload.events.entries.length > 0) {
          state.totalPage = payload.events.total_pages
        }
        if(payload.groups.total_pages > state.totalPage) {
          state.totalPage = payload.groups.total_pages
        }
        if(payload.organizations.total_pages > state.totalPage) {
          state.totalPage = payload.organizations.total_pages
        }
        if(payload.users.total_pages > state.totalPage) {
          state.totalPage = payload.users.total_pages
        }
      }
      
      var listData = []
      if(payload && payload.events.entries.length > 0) {
        listData = listData.concat(payload.events.entries);
      }
      if(payload && payload.groups.entries.length > 0) {
        listData = listData.concat(payload.groups.entries);
      }
      if(payload && payload.organizations.entries.length > 0) {
        listData = listData.concat(payload.organizations.entries);
      }
      if(payload && payload.users.entries.length > 0) {
        listData = listData.concat(payload.users.entries);
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
    case discoverTypes.ALL_DISCOVER_FAILED:
      return {...state, loadingDis: false, listLoading: false, list: [], listPageInfo: []};
    case discoverTypes.ALL_DISCOVER_UPDATE:
      return {...state, list: payload};

    // Get default discover details
    case discoverTypes.DEFAULT_DISCOVER_REQUEST:
      return {...state, loadingDis: true, listLoading: true,};
    case discoverTypes.DEFAULT_DISCOVER_SUCCESS:
      if(payload.page_number === 1) {
        state.list = [];
        state.groupList = [];
        state.eventList = [];
        state.peopleList = [];
      }
      return {
        ...state,
        loadingDis: false,
        listLoading: false,
        list: state.list.concat(payload.entries),
        listPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case discoverTypes.DEFAULT_DISCOVER_FAILED:
      return {...state, loadingDis: false, listLoading: false, list: [], listPageInfo: []};

    // Get organization discover details
    case discoverTypes.ORG_DISCOVER_REQUEST:
      return {...state, loadingDis: true};
    case discoverTypes.ORG_DISCOVER_SUCCESS:
      if(payload.page_number === 1) {
        return {...state, loadingDis: false, first: true, list: payload};
      }
      else {
        return {...state, loadingDis: false, first: false, list: payload};
      }
    case discoverTypes.ORG_DISCOVER_FAILED:
      return {...state, loadingDis: false, errorMessage: payload.message};

    // Get group discover details
    case discoverTypes.GRP_DISCOVER_REQUEST:
      return {...state, loadingDis: true, grpLoading: true,};
    case discoverTypes.GRP_DISCOVER_SUCCESS:
      if(payload.page_number === 1) {
        state.list = [];
        state.groupList = [];
        state.eventList = [];
        state.peopleList = [];
      }
      return {
        ...state,
        loadingDis: false,
        grpLoading: false,
        groupList: state.groupList.concat(payload.entries),
        groupPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case discoverTypes.GRP_DISCOVER_FAILED:
      return {...state, loadingDis: false, grpLoading: false, groupList: [], groupPageInfo: []};
    case discoverTypes.GRP_DISCOVER_UPDATE:
      return {...state, groupList: payload};

    // Get event discover details
    case discoverTypes.EVT_DISCOVER_REQUEST:
      return {...state, loadingDis: true, eventLoading: true,};
    case discoverTypes.EVT_DISCOVER_SUCCESS:
      if(payload.page_number === 1) {
        state.list = [];
        state.groupList = [];
        state.eventList = [];
        state.peopleList = [];
      }
      return {
        ...state,
        loadingDis: false,
        eventLoading: false,
        eventList: state.eventList.concat(payload.entries),
        eventPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case discoverTypes.EVT_DISCOVER_FAILED:
      return {...state, loadingDis: false, eventLoading: false, eventList: [], eventPageInfo: []};
    case discoverTypes.EVT_DISCOVER_UPDATE: {
      let tmpList = {};
      if (state.list) {
        tmpList = {
          ...state.list,
          events: {
            ...state.list,
            entries: payload.eventEntries
          }
        }
      }else{
        tmpList = {
          ...state.eventList,
          entries: payload.eventEntries
        }
      }
      return {...state, list: tmpList};
    }

    // Get event discover details
    case discoverTypes.PPL_DISCOVER_REQUEST:
      return {...state, loadingDis: true, peopleLoading: true,};
    case discoverTypes.PPL_DISCOVER_SUCCESS:
      if(payload.page_number === 1) {
        state.list = [];
        state.groupList = [];
        state.eventList = [];
        state.peopleList = [];
      }
      return {
        ...state,
        loadingDis: false,
        peopleLoading: false,
        peopleList: state.peopleList.concat(payload.entries),
        peoplePageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case discoverTypes.PPL_DISCOVER_FAILED:
      return {...state, loadingDis: false, peopleLoading: false, peopleList: [], peoplePageInfo: []};
    default:
      return state;
  }
}
