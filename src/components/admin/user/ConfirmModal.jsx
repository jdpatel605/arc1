import React, {useState, useEffect, useRef} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import Image from '../../common/Image';
import TruncationText from "../../common/TruncationText";
import PropTypes from 'prop-types';
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\user\\ConfirmModal.jsx";

const ConfirmModal = props => {
    
    const handelConfirm = (user) => {
        props.onHideModal()
        props.onOkModal(user)
    }
    
  return (
    <Modal className="promote-admin" size="lg" show={props.showModal} backdrop="static" onHide={() => props.onHideModal()} centered aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Body className="modal-promote-admin">
        { props.showModal &&
        <div className="promote-admin-details">
            <h4>{props.settings.title}</h4>
            <p>{props.settings.msg}</p>
            <div className="person-data align-items-center">
                <div className="person-info">
                  <div className="person-img">
                    <div className="img-round img-40">
                      <Image src={props.settings.user.avatar_url} altText="User" />
                    </div>
                  </div>
                  <div className="person">
                    <h4>{props.settings.user.name ? <TruncationText content={props.settings.user.name} /> : '-'}</h4>
                    { props.settings.user.from !== 'group-detail' &&
                    <p>{ props.settings.user.role === 'admin' ? 'Org Admin' : ( props.settings.user.role === 'owner' ? 'Org Owner' : 'Member' )}</p>
                    }
                    { props.settings.user.from === 'group-detail' &&
                    <p>{ props.settings.user.role === 'admin' ? 'Group Admin' : ( props.settings.user.role === 'owner' ? 'Group Owner' : 'Member' )}</p>
                    }
                  </div>
                </div>
            </div>
        </div>
        }
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <button type="button" className="btn bg-black-900 sm-box btn-medium clr-white" onClick={() => props.onHideModal()}>Cancel</button>
        <button type="button" className={`btn sm-box btn-medium ${props.settings.btnClass}`}
          onClick={(e) => handelConfirm(props.settings.user)} >
          {props.settings.okText} </button>
      </Modal.Footer>
    </Modal>
  )
}
ConfirmModal.propTypes = {
  showModal: PropTypes.bool,
  onHideModal: PropTypes.func,
  onOkModal: PropTypes.func,
  settings: PropTypes.object,
};
ConfirmModal.defaultProps = {
  showModal: false,
  settings: {},
};
export default ConfirmModal;
