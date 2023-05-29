// React hooks imports
import React, {useRef, useEffect, useState, useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown'
import {ChevronDownIcon, KebabIcon, SearchIcon, RecurringEventIcon, ChevronUpIcon} from "../../../utils/Svg";
import {Logger} from '../../../utils/logger';
import {Helper} from "../../../utils/helper";
import Loader from "../../Loader";
import moment from 'moment';

// Component imports
import {EventContext} from "../../events/EventContext";
import InviteToEventModal from "../../events/InviteToEventModal";
import CreateEventModal from '../../events/EventModalsPages/CreateEventModal';
import EventDetailModal from '../../admin/event/eventDetailsModal';

// Redux actions import
import {
    resetAdminGroupState, adminEventListRequest, adminEventListUpdate, fetchDetailsRequest,
    resetEventFetchDetails, updateMyEventList, eventsByIdSuccess, deleteEventRequest, eventsByIdRequest,
    resetEventMemberList, eventMemberListRequest, editEventRequest, resetEventList, deleteEventReset
} from '../../../store/actions';

var searchEventDelay;
const fileLocation = "src\\components\\admin\\event\\index.jsx";
const defaultValidation = {
    eventName: {}, date: {}, eventGroupHost: {}, startTime: {}, endTime: {}
};
const eventDetailsInit = {
    eventName: '', description: '', eventGroupHost: {name: 'Select Host', id: '', hostType: ''}, date: '',
    startTime: {}, endTime: {}, type: 'discussion', visibility: 'private',
};

const Index = props => {
    // Reference declaration
    const dispatch = useDispatch();
    const {loadingAdmEvt, admEvtListloading, adminEventList, adminEventPageInfo} = useSelector(({adminEvent}) => adminEvent);
    const {loading, eventDetail, eventEditFlag, modalEventDetails, current, myEventsList, eventDeleteFlag, currentEventFlag, eventCreateFlag} = useSelector(({events}) => events);

    // State declaration
    const [validationErrors, setValidationErrors] = useState(defaultValidation);
    const [showEventInviteModal, setShowEventInviteModal] = useState(false);
    const [showEventDetailModal, setShowEventDetailModal] = useState(false);
    const [eventDetails, setEventDetails] = useState(eventDetailsInit);
    const [inviteEventDetails, setInviteEventDetails] = useState({});
    const [showEventModal, setShowEventModal] = useState(false);
    const [memberPageNumber, setMemberPageNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState('mainPage');
    const [eventEditMode, setEventEditMode] = useState(false);
    const [componentLoad, setComponentLoad] = useState(false);
    const [activeTab, setActiveTab] = useState('eventInfo');
    const [EvtPageNumber, setEvtPageNumber] = useState(1);
    const [editEventId, setEditEventId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [orderBy, setOrderBy] = useState('begins_at');
    const [orderType, setOrderType] = useState('asc');
    const [search, setSearch] = useState('');
    const [createFrom, setCreateFrom] = useState('admin');

    const filtterByColumn = (column, type) => {
        setEvtPageNumber(1);
        if(orderBy === column && type === 'asc') {
            setOrderType('desc');
        }
        else if(orderBy === column && type === 'desc') {
            setOrderType('asc');
        }
        else {
            setOrderType('asc');
        }
        setOrderBy(column);
    }

    const getAdminEventData = () => {
        dispatch(adminEventListRequest({organization_id: localStorage.getItem('admin_identifier'), search: search, page: EvtPageNumber, order: orderBy === 'time' ? 'begins_at' : orderBy, dir: orderType}));
    }

    const searchEvent = (event) => {
        setEvtPageNumber(1);
        setSearch(event.target.value);
    }

    useEffect(() => {
        getAdminEventData();
    }, [search]);
    
    // Request Event list on load
    useEffect(() => {
        getAdminEventData();
        dispatch(resetAdminGroupState());
    }, []);
    
    // Set component is loaded for api call
    useEffect(() => {
        try {
            if(adminEventList) {
                setComponentLoad(true);
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:adminEventList'})
        }
    }, [adminEventList])
    
    useEffect(() => {
        getAdminEventData();
    }, [orderBy, orderType])

    // Privacy Section - start region
    const changeVisiblity = (item, visibility) => {
        const payload = {
            id: item.host_identifier,
            hostType: item.host_type,
            data: {
                identifier: item.identifier,
                name: item.name,
                type: item.type,
                visibility: visibility,
                isAdmin: true
            }
        }
        const updatedList = adminEventList.map(data => data.identifier === item.identifier ? {...data, visibility} : data);
        dispatch(adminEventListUpdate(updatedList));
        dispatch(editEventRequest(payload));
    }

    // Privacy Section - end region

    // Delete Event - start region
    const handelDeleteEvent = (event, type) => {
        const {identifier} = event;
        const {recursion_identifier} = event;
        dispatch(deleteEventRequest({
            id: identifier,
            recursion: recursion_identifier,
            type: type,
            isAdmin: true
        }));
        handleHideEventDetailModal();
    };


    useEffect(() => {
        try {
            const {flag, identifier, recursion, type} = eventDeleteFlag;
            if(flag === 1) {
                dispatch(deleteEventReset({flag: 0}));
                var updatedList = adminEventList;
                if(type === 'recurring') {
                    var updatedList = adminEventList.filter(event => event.recursion_identifier !== recursion && event);
                }
                else {
                    var updatedList = adminEventList.filter(event => event.identifier !== identifier && event);
                }
                dispatch(adminEventListUpdate(updatedList));
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:Hook'})
        }
    }, [eventDeleteFlag]);

    useEffect(() => {
        if(componentLoad && EvtPageNumber !== 1)
            setEvtPageNumber(EvtPageNumber);
            getAdminEventData();
    }, [EvtPageNumber]);
    // Delete Event - end region

    // Fetch event details to edit it
    const fetchEventDetails = ({identifier}) => {
        dispatch(fetchDetailsRequest(identifier));
    }

    // Event Invite Modal - start region
    const handleShowEventInviteModal = event => {
        try {
            let eventDetails = event;
            if(event?.host?.identifier) {
                eventDetails['host_identifier'] = event.host.identifier;
            }
            setInviteEventDetails(eventDetails);
            setShowEventInviteModal(true);
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'handleShowEventInviteModal'})
        }
    }
    const handleHideEventInviteModal = () => {
        setShowEventInviteModal(false);
    }
    // Event Invite Modal - end region

    const handleShowEventModal = () => {
        // Update event host info
        const eventGroupHost = {
            name: localStorage.getItem('admin_name'),
            id: localStorage.getItem('admin_identifier'),
            hostType: 'organizations'
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
        setSearch('');
    }

    const handleHideEventModal = () => {
        setShowEventModal(false);
        setEventEditMode(true);
        setEditEventId(null);
        setValidationErrors(defaultValidation);
        setActiveTab('eventInfo');
        setEventDetails(eventDetailsInit);
        dispatch(resetEventFetchDetails());
        setEvtPageNumber(1);
        getAdminEventData();
    }

    // Hook, create an event and enable edit mode
    useEffect(() => {
        if(eventCreateFlag === 1) {
            dispatch(resetEventList());
            // Enable edit mode
            setEventEditMode(true);
            setActiveTab('eventParticipants');
            dispatch(fetchDetailsRequest(modalEventDetails.identifier));
            setEditEventId(modalEventDetails.identifier);

            // Refresh the list in background
            setEvtPageNumber(1);
            getAdminEventData();
        }
    }, [eventCreateFlag]);

    const handleHideEventDetailModal = () => {
        setSearchText('');
        setShowEventDetailModal(false);
        setEditEventId(null);
        dispatch(resetEventFetchDetails());
    }

    const observer = useRef();
    const lastEventElementRef = useCallback(node => {
        try {
            if(admEvtListloading) {
                return
            }
            if(observer.current) {
                observer.current.disconnect()
            }
            observer.current = new IntersectionObserver(entries => {
                if(entries[0].isIntersecting) {
                    if(EvtPageNumber < adminEventPageInfo.total_pages) {
                        setEvtPageNumber(EvtPageNumber + 1);
                    }
                }
            })
            if(node) {
                observer.current.observe(node)
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'discoverLastGrouplementRef'})
        }
    }, [admEvtListloading])

    useEffect(() => {
        try {
            if(eventDetail.name) {

                // Enable edit mode
                setEventEditMode(true);
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
                    endTime = {value: '', label: ''}
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
                    isAdmin: true
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
            Logger.error({fileLocation, message, trace: 'useEffect:Hook'})
        }

    }, [eventDetail]);


    // Hook, edit an event, only update internal store
    useEffect(() => {
        try {
            if(eventEditFlag === 1) {
                const {identifier, name, visibility, begins_at, description, section, is_attending, joinable} = modalEventDetails;

                // Update the list
                const updatedList = myEventsList.map(data =>
                    data.identifier === identifier ? {...data, name, begins_at, section, joinable} : data
                );
                dispatch(updateMyEventList({
                    entries: updatedList,
                    eventId: identifier
                }));

                // Update right side panel if opened
                if(current.identifier === identifier) {
                    dispatch(eventsByIdSuccess(({
                        ...current, name, visibility, begins_at, description, is_attending, joinable
                    })));
                }

                setActiveTab('eventParticipants');
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:Hook'})
        }
    }, [eventEditFlag]);

    const handleShowEventDetailModal = ({identifier}) => {
        if(!loadingAdmEvt) {
            dispatch(eventsByIdRequest(identifier));
        }
    }

    // Hook, display event member once event details fetch successfully
    useEffect(() => {
        if(currentEventFlag === 1) {
            if(current.identifier) {
                setMemberPageNumber(1);
                dispatch(eventMemberListRequest({
                    id: current.identifier,
                    page: 1,
                    isAdmin: true
                }));
            }
        }
    }, [currentEventFlag]);
    
    useEffect(() => {
        if(current?.name) {
            setShowEventDetailModal(true);
        }
    }, [current]);

    const handleSearchText = e => {
        try {
            const {value} = e.target;
            const isFirstCharSpace = value[0] === ' ' ? true : false;

            if(isFirstCharSpace === false) {
                setSearchText(value);

                // Clear the timeout
                clearTimeout(searchEventDelay);

                // Reinitialize the callback with page number 1
                const searchValue = value.trim();
                searchEventDelay = setTimeout(() => {
                    setMemberPageNumber(1);
                    dispatch(resetEventMemberList());
                    dispatch(eventMemberListRequest({
                        id: current.identifier,
                        page: 1,
                        search: searchValue,
                        isAdmin: true
                    }));
                }, 700);
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'handleSearchEvent'})
        }

    }


    // Using memo hook for performance improvement
    const eventContextMemo = useMemo(() => ({
        eventDetails, activeTab, eventEditMode, editEventId, currentPage, validationErrors, showEventModal, createFrom,
        handleShowEventInviteModal, fetchEventDetails, handleHideEventModal, setEventDetails, setCurrentPage,
        setMemberPageNumber, setValidationErrors, setActiveTab, handelDeleteEvent, setCreateFrom
    }),
        [activeTab, eventEditMode, editEventId, eventDetails, currentPage, showEventModal]);

    return (
        <div className="content-sec">
            <div className="scroll">
                <div className="container-fluid">
                    <div className="content-title">
                        <div className="d-flex w-100 justify-content-between mb-2 header-class">
                            <h1>Event Management</h1>
                            <div className="d-flex justify-content-between">
                                <div className="search-box">
                                    <input type="text" id="txtsearch" className="search" placeholder="Search..." onChange={(event) => {setSearch(event.target.value)}} onKeyUp={e => searchEvent(e)} />
                                    <a className="btn-search" href="#">
                                        {SearchIcon}
                                    </a>
                                </div>
                                <button className="btn btn-submit btn-green ml-4" onClick={(e) => {handleShowEventModal(e)}}> + Create Event</button>
                            </div>
                        </div>
                    </div>
                    <Loader visible={loading} visible={loadingAdmEvt} />
                    <div className="page-contain admin-event">
                        <div className="tab-section">
                            <div className="tab-content align-items-start headers">
                                <div className="card tab-pane active">
                                    <div className="collapse show">
                                        <div className="grid-view mt-2 grid-table-view">
                                            <div className="grid-title-list bg-black-900">
                                                <div className='row'>
                                                    <div className="grid-event-date table-header" onClick={() => filtterByColumn('begins_at', orderType)}> <p>Date {(orderBy === 'begins_at' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon}</p></div>
                                                    <div className="grid-event-name table-header" onClick={() => filtterByColumn('name', orderType)}> <p>Event Name {(orderBy === 'name' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon}  </p> </div>
                                                    <div className="grid-event-host table-header"> <p>Event Host</p> </div>
                                                    <div className="grid-event-time table-header" onClick={() => filtterByColumn('time', orderType)}> <p>Time {(orderBy === 'time' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon}</p> </div>
                                                    <div className="grid-event-privacy table-header" jn onClick={() => filtterByColumn('visibility', orderType)}> <p>Privacy {(orderBy === 'visibility' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon}  </p> </div>
                                                    <div className="grid-event-repeat table-header"> <p>Repeat</p> </div>
                                                    <div className="grid-event-communication table-header"> <p>  </p> </div>
                                                </div>
                                            </div>
                                            {componentLoad && adminEventList.length > 0 &&
                                                <div className="grid-person-list green-border">
                                                    {
                                                        adminEventList.map((item, key) => {
                                                            return (
                                                                < div className="row grid-person-data bg-gray" key={key} ref={lastEventElementRef}>
                                                                    <div className="grid-event-date both-center" onClick={(e) => handleShowEventDetailModal(item)}>
                                                                        <div className="event-date">
                                                                            <div className="month">{Helper.formatDateTz(item.begins_at, "MMM").toUpperCase()}</div>
                                                                            <div className="date">{Helper.formatDateTz(item.begins_at, "DD")}</div>
                                                                            <div className="year">{Helper.formatDateTz(item.begins_at, "YYYY")}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-event-name both-center" onClick={(e) => handleShowEventDetailModal(item)}>
                                                                        <p className="event-name"> {item.name}</p>
                                                                    </div>
                                                                    <div className="grid-event-host both-center" onClick={(e) => handleShowEventDetailModal(item)}>
                                                                        <p>{item.host_name}</p>
                                                                    </div>
                                                                    <div className="grid-event-time both-center" onClick={(e) => handleShowEventDetailModal(item)}>
                                                                        <p className="event-time">{Helper.formatDateTz(item.begins_at, "h:mma")}</p>
                                                                    </div>
                                                                    <div className="grid-event-privacy both-center">
                                                                        <div className="member-info privacy-box">
                                                                            <div className="communication">
                                                                                <Dropdown>
                                                                                    <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                                                                                        {item.visibility === 'private' ? 'Private' : item.visibility === 'organization_public' ? 'Org. Public' : item.visibility === 'group_public' ? 'Group Public' : 'Public'} {ChevronDownIcon}
                                                                                    </Dropdown.Toggle>
                                                                                    <Dropdown.Menu alignRight="true" className="option-menu">
                                                                                        {(item.visibility === 'public') &&
                                                                                            <>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'private')}
                                                                                                    className="img-private">Make Private</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'organization_public')}
                                                                                                    className="img-public">Make Public to Organization</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'group_public')}
                                                                                                    className="img-public">Make Public to Group</Dropdown.Item>
                                                                                            </>
                                                                                        }
                                                                                        {item.visibility === 'private' &&
                                                                                            <>
                                                                                                <Dropdown.Item eventKey="2" onClick={() => changeVisiblity(item, 'public')}
                                                                                                    className="img-public">Make Public</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'organization_public')}
                                                                                                    className="img-public">Make Public to Organization</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'group_public')}
                                                                                                    className="img-public">Make Public to Group</Dropdown.Item>
                                                                                            </>
                                                                                        }
                                                                                        {item.visibility === 'organization_public' &&
                                                                                            <>
                                                                                                <Dropdown.Item eventKey="2" onClick={() => changeVisiblity(item, 'public')}
                                                                                                    className="img-public">Make Public</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'private')}
                                                                                                    className="img-private">Make Private</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'group_public')}
                                                                                                    className="img-public">Make Public to Group</Dropdown.Item>
                                                                                            </>
                                                                                        }
                                                                                        {item.visibility === 'group_public' &&
                                                                                            <>
                                                                                                <Dropdown.Item eventKey="2" onClick={() => changeVisiblity(item, 'public')}
                                                                                                    className="img-public">Make Public</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'private')}
                                                                                                    className="img-private">Make Private</Dropdown.Item>
                                                                                                <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item, 'organization_public')}
                                                                                                    className="img-public">Make Public to Organization</Dropdown.Item>
                                                                                            </>
                                                                                        }

                                                                                    </Dropdown.Menu>
                                                                                </Dropdown>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-event-repeat both-center">
                                                                        {item.recursion_identifier &&
                                                                            <div className="converticon">{RecurringEventIcon}</div>
                                                                        }
                                                                        {item.recursion_identifier &&
                                                                            <div></div>
                                                                        }
                                                                    </div>
                                                                    <div className="grid-event-communication both-center">
                                                                        <div className="communication">
                                                                            <Dropdown>
                                                                                <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
                                                                                    {KebabIcon}
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu alignRight="true" className="option-menu">
                                                                                    {item.recursion_identifier && item.recursion_identifier !== null &&
                                                                                        <>
                                                                                            < Dropdown.Item eventKey="1" className="img-assign-admin" onClick={(e) => handleShowEventInviteModal(item)}>Invite to This Event Only</Dropdown.Item>
                                                                                            <Dropdown.Item eventKey="2" className="img-assign-admin" onClick={(e) => handleShowEventInviteModal(item)}>Invite to All Occurrences</Dropdown.Item>
                                                                                            {item.status !== 'in_progress' &&
                                                                                                <>
                                                                                                    <Dropdown.Item eventKey="3" className="img-trash clr-red" onClick={(e) => handelDeleteEvent(item, 'indiviudal')}>Delete This Event Only </Dropdown.Item>
                                                                                                    <Dropdown.Item eventKey="4" className="img-trash clr-red" onClick={(e) => handelDeleteEvent(item, 'recurring')}>Delete All Occurrences</Dropdown.Item>
                                                                                                </>
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                    {item.recursion_identifier === null &&
                                                                                        <>
                                                                                            <Dropdown.Item eventKey="5" className="img-assign-admin" onClick={(e) => handleShowEventInviteModal(item)}>Invite Member</Dropdown.Item>
                                                                                            {item.status !== 'in_progress' &&
                                                                                                <>
                                                                                                    <Dropdown.Item eventKey="6" className="img-edit-icon" onClick={(e) => fetchEventDetails(item)}>Edit Event</Dropdown.Item>
                                                                                                    <Dropdown.Item eventKey="7" className="img-trash clr-red" onClick={(e) => handelDeleteEvent(item, 'indiviudal')}>Delete This Event</Dropdown.Item>
                                                                                                </>
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                            {!admEvtListloading && adminEventList.length === 0 &&
                                                <div className="row grid-person-data bg-gray">
                                                    <div className="col-lg-12 both-center pt-2 pb-2">
                                                        <p style={{textAlign: "center"}}>No events found.</p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite to Event Modal */}
            <InviteToEventModal
                show={showEventInviteModal}
                hideModal={handleHideEventInviteModal}
                event={inviteEventDetails}
            />

            {/* Edit Event Modal */}
            <EventContext.Provider value={eventContextMemo} >
                <CreateEventModal
                    show={showEventModal}
                    hideModal={handleHideEventModal}
                />
            </EventContext.Provider>

            {/* Event Details Modal */}
            <EventContext.Provider value={eventContextMemo} >
                <EventDetailModal
                    show={showEventDetailModal}
                    hideModal={handleHideEventDetailModal}
                    searchText={searchText}
                    handleSearchText={handleSearchText}
                    handelDeleteEvent={handelDeleteEvent}
                />
            </EventContext.Provider>
        </div >
    )
}

export default Index;