import {notificationTypes} from '../actions/types';

const defaultState = {
  loading: false,
  listLoading: false,
  errorMessage: '',
  successMessage: '',
  current: {},
  list: [],
  errors: [],
  pageInfo: {},
  deleteStatus: {id: ''},
  readStatus: {id: '', status: ''},
  acceptRejectStatus: {id: '', status: ''},
  unreadCount: 0
};

export default (state = defaultState, {type, payload}) => {

  switch(type) {

    // Get notification list
    case notificationTypes.LIST_REQUEST:
      return {...state, loading: true, listLoading: true};
    case notificationTypes.LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        listLoading: false,
        list: state.list.concat(payload.entries),
        pageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    case notificationTypes.UPDATE_LIST:
      return {...state, list: payload};
    case notificationTypes.LIST_FAILED:
      return {...state, loading: false, listLoading: false, errorMessage: payload.message};

    // Accept Reject notification invite
    case notificationTypes.ACCEPT_REJECT_REQUEST:
      return {...state, loading: true, acceptRejectStatus: {id: '', status: ''}};
    case notificationTypes.ACCEPT_REJECT_SUCCESS:
      return {...state, loading: false, acceptRejectStatus: payload};
    case notificationTypes.ACCEPT_REJECT_FAILED:
      return {...state, loading: false, errorMessage: payload.message, acceptRejectStatus: {id: '', status: ''}};

    // Delete notification
    case notificationTypes.DELETE_REQUEST:
      return {...state, loading: true};
    case notificationTypes.DELETE_SUCCESS:
      return {...state, loading: false, deleteStatus: payload};
    case notificationTypes.DELETE_FAILED:
      return {...state, loading: false, errorMessage: payload.message};

    // Read Unread notification
    case notificationTypes.READ_UNREAD_REQUEST:
      return {...state, loading: true};
    case notificationTypes.READ_UNREAD_SUCCESS:
      return {...state, loading: false, readStatus: payload};
    case notificationTypes.READ_UNREAD_FAILED:
      return {...state, loading: false, errorMessage: payload.message};

    // Unread notifications count
    case notificationTypes.UNREAD_COUNT_REQUEST: {
      return {...state, loading: true};
    }
    case notificationTypes.UNREAD_COUNT_SUCCESS: {
      return {...state, loading: false, unreadCount: payload.unreadCount};
    }
    case notificationTypes.UNREAD_COUNT_FAILED: {
      return {...state, loading: false, errorMessage: payload.message};
    }

    case notificationTypes.RESET_STATE: {
      const unreadCount = state.unreadCount;
      return {...defaultState, unreadCount};
    }

    default:
      return state;
  }

}
