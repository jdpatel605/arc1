import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import { useAlert } from 'react-alert';
import Modal from 'react-bootstrap/Modal';
import Image from '../../common/Image';
import TruncationText from "../../common/TruncationText";
import Spinner from './../../spinner';
import {promoteUserRoleRequest, detailsGroupMemberListUpdate} from '../../../store/actions';

import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\group\\PromoteAdmin.jsx";

const PromoteAdmin = (props) => {
  const alert = useAlert()
  const dispatch = useDispatch();
  const member = props.promoteAdminData;
  const {adminGroupDetails, detailsMemList, loadingRole, changeRoleSuccess, changeRoleError} = useSelector(({adminGroup}) => adminGroup);

  const promoteToAdmin = () => {
    const data = {
      id : adminGroupDetails.identifier,
      member: member.identifier,
      role: 'admin'
    }
    dispatch(promoteUserRoleRequest(data));
  }

  useEffect(() => {
    try {
      if(changeRoleSuccess) {
        const {message} = changeRoleError;
        if(message && message?.message !== '') {
          alert.error(message?.message)
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:changeRoleSuccess'})
    }
  },[changeRoleSuccess]);
  
  useEffect(() => {
    try {
      if(changeRoleError) {
        const {identifier, status} = changeRoleError;
        const updatedList = detailsMemList.map(data => data.identifier === identifier ? {...data, status} : data);
        dispatch(detailsGroupMemberListUpdate(updatedList));
        props.hidePromoteAdmin(false)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:changeRoleError'})
    }
  },[changeRoleError]);

  return (
    <Modal size="lg" show={props.showPromoteAdmin} backdrop="static" onHide={() => props.hidePromoteAdmin(false)} aria-labelledby="example-modal-sizes-title-lg" centered className="promote-admin">
      <Modal.Body className="modal-promote-admin">
        <div className="promote-admin-details">
          <h4>Promote to Org Admin?</h4>
          <p>An Org Admin will be able to edit all organization Users, Groups, and Events. Promote to Org Admin?</p>
          <div className="person-data align-items-center mt-4">
            <div className="person-info">
              <div className="person-img">
                <div className="img-round img-40 ml-3">
                  <Image src={member.avatar_url} altText="Member" />
                </div>
              </div>
              <div className="person">
                <h4>{member.name ? <TruncationText content={member.name} /> : '-'}</h4>
                <p>{member.status}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
          <button type="button" className="btn bg-black-900 md-box btn-medium clr-white" onClick={() => props.hidePromoteAdmin(false)}>Cancel</button>
          <button type="button" className="btn btn-green md-box btn-medium" onClick={promoteToAdmin}>Promote {loadingRole && <Spinner />}</button>
        </Modal.Footer>
    </Modal>
  )
}
PromoteAdmin.propTypes = {
  showPromoteAdmin: PropTypes.bool,
  promoteAdminData: PropTypes.object,
  hidePromoteAdmin: PropTypes.func,
};
PromoteAdmin.defaultProps = {
  showPromoteAdmin: false,
  promoteAdminData: {},
};
export default PromoteAdmin;
