// React hooks imports
import React, {useContext, useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {EventContext} from "../../events/EventContext";
import PropTypes from 'prop-types';

// Component imports
import Modal from 'react-bootstrap/Modal'
import {LockIcon, PlusIcon, ChevronDownIcon, PublicGroupIcon, CloseProfileIcon, SearchIcon} from '../../../utils/Svg';
import ReadMoreText from '../../common/ReadMoreText';
import Dropdown from 'react-bootstrap/Dropdown';
import {Helper} from '../../../utils/helper';
import Image from '../../common/Image';
import SingleProfile from "../../profile/SingleProfile";

// Redux actions import
import {eventMemberListRequest, inviteMemberEventRequest, resetEventMemberList, resetEventList, updateEventMemberList, kickUserFromEventRequest} from "../../../store/actions";
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\events\\EventModalsPages\\EventModalMainPage.jsx";

const EventDetailModal = (props) => {
    // Reference declaration
    const dispatch = useDispatch();
    const {kickFlag, kickUserSuccess} = useSelector(({adminEvent}) => adminEvent);
    const {current, memberLoading, eventMemberList, memberCount, eventParticipantInviteFlag} = useSelector(({events}) => events);
    const {handleShowEventInviteModal} = useContext(EventContext);

    // State declaration
    const [closeIcon, setCloseIcon] = useState(false);
    const [activeTab, setActiveTab] = useState('member');
    const [search, setSearch] = useState('');
    const [attCloseIcon, setAttCloseIcon] = useState(false);

    useEffect(() => {
        try {
            if(kickFlag === 1) {
                const {identifier} = kickUserSuccess;
                const index = eventMemberList.map(member => member.identifier === identifier);
                eventMemberList.splice(index, 1);
                dispatch(updateEventMemberList(eventMemberList));
            }
        } catch({message}) {
        }
    }, [kickFlag]);

    useEffect(() => {
        try {
            const {flag} = eventParticipantInviteFlag
            if(flag === 1) {
                dispatch(resetEventMemberList({}));
                dispatch(eventMemberListRequest({
                    id: current.identifier,
                    page: 1,
                    isAdmin: true,
                    attendance_status: activeTab,
                    search: search
                }));
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:eventParticipantInviteFlag'})
        }
    }, [eventParticipantInviteFlag]);

    const handelResetForm = () => {
        setActiveTab('member');
        dispatch(resetEventMemberList({}));
        dispatch(resetEventList({}));
    }

    const handleResendInvitation = user => {
        const payload = {
            identifier: user.identifier,
            eventId: current.identifier,
            method: 'RE-POST'
        }
        dispatch(inviteMemberEventRequest(payload));
    }

    const handleCancelInvitation = user => {

        // Update the event member list
        const index = eventMemberList.findIndex(data => data.identifier === user.identifier);
        eventMemberList.splice(index, 1);
        dispatch(updateEventMemberList(eventMemberList));
        const payload = {
            identifier: user.identifier,
            eventId: current.identifier,
            method: 'DELETE'
        }
        dispatch(inviteMemberEventRequest(payload));
    }

    const handleRemoveMember = user => {
        const data = {
            id: current.identifier,
            member: user.identifier,
        }
        dispatch(kickUserFromEventRequest(data));
    }

    const handleTabs = (tab) => {
        dispatch(resetEventMemberList({}));
        dispatch(eventMemberListRequest({
            id: current.identifier,
            page: 1,
            isAdmin: true,
            attendance_status: tab,
            search: search
        }));
        setActiveTab(tab);
    }

    return (
        <Modal size="lg" show={props.show} onExiting={handelResetForm} onHide={() => {
            handelResetForm();
            props.hideModal();
        }} className="event-management-modal" aria-labelledby="example-modal-sizes-title-lg" >
            <div className="modal-details-group">
                <div className="chat-history">
                    <div className="group-info">
                        <div className="chat-person-data">
                            <div className="group-info-header mt-3">
                                <div className="back-btn">
                                    <a href="#/" onClick={() => {
                                        handelResetForm();
                                        props.hideModal();
                                    }} role="button">{CloseProfileIcon}</a>
                                </div>
                                <div className="group-property">
                                    {
                                        current.visibility === 'public' &&
                                        <a className="btn-public" href="#/">
                                            <label>Public</label>
                                            {PublicGroupIcon}
                                        </a>
                                    }
                                    {
                                        current.visibility === 'organization_public' &&
                                        <a className="btn-public" href="#/">
                                            <label>Organization Public</label>
                                            {PublicGroupIcon}
                                        </a>
                                    }
                                    {
                                        current.visibility === 'group_public' &&
                                        <a className="btn-public" href="#/">
                                            <label>Group Public</label>
                                            {PublicGroupIcon}
                                        </a>
                                    }
                                    {
                                        current.visibility === 'private' &&
                                        <a className="btn-public" href="#/">
                                            <label>Private</label>
                                            {LockIcon}
                                        </a>
                                    }
                                    <div className="click-btn-div">
                                        <Dropdown onToggle={(e) => setCloseIcon(!closeIcon)}>
                                            <Dropdown.Toggle as="a" className={`btn-add btn-gray ${closeIcon && 'btn-close'}`} >
                                                {PlusIcon}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu alignRight="true" className="option-menu">
                                                {current.recursion_identifier === null &&
                                                    <Dropdown.Item onClick={() => handleShowEventInviteModal(current)} className="img-add">Invite</Dropdown.Item>
                                                }
                                                {current.recursion_identifier && current.recursion_identifier !== null &&
                                                    <>
                                                        <Dropdown.Item className="img-assign-admin" onClick={(e) => handleShowEventInviteModal(current)}>Invite to This Event Only</Dropdown.Item>
                                                        <Dropdown.Item className="img-assign-admin" onClick={(e) => handleShowEventInviteModal(current)}>Invite to All Future Events</Dropdown.Item>
                                                    </>
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="person-data">
                                <div className="person-info">
                                    <div className="person-img">
                                        <div className="img-round img-76">
                                            <Image src={current.avatar_url} altText="Event profile" />
                                        </div>
                                    </div>
                                    <div className="person">
                                        <h4>{current.name}</h4>
                                        <p className="show-read-more">
                                            <ReadMoreText
                                                content={current.description}
                                                limit={150}
                                                linkclassName="load-more cursor-pointer text-white"
                                            />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="search-box" style={{maxWidth: '250px'}}>
                                <input type="text" id="txtsearch" value={props.searchText} onChange={(e) => {
                                    setSearch(e.target.value);
                                    props.handleSearchText(e);
                                }} className="search" placeholder="Search participants…" />
                                <a className="btn-search" href="#">
                                    {SearchIcon}
                                </a>
                            </div>
                            <div className="group-info-footer mb-3">
                            </div>
                        </div>
                    </div>
                    <div className="filter-data" style={{borderStyle: "none"}}>
                        {
                            current.joinable === false &&
                            <div className="date-box">
                                <label>Date</label>
                                <h2>{Helper.formatDateTz(current.begins_at, "MMMM DD")}</h2>
                            </div>
                        }
                        <div className="time-box">
                            <label>Time</label>
                            <h2>
                                {
                                    current.joinable === true
                                        ? 'Happening Now'
                                        : Helper.formatDateTz(current.begins_at, "h:mma")
                                }
                            </h2>
                        </div>
                        <div className="btn-box">
                            {current.status !== 'in_progress' &&
                                <Dropdown onToggle={(e) => setAttCloseIcon(!attCloseIcon)}>
                                    <Dropdown.Toggle as="a" className={`btn btn-round btn-large btn-gray btn-attending btn-click ${attCloseIcon && 'btn-close'}`} >
                                        Attending {ChevronDownIcon}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu alignRight="true" className="option-menu">
                                        {
                                            current.recursion_identifier ? <> <Dropdown.Item onClick={() => props.handelDeleteEvent(current, 'individual')} className="img-trash clr-red">Delete This Event Only</Dropdown.Item> <Dropdown.Item onClick={() => props.handelDeleteEvent(current, 'recurring')} className="img-trash clr-red">Delete All Future Events</Dropdown.Item> </> : <Dropdown.Item onClick={() => props.handelDeleteEvent(current, 'individual')} className="img-trash clr-red">Delete this Event</Dropdown.Item>
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                        </div>
                    </div>
                    <div className="tab-section">
                        <ul id="tabs" className="nav nav-tabs" role="tablist">
                            <li className="nav-item w-50">
                                <a onClick={() => {handleTabs('member')}} id="tab-screen-A" href="#eventInfo" className={`nav-link ${activeTab === 'member' && 'active'}`} data-toggle="tab" role="tab">Attending</a>
                            </li>
                            <li className="nav-item w-50">
                                <a onClick={() => {handleTabs('invited')}} id="tabEventParticipants" href="#eventParticipants" className={`nav-link ${activeTab === 'invited' && 'active'}`} data-toggle="tab" role="tab">Invited</a>
                            </li>
                        </ul>
                        <div id="content" className="tab-content" role="tablist">
                            <div className="member-list">
                                <div className="member-list-header">
                                    <h5>
                                        {
                                            memberLoading
                                                ? 'Loading members...'
                                                : `${memberCount} ${memberCount === 1 ? 'Member' : 'Members'}`
                                        }
                                    </h5>
                                </div>
                                <div className="member-list-data">
                                    {
                                        eventMemberList.map((item, key) => {
                                            if(item.membership_status !== 'owner') {
                                                return (
                                                    <div className="member-info align-info" key={key}>
                                                        <SingleProfile key={key} name={item.name} avatarUrl={item.avatar_url} userId={item.identifier} />
                                                        {item.identifier !== current.owner.identifier &&
                                                            <div className="communication">
                                                                <Dropdown>
                                                                    <Dropdown.Toggle as="a" className={`btn btn-round btn-gray btn-invited btn-click ${closeIcon && 'btn-close'}`} >
                                                                        {activeTab == 'invited' ? "Invited" : "Attending"}{ChevronDownIcon}
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu alignRight="true" className="option-menu">
                                                                        {activeTab === 'member' &&
                                                                            <Dropdown.Item onClick={() => handleRemoveMember(item)} className="img-trash clr-red">Cancel Invitation</Dropdown.Item>
                                                                        }
                                                                        {activeTab === 'invited' &&
                                                                            <>
                                                                                <Dropdown.Item onClick={() => handleResendInvitation(item)} className="img-add-user">Resend Invitation</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => handleCancelInvitation(item)} className="img-close clr-red">Cancel Invitation</Dropdown.Item>
                                                                            </>
                                                                        }
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

EventDetailModal.propTypes = {
    show: PropTypes.bool,
    searchText: PropTypes.string,
    hideModal: PropTypes.func,
    handleSearchText: PropTypes.func,
    handelDeleteEvent: PropTypes.func,
};

EventDetailModal.defaultProps = {
    show: false,
    searchText: '',
};

export default EventDetailModal;
