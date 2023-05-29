import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import Image from '../common/Image';
import {eventDiscoverRequest} from '../../store/actions';
import TruncationText from "../common/TruncationText";
import {ChevronRightIcon} from "../../utils/Svg";
import {Helper} from './../../utils/helper';
import EmptyDiscover from './emptyDiscover';
import EmptyDefaultDiscover from './emptyDefaultDiscover';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\discover\\subContentEvent.jsx";

const SubContentEvent = (props) => {

  const dispatch = useDispatch();
  const {eventLoading, eventList, eventPageInfo} = useSelector(({discover}) => discover);
  const [componentLoad, setComponentLoad] = useState(false);
  const [eventPageNumber, setEventPageNumber] = useState(1);

  useEffect(() => {
    console.log(props.search);
    if(props.search !== '') {
      setComponentLoad(false);
      setEventPageNumber(1);
      const data = {search: props.search, page: 1};
      dispatch(eventDiscoverRequest(data));
    }
    else {
      setComponentLoad(false);
      setEventPageNumber(1);
      const data = {search: '', page: 1};
      dispatch(eventDiscoverRequest(data));
    }
  }, [props.search])

  useEffect(() => {
    try {
      console.log(eventList);
      if(eventList) {
        setComponentLoad(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:discoverEventList'})
    }
  }, [eventList])

  const observer = useRef()
  const lastEventlementRef = useCallback(node => {
    try {
      if(eventLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(eventPageNumber < eventPageInfo.total_pages) {
            setEventPageNumber(eventPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'discoverLastEventlementRef'})
    }
  }, [eventLoading])

  useEffect(() => {
    if(componentLoad) {
      const data = {search: props.search, page: eventPageNumber}
      dispatch(eventDiscoverRequest(data));
    }
  }, [eventPageNumber]);

  const goToEvent = (evtId) => {
    props.showEvent(evtId);
  }

  return (
    <div>
      {props.search !== '' && eventList.length > 0 &&
        <div className="chat-person-list green-border col-lg-9 group-search">
          {eventList.map((item, key) => {
            var day = '-';
            var time = '-';
            if(item.begins_at != null) {
              day = Helper.formatDateTz(item.begins_at, 'MMMM DD');
              time = Helper.formatDateTz(item.begins_at, 'h:mma');
            }
            return (
              <div className="chat-person-data bg-gray" key={key} ref={lastEventlementRef}>
                <div className="person-data" onClick={e => goToEvent(item.identifier)}>
                  <div className="person-info">
                    <div className="person-img">
                      <div className="img-round img-60">
                        <Image src={item.avatar_url} altText="Discover" />
                      </div>
                    </div>
                    <div className="person">
                      <h4>{item.title ? <TruncationText content={item.title} /> : '-'}</h4>
                      <p>{item.detail}</p>
                    </div>
                  </div>
                  <div className="communication">
                    <div className="time-data">
                      <label>{day}</label>
                      <a className="btn btn-round btn-green bg-black-600" href="#/">
                        {time}
                      </a>
                    </div>
                    <a className="view-more-btn" href="#/">
                      {ChevronRightIcon}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
      {!eventLoading && props.search !== '' && eventList.length === 0 &&
        <EmptyDiscover />
      }
      {props.search === '' &&
        <EmptyDefaultDiscover />
      }
    </div>
  )
}
SubContentEvent.propTypes = {
  search: PropTypes.string,
  showEvent: PropTypes.func,
};
SubContentEvent.defaultProps = {
  search: '',
};
export default SubContentEvent;
