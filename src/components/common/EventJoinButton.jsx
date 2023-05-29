import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { joinGroupEventRequest } from '../../store/actions/group';
import Spinner from "../spinner";
import CallBackModal from "./CallBackModal";
import CreateEvent from './CreateEvent';
import { useAlert } from 'react-alert'

const EventJoinButton = ({ label, identifier, extraClass, noificationId }) => {
  
  const dispatch = useDispatch();
  const [ showLoader, setShowLoader ] = useState(false)
  const [ userData, setUserData ] = useState({})
  const [ createEventProps, setCreateEventProps ] = useState({})
  const { globalEventJoinData, globalEventJoinDataError, loadingJoinGrp } = useSelector(({ group }) => group)    
  const [showCallBackModalFlag, setShowCallBackModal] = useState(false);
  const currentId = identifier
  const notiId = noificationId
  
  const alert = useAlert()
  
    const showCallBackModal = ( data ) => {
        setUserData(data)
        setShowCallBackModal(true)
    }
  
    const hideCallBackModal = () => {
        setShowCallBackModal(false)
        setUserData({})
    }

    const showCreateEventModal = ( data ) => {
//        console.log('showCreateEventModal', data)
        const modalData = {
            showModal: true, 
            groupId: data.attendee_identifiers[1],
            callType: 'user'
        }
        
        setCreateEventProps(modalData)
    }
    
    const hideCreateEventModal = () => {
        const modalData = {
            showModal: false, 
        }
        setCreateEventProps(modalData)
    }
    
  useEffect(() => {
        if(globalEventJoinData && globalEventJoinData.eventId === currentId && globalEventJoinData.notificationId === notiId){
            setShowLoader(false)
//            console.log('globalEventJoinData', globalEventJoinData)
            const jwt = localStorage.getItem("accessToken");

            // Store the event data in local storage
            localStorage.setItem(currentId, jwt);
            window.location = `/event?e=${currentId}`
        }
  }, [globalEventJoinData])
  
  
  useEffect(() => {
        if(globalEventJoinDataError && globalEventJoinDataError.eventId === currentId  && globalEventJoinDataError.notificationId === notiId){
            setShowLoader(false)
//            console.log('globalEventJoinDataError', globalEventJoinDataError)
            if(globalEventJoinDataError.message && globalEventJoinDataError.message.type === 'gone'){
                if(globalEventJoinDataError.message.attendee_identifiers.length < 2){
                    alert.error('You can not join this event. This event is already ended.')
                }else{
                    showCallBackModal(globalEventJoinDataError.message)
                }
            }else{
                alert.error('You can not join this event. This event is already ended.')
            }
        }
  }, [globalEventJoinDataError])
  
  const handleJoinEventNow = (id, notId) => {
    setShowLoader(true)
    dispatch(joinGroupEventRequest({eventId: id, notificationId: notId}))
  }

  return (
        <>
            <CreateEvent {...createEventProps} onHideModal={hideCreateEventModal} />
            <CallBackModal 
              showModal={showCallBackModalFlag}
              onHideModal={hideCallBackModal} 
              onOkModal={showCreateEventModal} 
              userData={userData} 
            />
            <a href={void(0)} onClick={ () => handleJoinEventNow(identifier, noificationId) } className={`btn btn-round btn-green ${extraClass}`}> {label}  { showLoader && <Spinner /> } </a>
        </>
  )
}

EventJoinButton.propTypes = {
  label: PropTypes.string,
  identifier: PropTypes.string,
  extraClass: PropTypes.string,
  noificationId: PropTypes.string,
};
EventJoinButton.defaultProps = {
  label: '',
  identifier: '',
  extraClass: '',
  noificationId: '',
};

export default EventJoinButton;
