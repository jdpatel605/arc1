import React, { forwardRef, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Image from '../common/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from 'react-redux';
import { unsubscribeEventRequest } from '../../store/actions';
import { EventContext } from './EventContext';
import { Helper } from './../../utils/helper';
import { KebabIcon } from './../../utils/Svg';
import moment from 'moment';
import { Logger } from './../../utils/logger';
import EventJoinButton from './../common/EventJoinButton';

const fileLocation = "src\\components\\events\\EventBox.jsx";

const EventBox = forwardRef((props, ref) => {

  const [closeIcon, setCloseIcon] = useState(false);
  const dispatch = useDispatch();
  const handelRemoveFromCalender = ({ identifier }) => {
    dispatch(unsubscribeEventRequest(identifier));
  }

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

  const getActiveClass = event => {
    try {
      if(typeof props.current !== 'undefined' && props.current.identifier) {
        const { identifier: currentEvent } = event;
        const { identifier: visibleEvent } = props.current;

        return currentEvent === visibleEvent ? 'active' : '';
      } else {
        return '';
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'getActiveClass' })
    }
  }

  const {
    handleShowEventInviteModal, handleJoinEventNow, canEditEvent, canInviteMember,
    fetchEventDetails, handelDeleteEvent, downloadICSFile
  } = useContext(EventContext);

  return (
    <div className={ `chat-person-data bg-gray ${getActiveClass(props.data)}` } ref={ ref }>
      <NavLink to={`#${props.data.identifier}`}>
      <div className="person-data" onClick={ () => props.displayEventDetails(props.data) }>
        <div className="person-info">
          <div className="person-img">
            <div className="img-round img-60">
              <Image src={ props.data.avatar_url } altText="Event" />
            </div>
          </div>
          <div className="person">
            <h4 title={ props.data.name }>{ Helper.textLimit(props.data.name, 32) }</h4>
            <p title={ props.data.host_name }>{ Helper.textLimit(props.data.host_name, 32) }</p>
          </div>
        </div>
        <div className="communication pt-2">
          <div className="time-data">
            <label>
              {
                (props.data.section === 'Today' || props.data.section === 'This week')
                  ?
                  Helper.formatDateTz(props.data.begins_at, 'dddd DD')
                  :
                  Helper.formatDateTz(props.data.begins_at, 'MMMM DD')
              }
            </label>
            {
              props.data.joinable === true
                ?
                <EventJoinButton label={'Join Now'} identifier={props.data.identifier} />
                :
                <a href="#/" role="button" className="btn btn-round btn-green bg-black-600">{ Helper.formatDateTz(props.data.begins_at, 'h:mma') }</a>
            }
          </div>
          <div className="click-btn-div">
            <Dropdown onToggle={ (e) => setCloseIcon(!closeIcon) } onClick={ (e) => e.stopPropagation() }>
              <Dropdown.Toggle as="a" className={ `btn more-btn btn-click ${closeIcon && 'btn-close'}` } >
                { KebabIcon }
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight="true" className="option-menu">
                {
                  (canEditEvent(props.data) && eventInProgress(props.data) === false) && props.data.recursion_identifier === null &&
                  <Dropdown.Item onClick={ () => fetchEventDetails(props.data) } className="img-edit-icon">Edit Event</Dropdown.Item>
                }
                {
                  (canInviteMember(props.data) && eventIsEnded(props.data) === false) &&
                  <Dropdown.Item onClick={ () => handleShowEventInviteModal(props.data) } className="img-add-user">Invite</Dropdown.Item>
                }
                {
                  (props.data.is_attending === true) &&
                  <>
                    {
                      (eventIsEnded(props.data) === false) &&
                      <Dropdown.Item onClick={ () => downloadICSFile(props.data, 'add') } className="img-plus">Add to Calendar</Dropdown.Item>
                    }
                    <Dropdown.Item onClick={ () => downloadICSFile(props.data, 'remove') } className="img-remove-calendar clr-red">Remove from Calendar</Dropdown.Item>
                  </>
                }
                {
                  (props.data.is_attending === true && props.data.status !== 'in_progress') &&
                    canEditEvent(props.data)
                    ? props.data.recursion_identifier ? <> <Dropdown.Item onClick={ () => handelDeleteEvent(props.data) } className="img-trash clr-red">Delete This Event Only</Dropdown.Item> <Dropdown.Item onClick={ () => handelDeleteEvent(props.data, 'recurring') } className="img-trash clr-red">Delete All Future Events</Dropdown.Item> </> : <Dropdown.Item onClick={ () => handelDeleteEvent(props.data) } className="img-trash clr-red">Delete Event</Dropdown.Item>
                    : <Dropdown.Item onClick={ () => handelRemoveFromCalender(props.data) } className="img-remove-calendar clr-red">Remove Event</Dropdown.Item>
                }
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      </NavLink>
    </div>
  )

})

EventBox.propTypes = {
  data: PropTypes.object,
  displayEventDetails: PropTypes.func,
  current: PropTypes.object,
};
EventBox.defaultProps = {
  data: {},
  current: {},
};


export default EventBox;
