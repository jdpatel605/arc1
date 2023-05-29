import React, {useState, useEffect, useRef} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\common\\CallBackModal.jsx";

const CallBackModal = props => {
    
    const handelConfirm = ( data ) => {
        props.onHideModal()
        props.onOkModal(data)
    }
    
  return (
    <Modal className="small-modal confirm-setting-modal noone-modal" size="sm" show={props.showModal} backdrop="static" onHide={() => props.onHideModal()} aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Body>
        <div className="box-contain bg-black-900 browser-sec">
            <div className="align-content">
              <img src="images/no-answer.png" alt="" />
              <h4>No one is here</h4>
              <p>It looks like this call was ended before you joined. Would you like to call them back?</p>
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <button type="button" className="btn bg-black-900 sm-box btn-medium clr-green" onClick={() => props.onHideModal()}>Close</button>
        <button type="button" className={'btn btn-green sm-box btn-medium '}
          onClick={(e) => handelConfirm( props.userData )} >
          Call Back</button>
      </Modal.Footer>
    </Modal>
  )
}
CallBackModal.propTypes = {
  showModal: PropTypes.bool,
  onHideModal: PropTypes.func,
  userData: PropTypes.object,
};
CallBackModal.defaultProps = {
  showModal: false,
  userData: PropTypes.object,
};
export default CallBackModal;
