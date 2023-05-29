import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import ReadMoreText from './../common/ReadMoreText';
import EventJoinButton from './../common/EventJoinButton';
import NewEventWhite from '../../assets/icons/images/add-event.png';
import GroupWhite from '../../assets/icons/images/groups.png';
import { KebabIcon } from '../../utils/Svg';
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\notifications\\NotificationBox.jsx";

const NotificationBox = forwardRef((props, ref) => {

  const [closeIcon, setCloseIcon] = useState(false);

  const iconSVG = (type = '') => {
    if(type.indexOf('event_') > -1) {
      return <img src={ NewEventWhite } alt="Event" />
    } else {
      return <img src={ GroupWhite } alt="Group" width="17" />
    }
  }

  const displayAcceptButton = (data) => {

    try {
      if(data.actions && data.actions[0]) {
        const action = data.actions[0];
        if(action.name === 'join') {
          const urlSplit = action.url.split('?e=');
          let actionUrl = action.url;
          if(typeof urlSplit[1] !== 'undefined') {
            actionUrl = `/event?e=${action.identifier}`;
          }
//          return <a href={ actionUrl } rel="noopener noreferrer" className="btn btn-round btn-green">{ action.label }</a>
          return <EventJoinButton label={action.label} identifier={action.identifier} noificationId={data.identifier}/>
        } else {
          return (
            <span
              onClick={
                (e) => {
                  e.stopPropagation();
                  props.acceptRejectInvite(action.url, data.identifier, action.verb, action.identifier, action.name)
                }
              }
              className="btn btn-round btn-green"
            >{ action.label }</span>
          );
        }
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'displayAcceptButton' })
    }


  }
  const displayRejectButton = (data) => {
    try {
      if(data.actions && data.actions[1]) {
        const action = data.actions[1];
        if(action.name === 'reject') {
          return (
            <span
              onClick={
                (e) => {
                  e.stopPropagation();
                  props.acceptRejectInvite(action.url, props.data.identifier, action.verb, action.identifier, action.name)
                }
              }
              className="btn btn-round bg-black-600 clr-white"
            >{ action.label }</span>
          )
        }
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'displayRejectButton' })
    }
  }

  return (

    <div className="chat-person-list green-border read-notif" ref={ ref } onClick={ (e) => props.readNotification(props.data) }>
      <div className="chat-person-data bg-black-900">
        <div className="person-data">
          <div className="person-info flex-nowrap align-items-start">
            <div className={ `icon-img ${props.data.status === 'unread' ? 'btn-green' : 'bg-gray'}` }>
              { iconSVG(props.data.type) }
            </div>
            <div className="person">
              <div>
                <h4>{ props.data.title }</h4>
                { props.data.detail && props.data.detail.length > 150 &&
                  <p>
                    <ReadMoreText
                      content={ props.data.detail }
                      limit={ 150 }
                      linkClass="load-more cursor-pointer text-white"
                    />
                  </p>
                }
                {
                  props.data.detail && props.data.detail.length <= 150 &&
                  <p>
                    { props.data.detail }
                  </p>
                }
              </div>
            </div>
          </div>
          <div className="communication">
            <div className="time-data justify-content-end">
              { props.data.status !== 'done' && displayRejectButton(props.data) }
            </div>
            <div className="time-data justify-content-end">
              { props.data.status !== 'done' && displayAcceptButton(props.data) }
              <label className="text-right">{ props.data.age }</label>
            </div>
            <div className="click-btn-div">
              <Dropdown onToggle={ (e) => setCloseIcon(!closeIcon) } onClick={ (e) => e.stopPropagation() }>
                <Dropdown.Toggle as="a" className={ `btn more-btn btn-click ${closeIcon && 'btn-close'}` } >
                  { KebabIcon }
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight="true" className="option-menu">
                  <Dropdown.Item onClick={ (e) => props.deleteNotification(e, props.data.identifier) } className="img-trash clr-red">Delete Notification</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

NotificationBox.propTypes = {
  data: PropTypes.object,
  readNotification: PropTypes.func,
  acceptRejectInvite: PropTypes.func,
  deleteNotification: PropTypes.func,
};
NotificationBox.defaultProps = {
  data: {},
};

export default NotificationBox;
