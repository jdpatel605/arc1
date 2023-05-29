import React, {useEffect, useState, useMemo, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import moment from 'moment';
import ContentHeader from './contentHeader';
import ContentMiddle from './contentMiddle';
import TabContent from './tabContent';
import ContentLeft from '../organizationInformation/ContentLeft';
import ContentRight from '../organizationInformation/ContentRight';
import EditOrganization from '../organizationInformation/EditOrganization';
import ContentOrganizationHeader from '../organizationInformation/ContentOrganizationHeader';
import ContentRightGroup from "../group/contentRight";
import CreateGroup from '../group/CreateGroup';
import {EventContext} from "../events/EventContext";
import ContentRightEvent from "../events/contentRight";
import CreateEventModal from '../events/EventModalsPages/CreateEventModal';
import InviteToEventModal from "../events/InviteToEventModal";
import history from "../../history/history";
import {organizationByIdRequest, checkOrganizationSubscriptionRequest, eventDiscoverUpdate, allDiscoverUpdate, groupDiscoverUpdate} from '../../store/actions'
import {manageOrganizationSubscriptionRequest, loadMoreOrgEventsRequest, resetOrganizationStore} from '../../store/actions/organizationActions';
import {groupDetailsRequest, groupEditDetailsRequest, leaveGroupRequest, deleteGroupRequest, resetGroupState, organizationListRequest} from '../../store/actions/group';
import {
  resetEventList, updateMyEventList, eventsByIdRequest, fetchDetailsRequest,
  eventsByIdSuccess, eventMemberListRequest, resetEventMemberList, resetEventFetchDetails,
  editEventFlagUpdate
} from '../../store/actions/eventActions'
import Loader from '../Loader';
import {eventICSFileRequest, eventICSFileReset} from './../../store/actions/eventActions';
import smoothscroll from 'smoothscroll-polyfill';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\discover\\index.jsx";

const defaultValidation = {
  eventName: {}, date: {}, eventGroupHost: {}, startTime: {}, endTime: {}
};
const Index = () => {
  smoothscroll.polyfill();
  const alert = useAlert();
  const dispatch = useDispatch();
  const {loadingDis, list, eventList, groupList} = useSelector(({discover}) => discover);
  const [componentLoad, setComponentLoad] = useState(false);
  const [clickTarget, setClickTarget] = useState('');
  const [mainClass, setMainClass] = useState('');
  const [validationErrors, setValidationErrors] = useState(defaultValidation);
  const [panel, setPanel] = useState('all');
  const [elementScroll, setElementScroll] = useState(0);
  const scrollTopRef = useRef(null);
  const mainContent = "main-content";

  const topPanelClick = (item) => {
    setPanel(item);
  }
  const [search, setSearch] = useState('');
  const searchArc = (item) => {
    console.log(item);
    setSearch(item);
  }
  const closeBox = () => {
    setClickTarget('');
    setTargetId('');
    setMainClass('');
    setPageNumber(1);
    dispatch(resetGroupState());
    setTimeout(() => {
      const element = document.getElementById(mainContent);
      element.scrollBy(0, elementScroll);
    }, 500);
  }

  // Fetch single organization data start
  const {loadingOrg, currentOrg, eventsList, is_subscribed, organizationId, loadEventFlag, orgPageInfo, updateFlag} = useSelector(({organization}) => organization);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [targetId, setTargetId] = useState('');
  const [showEditOrganization, setShowEditOrganization] = useState(false);

  const showOrg = (item) => {
    const elementScrollPosition = document.getElementById(mainContent);
    setElementScroll(elementScrollPosition.scrollTop);
    scrollToTop();
    setMainClass('d-none');
    setClickTarget('organization');
    setTargetId(item);
    dispatch(organizationByIdRequest(item));
    dispatch(checkOrganizationSubscriptionRequest(item));
    dispatch(loadMoreOrgEventsRequest({id: item, page: pageNumber}))
    return () => {
      dispatch(resetOrganizationStore());
    }
  }

  const handleShowEditOrganization = (visible) => {
    setShowEditOrganization(visible)
  }

  useEffect(() => {
    try {
      if(updateFlag === 1) {
        dispatch(organizationByIdRequest(targetId));
        dispatch(checkOrganizationSubscriptionRequest(targetId));
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:updateFlag'})
    }
  }, [updateFlag]);

  useEffect(() => {
    try {
      if(list) {
        setComponentLoad(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:discoverList'})
    }
  }, [list]);
  // Check organization is subscribed
  useEffect(() => {
    try {
      setIsSubscribed(is_subscribed);
      if(targetId) {
        dispatch(organizationByIdRequest(targetId));
      }
      dispatch(organizationListRequest());
      const orgId = localStorage.getItem('organization_id');
      if(orgId === 'null' || orgId === 'undefined' || orgId === '') {
        localStorage.setItem('organization_id', organizationId);
      }
      if(orgId !== 'null' && orgId !== 'undefined' && orgId !== '' && orgId === organizationId) {
        localStorage.setItem('organization_id', null);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:is_subscribed'})
    }
  }, [is_subscribed]);

  const handelSetSubscription = status => {
    const orgId = localStorage.getItem('organization_id');
    if(orgId !== targetId) {
      let payload = {status: 'subscribe', id: targetId};
      if(status === true) {
        payload = {status: 'unsubscribe', id: targetId};
      }
      dispatch(manageOrganizationSubscriptionRequest(payload));
    }
    else {
      alert.show("You can't leave from home organization");
    }
  }

  // Load more events
  useEffect(() => {
    if(targetId !== '') {
      dispatch(loadMoreOrgEventsRequest({
        id: targetId,
        page: pageNumber
      }))
    }
  }, [pageNumber]);

  // Set next page
  const nextPageEvents = () => {
    if(pageNumber < orgPageInfo.total_pages) {
      setPageNumber(pageNumber + 1);
    }
  }
  // Fetch single organization data end

  // Fetch single event data
  const eventDetailsInit = {
    eventName: '', description: '', eventGroupHost: {name: 'Select Host', id: ''}, date: '',
    startTime: '', endTime: '', type: 'discussion', visibility: 'private',
  };
  const {
    myEventsList, current, eventCreateFlag, modalEventDetails, eventDetail, eventEditFlag, currentEventFlag,
    eventDeleteFlag, ISCFileContent
  } = useSelector(({events}) => events);
  const [memberPageNumber, setMemberPageNumber] = useState(1);
  const [showEventInviteModal, setShowEventInviteModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [inviteEventDetails, setInviteEventDetails] = useState({});
  const [eventEditMode, setEventEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('eventInfo');
  const [currentPage, setCurrentPage] = useState('mainPage');
  const [eventDetails, setEventDetails] = useState(eventDetailsInit);
  const [editEventId, setEditEventId] = useState(null);

  const showEvent = (item) => {
    const elementScrollPosition = document.getElementById(mainContent);
    setElementScroll(elementScrollPosition.scrollTop);
    scrollToTop();
    setMainClass('d-none');
    setClickTarget('event');
    dispatch(eventsByIdRequest(item));
  }

  // Event Invite Modal
  const handleShowEventInviteModal = event => {
    let eventDetails = event;
    if(event?.host?.identifier) {
      eventDetails['host_identifier'] = event.host.identifier;
    }
    setInviteEventDetails(eventDetails);
    setShowEventInviteModal(true);
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
    const {identifier} = event;
    const jwt = localStorage.getItem("accessToken");
    // Store the event data in local storage
    localStorage.setItem(identifier, jwt);
    // Push user to the group call screen
    history.push(`/event?e=${identifier}`);
    window.location.reload();
  }

  // Check if session user can edit the event
  const canEditEvent = event => {
    const currentIdentifier = localStorage.getItem("identifier");
    return currentIdentifier === event.owner_identifier;
  }

  // Check if session user can invite other to the event
  const canInviteMember = event => {
    if(event) {
      return event.is_attending === true ? true : false;
    } else {
      return false;
    }
  }

  // Hook, display event member once event details fetch successfully
  useEffect(() => {
    try {
      if(currentEventFlag === 1) {
        if(current.identifier) {
          setMemberPageNumber(1);
          dispatch(resetEventMemberList());
          dispatch(eventMemberListRequest({
            id: current.identifier,
            page: 1
          }));
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:currentEventFlag'})
    }
  }, [currentEventFlag]);

  // Hook, display event member next page
  useEffect(() => {
    if(memberPageNumber > 1) {
      if(current.identifier) {
        dispatch(eventMemberListRequest({
          id: current.identifier,
          page: memberPageNumber
        }));
      }
    }
  }, [memberPageNumber]);

  // Hook, create an event and enable edit mode
  useEffect(() => {
    try {
      if(eventCreateFlag === 1) {
        dispatch(resetEventList());
        // Enable edit mode
        setEventEditMode(true);
        setActiveTab('eventParticipants');
        setEditEventId(modalEventDetails.identifier);

      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventCreateFlag'})
    }
  }, [eventCreateFlag]);

  // Fetch event details to edit it
  const fetchEventDetails = ({identifier}) => {
    dispatch(fetchDetailsRequest(identifier));
  }

  // Hook, display event edit modal
  useEffect(() => {
    try {
      if(eventDetail.name) {
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
        if(eventDetail.ends_at === null) {
          endTime = {value: '', label: ''}
        }
        const date = new Date(tmpDate);
        setEventDetails(({
          ...eventDetailsInit,
          eventName: eventDetail.name,
          description: eventDetail.description === null ? '' : eventDetail.description,
          date, startTime, endTime,
          eventGroupHost: {
            name: eventDetail.host.name,
            id: eventDetail.host.identifier,
          },
          type: eventDetail.type,
          visibility: eventDetail.visibility,
        }));

        // Set validation
        setValidationErrors({
          eventName: {valid: true}, date: {valid: true}, startTime: {valid: true}, endTime: {valid: true}
        });
        if(eventDetail.ends_at === null) {
          setValidationErrors(prevProps => ({
            ...prevProps, endTime: {valid: false, message: 'End time is required'}
          }));
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventDetail'})
    }
  }, [eventDetail]);

  // Hook, edit an event, only update internal store
  useEffect(() => {
    try {
      if(eventEditFlag === 1) {
        const {identifier, name, visibility, begins_at, description} = modalEventDetails;

        // Update the list
        const updatedList = myEventsList.map(data =>
          data.identifier === identifier ? {...data, name, begins_at} : data
        );
        dispatch(updateMyEventList({
          entries: updatedList,
          eventId: identifier
        }));

        // Update right side panel if opened
        if(current.identifier === identifier) {
          dispatch(eventsByIdSuccess(({
            ...current, name, visibility, begins_at, description
          })));
        }

        setActiveTab('eventParticipants');
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventEditFlag'})
    }
  }, [eventEditFlag]);

  // Download ICS File content
  const downloadICSFile = ({identifier}, type = 'add') => {
    const payload = {
      id: identifier, type
    }
    dispatch(eventICSFileRequest(payload));
  }

  //Hook, Download ICF File
  useEffect(() => {
    try {
      const {flag, data} = ISCFileContent;
      if(flag === 1) {
        const element = document.createElement("a");
        const file = new Blob([data], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `event-${moment().format('YYYYMMDDHHmmss')}.ics`;
        document.body.appendChild(element);
        element.click();
        dispatch(eventICSFileReset());
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:ISCFileContent'})
    }
  }, [dispatch, ISCFileContent]);

  useEffect(() => {
    try {
      const {flag, identifier} = eventDeleteFlag;
      if(flag === 1) {
        let updatedList = {};
        if(list) {
          updatedList = list.filter(event => event.identifier !== identifier && event);
        } else {
          updatedList = eventList.filter(event => event.identifier !== identifier && event);
        }
        dispatch(eventDiscoverUpdate({
          eventEntries: updatedList
        }))
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventDeleteFlag'})
    }
  }, [eventDeleteFlag]);

  // Using memo hook for performance improvement
  const eventContextMemo = useMemo(() => ({
    eventDetails, activeTab, eventEditMode, editEventId, currentPage, validationErrors,
    handleShowEventInviteModal, handleJoinEventNow, canEditEvent,
    canInviteMember, fetchEventDetails, handleHideEventModal,
    setEventDetails, setCurrentPage, setMemberPageNumber,
    setValidationErrors, setActiveTab, downloadICSFile
  }), [activeTab, eventEditMode, editEventId, eventDetails, currentPage]);

  // Fetch single Group details start
  const groupOrganizationId = localStorage.getItem('organization_id');
  const {groupEditDetails, leaveGroupSuccess, leaveGroupError, deleteGroupSuccess, deleteGroupError} = useSelector(({group}) => group);
  const [currentGroup, setCurrentGroup] = useState('');
  const [editData, setEditData] = useState({});
  const [showAddEditModel, setShowAddEditModel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const showGroup = (item) => {
    const elementScrollPosition = document.getElementById(mainContent);
    setElementScroll(elementScrollPosition.scrollTop);
    scrollToTop();
    setMainClass('d-none');
    setClickTarget('group');
    setCurrentGroup(item);
    const gData = {group_id: item}
    dispatch(groupDetailsRequest(gData));
  }
  // Get group details
  useEffect(() => {
    try {
      if(groupEditDetails.name) {
        setEditData(groupEditDetails);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:groupEditDetails'})
    }
  }, [groupEditDetails]);
  // Show edit group
  const showEditGroup = (gID) => {
    const groupData = {group_id: gID}
    dispatch(groupEditDetailsRequest(groupData));
    setShowAddEditModel(true);
    setIsEdit(true);
  }
  const showCreateGroupBox = (event) => {
    setShowAddEditModel(event);
  }
  const createGroupSuccess = () => {
    const gData = {group_id: currentGroup}
    dispatch(groupDetailsRequest(gData));
  }

  const leaveGroup = (id) => {
    dispatch(leaveGroupRequest(id));
  }

  useEffect(() => {
    try {
      if(leaveGroupSuccess.id) {
        const groupData = {group_id: leaveGroupSuccess.id}
        dispatch(groupDetailsRequest(groupData));
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:leaveGroupSuccess'})
    }
  }, [leaveGroupSuccess]);
  useEffect(() => {
    try {
      if(componentLoad && leaveGroupError.message) {
        if(leaveGroupError.message.message) {
          alert.error(leaveGroupError.message.message);
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:leaveGroupError'})
    }
  }, [leaveGroupError]);

  const deleteGroup = (id) => {
    dispatch(deleteGroupRequest(id));
  }

  useEffect(() => {
    try {
      if(componentLoad && deleteGroupSuccess.id) {
        setClickTarget('');
        setTargetId('');
        setMainClass('');
        setPageNumber(1);
        dispatch(resetGroupState());
        setTimeout(() => {
          const element = document.getElementById(mainContent);
          element.scrollBy(0, elementScroll);
        }, 500);
        if(list && list.length !== 0) {
          const updatedList = list.filter(group => group.identifier !== deleteGroupSuccess.id && group);
          dispatch(allDiscoverUpdate(updatedList));
        } else {
          const updatedList = groupList.filter(group => group.identifier !== deleteGroupSuccess.id && group);
          dispatch(groupDiscoverUpdate(updatedList));
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:deleteGroupSuccess'})
    }
  }, [deleteGroupSuccess]);

  useEffect(() => {
    try {
        if (componentLoad && deleteGroupError.status) {
            if (deleteGroupError?.message?.message) {
                alert.error(deleteGroupError.message.message);
            }
        }
    } catch ({ message }) {
        Logger.error({ fileLocation, message, trace: 'useEffect:deleteGroupSuccess' })
    }
  }, [deleteGroupError]);

  const scrollToTop = () => {
    scrollTopRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  return (
    <div className="content-sec">
      <div className="scroll" id="main-content" style={{'scrollBehavior': 'smooth'}}>
        <div className="container-fluid">
          <Loader visible={loadingDis} visible={loadingOrg} />
          <ContentHeader searchArc={searchArc} loading={loadingDis} mainClass={mainClass} ref={scrollTopRef} />
          <div className="page-contain">
            <div className={`tab-section ${mainClass}`}>
              <ContentMiddle onClick={topPanelClick} />
              <TabContent panel={panel} search={search} showOrg={showOrg} showEvent={showEvent} showGroup={showGroup} />
            </div>
            {clickTarget === 'organization' &&
              <div className="row" style={{height: 'auto'}}>
                <div className={`${showEditOrganization === true ? 'col-lg-11' : 'col-lg-10'} single-discover-box`} style={{height: 'auto'}}>
                  <ContentOrganizationHeader params={targetId} data={currentOrg} isSubscribed={isSubscribed} from="discover" closeBox={closeBox} />
                  <div className="page-contain bg-gray bg-black-grey">
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
                          <EditOrganization id={targetId} hide={handleShowEditOrganization} />
                          :
                          <ContentRight
                            eventsList={eventsList}
                            isSubscribed={isSubscribed}
                            nextPageEvents={nextPageEvents}
                            loading={loadEventFlag}
                            from="discover"
                            showEvent={showEvent}
                          />
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
            {clickTarget === 'group' &&
              <>
                <div className="group-discover-box">
                  <ContentRightGroup
                    hideRightSide={closeBox}
                    editGroup={showEditGroup}
                    deleteGroup={deleteGroup}
                    leaveGroup={leaveGroup}
                    groupId={currentGroup}
                    from="discover"
                  />
                  <CreateGroup
                    show={showAddEditModel}
                    hide={showCreateGroupBox}
                    organizationId={groupOrganizationId}
                    onSuccess={createGroupSuccess}
                    editData={editData}
                    is_edit={isEdit}
                  />
                </div>
              </>
            }
            {clickTarget === 'event' &&
              <div className="event-discover-box">
                <EventContext.Provider value={eventContextMemo} >
                  {current.name && <ContentRightEvent from="discover" closeBox={closeBox} current={current} />}
                  <CreateEventModal show={showEventModal} hideModal={handleHideEventModal} />
                  <InviteToEventModal show={showEventInviteModal} hideModal={handleHideEventInviteModal} event={inviteEventDetails} />
                </EventContext.Provider>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default Index;
