import React, { useRef, useCallback, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import EventBox from "./EventBox"
import { useDispatch, useSelector } from 'react-redux';
import { deleteEventReset, eventsByIdFailed, eventsByIdRequest } from './../../store/actions/eventActions';
import { eventTypes } from './../../store/actions/eventTypes';
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\events\\contentLeft.jsx";

const ContentLeft = props => {

  const [lastRow, setLastRow] = useState({});
  const [sections, setSections] = useState({});

  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { current, eventDeleteFlag } = useSelector(({ events }) => events);

  useEffect(() => {
    try {
      if(props.eventsList) {

        // Get the last row
        const lastRowEl = props.eventsList.slice(-1)[0];
        if(lastRowEl && lastRowEl.identifier) {
          setLastRow(lastRowEl);
        }

        // Manipulate the object
        const tmpSections = {};
        props.eventsList.forEach(event => {
          const tempArray = tmpSections[event.section] ? tmpSections[event.section] : [];
          tmpSections[event.section] = [...tempArray, event];
        });
        setSections(tmpSections);
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:Hook' })
    }
  }, [props.eventsList]);

  const observer = useRef()
  const lastEventElementRef = useCallback(node => {
    try {
      if(props.loading) {
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
  }, [props.loading])

  // Display event details
  const displayEventDetails = ({ identifier }) => {
    if(current.identifier !== identifier) {
      dispatch(eventsByIdRequest(identifier));
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const { flag } = eventDeleteFlag;
    if(flag === 1) {
      dispatch(deleteEventReset({ flag: 0 }));
      dispatch(eventsByIdFailed({}));
    }
  }, [eventDeleteFlag]);

  return (
    <div className="col-lg-5" ref={ scrollRef }>
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
                    data={ event }
                    ref={ lastRow.identifier === event.identifier ? lastEventElementRef : null }
                    displayEventDetails={ displayEventDetails }
                    current={ current }
                  />
                ))
              }
            </div>
          ))
        }

      </div>
    </div>
  );
}

ContentLeft.propTypes = {
  eventsList: PropTypes.array,
  nextPageEvents: PropTypes.func,
  loading: PropTypes.bool,
};
ContentLeft.defaultProps = {
  eventsList: [],
  loading: false
};

export default ContentLeft;
