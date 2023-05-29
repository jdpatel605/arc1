import React, { useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal'
import EventModalMainPage from "./EventModalMainPage";
import EventModalGroupHost from "./EventModalGroupHost";
import EventModalAdvanceSettings from "./EventModalAdvanceSettings";
import { eventHostListRequest, eventParticipantsListReset } from '../../../../store/actions/eventActions';
import { EventContext } from "../EventContext";

const CreateEventModal = props => {

  const modalContentCss = `.modal-content{height: auto;}`;
  const dispatch = useDispatch();

  const { currentPage, setCurrentPage, handleHideEventModal } = useContext(EventContext);

  // Get hosts list
  useEffect(() => {
    dispatch(eventHostListRequest());
  }, [dispatch]);

  const handelResetForm = () => {
    setCurrentPage('mainPage');
    dispatch(eventParticipantsListReset({}));
  }

  return (
    <Modal size="lg" show={ props.show } onExiting={ handelResetForm } onHide={ () => handleHideEventModal() } aria-labelledby="example-modal-sizes-title-lg" >
      <style>{ modalContentCss }</style>
      <Modal.Body>
        { currentPage === 'mainPage' && <EventModalMainPage /> }
        { currentPage === 'groupHostPage' && <EventModalGroupHost /> }
        { currentPage === 'advanceSettingsPage' && <EventModalAdvanceSettings /> }
      </Modal.Body>
    </Modal>
  )
}

CreateEventModal.propTypes = {
  show: PropTypes.bool,
  hideModal: PropTypes.func,
};
CreateEventModal.defaultProps = {
  show: false,
};

export default CreateEventModal;
