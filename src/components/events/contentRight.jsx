import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import PropTypes from 'prop-types';
import moment from 'moment'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from './../common/Image';
import ReadMoreText from './../common/ReadMoreText';
import { EventContext } from "./EventContext";
import { useDispatch, useSelector } from "react-redux";
import {
  unsubscribeEventRequest, eventsByIdFailed, inviteMemberEventRequest, updateEventMemberList,
  subscribeEventRequest, eventsDetailsUpdate, resetEventMemberList, eventMemberListRequest,
  resetEventSubscriptionStatus, eventUpdateMemberCount, deleteEventRequest, deleteEventReset
} from '../../store/actions';
import EventMemberBox from './EventMemberBox';
import { Helper } from './../../utils/helper';
import { ArrowBackIcon, LockIcon, PlusIcon, ChevronDownIcon, PublicGroupIcon } from './../../utils/Svg';
import { Logger } from './../../utils/logger';
import EventJoinButton from './../common/EventJoinButton';

const fileLocation = "src\\components\\events\\contentLeft.jsx";

const ContentRight = ({ closeBox, from }) => {

  const {
    handleShowEventInviteModal, handleJoinEventNow, fetchEventDetails, setMemberPageNumber, downloadICSFile
  } = useContext(EventContext);
  const dispatch = useDispatch();

  const {
    current, memberLoading, eventMemberList, memberPageInfo, memberCancelFlag, subscribeStatus,
    unsubscribeStatus, memberCount, eventDeleteFlag, eventParticipantInviteFlag
  } = useSelector(({ events }) => events)

  const [closeIcon, setCloseIcon] = useState(false);
  const [attCloseIcon, setAttCloseIcon] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(eventsDetailsUpdate({}));
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      const { flag, identifier, event: eventId } = memberCancelFlag;
      if(flag === 2) {
        if(current.identifier === eventId) {
          setMemberPageNumber(1);
          dispatch(resetEventMemberList());
          dispatch(eventMemberListRequest({
            id: current.identifier,
            page: 1
          }));
        }
      } else if(flag === 1) {
        const updatedList = eventMemberList.filter(data => data.identifier !== identifier);
        dispatch(updateEventMemberList(updatedList));
        dispatch(eventUpdateMemberCount(-1));
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }
  }, [memberCancelFlag]);

  // Check if session user can edit the event
  const canEditEvent = event => {
    const currentIdentifier = localStorage.getItem("identifier");
    return currentIdentifier === event.owner.identifier;
  }

  const removeEventDetails = () => {
    dispatch(eventsByIdFailed({}));
  }

  const observer = useRef()
  const lastMemberElementRef = useCallback(node => {
    try {
      if(memberLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          nextPageMembers();
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'lastMemberElementRef' })
    }
  }, [memberLoading]);

  const nextPageMembers = () => {
    setMemberPageNumber(oldProps => {
      return memberPageInfo.total_pages > oldProps ? (oldProps + 1) : oldProps;
    });
  }

  const resetMemberList = ({ identifier }) => {
    setMemberPageNumber(1);
    dispatch(resetEventMemberList());
    dispatch(eventMemberListRequest({
      id: identifier,
      page: 1
    }));
  }

  const addEventToCalendar = ({ identifier }) => {
    dispatch(subscribeEventRequest(identifier));
  }

  const handelRemoveFromCalender = ({ identifier }) => {
    dispatch(unsubscribeEventRequest(identifier));
  }

  // Subscribe event for current user
  useEffect(() => {
    if(subscribeStatus.flag === 1) {
      if(subscribeStatus.event === current.identifier) {
        const updatedData = { ...current, is_attending: true };
        dispatch(eventsDetailsUpdate(updatedData));
        dispatch(resetEventSubscriptionStatus());

        // Update member list
        resetMemberList(updatedData);
      }
    }
  }, [dispatch, subscribeStatus]);

  // Unsubscribe event for current user
  useEffect(() => {
    try {
      if(unsubscribeStatus.flag === 1) {

        if(unsubscribeStatus.event === current.identifier) {
          const updatedData = { ...current, is_attending: false };
          dispatch(eventsDetailsUpdate(updatedData));
          dispatch(resetEventSubscriptionStatus());

          // Update member list
          resetMemberList(updatedData);
        }
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }
  }, [dispatch, unsubscribeStatus]);

  const handleResendInvitation = user => {
    const payload = {
      identifier: user.identifier,
      eventId: current.identifier,
      method: 'RE-POST'
    }
    dispatch(inviteMemberEventRequest(payload));
  }

  const handleCancelInvitation = user => {
    const payload = {
      identifier: user.identifier,
      eventId: current.identifier,
      method: 'DELETE'
    }
    dispatch(inviteMemberEventRequest(payload));
  }

  const handleRemoveMember = user => {
    const payload = {
      identifier: user.identifier,
      eventId: current.identifier,
      method: 'DELETE',
      removeMember: true
    }
    dispatch(inviteMemberEventRequest(payload));
  }

  // Check if session user can invite other to the event
  const canInviteMember = () => {
    if(current) {
      return (current.is_attending === true) ? true : false;
    } else {
      return false;
    }
  }

  const displayMemberCount = () => memberCount === 1 ? 'Member' : 'Members';

  const handelDeleteEvent = (type) => {
    const { identifier } = current;
    const { recursion_identifier } = current;
    dispatch(deleteEventRequest({
      id: identifier,
      recursion : recursion_identifier,
      type : type
    }));
  };

  useEffect(() => {
    const { flag } = eventDeleteFlag;
    if(flag === 1) {
      if(from === 'discover') {
        // Remove from store
        removeEventDetails();
        closeBox();
        dispatch(deleteEventReset({ flag: 0 }));
      }
    }
  }, [eventDeleteFlag]);

  const eventInProgress = event => event?.status === 'in_progress' ? true : false;

  const eventIsEnded = event => {
    try {
      if(event?.ends_at) {
        const currentTime = Helper.convertDateTz(Helper.formatDate(), true);

        const eventEndTime = moment(event.ends_at);
        const minDiff = eventEndTime.diff(currentTime, 'minutes');

        return minDiff < 0 ? true : false;
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'eventIsEnded' })
    }
    return false;
  };

  // Hook, relist event members
  useEffect(() => {
    const { flag } = eventParticipantInviteFlag
    if(flag === 1) {
      dispatch(resetEventMemberList());
      dispatch(eventMemberListRequest({
        id: current.identifier,
        page: 1
      }));
    }
  }, [eventParticipantInviteFlag]);

  return (
    <div className={ from === 'discover' ? 'col-lg-10' : 'col-lg-7' }>
      <div className="chat-history">
        <div className="group-info">
          <div className="chat-person-data">
            <div className="group-info-header mt-3">
              <div className="back-btn">
                { from === 'discover' &&
                  <h3
                    onClick={
                      () => {
                        closeBox();
                        removeEventDetails();
                      }
                    }
                    className="discover-back"
                  >
                    <a href="#/" role="button">{ ArrowBackIcon }</a>
                  &nbsp; Back to Results
                </h3>
                }
                { from === 'event' &&
                  <a href="#/" onClick={ removeEventDetails } role="button">{ ArrowBackIcon }</a>
                }
              </div>
              <div className="group-property">
                {
                  current.visibility === 'public' &&
                  <a className="btn-public" href="#/">
                    <label>Public</label>
                    { PublicGroupIcon }
                  </a>
                }
                {
                  current.visibility === 'organization_public' &&
                  <a className="btn-public" href="#/">
                    <label>Organization Public</label>
                    { PublicGroupIcon }
                  </a>
                }
                {
                  current.visibility === 'group_public' &&
                  <a className="btn-public" href="#/">
                    <label>Group Public</label>
                    { PublicGroupIcon }
                  </a>
                }
                {
                  current.visibility === 'private' &&
                  <a className="btn-public" href="#/">
                    <label>Private</label>
                    { LockIcon }
                  </a>
                }
                <div className="click-btn-div">
                  {
                    (canInviteMember() || canEditEvent(current)) &&
                    <Dropdown onToggle={ (e) => setCloseIcon(!closeIcon) }>
                      <Dropdown.Toggle as="a" className={ `btn-add btn-gray ${closeIcon && 'btn-close'}` } >
                        { PlusIcon }
                      </Dropdown.Toggle>
                      <Dropdown.Menu alignRight="true" className="option-menu">
                        {
                          (canEditEvent(current) && eventInProgress(current) === false) && current.recursion_identifier === null &&
                          <Dropdown.Item onClick={ () => fetchEventDetails(current) } className="img-edit-icon">Edit Event</Dropdown.Item>
                        }
                        {
                          (canInviteMember() && eventIsEnded(current) === false) &&
                          <Dropdown.Item onClick={ () => handleShowEventInviteModal(current) } className="img-add">Invite</Dropdown.Item>
                        }
                        {
                          (current.is_attending === true) &&
                          <>
                            {
                              eventIsEnded(current) === false &&
                              <Dropdown.Item onClick={ () => downloadICSFile(current, 'add') } className="img-plus">Add to Calendar</Dropdown.Item>
                            }
                            <Dropdown.Item onClick={ () => downloadICSFile(current, 'remove') } className="img-remove-calendar clr-red">Remove from Calendar</Dropdown.Item>
                          </>
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                </div>
              </div>
            </div>
            <div className="person-data">
              <div className="person-info">
                <div className="person-img">
                  <div className="img-round img-76">
                    <Image src={ current.avatar_url } altText="Event profile" />
                  </div>
                </div>
                <div className="person">
                  <h4>{ current.name }</h4>
                  <p className="show-read-more">
                    <ReadMoreText
                      content={ current.description }
                      limit={ 500 }
                      linkClass="load-more cursor-pointer text-white"
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="group-info-footer mb-3">
            </div>
          </div>
        </div>
        <div className="filter-data">
          {
            current.joinable === false &&
            <div className="date-box">
              <label>Date</label>
              <h2>{ Helper.formatDateTz(current.begins_at, "MMMM DD") }</h2>
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
            {
              (current.is_attending === true && current.joinable === true) &&
              <EventJoinButton label={'Join Now'} identifier={current.identifier} noificationId={moment()} extraClass={'btn-large btn-attending btn-click'} />
            }
            {
              (current.is_attending === true && current.joinable === false) &&
              <Dropdown onToggle={ (e) => setAttCloseIcon(!attCloseIcon) }>
                <Dropdown.Toggle as="a" className={ `btn btn-round btn-large btn-gray btn-attending btn-click ${attCloseIcon && 'btn-close'}` } >
                  Attending
                  { ChevronDownIcon }
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight="true" className="option-menu">
                  {
                    canEditEvent(current)
                      ? current.recursion_identifier ? <> <Dropdown.Item onClick={ () => handelDeleteEvent() } className="img-trash clr-red">Delete This Event Only</Dropdown.Item> <Dropdown.Item onClick={ () => handelDeleteEvent('recurring') } className="img-trash clr-red">Delete All Future Events</Dropdown.Item> </> : <Dropdown.Item onClick={ () => handelDeleteEvent() } className="img-trash clr-red">Delete Event</Dropdown.Item>
                      : <Dropdown.Item onClick={ () => handelRemoveFromCalender(current) } className="img-remove-calendar clr-red">Remove Event</Dropdown.Item>
                  }

                </Dropdown.Menu>
              </Dropdown>
            }
            {
              (current.is_attending === false && current.joinable === false) &&
              <span onClick={ () => addEventToCalendar(current) } className="btn btn-round btn-large btn-green btn-attending  btn-click" style={ { backgroundImage: 'none' } } href="#/">+ Add Event</span>
            }
          </div>
        </div>
        <div className="member-list">
          <div className="member-list-header">
            <h5>
              {
                memberLoading
                  ? 'Loading members...'
                  : `${memberCount} ${displayMemberCount()}`
              }
            </h5>
          </div>
          <div className="member-list-data">
            {
              eventMemberList.map((item, key) => (
                <EventMemberBox
                  key={ key }
                  item={ item }
                  event={ current }
                  handleResendInvitation={ handleResendInvitation }
                  handleCancelInvitation={ handleCancelInvitation }
                  canInviteMember={ canInviteMember }
                  handleRemoveMember={ handleRemoveMember }
                  ref={ (key + 1) === eventMemberList.length ? lastMemberElementRef : null }
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );

}

ContentRight.propTypes = {
  current: PropTypes.object,
  from: PropTypes.string,
};
ContentRight.defaultProps = {
  current: {},
  from: 'event'
};

export default ContentRight;
