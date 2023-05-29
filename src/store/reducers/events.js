import { eventTypes } from '../actions/types';

const defaultState = {
  loading: false,
  memberLoading: false,
  myEventLoadingFlag: false,
  errorMessage: '',
  successMessage: '',
  current: {},
  currentEventFlag: 0,
  eventCreateFlag: 0,
  eventEditFlag: 0,
  eventCreateLoading: 0,
  list: [],
  myEventsList: [],
  pageInfo: {},
  eventMemberList: [],
  memberPageInfo: {},
  memberCancelFlag: { flag: 0, identifier: '' },
  memberCount: 0,
  unsubscribeStatus: { flag: 0, event: '' },
  subscribeStatus: { flag: 0, event: '' },
  errors: [],
  eventHostList: {},
  modalEventDetails: {},
  eventCreateError: "",
  eventDetail: {},
  breakout: { flag: 0, data: '' },
  eventParticipantsList: [],
  eventParticipantsLoading: false,
  eventParticipantsPageInfo: {},
  eventParticipantInviteFlag: { flag: 0, type: '', identifier: '' },
  ISCFileContent: { flag: 0, data: '' },
  eventDeleteFlag: { flag: 0, identifier: '', recursion: '' }
};

export default (state, { type, payload }) => {
  if (typeof state === 'undefined') {
    return defaultState;
  }

  // Reset required object
  state.eventCreateError = "";

  switch (type) {

    // Create an event
    case eventTypes.CREATE_REQUEST: {
      return { ...state, eventCreateLoading: true, eventCreateFlag: 0, modalEventDetails: {} };
    }
    case eventTypes.CREATE_SUCCESS: {
      return { ...state, eventCreateLoading: false, eventCreateFlag: 1, modalEventDetails: payload };
    }
    case eventTypes.CREATE_FAILED: {
      return {
        ...state,
        eventCreateLoading: false,
        eventCreateFlag: 2,
        modalEventDetails: {},
        eventCreateError: payload.message
      };
    }

    // Edit an event
    case eventTypes.EDIT_FLAG_UPDATE: {
      return { ...state, eventEditFlag: payload };
    }
    case eventTypes.EDIT_REQUEST: {
      return { ...state, eventCreateLoading: true, eventEditFlag: 0, modalEventDetails: {} };
    }
    case eventTypes.EDIT_SUCCESS: {
      return { ...state, eventCreateLoading: false, eventEditFlag: 1, modalEventDetails: payload };
    }
    case eventTypes.EDIT_FAILED: {
      return {
        ...state,
        eventCreateLoading: false,
        eventEditFlag: 2,
        modalEventDetails: {},
        eventCreateError: payload.message
      };
    }

    // Delete an event
    case eventTypes.DELETE_REQUEST: {
      return { ...state, loading: true, eventDeleteFlag: { flag: 0, identifier: '' } };
    }
    case eventTypes.DELETE_SUCCESS: {
      return { ...state, loading: false, eventDeleteFlag: { flag: 1, identifier: payload.identifier, recursion: payload.recursion, type: payload.type } };
    }
    case eventTypes.DELETE_RESET: {
      return { ...state, loading: false, eventDeleteFlag: { flag: payload.flag, identifier: '', recursion: '' } };
    }

    // My events list
    case eventTypes.MY_LIST_REQUEST: {
      return { ...state, loading: true, myEventLoadingFlag: true };
    }
    case eventTypes.MY_LIST_SUCCESS: {
      return {
        ...state,
        loading: false,
        myEventLoadingFlag: false,
        myEventsList: state.myEventsList.concat(payload.entries),
        pageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    }
    case eventTypes.MY_LIST_FAILED: {
      return { ...state, loading: false, myEventLoadingFlag: false, errorMessage: payload.message };
    }

    // Event member list
    case eventTypes.RESET_MEMBER_LIST: {
      return { ...state, eventMemberList: [], memberPageInfo: {}, memberCount: 0 };
    }
    case eventTypes.UPDATE_MEMBER_LIST: {
      return { ...state, eventMemberList: payload, memberCount: payload.length };
    }
    case eventTypes.MEMBER_LIST_REQUEST: {
      // Update the member count
      let tmpState = state;
      if (state.current.name) {
        tmpState = { ...state, current: { ...state.current, member_count: 0 } };
      }
      return { ...tmpState, memberLoading: true };
    }
    case eventTypes.MEMBER_LIST_SUCCESS: {
      return {
        ...state,
        memberLoading: false,
        eventMemberList: state.eventMemberList.concat(payload.entries),
        memberCount: payload.total_entries,
        memberPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    }
    case eventTypes.MEMBER_LIST_FAILED: {
      // Update the member count
      let tmpState = state;
      if (state.current.name) {
        tmpState = { ...state, current: { ...state.current, member_count: 0 } };
      }
      return { ...tmpState, memberLoading: false, errorMessage: payload.message };
    }

    // Event participants list
    case eventTypes.UPDATE_PARTICIPANTS_LIST: {
      return { ...state, eventParticipantsList: payload };
    }
    case eventTypes.PARTICIPANTS_LIST_REQUEST: {
      return { ...state, eventParticipantsLoading: true };
    }
    case eventTypes.PARTICIPANTS_LIST_SUCCESS: {
      return {
        ...state,
        eventParticipantsLoading: false,
        eventParticipantsList: state.eventParticipantsList.concat(payload.entries),
        eventParticipantsPageInfo: {
          page_number: payload.page_number,
          page_size: payload.page_size,
          total_entries: payload.total_entries,
          total_pages: payload.total_pages,
        }
      };
    }
    case eventTypes.PARTICIPANTS_LIST_FAILED: {
      return {
        ...state,
        eventParticipantsList: [],
        eventParticipantsPageInfo: {},
        eventParticipantsLoading: false,
        errorMessage: payload.message ? payload.message : ''
      };
    }

    // Event participant invitation
    case eventTypes.INVITE_PARTICIPANTS_REQUEST: {
      return { ...state, loading: true, eventParticipantInviteFlag: { flag: 0, type: '', identifier: '' } };
    }
    case eventTypes.INVITE_PARTICIPANTS_SUCCESS: {
      return { ...state, loading: false, eventParticipantInviteFlag: { flag: 1, type: payload.type, identifier: payload.identifier } };
    }
    case eventTypes.INVITE_PARTICIPANTS_FAILED: {
      return { ...state, loading: false, eventParticipantInviteFlag: { flag: 2, type: '', identifier: '' } };
    }

    // Update my event list
    case eventTypes.UPDATE_MY_EVENT_LIST: {
      if (payload.eventId === state.current.identifier && payload.displayDetails === false) {
        return { ...state, current: {}, currentEventFlag: 0, myEventsList: payload.entries };
      } else {
        return { ...state, myEventsList: payload.entries };
      }
    }

    // Get event details by id
    case eventTypes.BY_ID_REQUEST:
      return { ...state, loading: true, currentEventFlag: 0 };
    case eventTypes.BY_ID_SUCCESS:
      return { ...state, loading: false, current: payload, currentEventFlag: 1 };
    case eventTypes.BY_ID_FAILED:
      return { ...state, loading: false, current: {}, errorMessage: payload.message, currentEventFlag: 2 };
    case eventTypes.UPDATE_EVENT_DETAILS:
      return { ...state, current: payload };

    // Fetch event details 
    case eventTypes.FETCH_DETAILS_REQUEST:
      return { ...state, loading: true, eventCreateFlag: false, eventDetail: {} };
    case eventTypes.FETCH_DETAILS_SUCCESS:
      return { ...state, loading: false, eventCreateFlag: false, eventDetail: payload };
    case eventTypes.FETCH_DETAILS_FAILED:
      return { ...state, loading: false, eventCreateFlag: false, errorMessage: payload.message, eventDetail: {} };
    case eventTypes.RESET_FETCH_DETAILS:
      return { ...state, eventDetail: {}, eventCreateFlag: 0, eventEditFlag: 0 };

    // Event subscribe for current user
    case eventTypes.SUBSCRIBE_REQUEST: {
      return { ...state, loading: true, subscribeStatus: { flag: 0, event: '' } };
    }
    case eventTypes.SUBSCRIBE_SUCCESS: {
      return { ...state, loading: false, subscribeStatus: { flag: 1, event: payload } };
    }
    case eventTypes.SUBSCRIBE_FAILED: {
      return { ...state, loading: false, subscribeStatus: { flag: 2, event: '' } };
    }

    // Event unsubscribe for current user
    case eventTypes.UNSUBSCRIBE_REQUEST: {
      return { ...state, loading: true, unsubscribeStatus: { flag: 0, event: '' } };
    }
    case eventTypes.UNSUBSCRIBE_SUCCESS: {
      return { ...state, loading: false, unsubscribeStatus: { flag: 1, event: payload } };
    }
    case eventTypes.UNSUBSCRIBE_FAILED: {
      return { ...state, loading: false, unsubscribeStatus: { flag: 2, event: '' } };
    }
    case eventTypes.RESET_SUBSCRIPTION_STATUS: {
      return { ...state, subscribeStatus: { flag: 0, event: '' }, unsubscribeStatus: { flag: 0, event: '' } };
    }
    case eventTypes.UPDATE_MEMBER_COUNT: {
      const count = state.memberCount + payload;
      const memberCount = count <= 0 ? 0 : count
      return { ...state, memberCount };
    }

    // Event invite member
    case eventTypes.INVITE_REQUEST: {
      return { ...state, loading: true, memberCancelFlag: { flag: 0, identifier: '', event: '' } };
    }
    case eventTypes.INVITE_SUCCESS: {
      let flag = 1;
      if (payload.type === 'invite') {
        flag = 2;
      } else if (payload.type === 're-invite') {
        flag = 4;
      }
      return { ...state, loading: false, memberCancelFlag: { flag, identifier: payload.identifier, event: payload.event } };
    }
    case eventTypes.INVITE_FAILED: {
      return { ...state, loading: false, memberCancelFlag: { flag: 3, identifier: '', event: '' } };
    }

    // Event breakout request
    case eventTypes.BREAKOUT_REQUEST: {
      return { ...state, loading: true, breakout: { flag: 0, data: '' } };
    }
    case eventTypes.BREAKOUT_SUCCESS: {
      return { ...state, loading: false, breakout: { flag: 1, data: payload } };
    }
    case eventTypes.BREAKOUT_FAILED: {
      return { ...state, loading: false, breakout: { flag: 2, data: '' } };
    }

    // Event host list
    case eventTypes.HOST_LIST_REQUEST: {
      return { ...state, loading: true };
    }
    case eventTypes.HOST_LIST_SUCCESS: {
      return { ...state, loading: false, eventHostList: payload };
    }
    case eventTypes.HOST_LIST_FAILED: {
      return { ...state, loading: false };
    }

    // Event ICS file content
    case eventTypes.ICS_FILE_RESET: {
      return { ...state, loading: false, ISCFileContent: { flag: 0, data: '' } };
    }
    case eventTypes.ICS_FILE_REQUEST: {
      return { ...state, loading: true, ISCFileContent: { flag: 0, data: '' } };
    }
    case eventTypes.ICS_FILE_SUCCESS: {
      return { ...state, loading: false, ISCFileContent: { flag: 1, data: payload } };
    }
    case eventTypes.ICS_FILE_FAILED: {
      return { ...state, loading: false, ISCFileContent: { flag: 2, data: '' } };
    }

    case eventTypes.RESET_STORE: {
      return { ...defaultState, eventEditFlag: 0 };
    }

    case eventTypes.RESET_STORE_LIST: {
      return { ...state, myEventsList: [], current: {}, currentEventFlag: 0 };
    }
    default:
      return state;
  }
}
