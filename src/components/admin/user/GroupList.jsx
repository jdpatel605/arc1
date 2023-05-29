import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import SingleProfile from "../../profile/SingleProfile";
import {KebabIcon} from "../../../utils/Svg";
import {Logger} from './../../../utils/logger';
import UserImage from '../../common/UserImage';
import ConfirmModal from './ConfirmModal';
import AssignToOwnerModal from './../group/AssignToOwnerModal';
import {kickUserFromGroupRequest, kickUserFromGroupReset, updateUserDetail, promoteUserRoleRequest} from '../../../store/actions';
const fileLocation = "src\\components\\admin\\user\\GroupList.jsx";

const GroupList = (props) => {
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem('identifier');
  const [showConfirmModalFlag, setConfirmModal] = useState(false);
  const [settings, setSettings] = useState({});
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [assignOwnerGroup, setAssignOwnerGroup] = useState({});
  
  const showAssignGroupOwner = (data) => {
    setAssignOwnerGroup(data);
    setAssignModalShow(true);
  }
  
  const hideAssignGroupOwner = (event) => {
    setAssignOwnerGroup({});
    setAssignModalShow(false);
  }
  
  const {adminUserDetails} = useSelector(({user}) => user);
  const userRole = localStorage.getItem('user_role');
    const settingsList = {
        admin: {
            title: 'Promote to Group Admin?',
            msg: 'An User will be Promated to Group Admin. Promote to Group Admin?',
            okText: 'Promote',
            btnClass: 'btn-green'
        },
        member: {
            title: 'Demote to Member?',
            msg: 'An User will be Demoted to Member. Demote to Member?',
            okText: 'Demote',
            btnClass: 'btn-red'
        },
        remove: {
            title: 'Remove from Group?',
            msg: 'Removing a user from a group will remove them from all group events as well.',
            okText: 'Remove',
            btnClass: 'btn-red'
        },
    }
    const showConfirmModal = ( user, type) => {
        
        const set = settingsList[type]
        set.user = user
        set.user.actionType = type
        set.user.from = 'group-detail'
        setSettings(set)
        setConfirmModal(true)
    }
    const hideConfirmModal = () => {
        setConfirmModal(false)
        dispatch(kickUserFromGroupReset());
    }
    const confirmCallBack = (group) => {
        console.log('remove group', group)
        if(group.actionType === 'remove'){
            removeFromGroup(group)  
        }
        else if(group.actionType === 'admin' || group.actionType === 'member'){
            changeGroupUserRole(group, group.actionType)  
        }
        
    }
  const removeFromGroup = (group) => {
      
    const data = {
      id: group.identifier,
      member: adminUserDetails.identifier,
    }
    dispatch(kickUserFromGroupRequest(data));
  
  }
  const changeGroupUserRole = (group, role) => {
        const data = {
          id: group.identifier,
          member: adminUserDetails.identifier,
          role: role
        }
        dispatch(promoteUserRoleRequest(data));
  }
  
  const updateOwnership = (res) => {
        let groups = adminUserDetails.groups
        let updatedList = adminUserDetails;
        updatedList.groups = groups.map(data => data.identifier === res.group_id ? { ...data, role : 'admin'} : data );
        dispatch(updateUserDetail(updatedList));
  }

return (
  <div>
      <AssignToOwnerModal
            showModal={assignModalShow}
            groupData={assignOwnerGroup}
            onHideModal={hideAssignGroupOwner}
            updateOnParent={true}
            updateOnParentData={updateOwnership}
          />
      
    <ConfirmModal
        showModal={showConfirmModalFlag}
        onHideModal={hideConfirmModal}
        onOkModal={confirmCallBack}
        settings={settings}
    />
    <div className="member-list-header pl-0 mt-2">
      <h5>{adminUserDetails.groups.length} Group{adminUserDetails.groups.length > 1 ? 's' : ''}</h5>
    </div>
    <div className="member-list-data">
      {adminUserDetails.groups.length > 0 && adminUserDetails.groups.map((member, key) => <div className="member-info" key={key} >
        
        <SingleProfile name={member.name} from="admin" detail={`${member.member_count} Members`} avatarUrl={member.avatar_url} userId={member.identifier} />
        
        <div className="communication details-member">
          {member.role === 'owner' &&
            <div className="user-designation"><span className="badge btn-blue">Group Owner</span></div>
          }
          {member.role === 'admin' &&
            <div className="user-designation"><span className="badge btn-yellow">Group Admin</span></div>
          }
          
          {member.role === 'member' &&
            <div className="user-designation"><span className="badge btn-gray">Member</span></div>
          }
          <Dropdown>
            <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
              {KebabIcon}
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight="true" className="option-menu">
              {member.role === 'owner' &&
              <Dropdown.Item onClick={() => showAssignGroupOwner(member)}
                className="img-transfer-ownership clr-blue">Transfer Ownership</Dropdown.Item>
              }
              {userRole === 'owner' && member.role === 'member' && 
              <Dropdown.Item onClick={() => showConfirmModal(member, 'admin')}
                className="img-promote-admin clr-yellow">Promote to Group Admin</Dropdown.Item>
              }
              {userRole === 'owner' && member.role === 'admin' &&
              <Dropdown.Item onClick={() => showConfirmModal(member, 'member')}
                className="img-demote-member">Demote to Member</Dropdown.Item>
              }
              {member.role !== 'owner' &&
              <Dropdown.Item onClick={() => showConfirmModal(member, 'remove')} className="img-exit clr-red">Remove From Group</Dropdown.Item>
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      )}
      {adminUserDetails.groups.length === 0 &&
        <div className="member-info">
          <div className="member">
            <div className="member-data m-4">
              <a href="#">No group!</a>
            </div>
          </div>
        </div>
      }
    </div>
  </div>
)
}
GroupList.propTypes = {
};
GroupList.defaultProps = {
};
export default GroupList;
