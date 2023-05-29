import React, {useState, useEffect, useRef} from "react";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import useValidator from 'simple-react-validator-hooks';
import Spinner from './../spinner';
import {createGroupEventRequest} from "../../store/actions/group";
import history from "../../history/history";
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\common\\CreateEvent.jsx";

const CreateEvent = props => {

  const dispatch = useDispatch();
  const errorDivCSS = `.form-group .srv-validation-message{bottom: unset;}`;
  const [validator, showValidationMessage] = useValidator();
  const [eventDetails, setEventDetails] = useState({name: '', type: 'discussion'});
  const {createEventLoading, eventJoinData} = useSelector(({group}) => group);
  const htmlElRef = useRef(null)

  // Reset event details
  useEffect(() => {
//    console.log('callType', props.callType)
    setEventDetails({name: '', type: 'discussion'});
  }, []);
  
  useEffect(() => {
    if(props.showModal) {
      
      if(props.callType === 'event' || props.callType === 'user'){
          handelCreateEvent()
      }else{
          htmlElRef.current.focus()
      }
    }
  }, [props.showModal]);

  // Check if the event is generated successfully
  useEffect(() => {
    try {
      if(eventJoinData.eventData) {
        const {eventData} = eventJoinData;
        const jwt = localStorage.getItem("accessToken");
        const channel = eventData.identifier;

        // Store the event data in local storage
        localStorage.setItem(channel, jwt);
        const isSetCallType = localStorage.getItem('callType')
        if(!isSetCallType || props.callType === 'event'){
            localStorage.setItem('callType', props.callType);
        }
        // Push user to the group call screen
//        history.push(`/event?e=${channel}`);
//        window.location.reload();
        window.location = `/event?e=${channel}`

      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:eventJoinData'})
    }
  }, [eventJoinData])

  // Dispatch event create
  const handelCreateEvent = () => {

    if(validator.allValid()) {

      const payload = {
        group_id: props.groupId,
        type: eventDetails.type,
        call_type: props.callType
      }
      if(eventDetails.name.trim() !== '') {
        payload.name = eventDetails.name.trim();
      }
      // Create the event for session user and wait for response from API
      dispatch(createGroupEventRequest(payload));

    } else {
      showValidationMessage(true);
    }
  }

  // Update event details
  const updateEventDetails = e => {
    const {name, value} = e.target;
    setEventDetails(preProps => ({
      ...preProps, [name]: value
    }));
  }

  const goToEventCall = e => {
    if(e.keyCode === 13) {
      handelCreateEvent()
    }
  }

  return (
    <Modal size="md" show={props.showModal && ( props.callType !== 'event' && props.callType !== 'user' )} backdrop="static" onHide={() => props.onHideModal()} aria-labelledby="example-modal-sizes-title-lg" >
      <style>{errorDivCSS}</style>
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Create an Event
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-data" style={{marginTop: '0'}}>
          <div className="form-group">
            <div className="bg-black-500">
              <input ref={htmlElRef} type="text" name="name" value={eventDetails.name} className="form-control" onKeyDown={goToEventCall} required onChange={(e) => updateEventDetails(e)} />
              <label className="txt-label">Event Name</label>
            </div>
          </div>
          <div className="form-group">
            <div className="bg-black-500 custom-auto-complete">
              <Form.Control as="select" className="form-control" name="type" value={eventDetails.type} custom required onChange={(e) => updateEventDetails(e)} >
                <option value="discussion">Discussion</option>
                <option value="presentation">Presentation</option>
              </Form.Control>
              <label className="txt-label">Event Type</label>
              {validator.message('eventType', eventDetails.type, 'required|in:presentation,discussion')}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <button type="button" className="btn bg-black-900 md-box btn-medium clr-white" onClick={() => props.onHideModal()}>Cancel</button>
        <button type="button" className={'btn btn-green md-box btn-medium '}
          onClick={(e) => handelCreateEvent()} disabled={createEventLoading}>
          Call Now {' '} {createEventLoading && <Spinner />}</button>
      </Modal.Footer>
    </Modal>
  )
}
CreateEvent.propTypes = {
  showModal: PropTypes.bool,
  groupId: PropTypes.string,
  callType: PropTypes.string,
  onHideModal: PropTypes.func,
};
CreateEvent.defaultProps = {
  showModal: false,
  groupId: '',
  callType: 'group',
};
export default CreateEvent;
