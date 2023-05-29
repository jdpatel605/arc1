import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import InviteToEventModal from '../InviteToEventModal';
import Image from './../../../common/Image';
import {Helper} from '../../../../utils/helper';
import {KebabIcon, RecurringEventIcon} from "../../../../utils/Svg";
import {adminGroupListUpdate, groupEventListRequest, groupEventListUpdate, deleteGroupEventRequest} from '../../../../store/actions';
import {Logger} from './../../../../utils/logger';
const fileLocation = "src\\components\\admin\group\\GroupModalPages\\EventList.jsx";

const EventList = (props) => {

  const dispatch = useDispatch();
  const currentUser = localStorage.getItem('identifier');
  const userRole = localStorage.getItem("user_role");
  const {loadingAdmGrp, adminGroupDetails, grpEventLoading, grpEventList, grpEventPageInfo, deleteGrpEventFlag, deleteGrpEventSuccess, eventEditFlag, adminGroupList} = useSelector(({adminGroup}) => adminGroup);
  const [eventPageNumber, setEventPageNumber] = useState(1);
  const [lastRow, setLastRow] = useState({});
  const [sections, setSections] = useState({});

  const getEventList = () => {
    const data = {groupId: adminGroupDetails.identifier, search: props.searchText, page: eventPageNumber}
    dispatch(groupEventListRequest(data));
  }

  // Get serach reacord from ALL API
  useEffect(() => {
    try{
      setEventPageNumber(1);
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventEditFlag'})
    }
  }, [eventEditFlag])
  
  // Get serach reacord from ALL API
  useEffect(() => {
    if(props.searchText !== '') {
      setEventPageNumber(1);
      getEventList();
    }
    else {
      setEventPageNumber(1);
      getEventList();
    }
  }, [props.searchText])

  useEffect(() => {
    try {
      if(grpEventList) {

        // Get the last row
        const lastRowEl = grpEventList.slice(-1)[0];
        if(lastRowEl && lastRowEl.identifier) {
          setLastRow(lastRowEl);
        }

        // Manipulate the object
        const tmpSections = {};
        grpEventList.forEach(event => {
          const tempArray = tmpSections[event.section] ? tmpSections[event.section] : [];
          tmpSections[event.section] = [...tempArray, event];
        });
        setSections(tmpSections);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:Hook'})
    }
  }, [grpEventList]);

  useEffect(() => {
    if(eventPageNumber !== 1) {
      getEventList();
    }
  }, [dispatch, eventPageNumber]);

  const observer = useRef()
  const lastEventBookElementRef = useCallback(node => {
    try {
      if(grpEventLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(eventPageNumber < grpEventPageInfo.total_pages) {
            setEventPageNumber(eventPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'lastGroupMemberElementRef'})
    }
  }, [grpEventLoading])

  const handelDeleteEvent = (event, type = 'event') => {
    const data = {identifier: event.identifier, recursion: event.recursion_identifier, type: type}
    dispatch(deleteGroupEventRequest(data));
  }

  useEffect(() => {
    try {
      const { identifier, recursion, type } = deleteGrpEventSuccess;
      if(deleteGrpEventFlag === 1) {
        var groupList = adminGroupList;
        var groupData = grpEventList;
        var updatedList = grpEventList;
        if(type === 'recurring') {
          const eventCount = groupData.filter(event => event.recursion_identifier === recursion);
          var updatedList = grpEventList.filter(event => event.recursion_identifier !== recursion && event);
          var groupList = adminGroupList.map(group => group.identifier === adminGroupDetails.identifier ? { ...group, event_count : group.event_count-eventCount.length } : group);
        }
        else {
          var groupList = adminGroupList.map(group => group.identifier === adminGroupDetails.identifier ? { ...group, event_count : group.event_count-1 } : group);
          var updatedList = grpEventList.filter(event => event.identifier !== identifier && event);
        }
        dispatch(adminGroupListUpdate(groupList));
        dispatch(groupEventListUpdate(updatedList));

      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:Hook'})
    }
  }, [deleteGrpEventSuccess]);

  const [showEventInviteModal, setShowEventInviteModal] = useState(false);
  const [inviteEventDetails, setInviteEventDetails] = useState({});
  const handleHideEventInviteModal = () => {
    setShowEventInviteModal(false);
  }

  // Event Invite Modal
  const handleShowEventInviteModal = (event, type = 'event') => {
    try {
      let eventDetails = event;
      if(event?.host?.identifier) {
        eventDetails['host_identifier'] = event.host.identifier;
      }
      eventDetails['type'] = type;
      setInviteEventDetails(eventDetails);
      setShowEventInviteModal(true);
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'handleShowEventInviteModal' })
    }
  }

  return (
    <div className="member-list-data event-box">
      {
        // Loop through each section
        Object.keys(sections).map((section, sKey) => (

          sections[section].length > 0 &&
          <div key={sKey}>
            <div className="member-list-header pl-0 mt-2">
              <h5>{section}</h5>
            </div>
            {
              // Loop through each event
              sections[section].map((event, key) => {
                var day = '-';
                var time = '-';
                if(event.begins_at != null) {
                  day = Helper.formatDateTz(event.begins_at, 'MMMM DD');
                  time = Helper.formatDateTz(event.begins_at, 'h:mma');
                }
                return (
                  <div className="member-info" key={key} ref={lastEventBookElementRef}>
                    <div className="person-info">
                      <div className="person-img">
                        <div className="img-round img-60">
                          <Image src={event.avatar_url} altText="Event" />
                        </div>
                      </div>
                      <div className="person">
                        <h4 className="eventName" title={event.name}>{Helper.textLimit(event.name, 32)}</h4>
                        <p className="mt-0 mb-2" title={event.host_name}>{Helper.textLimit(event.host_name, 32)}</p>
                      </div>
                    </div>

                    <div className="communication event-list">
                      {event.recursion_identifier &&
                        <div className="converticon">{RecurringEventIcon}</div>
                      }
                      {event.recursion_identifier &&
                        <div></div>
                      }
                      <div className="time-data ml-3">
                        <label>{day}</label>
                        <a className="btn btn-round btn-green bg-black-600" href="#/">
                          {time}
                        </a>
                      </div>
                      <Dropdown>
                        <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
                          {KebabIcon}
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight="true" className="option-menu">
                          {event.recursion_identifier &&
                            <>
                              <Dropdown.Item onClick={() => handleShowEventInviteModal(event)} className="img-add-user">Invite to This Event Only</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleShowEventInviteModal(event, 'recurring')} className="img-add-user">Invite to All Occurrences</Dropdown.Item>
                              <Dropdown.Item onClick={() => handelDeleteEvent(event)} className="img-trash clr-red">Delete This Event Only</Dropdown.Item>
                              <Dropdown.Item onClick={() => handelDeleteEvent(event, 'recurring')} className="img-trash clr-red">Delete All Occurrences</Dropdown.Item>
                            </>
                          }
                          {!event.recursion_identifier &&
                            <>
                              <Dropdown.Item onClick={ () => props.fetchEventDetails(event) } className="img-edit-icon">Edit Event</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleShowEventInviteModal(event)} className="img-add-user">Invite Member</Dropdown.Item>
                              <Dropdown.Item onClick={() => handelDeleteEvent(event)} className="img-trash clr-red">Delete This Event</Dropdown.Item>
                            </>
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                );
              })
            }
          </div>
        ))
      }
      {
        !loadingAdmGrp && grpEventList.length === 0 && 
        <div className="member-list-header pl-0 mt-2">
          <h5 className="w-100 text-center">No events found</h5>
        </div>
      }
      <InviteToEventModal
        show={ showEventInviteModal }
        hideModal={ handleHideEventInviteModal }
        event={ inviteEventDetails }
      />
    </div>
  )
}
EventList.propTypes = {
  searchText: PropTypes.string,
  fetchEventDetails: PropTypes.func,
};
EventList.defaultProps = {
  searchText: '',
};
export default EventList;
