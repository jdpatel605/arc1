import React from "react";
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types';

const MeetingErrorModal = props => {

  return (
    <Modal size="sm" show={ props.showModal } backdrop="static" centered dialogClassName="event-error" >
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Alert
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-sm-12 pl-4 pr-4">
            <p>{ !props.reloadButton ? props.mainMessage : props.reloadMessage }</p>
            <label className="pr-3">{ props.msg }</label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        { !props.reloadButton &&
          <>
            <button onClick={ () => props.hideErrorModal() } className="btn btn-green md-box btn-medium btn-gray-500" type="button">Stay In</button>
            <button onClick={ () => props.closeEvent() } className="btn bg-red clr-white md-box btn-medium btn-red-500" type="button">Leave event</button>
          </>
        }
        { props.reloadButton &&
          <button onClick={ () => window.location.reload() } className="btn btn-green md-box btn-medium btn-red-500" type="button">Reload</button>
        }
      </Modal.Footer>
    </Modal>
  )

}
MeetingErrorModal.defaultProps = {
  mainMessage: 'Seems like your browser does not supported for joining this event',
  reloadMessage: 'Internet has reconnected. Please reload page to avoid misbehaviour.',
  msg: null,
  reloadButton: false,
}
MeetingErrorModal.propTypes = {
  mainMessage: PropTypes.string,
  msg: PropTypes.string,
  reloadButton: PropTypes.bool,
};
export default MeetingErrorModal;
