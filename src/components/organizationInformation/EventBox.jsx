import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Dropdown from 'react-bootstrap/Dropdown'
import { useDispatch } from 'react-redux';
import { subscribeEventRequest } from '../../store/actions';
import Image from '../common/Image';
import TruncationText from "../common/TruncationText";
import history from '../../history/history';
import { KebabIcon } from '../../utils/Svg';
import { Helper } from '../../utils/helper';
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\organizationInformation\\EventBox.jsx";

const EventBox = forwardRef((props, ref) => {

  const dispatch = useDispatch();
  const [closeIcon, setCloseIcon] = useState(false);

  const goToEvent = (evtId) => {
    props.showEvent(evtId);
  }

  const handleAddEventToCalendar = ({ identifier }) => {
    dispatch(subscribeEventRequest(identifier));
  };

  const handleJoinEventNow = event => {
    try {
      const { identifier } = event;
      const jwt = localStorage.getItem("accessToken");
      // Store the event data in local storage
      localStorage.setItem(identifier, jwt);
      // Push user to the group call screen
      history.push(`/event?e=${identifier}`);
      window.location.reload();
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'handleJoinEventNow' })
    }
  }

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


  return (
    <div className="chat-person-data bg-gray" ref={ ref } >
      <div className="person-data">
        <div className="person-info">
          <div className="person-img">
            <div className="img-round img-60">
              <Image src={ props.data.avatar_url } altText="Event" />
            </div>
          </div>
          <div className="person">
            <h4 onClick={ e => goToEvent(props.data.identifier) }>{ props.data.name ? <TruncationText content={ props.data.name } /> : '-' }</h4>
            <p>{ props.data.host_name ? <TruncationText content={ props.data.host_name } /> : '-' }</p>
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
              (props.data.joinable === true && eventIsEnded(props.data) === false)
                ?
                <a href="#/" role="button" className="btn btn-round btn-green" onClick={ () => handleJoinEventNow(props.data) } >Join Now</a>
                :
                <a href="#/" role="button" className="btn btn-round btn-green bg-black-600">{ Helper.formatDateTz(props.data.begins_at, 'h:mma') }</a>
            }
            {/* <a className="btn btn-round bg-black-600 clr-white" href="/#">{Helper.formatDate(props.data.begins_at, 'h:mma')}</a> */ }
          </div>
          {
            (props.isSubscribed === true && eventIsEnded(props.data) === false) &&
            <Dropdown onToggle={ (e) => setCloseIcon(!closeIcon) } onClick={ (e) => e.stopPropagation() }>
              <Dropdown.Toggle as="a" className={ `more-btn ${closeIcon && 'btn-close'}` }>
                { KebabIcon }
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight="true" className="option-menu">
                { (props.data.is_attending !== true && eventIsEnded(props.data) === false) &&
                  <Dropdown.Item onClick={ () => handleAddEventToCalendar(props.data) } className="img-plus">Add Event</Dropdown.Item>
                }
                { (props.data.is_attending === true && eventIsEnded(props.data) === false) &&
                <Dropdown.Item onClick={ () => props.handleShowEventInviteModal(props.data) } className="img-add">Invite</Dropdown.Item>
                }
              </Dropdown.Menu>
            </Dropdown>
          }
        </div>
      </div>
    </div>
  )
})

EventBox.propTypes = {
  isSubscribed: PropTypes.bool,
  data: PropTypes.object,
  from: PropTypes.string,
  showEvent: PropTypes.func,
  handleShowEventInviteModal: PropTypes.func,
};
EventBox.defaultProps = {
  isSubscribed: false,
  data: {},
  from: '',
};

export default EventBox;
