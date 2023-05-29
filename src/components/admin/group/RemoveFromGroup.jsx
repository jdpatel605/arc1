import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import { useAlert } from 'react-alert';
import Modal from 'react-bootstrap/Modal';
import Image from '../../common/Image';
import TruncationText from "../../common/TruncationText";
import Spinner from './../../spinner';
import {RemoveGroupSuccess} from "../../../utils/Svg";
import {adminGroupListUpdate, kickUserFromGroupRequest, detailsGroupMemberListUpdate, kickUserFromGroupReset} from '../../../store/actions';

import {Logger} from './../../../utils/logger';
import {groupCallInviteMemberFailed} from "../../../store/actions/group";
const fileLocation = "src\\components\\admin\group\\PromoteAdmin.jsx";

const RemoveFromGroup = (props) => {
  const alert = useAlert()
  const dispatch = useDispatch();
  const member = props.removeUserData;
  const {adminGroupList, adminGroupDetails, detailsMemList, loadingKick, kickUserSuccess, kickUserFail, kickFlag} = useSelector(({adminGroup}) => adminGroup);

  const removeMember = () => {
    const data = {
      id: adminGroupDetails.identifier,
      member: member.identifier,
    }
    dispatch(kickUserFromGroupRequest(data));
  }

  useEffect(() => {
    try {
      if(kickFlag === 1) {
        const {identifier} = kickUserSuccess;
        const groupList = adminGroupList.map(group => group.identifier === adminGroupDetails.identifier ? { ...group, member_count : group.member_count-1 } : group);
        dispatch(adminGroupListUpdate(groupList));
        const updatedList = detailsMemList.filter(data => data.identifier !== identifier && data);
        dispatch(detailsGroupMemberListUpdate(updatedList));
      }
      else if(kickFlag === 2) {
        const {message} = kickUserFail;
        if(message && message?.message !== '') {
          alert.error(message?.message)
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:kickUserSuccess'})
    }
  }, [kickFlag]);

  const closeRemoveBox = () => {
    dispatch(kickUserFromGroupReset());
    props.hideRemoveGroup(false)
  }


  return (
    <Modal size="lg" show={props.showRemoveGroup} backdrop="static" onHide={() => props.hideRemoveGroup(false)} aria-labelledby="example-modal-sizes-title-lg" centered className="promote-admin">
      <Modal.Body className="modal-promote-admin">
        {(kickFlag === 0 || kickFlag === 2) &&
        <div className="promote-admin-details">
          <h4>Remove from Group?</h4>
          <p>Removing a user from a group will remove them from all group events as well.</p>
          <div className="person-data align-items-center mt-5">
            <div className="person-info">
              <div className="person-img">
                <div className="img-round img-40 ml-3">
                  <Image src={member.avatar_url} altText="Member" />
                </div>
              </div>
              <div className="person">
                <h4>{member.name ? <TruncationText content={member.name} /> : '-'}</h4>
                <p>{member.role}</p>
              </div>
            </div>
          </div>
        </div>
        }
        {kickFlag === 1 &&
          <div className="remove-success">
            {RemoveGroupSuccess}
            <h4>Success!</h4>
            <p>You have successfully removed a user.</p>
            <button type="button" className="btn btn-green md-box btn-medium" onClick={closeRemoveBox}>Close</button>
          </div>
        }
      </Modal.Body>
      {(kickFlag === 0 || kickFlag === 2) &&
        <Modal.Footer className="justify-content-between">
          <button type="button" className="btn bg-black-900 md-box btn-medium clr-white" onClick={() => props.hideRemoveGroup(false)}>Cancel</button>
          <button type="button" className="btn btn-green md-box btn-medium btn-red" onClick={removeMember}>Remove {loadingKick && <Spinner />}</button>
        </Modal.Footer>
      }
    </Modal>
  )
}
RemoveFromGroup.propTypes = {
  showRemoveGroup: PropTypes.bool,
  removeUserData: PropTypes.object,
  hideRemoveGroup: PropTypes.func,
};
RemoveFromGroup.defaultProps = {
  showRemoveGroup: false,
  removeUserData: {},
};
export default RemoveFromGroup;
