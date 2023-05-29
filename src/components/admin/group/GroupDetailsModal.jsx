import React, {useState, useEffect, useMemo, useCallback} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import {isMobile} from "react-device-detect";
import {SearchIcon, PublicGroupIcon, LockIcon, PlusIcon, CloseProfileIcon} from "../../../utils/Svg";
import Image from '../../common/Image';
import ReadMoreText from './../../common/ReadMoreText';
import CreateEvent from './../../common/CreateEvent';
import { EventContext } from "./EventContext";
import CreateEventModal from './EventModalsPages/CreateEventModal';
import MemberList from './GroupModalPages/MemberList';
import EventList from './GroupModalPages/EventList';
import { Helper } from "../../../utils/helper";
import { adminGroupListUpdate, fetchDetailsRequest, groupEventListRequest, resetEventFetchDetails, detailsGroupMemberListReset } from '../../../store/actions'
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\group\\InviteToGroupModal.jsx";

const defaultValidation = {
  eventName: {}, date: {}, eventGroupHost: {}, startTime: {}, endTime: {}
};

const GroupDetailsModal = props => {
  const dispatch = useDispatch();
  const {adminGroupList, adminGroupDetails} = useSelector(({adminGroup}) => adminGroup);
  const [showCreateEventModalFlag, setShowCreateEventModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tab, setTab] = useState('members');

  const showAssignGroupOwner = () => {
    props.showAssignGroupOwner(adminGroupDetails);
  }
  
  const tabPannelClick = (item) => {
    setTab(item);
  }

  const showCreateEventModal = id => {
    if(isMobile) {
      window.location = '/unsupported-feature'
      return false
    }
    setShowCreateEventModal(true);
  }

  const hideCreateEventModal = () => {
    setShowCreateEventModal(false);
  }

  const hideDetailsModal = (value) => {
    setTab('members')
    setSearchText('');
    dispatch(detailsGroupMemberListReset());
    props.hideDetailsModal(value);
  }

  const showInviteBox = (identifier) => {
    props.showInviteBox(identifier)
  }

  const searchMemberInput = React.useRef(null);
  const searchMember = (event) => {
    setSearchText(event.target.value);
  }

  const eventDetailsInit = {
    eventName: '', description: '', eventGroupHost: {name: 'Select Host', id: '', hostType: ''}, date: '',
    startTime: {}, endTime: {}, type: 'discussion', visibility: 'private',
  };
  const { eventDetail } = useSelector(({ events }) => events);
  const { eventCreateFlag, eventEditFlag, modalEventDetails } = useSelector(({ adminGroup }) => adminGroup);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventEditMode, setEventEditMode] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [validationErrors, setValidationErrors] = useState(defaultValidation);
  const [activeTab, setActiveTab] = useState('eventInfo');
  const [eventDetails, setEventDetails] = useState(eventDetailsInit);
  const [memberPageNumber, setMemberPageNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState('mainPage');

  const handleHideEventModal = () => {
    dispatch(resetEventFetchDetails());
    setShowEventModal(false);
    setEventEditMode(false);
    setEditEventId(null);
    setValidationErrors(defaultValidation);
    setActiveTab('eventInfo');
    setEventDetails(eventDetailsInit);
  }

  const handleShowEventModal = () => {
    // Update event host info
    const eventGroupHost = {
      name: adminGroupDetails.name,
      id: adminGroupDetails.identifier,
      hostType: 'group'
    }
    const eventDetailsData = {...eventDetailsInit, eventGroupHost};
    setEventDetails(eventDetailsData);

    setValidationErrors(preProps => ({
      ...preProps, eventGroupHost: {valid: true, message: ''}
    }));

    setShowEventModal(true);
    setEventEditMode(false);
    setEditEventId(null);
    setActiveTab('eventInfo');
  }

  // Hook, create an event and enable edit mode
  useEffect(() => {
    try {
      if(eventCreateFlag === 1) {
        // Enable edit mode
        setEventEditMode(true);
        setActiveTab('eventParticipants');
        setEditEventId(modalEventDetails.identifier);
        const data = {groupId: adminGroupDetails.identifier, search: searchText, page: 1}
        dispatch(groupEventListRequest(data));
        const groupList = adminGroupList.map(group => group.identifier === adminGroupDetails.identifier ? { ...group, event_count : group.event_count+1 } : group);
        dispatch(adminGroupListUpdate(groupList));
        
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventCreateFlag'})
    }
  }, [eventCreateFlag]);

  // Hook, update an event and enable edit mode
  useEffect(() => {
    try {
      if(eventEditFlag === 1) {
        setEventEditMode(true);
        setActiveTab('eventParticipants');
        const data = {groupId: adminGroupDetails.identifier, search: searchText, page: 1}
        dispatch(groupEventListRequest(data));
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventEditFlag'})
    }
  }, [eventEditFlag]);

  // Fetch event details to edit it
  const fetchEventDetails = ({ identifier }) => {
    dispatch(fetchDetailsRequest(identifier));
  }

  // Hook, display event edit modal once fetchEventDetails request is completed
  useEffect(() => {
    try {
      if(eventDetail.name) {

        // Enable edit mode
        setEventEditMode(true);
        if(eventCreateFlag !== false) {
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
        if(eventDetail.ends_at === null) {
          endTime = { value: '', label: '' }
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
            hostType: eventDetail.host_type
          },
          type: eventDetail.type,
          visibility: eventDetail.visibility,
        }));

        // Set validation
        setValidationErrors({
          eventName: { valid: true }, date: { valid: true }, startTime: { valid: true }, endTime: { valid: true }
        });
        if(eventDetail.ends_at === null) {
          setValidationErrors(prevProps => ({
            ...prevProps, endTime: { valid: false, message: 'End time is required' }
          }));
        }

      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }

  }, [eventDetail]);

  const eventContextMemo = useMemo(() => ({
    eventDetails, activeTab, eventEditMode,
    editEventId, validationErrors, currentPage, showEventModal,
    handleHideEventModal, setEventDetails, setMemberPageNumber, setValidationErrors, setActiveTab, setCurrentPage, fetchEventDetails
  }), [activeTab, eventEditMode, editEventId, eventDetails, currentPage, showEventModal]);

  return (
    <>
    <EventContext.Provider value={eventContextMemo} >
      <CreateEventModal show={showEventModal} hideModal={handleHideEventModal} />
    </EventContext.Provider>
    <Modal size="lg" className="group-invite-modal" show={props.showModal} onHide={() => hideDetailsModal(false)} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Body className="modal-details-group">
          <CreateEvent
            showModal={showCreateEventModalFlag}
            groupId={adminGroupDetails.identifier}
            onHideModal={hideCreateEventModal}
          />
          <div className="chat-history">
            <div className="group-info">
              <div className="group-person-data">
                <div className="group-info-header mt-4">
                  <div className="back-btn">
                    <a href="#" onClick={() => hideDetailsModal(false)}>
                      {CloseProfileIcon}
                    </a>
                  </div>
                  <div className="group-property">
                    {adminGroupDetails.visibility === 'public' &&
                      <a className="btn-public" href="#">
                        <label htmlFor="">Public</label>&ensp;&ensp; {PublicGroupIcon}
                      </a>
                    }
                    {adminGroupDetails.visibility === 'organization_public' &&
                      <a className="btn-public" href="#">
                        <label htmlFor="">Organization Public</label>&ensp;&ensp; {PublicGroupIcon}
                      </a>
                    }
                    {adminGroupDetails.visibility === 'private' &&
                      <a className="btn-public" href="#">
                        <label htmlFor="">Private</label>&ensp;&ensp; {LockIcon}
                      </a>
                    }
                    <div>
                      <Dropdown>
                        <Dropdown.Toggle as='a' id="dropdown-custom-components-1" className='btn-add btn-gray'>
                          {PlusIcon}
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight="true" className="option-menu">
                        <Dropdown.Item href="#" onClick={() => props.editGroup(adminGroupDetails.identifier)} className="img-edit-icon">Edit Group</Dropdown.Item>
                          <Dropdown.Item href="#" className="img-plus" onClick={() => handleShowEventModal()}>Create Event</Dropdown.Item>
                          <Dropdown.Item href="#" onClick={() => showInviteBox(adminGroupDetails.identifier)} className="img-add">Invite Members</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className="person-data">
                  <div className="person-info">
                    <div className="person-img">
                      <div className="img-round img-76">
                        <Image className="group_details" src={adminGroupDetails.avatar_url} altText="Groups" />
                      </div>
                    </div>
                    <div className="person">
                      <h4>{adminGroupDetails.name}</h4>
                      {adminGroupDetails.description && adminGroupDetails.description.length > 150 &&
                        <p>
                          <ReadMoreText
                            content={adminGroupDetails.description}
                            limit={150}
                            linkclassName="load-more cursor-pointer text-white"
                          />
                        </p>
                      }
                      {adminGroupDetails.description && adminGroupDetails.description.length <= 150 &&
                        <p>
                          {adminGroupDetails.description}
                        </p>
                      }
                    </div>
                  </div>
                </div>
                <div className="group-info-footer">
                  <div className="search-box">
                    <input type="text" ref={searchMemberInput} id="txtsearch" className="search" placeholder="Search group..." onChange={searchMember.bind(this)} />
                    <a className="btn-search" href="#">
                      {SearchIcon}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="member-list group-details-tab">
              <nav className="nav nav-pills nav-fill">
                <a href="#" onClick={e => tabPannelClick('members')} className={`nav-item nav-link ${tab === 'members' ? 'active' : ''}`}>Members</a>
                <a href="#" onClick={e => tabPannelClick('events')} className={`nav-item nav-link ${tab === 'events' ? 'active' : ''}`}>Events</a>
              </nav>
              <div className="tab-content align-items-start headers" >
                <div className="card tab-pane active">
                  <div className="collapse show">
                    {tab === 'members' && <MemberList searchText={searchText} hideDetailsModal={hideDetailsModal} showAssignGroupOwner={showAssignGroupOwner}/>}
                    {tab === 'events' && <EventList searchText={searchText} fetchEventDetails={fetchEventDetails}/>}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </Modal.Body>
    </Modal>
  </>
  )
}
GroupDetailsModal.propTypes = {
  showModal: PropTypes.bool,
  hideDetailsModal: PropTypes.func,
  showInviteBox: PropTypes.func,
  showAssignGroupOwner: PropTypes.func,
  editGroup: PropTypes.func,
};
GroupDetailsModal.defaultProps = {
  showModal: false,
};
export default GroupDetailsModal;
