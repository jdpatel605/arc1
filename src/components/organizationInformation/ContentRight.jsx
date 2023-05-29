import React, { useRef, useCallback, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import EventBox from './EventBox';
import { useSelector, useDispatch } from "react-redux";
import { updateOrgEventList } from "../../store/actions";
import InviteToEventModal from "../events/InviteToEventModal";
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\organizationInformation\\ContentRight.jsx";

const ContentRight = props => {

  const dispatch = useDispatch();
  const { subscribeStatus } = useSelector(({ events }) => events);
  const { eventsList, loadEventFlag } = useSelector(({ organization }) => organization);
  const [lastRow, setLastRow] = useState({});
  const [sections, setSections] = useState({});
  const [showEventInviteModal, setShowEventInviteModal] = useState(false);
  const [inviteEventDetails, setInviteEventDetails] = useState({});


  useEffect(() => {
    try {
      if(eventsList) {

        // Get the last row
        const lastRowEl = eventsList.slice(-1)[0];
        if(lastRowEl && lastRowEl.identifier) {
          setLastRow(lastRowEl);
        }

        // Manipulate the object
        const tmpSections = {};
        eventsList.forEach(event => {
          const tempArray = tmpSections[event.section] ? tmpSections[event.section] : [];
          tmpSections[event.section] = [...tempArray, event];
        });
        setSections(tmpSections);

      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:eventsList' })
    }
  }, [eventsList]);

  useEffect(() => {
    try {
      if(subscribeStatus.flag === 1) {
        const newEventList = eventsList.map(data =>
          (data.identifier === subscribeStatus.event) ? { ...data, is_attending: true } : data
        );
        dispatch(updateOrgEventList(newEventList));
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:subscribeStatus' })
    }
  }, [subscribeStatus])

  const observer = useRef()
  const lastEventElementRef = useCallback(node => {
    try {
      if(loadEventFlag) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          props.nextPageEvents();
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'lastEventElementRef' })
    }
  }, [loadEventFlag])

  const showEvent = (item) => {
    props.showEvent(item);
  }


  // Event Invite Modal
  const handleShowEventInviteModal = event => {
    setInviteEventDetails(event);
    setShowEventInviteModal(true);
  }
  const handleHideEventInviteModal = () => {
    setShowEventInviteModal(false);
  }

  return (

    <div className="col-lg-7">
      <div className="right-panal" style={ { 'paddingTop': '0' } }>
        <div className="chat-person-list green-border">
          {
            // Loop through each section
            Object.keys(sections).map((section, sKey) => (

              sections[section].length > 0 &&
              <div key={ sKey }>
                <div className="title"><label>{ section }</label></div>
                {
                  // Loop through each event
                  sections[section].map((event, key) => (
                    <EventBox
                      key={ key }
                      isSubscribed={ props.isSubscribed }
                      data={ event }
                      ref={ lastRow.identifier === event.identifier ? lastEventElementRef : null }
                      from={ props.from ? props.from : '' }
                      showEvent={ showEvent }
                      handleShowEventInviteModal={ handleShowEventInviteModal }
                    />
                  ))
                }
              </div>
            ))
          }
          {
            !loadEventFlag && eventsList.length === 0 && <div className="no-events">No events found</div>
          }
        </div>
      </div>
      <InviteToEventModal show={ showEventInviteModal } hideModal={ handleHideEventInviteModal } event={ inviteEventDetails } />
    </div>
  )
}

ContentRight.propTypes = {
  isSubscribed: PropTypes.bool,
  nextPageEvents: PropTypes.func,
  showEvent: PropTypes.func,
};
ContentRight.defaultProps = {
  isSubscribed: false,
};

export default ContentRight;
