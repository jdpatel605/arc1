import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from '../common/Image';
import { useAlert } from "react-alert";
import InviteToGroupModal from './InviteToGroupModal';
import CreateEvent from './../common/CreateEvent';
import CallButton from './../common/CallButton';
import ReadMoreText from './../common/ReadMoreText';
import { EventContext } from "../events/EventContext";
import CreateEventModal from '../events/EventModalsPages/CreateEventModal';
import { groupDetailsRequest, groupMemberRequest, joinGroupRequest, organizationGroupListRequest, cancelMemberInvitationRequest, inviteMemberRequest, deleteGroupMemberRequest, makeOwnerRequest, changeUserRoleRequest } from '../../store/actions/group';
import { resetEventFetchDetails } from '../../store/actions'
import { SearchIcon, ArrowBackIcon, PublicGroupIcon, LockIcon, PlusIcon, VideoWhiteIcon, ChevronRightIcon, ChevronDownIcon, KebabIcon, closeIcon } from "../../utils/Svg";
import SingleProfile from "../profile/SingleProfile";
import { Logger } from './../../utils/logger';
import { isMobile } from "react-device-detect";
const fileLocation = "src\\components\\group\\contentRight.jsx";

const defaultValidation = {
    eventName: {}, date: {}, eventGroupHost: {}, startTime: {}, endTime: {}
};

const ContentRight = props => {
    const alert = useAlert();
    const currentUser = localStorage.getItem('identifier');
    const dispatch = useDispatch();
    const { groupDetails, groupMemLoading, groupMemList, groupMemPageInfo, joinGroupSuccess, joinGroupError, refreshMemberList, ownerSuccess, roleSuccess } = useSelector(({ group }) => group);
    const { eventCreateFlag, eventEditFlag, modalEventDetails } = useSelector(({ events }) => events);
    const [componentLoad, setComponentLoad] = useState(false);
    const [showCreateEventModalFlag, setShowCreateEventModal] = useState(false);
    const [groupId, setGroupId] = useState('');
    const [inviteBoxShow, setInviteBoxShow] = useState(false);
    const [memberPageNumber, setMemberPageNumber] = useState(1);
    const [searchText, setSearchText] = useState('');

    const getGroupMember = () => {
        const grpId = props.groupId ? props.groupId : groupDetails.identifier;
        const postdata = { group_id: grpId, search: searchText, page: memberPageNumber }
        dispatch(groupMemberRequest(postdata));
    }

    const searchMemberInput = React.useRef(null);
    useEffect(() => {
        try {
            if (groupDetails) {
                searchMemberInput.current.value = "";
                setSearchText('')
                setMemberPageNumber(1)
                getGroupMember();
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:groupDetails' })
        }
    }, [groupDetails]);

    const [lastMember, setLastmember] = useState({});
    useEffect(() => {
        try {
            if (groupMemList) {
                const lastMemberData = groupMemList.slice(-1)[0];
                if (lastMemberData && lastMember.identifier) {
                    setLastmember(lastMemberData);
                }
            }
            setComponentLoad(true)
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:groupMemList' })
        }
    }, [groupMemList]);

    const observer = useRef()
    const lastMemberBookElementRef = useCallback(node => {
        try {
            if (groupMemLoading) {
                return
            }
            if (observer.current) {
                observer.current.disconnect()
            }
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    if (memberPageNumber < groupMemPageInfo.total_pages) {
                        setMemberPageNumber(memberPageNumber + 1);
                    }
                }
            })
            if (node) {
                observer.current.observe(node)
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'lastGroupMemberElementRef' })
        }
    }, [groupMemLoading])

    useEffect(() => {
        if (componentLoad) {
            getGroupMember();
        }
    }, [dispatch, memberPageNumber, searchText]);

    // Refresh Member list
    useEffect(() => {
        try {
            if (refreshMemberList === 1) {
                getGroupMember();
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:refreshMemberList' })
        }
    }, [refreshMemberList]);

    const joinGroup = (id) => {
        const joinData = { group_id: id }
        dispatch(joinGroupRequest(joinData));
    }

    useEffect(() => {
        try {
            if (componentLoad && joinGroupSuccess) {
                const groupData = { group_id: joinGroupSuccess.id }
                dispatch(groupDetailsRequest(groupData));
                if (props.listFrom === 'index') {
                    props.refreshJoinGroupList();
                }
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:joinGroupSuccess' })
        }
    }, [joinGroupSuccess]);
    useEffect(() => {
        try {
            if (componentLoad && joinGroupError) {
                if (joinGroupError.message.message) {
                    alert.error(joinGroupError.message.message);
                }
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:joinGroupError' })
        }
    }, [joinGroupError]);

    const leaveGroup = (id) => {
        props.leaveGroup(id);
    }

    const searchMember = (event) => {
        setMemberPageNumber(1);
        setSearchText(event.target.value);
    }

    const showCreateEventModal = id => {
        if (isMobile) {
            window.location = '/unsupported-feature'
            return false
        }
        setGroupId(id);
        setShowCreateEventModal(true);
    }

    const hideCreateEventModal = () => {
        setShowCreateEventModal(false);
        setGroupId('');
    }

    const showInviteBox = (event) => {
        setInviteBoxShow(event);
    }

    const hideRightSide = (value) => {
        props.hideRightSide(value);
    }

    const showEditGroup = (grpIp) => {
        props.editGroup(grpIp);
    }

    const deleteGroup = (id) => {
        props.deleteGroup(id);
    }

    const eventDetailsInit = {
        eventName: '', description: '', eventGroupHost: { name: 'Select Host', id: '', hostType: '' }, date: '',
        startTime: {}, endTime: {}, type: 'discussion', visibility: 'private',
    };
    const [showEventModal, setShowEventModal] = useState(false);
    const [eventEditMode, setEventEditMode] = useState(false);
    const [editEventId, setEditEventId] = useState(null);
    const [validationErrors, setValidationErrors] = useState(defaultValidation);
    const [activeTab, setActiveTab] = useState('eventInfo');
    const [eventDetails, setEventDetails] = useState(eventDetailsInit);
    const [currentPage, setCurrentPage] = useState('mainPage');

    const handleHideEventModal = () => {
        setShowEventModal(false);
        setEventEditMode(false);
        setEditEventId(null);
        setValidationErrors(defaultValidation);
        setActiveTab('eventInfo');
        setEventDetails(eventDetailsInit);
        dispatch(resetEventFetchDetails());
    }

    const handleShowEventModal = () => {
        // Update event host info
        const eventGroupHost = {
            name: groupDetails.name,
            id: groupDetails.identifier,
            hostType: 'group'
        }
        const eventDetailsData = { ...eventDetailsInit, eventGroupHost };
        setEventDetails(eventDetailsData);

        setValidationErrors(preProps => ({
            ...preProps, eventGroupHost: { valid: true, message: '' }
        }));

        setShowEventModal(true);
        setEventEditMode(false);
        setEditEventId(null);
        setActiveTab('eventInfo');
    }

    const inviteMember = (identifier, resend = false, reset = false) => {
        const payload = {
            group_id: groupDetails.identifier,
            identifier
        }
        dispatch(inviteMemberRequest(payload));
    }

    const cancelMemberInvitation = identifier => {
        const payload = {
            group_id: groupDetails.identifier,
            identifier
        }
        dispatch(cancelMemberInvitationRequest(payload));
    }

    const removeGroupMember = identifier => {
        const payload = {
            group_id: groupDetails.identifier,
            user_id: identifier
        }
        dispatch(deleteGroupMemberRequest(payload));
    }

    const makeOwner = (group, user) => {
        const payload = {
            group_id: group,
            user_id: user
        }
        dispatch(makeOwnerRequest(payload));
    }

    // Hook, make owner successfully
    useEffect(() => {
        const postdata = { search: '', filter: 'owned', page: 1 }
        if (ownerSuccess === 1)
            dispatch(organizationGroupListRequest(postdata));
    }, [ownerSuccess]);

    const changeUserRole = (group, user) => {
        const payload = {
            group_id: group,
            user_id: user
        }
        dispatch(changeUserRoleRequest(payload));
    }

    // Hook, make owner successfully
    useEffect(() => {
        console.log(roleSuccess);
    }, [roleSuccess]);

    // Hook, create an event and enable edit mode
    useEffect(() => {
        try {
            if (eventCreateFlag === 1) {
                // Enable edit mode
                setEventEditMode(true);
                setActiveTab('eventParticipants');
                setEditEventId(modalEventDetails.identifier);
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:eventCreateFlag' })
        }
    }, [eventCreateFlag]);

    // Hook, update an event and enable edit mode
    useEffect(() => {
        try {
            if (eventEditFlag === 1) {
                setEventEditMode(true);
                setActiveTab('eventParticipants');
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:eventEditFlag' })
        }
    }, [eventEditFlag]);

    const eventContextMemo = useMemo(() => ({
        eventDetails, activeTab, eventEditMode,
        editEventId, validationErrors, currentPage,
        handleHideEventModal, setEventDetails, setMemberPageNumber,
        setValidationErrors, setActiveTab, setCurrentPage
    }),
        [activeTab, eventEditMode, editEventId, eventDetails, currentPage]);

    let colClass = 'col-lg-7';
    if (props.from) {
        colClass = 'col-lg-10';
    }
    return (
        <div className={`${colClass} col-sm-12`}>
            <div className="chat-history">
                <CreateEvent
                    showModal={showCreateEventModalFlag}
                    groupId={groupId}
                    onHideModal={hideCreateEventModal}
                />
                <div className="group-info">
                    <div className="chat-person-data">
                        <div className="group-info-header mt-4">
                            <div className="back-btn">
                                <a href="#" onClick={() => hideRightSide(false)}>
                                    {ArrowBackIcon}
                                </a>
                                {props.from &&
                                    <h5 onClick={() => hideRightSide(false)}>Back to Results</h5>
                                }
                            </div>
                            <div className="group-property">
                                {groupDetails.visibility === 'public' &&
                                    <a className="btn-public" href="#">
                                        <label htmlFor="">Public</label>&ensp;&ensp;
                                        {PublicGroupIcon}
                                    </a>
                                }
                                {groupDetails.visibility === 'organization_public' &&
                                    <a className="btn-public" href="#">
                                        <label htmlFor="">Organization Public</label>&ensp;&ensp;
                                        {PublicGroupIcon}
                                    </a>
                                }
                                {groupDetails.visibility === 'private' &&
                                    <a className="btn-public" href="#">
                                        <label htmlFor="">Private</label>&ensp;&ensp;
                                        {LockIcon}
                                    </a>
                                }
                                {groupDetails.current_user_role &&
                                    <div>
                                        <Dropdown>
                                            <Dropdown.Toggle as='a' id="dropdown-custom-components-1" className='btn-add btn-gray'>
                                                {PlusIcon}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu alignRight="true" className="option-menu">
                                                {groupDetails.current_user_role === 'owner' &&
                                                    <>
                                                        <Dropdown.Item href="#" onClick={() => showEditGroup(groupDetails.identifier)} className="img-edit-icon">Edit Group</Dropdown.Item>
                                                        <Dropdown.Item href="#" className="img-plus" onClick={() => handleShowEventModal()}>Create Event</Dropdown.Item>
                                                    </>
                                                }
                                                <Dropdown.Item href="#" onClick={() => showInviteBox(true)} className="img-add">Invite Members</Dropdown.Item>
                                                {groupDetails.current_user_role === 'owner' &&
                                                    <Dropdown.Item href="#" onClick={() => deleteGroup(groupDetails.identifier)} className="img-trash clr-red">Delete Group</Dropdown.Item>
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <InviteToGroupModal
                                            showModal={inviteBoxShow}
                                            organization_id={groupDetails.organization.identifier}
                                            group_id={groupDetails.identifier}
                                            onHideModal={showInviteBox}
                                            onClickModal={showInviteBox}
                                        />
                                        <EventContext.Provider value={eventContextMemo} >
                                            <CreateEventModal show={showEventModal} hideModal={handleHideEventModal} />
                                        </EventContext.Provider>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="person-data">
                            <div className="person-info">
                                <div className="person-img">
                                    <div className="img-round img-76">
                                        <Image className="group_details" src={groupDetails.avatar_url} altText="Groups" />
                                    </div>
                                </div>
                                <div className="person">
                                    <h4>{groupDetails.name}</h4>
                                    {groupDetails.description && groupDetails.description.length > 150 &&
                                        <p>
                                            <ReadMoreText
                                                content={groupDetails.description}
                                                limit={150}
                                                linkClass="load-more cursor-pointer text-white"
                                            />
                                        </p>
                                    }
                                    {groupDetails.description && groupDetails.description.length <= 150 &&
                                        <p>
                                            {groupDetails.description}
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="group-info-footer">
                            <div className="search-box">
                                <input type="text" ref={searchMemberInput} id="txtsearch" className="search" placeholder="Search member..." onChange={searchMember.bind(this)} />
                                <a className="btn-search" href="#">
                                    {SearchIcon}
                                </a>
                            </div>
                            {(groupDetails.current_user_role !== 'owner' && groupDetails.current_user_role !== 'member' && groupDetails.current_user_role !== 'admin') &&
                                <div className="btn-box">
                                    <a className="btn btn-round btn-green" href="#" onClick={() => joinGroup(groupDetails.identifier)}>Join Group</a>
                                </div>
                            }
                            {groupDetails.contactable === true && groupDetails.current_user_role === 'admin' &&
                                <div className="btn-box">
                                    <span className="btn btn-round btn-green" onClick={() => showCreateEventModal(groupDetails.identifier)}>
                                        Call Group &nbsp; {VideoWhiteIcon}
                                    </span>
                                </div>
                            }
                            {(groupDetails.current_user_role === 'owner' || groupDetails.current_user_role === 'member') &&
                                <div className="btn-box">
                                    <span className="btn btn-round btn-green" onClick={() => showCreateEventModal(groupDetails.identifier)}>
                                        Call Group &nbsp; {VideoWhiteIcon}
                                    </span>
                                    <Dropdown>
                                        <Dropdown.Toggle as='a' id="dropdown-custom-components-2" className="btn-round btn-gray btn-member">
                                            Member {ChevronDownIcon}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="option-menu">
                                            <Dropdown.Item href="#" className="img-exit" onClick={() => leaveGroup(groupDetails.identifier)}>Leave Group</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="member-list">
                    <div className="member-list-header">
                        <h5>{groupMemPageInfo.total_entries} Member{groupMemPageInfo.total_entries > 1 ? 's' : ''}</h5>
                    </div>
                    <div className="member-list-data">
                        {groupMemList.length > 0 && groupMemList.map((member, key) => <div className="member-info max-width-member" key={key} ref={lastMemberBookElementRef}>
                            <SingleProfile name={member.name} avatarUrl={member.avatar_url} userId={member.identifier} />
                            <div className="communication">
                                {currentUser !== member.identifier && member.status !== 'invited' && (groupDetails.current_user_role === 'owner' || groupDetails.current_user_role === 'member' || groupDetails.current_user_role === 'admin') &&
                                    <CallButton callee_id={member.identifier} call_type="user" confirm={true} name={member.name} />
                                }
                                {groupDetails.current_user_role === 'owner' && member.status === 'invited' &&
                                    <Dropdown>
                                        <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                                            Invited
                                      {ChevronDownIcon}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu alignRight="true" className="option-menu">
                                            <Dropdown.Item eventKey="1" onClick={() => inviteMember(member.identifier, true)}
                                                className="img-resend-invite">Resend Invite</Dropdown.Item>
                                            <Dropdown.Item eventKey="2" onClick={() => cancelMemberInvitation(member.identifier)}
                                                className="img-close clr-red">Cancel Invite</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                }
                                {(groupDetails.current_user_role === 'owner' || groupDetails.current_user_role === 'admin') && member.status === 'member' && currentUser !== member.identifier &&
                                    <Dropdown>
                                        <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
                                            {KebabIcon}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu alignRight="true" className="option-menu">
                                            <Dropdown.Item onClick={() => removeGroupMember(member.identifier)} className="img-exit clr-red">Remove</Dropdown.Item>
                                            {/* <Dropdown.Item onClick={ () => changeUserRole(member.identifier) } className="img-resume">Make Admin</Dropdown.Item> */}
                                            <Dropdown.Item onClick={() => makeOwner(groupDetails.identifier, member.identifier)} className="img-transfer-ownership clr-blue">Make Owner</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                }
                            </div>
                        </div>
                        )}
                        {groupMemList.length === 0 &&
                            <div className="member-info">
                                <div className="member">
                                    <div className="member-data m-4">
                                        <a href="#">No member join this group!</a>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
ContentRight.propTypes = {
    hideRightSide: PropTypes.func,
    editGroup: PropTypes.func,
    leaveGroup: PropTypes.func,
    refreshJoinGroupList: PropTypes.func,
    listFrom: PropTypes.string,
    groupId: PropTypes.string,
};
ContentRight.defaultProps = {
    groupId: '',
    listFrom: '',
};
export default ContentRight
