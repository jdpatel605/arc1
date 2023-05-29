import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Loader from "../Loader";
import moment from 'moment';
import ContentHeader from "./contentHeader";
import ContentLeft from "./contentLeft";
import ContentRight from "./contentRight";
import EventEmpty from "./EventEmpty";
import {
  myEventsListRequest, resetEventStore, resetEventList, updateMyEventList, eventsByIdRequest,
  fetchDetailsRequest, eventsByIdSuccess, eventMemberListRequest, resetEventMemberList, resetEventFetchDetails,
  deleteEventReset, deleteEventRequest
} from '../../store/actions'
import InviteToEventModal from "./InviteToEventModal";
import CreateEventModal from './EventModalsPages/CreateEventModal';
import history from "../../history/history";
import { EventContext } from "./EventContext";
import { eventICSFileReset, eventICSFileRequest } from './../../store/actions/eventActions';
import { Helper } from "../../utils/helper";
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\events\\index.jsx";

var searchEventDelay;
const defaultValidation = {
  eventName: {}, date: {}, eventGroupHost: {}, startTime: {}, endTime: {}
};
const eventDetailsInit = {
  eventName: '', description: '', eventGroupHost: { name: '*Select Host', id: '', hostType: '' }, date: '',
  startTime: {}, endTime: {}, type: 'discussion', visibility: 'private',
};

const Events = () => {

  const dispatch = useDispatch();
  const {
    loading, myEventLoadingFlag, pageInfo, myEventsList, current, eventCreateFlag, modalEventDetails,
    eventDetail, eventEditFlag, currentEventFlag, unsubscribeStatus, eventDeleteFlag, ISCFileContent
  } = useSelector(({ events }) => events);
  const [pageNumber, setPageNumber] = useState(1);
  const [memberPageNumber, setMemberPageNumber] = useState(1);
  const [showEventInviteModal, setShowEventInviteModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [inviteEventDetails, setInviteEventDetails] = useState({});
  const [searchEvent, setSearchEvent] = useState('');
  const [eventEditMode, setEventEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('eventInfo');
  const [currentPage, setCurrentPage] = useState('mainPage');
  const [eventDetails, setEventDetails] = useState(eventDetailsInit);
  const [editEventId, setEditEventId] = useState(null);
  const [editRecurringEventId, setEditRecurringEventId] = useState(null);
  const [validationErrors, setValidationErrors] = useState(defaultValidation);
  const [urlEventId, setUrlEventId] = useState(false);

  // Init
  useEffect(() => {

    try {
      dispatch(resetEventStore());
      // Display the event details, if URL has event id
      const url = new URL(window.location.href);
      if (url?.hash && url?.hash !== '') {
        // const eventId = url.searchParams.get('e');
        const eventId = url?.hash.substring(1);
        setUrlEventId(eventId);
        if (eventId) {
          dispatch(eventsByIdRequest(eventId));
        }
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }


    return () => {
      dispatch(resetEventStore());
    }
  }, [dispatch]);

  // Load more as page number updated
  useEffect(() => {
    dispatch(myEventsListRequest({
      page: pageNumber,
      search: searchEvent
    }));
  }, [dispatch, pageNumber]);

  // Set next page
  const nextPageEvents = () => {
    if (pageNumber < pageInfo.total_pages) {
      setPageNumber(pageNumber + 1);
    }
  }

  // Event Invite Modal
  const handleShowEventInviteModal = event => {
    try {
      let eventDetails = event;
      if (event?.host?.identifier) {
        eventDetails['host_identifier'] = event.host.identifier;
      }
      setInviteEventDetails(eventDetails);
      setShowEventInviteModal(true);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'handleShowEventInviteModal' })
    }
  }
  const handleHideEventInviteModal = () => {
    setShowEventInviteModal(false);
  }

  // Create Event Modal
  const handleShowEventModal = () => {
    setShowEventModal(true);
    setEventEditMode(false);
    setEditEventId(null);
    setEditRecurringEventId(null);
    setActiveTab('eventInfo');
  }
  const handleHideEventModal = () => {
    setShowEventModal(false);
    setEventEditMode(false);
    setEditEventId(null);
    setEditRecurringEventId(null);
    setValidationErrors(defaultValidation);
    setTimeout(() => {
      console.log(validationErrors);
    }, 1000);
    setActiveTab('eventInfo');
    setEventDetails(eventDetailsInit);
    dispatch(resetEventFetchDetails());
  }

  const handleSearchEvent = e => {
    try {
      const { value } = e.target;
      const isFirstCharSpace = value[0] === ' ' ? true : false;

      if (isFirstCharSpace === false) {
        setSearchEvent(value);

        // Clear the timeout
        clearTimeout(searchEventDelay);

        // Reinitialize the callback with page number 1
        const search = value.trim();
        searchEventDelay = setTimeout(() => {
          setPageNumber(1);
          dispatch(resetEventList());
          dispatch(myEventsListRequest({
            page: pageNumber, search
          }));
        }, 700);
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'handleSearchEvent' })
    }

  }

  const handleJoinEventNow = event => {
    try {
      const { identifier } = event;

      const jwt = localStorage.getItem("accessToken");

      // Store the event data in local storage
      localStorage.setItem(identifier, jwt);

      // Push user to the group call screen
      history.push(`/event?e=${identifier}`);
      window.location.reload();
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'handleJoinEventNow' })
    }
  }

  // Check if session user can edit the event
  const canEditEvent = event => {
    const currentIdentifier = localStorage.getItem("identifier");
    return currentIdentifier === event.owner_identifier;
  }

  // Check if session user can invite other to the event
  const canInviteMember = event => {
    if (event) {
      return (event.is_attending === true) ? true : false;
    } else {
      return false;
    }
  }

  // Hook, display event member once event details fetch successfully
  useEffect(() => {
    if (currentEventFlag === 1) {
      if (current.identifier) {
        setMemberPageNumber(1);
        dispatch(resetEventMemberList());
        dispatch(eventMemberListRequest({
          id: current.identifier,
          page: 1
        }));
      }
    }
  }, [currentEventFlag]);

  // Hook, display event member next page
  useEffect(() => {
    if (memberPageNumber > 1) {
      if (current.identifier) {
        dispatch(eventMemberListRequest({
          id: current.identifier,
          page: memberPageNumber
        }));
      }
    }
  }, [memberPageNumber]);

  // Hook, create an event and enable edit mode
  useEffect(() => {
    if (eventCreateFlag === 1) {
      dispatch(resetEventList());
      // Enable edit mode
      setEventEditMode(true);
      setActiveTab('eventParticipants');
      dispatch(fetchDetailsRequest(modalEventDetails.identifier));
      setEditEventId(modalEventDetails.identifier);
      setEditRecurringEventId(modalEventDetails.identifier);

      // Refresh the list in background
      dispatch(myEventsListRequest({
        page: pageNumber,
        search: searchEvent
      }));
    }
  }, [eventCreateFlag]);

  // Fetch event details to edit it
  const fetchEventDetails = ({ identifier }) => {
    dispatch(fetchDetailsRequest(identifier));
  }

  // Hook, display event edit modal once fetchEventDetails request is completed
  useEffect(() => {
    try {
      if (eventDetail.name) {

        // Enable edit mode
        setEventEditMode(true);
        if (eventCreateFlag !== false) {
          setActiveTab('eventInfo');
        }
        setEditEventId(eventDetail.identifier);
        setShowEventModal(true);


        const tmpDate = Helper.formatDate(eventDetail.begins_at, "YYYY-MM-DD 00:00:00")
        const startTime = {
          value: Helper.formatDate(eventDetail.begins_at, `HH:mm:00`),
          label: Helper.formatDate(eventDetail.begins_at, `hh:mm a`)
        }
        let endTime = {
          value: Helper.formatDate(eventDetail.ends_at, `HH:mm:00`),
          label: Helper.formatDate(eventDetail.ends_at, `hh:mm a`)
        }
        if (eventDetail.ends_at === null) {
          endTime = { value: '', label: '' }
        }
        const date = new Date(tmpDate);
        setEventDetails(({
          ...eventDetailsInit,
          identifier: eventDetail.identifier,
          eventName: eventDetail.name,
          description: eventDetail.description === null ? '' : eventDetail.description,
          date, startTime, endTime,
          eventGroupHost: {
            name: eventDetail.host.name,
            id: eventDetail.host.identifier,
            hostType: eventDetail.host_type
          },
          type: eventDetail.type,
          visibility: eventDetail.visibility,
          isAdmin: false
        }));

        // Set validation
        setValidationErrors({
          eventName: { valid: true }, eventGroupHost: { valid: true }, date: { valid: true }, startTime: { valid: true }, endTime: { valid: true }
        });
        if (eventDetail.ends_at === null) {
          setValidationErrors(prevProps => ({
            ...prevProps, endTime: { valid: false, message: 'End time is required' }
          }));
        }

      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }

  }, [eventDetail]);

  // Hook, edit an event, only update internal store
  useEffect(() => {
    try {
      if (eventEditFlag === 1) {
        const { identifier, name, visibility, begins_at, description, section, is_attending, joinable } = modalEventDetails;

        // Update the list
        const updatedList = myEventsList.map(data =>
          data.identifier === identifier ? { ...data, name, begins_at, section, joinable } : data
        );
        dispatch(updateMyEventList({
          entries: updatedList,
          eventId: identifier
        }));

        // Update right side panel if opened
        if (current.identifier === identifier) {
          dispatch(eventsByIdSuccess(({
            ...current, name, visibility, begins_at, description, is_attending, joinable
          })));
        }

        setActiveTab('eventParticipants');
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }
  }, [eventEditFlag]);

  // Unsubscribe event for current user
  useEffect(() => {
    try {
      if (unsubscribeStatus.flag === 1) {

        const updatedList = myEventsList.filter(data => data.identifier !== unsubscribeStatus.event && data);
        dispatch(updateMyEventList({
          entries: updatedList,
          eventId: unsubscribeStatus.event
        }));

      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }
  }, [dispatch, unsubscribeStatus]);

  const handelDeleteEvent = (event, type = 'event') => {
    const { identifier } = event;
    const { recursion_identifier } = event;
    dispatch(deleteEventRequest({
      id: identifier,
      recursion: recursion_identifier,
      type: type
    }));
  };

  useEffect(() => {
    try {
      const { flag, identifier, recursion, type } = eventDeleteFlag;
      if (flag === 1) {
        dispatch(deleteEventReset({ flag: 0 }));
        var updatedList = myEventsList;
        if (type === 'recurring') {
          var updatedList = myEventsList.filter(event => event.recursion_identifier !== recursion && event);
        }
        else {
          var updatedList = myEventsList.filter(event => event.identifier !== identifier && event);
        }
        dispatch(updateMyEventList({
          entries: updatedList,
          groupId: identifier,
          displayDetails: false
        }));

      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }
  }, [eventDeleteFlag]);

  // Download ICS File content
  const downloadICSFile = ({ identifier }, type = 'add') => {
    const payload = {
      id: identifier, type
    }
    dispatch(eventICSFileRequest(payload));
  }

  //Hook, Download ICF File
  useEffect(() => {
    try {
      const { flag, data } = ISCFileContent;
      if (flag === 1) {
        const element = document.createElement("a");
        const file = new Blob([data], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `event-${moment().format('YYYYMMDDHHmmss')}.ics`;
        document.body.appendChild(element);
        element.click();
        dispatch(eventICSFileReset());
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }

  }, [dispatch, ISCFileContent]);

  // Using memo hook for performance improvement
  const eventContextMemo = useMemo(() => ({
    eventDetails, activeTab, eventEditMode, editEventId, currentPage, validationErrors, showEventModal,
    handleShowEventInviteModal, handleJoinEventNow, canEditEvent, canInviteMember, fetchEventDetails,
    handleHideEventModal, setEventDetails, setCurrentPage, setMemberPageNumber, setValidationErrors,
    setActiveTab, handelDeleteEvent, downloadICSFile
  }), [activeTab, eventEditMode, editEventId, eventDetails, currentPage, showEventModal]);

  return (

    <div className="content-sec">
      <div className="scroll">
        <div className="container-fluid">
          <ContentHeader
            handleShowEventModal={handleShowEventModal}
            searchEvent={searchEvent}
            handleSearchEvent={handleSearchEvent}
          />
          <Loader visible={loading} />
          {
            (!myEventLoadingFlag && myEventsList.length === 0 && !urlEventId)
              ?
              <EventEmpty />
              :
              <div className="page-contain">
                <div className="row">
                  <div className="chat-box">
                    <EventContext.Provider value={eventContextMemo} >
                      <ContentLeft
                        eventsList={myEventsList}
                        nextPageEvents={nextPageEvents}
                        loading={myEventLoadingFlag}
                      />
                      {current.name && <ContentRight from="event" current={current} />}
                    </EventContext.Provider>
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
      <InviteToEventModal
        show={showEventInviteModal}
        hideModal={handleHideEventInviteModal}
        event={inviteEventDetails}
      />
      <EventContext.Provider value={eventContextMemo} >
        <CreateEventModal
          show={showEventModal}
          hideModal={handleHideEventModal}
        />
      </EventContext.Provider>
    </div>

  );

}

export default Events;
