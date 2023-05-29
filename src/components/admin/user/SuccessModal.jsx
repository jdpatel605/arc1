import React, {useState, useEffect, useRef} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

const fileLocation = "src\\components\\admin\\user\\SuccessModal.jsx";

const SuccessModal = props => {
    
  return (
    <Modal className="promote-admin" size="lg" show={props.showModal} backdrop="static" centered onHide={() => props.onHideModal} aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Body  className="modal-promote-admin">
        <div className="remove-success">
            <img src="/images/success.png" alt="" />
            <h4>Success!</h4>
            <p>{props.msg}</p>
            <button type="button" className="btn btn-green md-box btn-medium" onClick={props.onHideModal}>Close</button>
        </div>
      </Modal.Body>
      
    </Modal>
  )
}
SuccessModal.propTypes = {
  showModal: PropTypes.bool,
  onHideModal: PropTypes.func,
  msg: PropTypes.string,
};
SuccessModal.defaultProps = {
  showModal: false,
  msg: PropTypes.string,
};
export default SuccessModal;
