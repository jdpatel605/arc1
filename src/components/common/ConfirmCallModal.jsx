import React, {useState, useEffect, useRef} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from './../spinner';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\common\\CreateEvent.jsx";

const ConfirmCallModal = props => {
    
    const [name, setName] = useState('');
    const {createEventLoading, eventJoinData} = useSelector(({group}) => group);
    
    useEffect( () => {
        var n = props.name.split(' ') || [];
        n = n.shift();
        setName(n)
    }, [props.name] )
    
    const handelConfirm = (id, callType) => {
//        props.onHideModal()
        props.onOkModal(id, callType)
    }
    
  return (
    <Modal className="small-modal" size="sm" show={props.showModal} backdrop="static" onHide={() => props.onHideModal()} aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Call {name}?
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Would you like to call {props.name}? </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <button type="button" className="btn bg-black-900 sm-box btn-medium clr-red" onClick={() => props.onHideModal()}>Cancel</button>
        <button type="button" className={'btn btn-green sm-box btn-medium '}
          disabled={createEventLoading}
          onClick={(e) => handelConfirm(props.groupId, props.callType)} >
          Call {' '} {createEventLoading && <Spinner />} </button>
      </Modal.Footer>
    </Modal>
  )
}
ConfirmCallModal.propTypes = {
  showModal: PropTypes.bool,
  groupId: PropTypes.string,
  callType: PropTypes.string,
  onHideModal: PropTypes.func,
  onOkModal: PropTypes.func,
  name: PropTypes.string,
};
ConfirmCallModal.defaultProps = {
  showModal: false,
  groupId: '',
  callType: 'group',
};
export default ConfirmCallModal;
