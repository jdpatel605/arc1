import React, {useState, useEffect, useRef} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import CreateEvent from './../common/CreateEvent';
import ConfirmCallModal from './../common/ConfirmCallModal';
import {Logger} from './../../utils/logger';
import {VideoIcon, VideoOn} from "../../utils/Svg";
import Spinner from './../spinner';
import { isMobile } from "react-device-detect";
const fileLocation = "src\\components\\common\\CallButton.jsx";

const CallButton = props => {

    const [showCreateEventModalFlag, setShowCreateEventModal] = useState(false);
    const [showConfirmCallModalFlag, setConfirmCallModal] = useState(false);
    const [groupId, setGroupId] = useState('');
    const [callType, setCallType] = useState('');
    
    const {createEventLoading, eventJoinData} = useSelector(({group}) => group);

    const showCreateEventModal = (id, call_type) => {
        setGroupId(id)
        setCallType(call_type)
        setShowCreateEventModal(true)
    }
    const showConfirmCallModal = (id, call_type) => {
        setGroupId(id)
        setCallType(call_type)
        setConfirmCallModal(true)
    }

    const hideCreateEventModal = () => {
        setShowCreateEventModal(false)
        setGroupId('')
    }
    const hideConfirmCallModal = () => {
        setConfirmCallModal(false)
    }
    const confirmCallBack = (id, call_type) => {
        showCreateEventModal(id, call_type)
    }
    
    const handleButtonClick = (pr) => {
        if(isMobile){
            window.location = '/unsupported-feature'
            return false
        }
        if(pr.confirm){
           showConfirmCallModal(pr.callee_id, pr.call_type) 
        } else{ 
            showCreateEventModal(pr.callee_id, pr.call_type)
        }
        
    }
    
  return (
        <>
            <CreateEvent
              showModal={showCreateEventModalFlag}
              groupId={groupId}
              callType={callType}
              onHideModal={hideCreateEventModal}
            />
            
            <ConfirmCallModal
              showModal={showConfirmCallModalFlag}
              groupId={groupId}
              callType={callType}
              onHideModal={hideConfirmCallModal}
              onOkModal={confirmCallBack}
              name={props.name}
            />
            
            { !props.withText &&
            <a className="video-btn" href="#" role="button" onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick(props)
              }}>
                  {VideoIcon}
            </a>
            }
            { props.withText &&
              <div className="btn-box" onClick={(e) => {
                  e.stopPropagation();
                  if(!createEventLoading){
                        handleButtonClick(props)
                  }
              }}>
                <span className="btn btn-round btn-large btn-green btn-instant-meeting btn-click">
                  Instant Meet  
                   <VideoOn /> {' '} {createEventLoading && <Spinner />}
                </span>
              </div>      
            }
        </>
  )
}
CallButton.propTypes = {
  showModal: PropTypes.bool,
  groupId: PropTypes.string,
  call_type: PropTypes.string,
  withText: PropTypes.bool,
  confirm: PropTypes.bool,
  name: PropTypes.string,
};
CallButton.defaultProps = {
  showModal: false,
  groupId: '',
  call_type: 'group',
  withText: false,
  confirm: false,
  name: '',
};
export default CallButton;
