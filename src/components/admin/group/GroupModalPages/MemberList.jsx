import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import PromoteToAdmin from '../PromoteToAdmin';
import RemoveFromGroup from '../RemoveFromGroup';
import SingleProfile from "../../../profile/SingleProfile";
import {KebabIcon, ChevronDownIcon} from "../../../../utils/Svg";
import {detailsGroupMemberListRequest, promoteUserRoleRequest, detailsGroupMemberListUpdate, inviteGroupMemberRequest, cancleInviteGroupMemberRequest} from '../../../../store/actions';
import {Logger} from './../../../../utils/logger';
const fileLocation = "src\\components\\admin\group\\GroupModalPages\\MemberList.jsx";

const MemberList = (props) => {
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem('identifier');
  const userRole = localStorage.getItem("user_role");
  const {adminGroupDetails, detailsMemLoading, detailsMemList, detailsMemPageInfo, changeRoleSuccess, inviteGrpMemberFlag, canInviteGrpMemberFlag, inviteGrpMemberSuccess, canInviteGrpMemberSuccess, kickFlag} = useSelector(({adminGroup}) => adminGroup);
  const [memberPageNumber, setMemberPageNumber] = useState(1);

  useEffect(() => {
    try {
      if(inviteGrpMemberFlag === 1 || canInviteGrpMemberFlag === 1 || kickFlag === 1) {
        getGroupMember();
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteMemList'})
    }
  }, [inviteGrpMemberFlag, canInviteGrpMemberFlag, kickFlag])

  const getGroupMember = () => {
    const data = {id: adminGroupDetails.identifier, search: props.searchText, page: memberPageNumber}
    dispatch(detailsGroupMemberListRequest(data));
  }

  // Get serach reacord from ALL API
  useEffect(() => {
    if(props.searchText !== '') {
      setMemberPageNumber(1);
      getGroupMember();
    }
    else {
      setMemberPageNumber(1);
      getGroupMember();
    }
  }, [props.searchText])

  useEffect(() => {
    if(memberPageNumber !== 1) {
      getGroupMember();
    }
  }, [dispatch, memberPageNumber]);

  const observer = useRef()
  const lastMemberBookElementRef = useCallback(node => {
    try {
      if(detailsMemLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(memberPageNumber < detailsMemPageInfo.total_pages) {
            setMemberPageNumber(memberPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'lastGroupMemberElementRef'})
    }
  }, [detailsMemLoading])

  const transferOwnership = (identifier) => {

  }

  const [showPromoteAdmin, setShowPromoteAdmin] = useState(false);
  const [promoteAdminData, setPromoteAdminData] = useState({});
  const promoteGroupAdmin = (data) => {
    setPromoteAdminData(data);
  }

  useEffect(() => {
    try {
      if(promoteAdminData && promoteAdminData.name) {
        setShowPromoteAdmin(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'promoteAdminData'})
    }
  }, [promoteAdminData]);

  const hidePromoteAdmin = (value) => {
    setShowPromoteAdmin(value);
    setPromoteAdminData({});
  }

  const demoteToMember = (identifier) => {
    const data = {
      id: adminGroupDetails.identifier,
      member: identifier,
      role: 'member'
    }
    dispatch(promoteUserRoleRequest(data));
  }

  useEffect(() => {
    try {
      if(changeRoleSuccess) {
        const {identifier, role} = changeRoleSuccess;
        const updatedList = detailsMemList.map(data => data.identifier === identifier ? {...data, role} : data);
        dispatch(detailsGroupMemberListUpdate(updatedList));
        props.hidePromoteAdmin(false)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:changeRoleSuccess'})
    }
  }, [changeRoleSuccess]);

  const [showRemoveGroup, setShowRemoveGroup] = useState(false);
  const [removeUserData, setRemoveUserData] = useState({});
  const removeFromGroup = (data) => {
    setRemoveUserData(data);
  }

  useEffect(() => {
    try {
      if(removeUserData && removeUserData.name) {
        setShowRemoveGroup(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'removeUserData'})
    }
  }, [removeUserData]);

  const hideRemoveGroup = (value) => {
    setShowRemoveGroup(value);
    setRemoveUserData({});
  }

  const inviteMember = (identifier, resend = false, reset = false) => {
    const payload = {
      group_id: adminGroupDetails.identifier,
      identifier
    }
    dispatch(inviteGroupMemberRequest(payload));
  }

  const cancelMemberInvitation = identifier => {
    const payload = {
      group_id: adminGroupDetails.identifier,
      identifier
    }
    dispatch(cancleInviteGroupMemberRequest(payload));
  }

  /* useEffect(() => {
    try {
      if(canInviteGrpMemberFlag === 1) {
        const {identifier} = canInviteGrpMemberSuccess;
        const updatedList = detailsMemList.filter(data => data.identifier !== identifier && data);
        dispatch(detailsGroupMemberListUpdate(updatedList));
      } 
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteMemList'})
    }
  }, [canInviteGrpMemberFlag]) */

  return (
    <div>
      <PromoteToAdmin
        showPromoteAdmin={showPromoteAdmin}
        promoteAdminData={promoteAdminData}
        hidePromoteAdmin={hidePromoteAdmin}
      />
      <RemoveFromGroup
        showRemoveGroup={showRemoveGroup}
        removeUserData={removeUserData}
        hideRemoveGroup={hideRemoveGroup}
      />
      <div className="member-list-header pl-0 mt-2">
        <h5>{detailsMemPageInfo.total_entries} Member{detailsMemPageInfo.total_entries > 1 ? 's' : ''}</h5>
      </div>
      <div className="member-list-data">
        {detailsMemList.length > 0 && detailsMemList.map((member, key) => <div className="member-info" key={key} ref={lastMemberBookElementRef}>
          <SingleProfile name={member.name} avatarUrl={member.avatar_url} userId={member.identifier} />

          <div className="communication details-member">
            {member.role === 'owner' &&
              <div className="user-designation"><span className="badge badge-info">Group Owner</span></div>
            }
            {member.role === 'admin' &&
              <div className="user-designation"><span className="badge badge-warning">Group Admin</span></div>
            }
            {member.status === 'invited' &&
              <Dropdown className="invited-dropdown">
                <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                  Invited {ChevronDownIcon}
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight="true" className="option-menu">
                  <Dropdown.Item eventKey="1" onClick={() => inviteMember(member.identifier, true)}
                    className="img-resend-invite">Resend Invite</Dropdown.Item>
                  <Dropdown.Item eventKey="2" onClick={() => cancelMemberInvitation(member.identifier)}
                    className="img-close clr-red">Cancel Invite</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            }
            {member.status !== 'invited' && (userRole === 'owner' || userRole === 'admin') &&
              <Dropdown>
                <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
                  {KebabIcon}
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight="true" className="option-menu">
                  {(member.role === 'owner' || member.role === 'admin') && member.role === 'owner' &&
                    <Dropdown.Item onClick={() => props.showAssignGroupOwner()}
                      className="img-transfer-ownership clr-blue">Transfer Ownership</Dropdown.Item>
                  }
                  {(userRole === 'owner' || userRole === 'admin') && member.role === 'member' &&
                    <Dropdown.Item onClick={() => promoteGroupAdmin(member)}
                      className="img-promote-admin clr-yellow">Promote to Group Admin</Dropdown.Item>
                  }
                  {userRole === 'owner' && member.role === 'admin' &&
                    <Dropdown.Item onClick={() => demoteToMember(member.identifier)}
                      className="img-demote-member">Demote to Member</Dropdown.Item>
                  }
                  {member.role !== 'owner' &&
                    <Dropdown.Item onClick={() => removeFromGroup(member)} className="img-exit clr-red">Remove From Group</Dropdown.Item>
                  }
                </Dropdown.Menu>
              </Dropdown>
            }
          </div>
        </div>
        )}
        {!detailsMemLoading && detailsMemList.length === 0 &&
          <div className="member-info">
            <div className="member">
              <div className="member-data m-4">
                <a href="#">No member join this group!</a>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
MemberList.propTypes = {
  searchText: PropTypes.string,
  hideDetailsModal: PropTypes.func,
  showAssignGroupOwner: PropTypes.func,
};
MemberList.defaultProps = {
  searchText: '',
};
export default MemberList;
