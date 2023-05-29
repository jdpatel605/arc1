import React, { useEffect, useState, useMemo, useRef } from "react";
import ContentOrganizationHeader from './ContentOrganizationHeader';
import ContentLeft from './ContentLeft';
import ContentRight from './ContentRight';
import { useDispatch, useSelector } from "react-redux";
import { organizationByIdRequest, checkOrganizationSubscriptionRequest } from '../../store/actions'
import { organizationListRequest } from './../../store/actions/group';
import Loader from '../Loader';
import { useAlert } from "react-alert";
import moment from 'moment';
import history from "../../history/history";
import { EventContext } from "../events/EventContext";
import ContentRightEvent from "../events/contentRight";
import CreateEventModal from '../events/EventModalsPages/CreateEventModal';
import InviteToEventModal from "../events/InviteToEventModal";
import { manageOrganizationSubscriptionRequest, loadMoreOrgEventsRequest, resetOrganizationStore } from '../../store/actions/organizationActions';
import {
  resetEventList, eventsByIdRequest, fetchDetailsRequest,
  eventsByIdSuccess, eventMemberListRequest, resetEventMemberList, resetEventFetchDetails,
  editEventFlagUpdate
} from '../../store/actions/eventActions'
import { eventICSFileRequest, eventICSFileReset } from './../../store/actions/eventActions';
import smoothscroll from 'smoothscroll-polyfill';
import { Logger } from './../../utils/logger';
import EditOrganization from './EditOrganization';

const defaultValidation = {
  eventName: {}, date: {}, eventGroupHost: {}, startTime: {}, endTime: {}
};
const fileLocation = "src\\components\\organizationInformation\\index.jsx";

const OrganizationInformation = (props) => {
  smoothscroll.polyfill();
  const alert = useAlert();
  const dispatch = useDispatch();
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { loadingOrg, currentOrg, is_subscribed, organizationId, orgPageInfo, updateFlag } = useSelector(({ organization }) => organization);
  const { id } = props.id ? props : props.match.params
  const [validationErrors, setValidationErrors] = useState(defaultValidation);
  const [showEditOrganization, setShowEditOrganization] = useState(false);

  useEffect(() => {
    dispatch(organizationByIdRequest(id));
    dispatch(checkOrganizationSubscriptionRequest(id));

    return () => {
      dispatch(resetOrganizationStore());
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      if (updateFlag === 1) {
        dispatch(organizationByIdRequest(id));
        dispatch(checkOrganizationSubscriptionRequest(id));
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:updateFlag' })
    }
  }, [updateFlag]);

  useEffect(() => {
    try {
      setIsSubscribed(is_subscribed);
      dispatch(organizationByIdRequest(id));
      dispatch(organizationListRequest());
      const orgId = localStorage.getItem('organization_id');
      if (orgId === 'null' || orgId === 'undefined' || orgId === '') {
        localStorage.setItem('organization_id', organizationId);
      }
      if (orgId !== 'null' && orgId !== 'undefined' && orgId !== '' && orgId === organizationId) {
        localStorage.setItem('organization_id', null);
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:is_subscribed' })
    }
  }, [is_subscribed]);

  const handelSetSubscription = status => {
    try {
      const orgId = localStorage.getItem('organization_id');
      if (orgId !== id) {
        let payload = { status: 'subscribe', id: id };
        if (status === true) {
          payload = { status: 'unsubscribe', id: id };
        }
        dispatch(manageOrganizationSubscriptionRequest(payload));
      }
      else {
        alert.show("You can't leave from home organization");
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:handelSetSubscription' })
    }
  }

  // Load more events
  useEffect(() => {
    dispatch(loadMoreOrgEventsRequest({
      id,
      page: pageNumber
    }))
  }, [dispatch, pageNumber]);

  // Set next page
  const nextPageEvents = () => {
    if (pageNumber < orgPageInfo.total_pages) {
      setPageNumber(pageNumber + 1);
    }
  }

  const [elementScroll, setElementScroll] = useState(0);
  const [mainClass, setMainClass] = useState('');
  const [clickTarget, setClickTarget] = useState('');

  const eventDetailsInit = {
    eventName: '', description: '', eventGroupHost: { name: 'Select Host', id: '' }, date: '',
    startTime: '', endTime: '', type: 'discussion', visibility: 'private',
  };
  const {
    current, eventCreateFlag, modalEventDetails, eventDetail, eventEditFlag, currentEventFlag,
    eventDeleteFlag, ISCFileContent
  } = useSelector(({ events }) => events);
  const [memberPageNumber, setMemberPageNumber] = useState(1);
  const [showEventInviteModal, setShowEventInviteModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [inviteEventDetails, setInviteEventDetails] = useState({});
  const [eventEditMode, setEventEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('eventInfo');
  const [currentPage, setCurrentPage] = useState('mainPage');
  const [eventDetails, setEventDetails] = useState(eventDetailsInit);
  const [editEventId, setEditEventId] = useState(null);
  const scrollTopRef = useRef(null);

  const showEvent = (item) => {
    const elementScrollPosition = document.getElementById('main-content');
    setElementScroll(elementScrollPosition.scrollTop);
    scrollToTop();
    setMainClass('d-none');
    setClickTarget('event');
    dispatch(eventsByIdRequest(item));
  }

  const closeBox = () => {
    setClickTarget('');
    setMainClass('');
    setMemberPageNumber(1);
    setTimeout(() => {
      const element = document.getElementById('main-content');
      element.scrollBy(0, elementScroll);
    }, 500);
  }

  // Event Invite Modal
  const handleShowEventInviteModal = event => {
    try {
      const eventDetails = event;
      if (event?.host?.identifier) {
        eventDetails['host_identifier'] = event.host.identifier;
      }
      setInviteEventDetails(eventDetails);
      setShowEventInviteModal(true);
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:handleShowEventInviteModal' })
    }
  }
  const handleHideEventInviteModal = () => {
    setShowEventInviteModal(false);
  }

  const handleHideEventModal = () => {
    setShowEventModal(false);
    setEventEditMode(false);
    setEditEventId(null);
    setActiveTab('eventInfo');
    setEventDetails(eventDetailsInit);
    dispatch(resetEventFetchDetails());
    dispatch(editEventFlagUpdate(0));
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
      Logger.error({ fileLocation, message, trace: 'useEffect:handleJoinEventNow' })
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
      return event.is_attending === true ? true : false;
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
      setEditEventId(modalEventDetails.identifier);

    }
  }, [eventCreateFlag]);

  // Fetch event details to edit it
  const fetchEventDetails = ({ identifier }) => {
    dispatch(fetchDetailsRequest(identifier));
  }

  // Hook, display event edit modal
  useEffect(() => {
    try {
      if (eventDetail.name) {
        // Enable edit mode
        setEventEditMode(true);
        setActiveTab('eventInfo');
        setEditEventId(eventDetail.identifier);
        setShowEventModal(true);

        const tmpDate = moment(eventDetail.begins_at).utc().format("YYYY-MM-DD 00:00:00")
        const startTime = {
          value: moment(eventDetail.begins_at).utc().format(`HH:mm:00`),
          label: moment(eventDetail.begins_at).utc().format(`hh:mm a`)
        }
        let endTime = {
          value: moment(eventDetail.ends_at).utc().format(`HH:mm:00`),
          label: moment(eventDetail.ends_at).utc().format(`hh:mm a`)
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
          },
          type: eventDetail.type,
          visibility: eventDetail.visibility,
          isAdmin: false
        }));

        // Set validation
        setValidationErrors({
          eventName: { valid: true }, date: { valid: true }, startTime: { valid: true }, endTime: { valid: true }
        });
        if (eventDetail.ends_at === null) {
          setValidationErrors(prevProps => ({
            ...prevProps, endTime: { valid: false, message: 'End time is required' }
          }));
        }
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:eventDetail' })
    }

  }, [eventDetail]);

  // Hook, edit an event, only update internal store
  useEffect(() => {
    try {
      if (eventEditFlag === 1) {
        const { identifier, name, visibility, begins_at, description } = modalEventDetails;

        // Update right side panel if opened
        if (current.identifier === identifier) {
          dispatch(eventsByIdSuccess(({
            ...current, name, visibility, begins_at, description
          })));
        }

        setActiveTab('eventParticipants');
      }
    } catch ({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:eventEditFlag' })
    }
  }, [eventEditFlag]);

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
      Logger.error({ fileLocation, message, trace: 'useEffect:ISCFileContent' })
    }
  }, [dispatch, ISCFileContent]);

  // Using memo hook for performance improvement
  const eventContextMemo = useMemo(() => ({
    eventDetails, activeTab, eventEditMode, editEventId, currentPage, validationErrors,
    handleShowEventInviteModal, handleJoinEventNow, canEditEvent,
    canInviteMember, fetchEventDetails, handleHideEventModal,
    setEventDetails, setCurrentPage, setMemberPageNumber,
    setValidationErrors, setActiveTab, downloadICSFile
  }), [activeTab, eventEditMode, editEventId, eventDetails, currentPage]);

  const scrollToTop = () => {
    scrollTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleShowEditOrganization = (visible) => {
    setShowEditOrganization(visible)
  }

  return (
    <div className="content-sec">
      <div className="scroll" id="main-content" style={{ 'scrollBehavior': 'smooth' }}>
        <div className="container-fluid">
          <Loader visible={loadingOrg} />
          <ContentOrganizationHeader params={id} data={currentOrg} isSubscribed={isSubscribed} from="organization" mainClass={mainClass} ref={scrollTopRef} />
          <div className={`page-contain ${mainClass}`}>
            <div className="row">
              <ContentLeft
                data={currentOrg}
                isSubscribed={isSubscribed}
                handelSetSubscription={handelSetSubscription}
                handleShowEditOrganization={handleShowEditOrganization}
              />
              {
                (showEditOrganization === true)
                  ?
                  <EditOrganization id={id} hide={handleShowEditOrganization} />
                  :
                  <ContentRight isSubscribed={isSubscribed} nextPageEvents={nextPageEvents} showEvent={showEvent} />

              }
            </div>
          </div>
          {clickTarget === 'event' &&
            <div className="page-contain">
              <div className="event-discover-box">
                <EventContext.Provider value={eventContextMemo} >
                  {current.name && <ContentRightEvent from="discover" closeBox={closeBox} current={current} />}
                  <CreateEventModal show={showEventModal} hideModal={handleHideEventModal} />
                  <InviteToEventModal show={showEventInviteModal} hideModal={handleHideEventInviteModal} event={inviteEventDetails} />
                </EventContext.Provider>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
export default OrganizationInformation;
