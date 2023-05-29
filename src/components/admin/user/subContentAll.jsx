import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import {useAlert} from 'react-alert'
import Image from '../../common/Image';
import useInfiniteScroll from "../../common/useInfiniteScroll";
import {
  getAllUsersRequest, getAdminUserDetailRequest, updateUserList, updateUserDetail, resetAdminRemoveUser,
  resetAdminChangeRole, kickUserFromGroupReset, promoteUserRoleReset, getOrganizationDetailSuccess,
  changeAdminUserRoleRequest, removeUserFromOrgRequest
} from '../../../store/actions';
import {LockIcon, ChevronRightIcon, PublicGroupIcon, ChevronDownIcon, ChevronUpIcon} from "../../../utils/Svg";
import SingleProfile from "../../profile/SingleProfile";
import TruncationText from "../../common/TruncationText";
import {Helper} from './../../../utils/helper';
import UserDetailsModal from './UserDetailsModal';
import EmptyUser from './EmptyUser';
import AssociatedGroups from './associatedGroups';
import UserActions from './userActions';
import SuccessModal from './SuccessModal';
import OwnershipModal from './OwnershipModal';
import InviteToGroupModal from './InviteToGroupModal';
import ConfirmModal from './ConfirmModal';
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\user\\subContentAll.jsx";
const Str = require('string');

const SubContentAll = props => {
  const dispatch = useDispatch();
  const {listLoading, list, listPageInfo, adminUserDetails, userDetailLoading, changeRoleDetail, changeRoleFlag, removeUserFlag,
    removeUserData, orgDetail} = useSelector(({user}) => user);
  const {kickUserSuccess, kickUserFail, changeRoleSuccess, changeRoleError} = useSelector(({adminGroup}) => adminGroup);
  const [componentLoad, setComponentLoad] = useState(false);
  const [ListPageNumber, setListPageNumber] = useState(1);
  const [orderType, setOrderType] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModalFlag, setSuccessModal] = useState(false);
  const [showInviteModalFlag, setInviteModal] = useState(false);
  const [inviteUser, setInviteUser] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [showOwnershipModalFlag, setShowOwnershipModal] = useState(false);
  const [currentOwnershipUser, setCurrentOwnershipUser] = useState({});
  const currentIdentifier = localStorage.getItem("identifier");
  const [showConfirmModalFlag, setConfirmModal] = useState(false);
  const [settings, setSettings] = useState({});
  const alert = useAlert()
  // Get serach record from ALL API
  useEffect(() => {
    if(props.search !== '') {
      setComponentLoad(false);
      setListPageNumber(1);
      const data = {search: props.search, page: 1, order: orderBy, dir: orderType}
      dispatch(getAllUsersRequest(data));
    }
    else {
      setComponentLoad(false);
      setListPageNumber(1);
      const data = {page: 1, order: orderBy, dir: orderType}
      dispatch(getAllUsersRequest(data));
    }
  }, [props.search, orderBy, orderType])
  //  }, [])

  useEffect(() => {
    try {
      if(list) {
        setComponentLoad(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:list'})
    }
  }, [list])

  const observer = useRef()
  const lastListElementRef = useCallback(node => {
    try {
      if(listLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(ListPageNumber < listPageInfo.total_pages) {
            setListPageNumber(ListPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'lastListElementRef'})
    }
  }, [listLoading])

  useEffect(() => {
    if(componentLoad) {
      if(props.search !== '') {
        const data = {search: props.search, page: ListPageNumber, order: orderBy, dir: orderType}
        dispatch(getAllUsersRequest(data));
      }
      else {
        const data = {page: ListPageNumber, order: orderBy, dir: orderType}
        dispatch(getAllUsersRequest(data));
      }
    }
  }, [ListPageNumber]);

  const openUser = (identifier, event) => {
    const tag = event?.target?.tagName
    const className = event?.target?.className
    //        console.log('className', className)
    if(tag === 'svg' || tag === 'path' || className.includes('dropdown-toggle')
      || className.includes('dropdown-item')) { // || className.includes('communication')
      return
    }
    if(userDetailLoading) {
      return
    }
    dispatch(getAdminUserDetailRequest({user_id: identifier}));
  }

  const hideDetailsModal = (value) => {
    setShowDetailsModal(value);
  }

  useEffect(() => {
    try {
      if(!showDetailsModal && adminUserDetails && adminUserDetails.status) {
        setShowDetailsModal(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:adminUserDetails'})
    }
  }, [adminUserDetails]);

  useEffect(() => {
    if(changeRoleFlag === 1) {
      let updatedList = [];
      const newRole = changeRoleDetail.role
      updatedList = list.map(data => data.identifier === changeRoleDetail.user_id ? {...data, role: newRole} : data);
      dispatch(updateUserList(updatedList));

      const detail = adminUserDetails
      if(detail) {
        detail.role = newRole
        dispatch(updateUserDetail(detail));
      }
      showSuccessModal('You have successfully changed user role.')
      dispatch(resetAdminChangeRole())
    }

    if(changeRoleFlag === 2) {
      if(changeRoleDetail.type && changeRoleDetail.type === "forbidden") {
        alert.error('You are not allowed to change this user role.')
      }
      else if(changeRoleDetail.message) {
        alert.error(changeRoleDetail.message)
      }
      else {
        alert.error('Something went wrong while changing user role.')
      }

      dispatch(resetAdminChangeRole())
    }
  }, [changeRoleDetail])

  useEffect(() => {
    if(removeUserFlag === 1) {
      showSuccessModal('You have successfully removed a user.')
      let updatedList = [];
      updatedList = list.filter(data => data.identifier !== removeUserData.user_id);
      dispatch(updateUserList(updatedList));
      const detail = adminUserDetails
      if(detail) {
        setShowDetailsModal(false);
      }
      dispatch(resetAdminRemoveUser())

      const org = orgDetail
      org.seats_occupied = org.seats_occupied - 1
      dispatch(getOrganizationDetailSuccess(org))
    }
    if(removeUserFlag === 2) {
      if(removeUserData.message) {
        alert.error(removeUserData.message)
      }
      dispatch(resetAdminRemoveUser())
    }
  }, [removeUserFlag])

  useEffect(() => {
    try {
      console.log('kickUserSuccess', kickUserSuccess)
      if(kickUserSuccess.identifier) {
        const {identifier, group_id} = kickUserSuccess;
        const detail = adminUserDetails
        if(detail) {
          let groups = adminUserDetails.groups
          let updatedList = detail;
          updatedList.groups = groups.filter(data => data.identifier !== group_id);
          dispatch(updateUserDetail(updatedList));
        }
        let updatedList = [];
        updatedList = list.map(data => data.identifier === identifier ? {...data, group_count: data.group_count - 1} : data);
        dispatch(updateUserList(updatedList));
        showSuccessModal('You have successfully removed a user.')
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:kickUserSuccess'})
    }
  }, [kickUserSuccess]);

  useEffect(() => {
    try {
      console.log('changeRoleSuccess', changeRoleSuccess)
      if(changeRoleSuccess.identifier) {
        const {identifier, group_id} = changeRoleSuccess;
        const detail = adminUserDetails
        if(detail) {
          let groups = adminUserDetails.groups
          let updatedList = detail;
          const newRole = changeRoleSuccess.role
          updatedList.groups = groups.map(data => data.identifier === changeRoleSuccess.group_id ? {...data, role: newRole} : data);
          dispatch(updateUserDetail(updatedList));
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:changeRoleSuccess'})
    }
  }, [changeRoleSuccess]);

  useEffect(() => {
    try {
      if(changeRoleError && changeRoleError.status) {
        if(changeRoleError.message && changeRoleError.message.message) {
          alert.error(changeRoleError.message.message)
        } else {
          alert.error('Something went wrong while changing user role for group.')
        }
        dispatch(promoteUserRoleReset({}))
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:kickUserFail'})
    }
  }, [changeRoleError]);

  useEffect(() => {
    try {
      if(kickUserFail && kickUserFail.status) {
        console.log('kickUserFail', kickUserFail)
        if(kickUserFail.message && kickUserFail.message.message) {
          alert.error(kickUserFail.message.message)
        } else {
          alert.error('Something went wrong while removing user from group.')
        }
        dispatch(kickUserFromGroupReset({}))
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:kickUserFail'})
    }
  }, [kickUserFail]);

  const showSuccessModal = (msg) => {
    setSuccessMsg(msg)
    setSuccessModal(true)
  }
  const hideSuccessModal = () => {
    setSuccessModal(false)
  }

  const showInviteModal = (user) => {
    setInviteUser(user)
    setInviteModal(true)
  }
  const hideInviteModal = () => {
    setInviteModal(false)
  }

  const showOwnershipModal = (user) => {
    setCurrentOwnershipUser(user)
    setShowOwnershipModal(true)
  }
  const hideOwnershipModal = () => {
    setShowOwnershipModal(false)
  }

  const filtterByColumn = (column, type) => {
    setListPageNumber(1);
    if(orderBy === column && type === 'asc') {
      setOrderType('desc');
    }
    else if(orderBy === column && type === 'desc') {
      setOrderType('asc');
    }
    else {
      setOrderType('asc');
    }
    setOrderBy(column);
  }

  const getEmailLengthLimit = (text) => {
    if(text.length > 24) {
      return 22
    }
    return 25
  }

  const settingsList = {
    owner: {
      title: 'Promote to Org Owner?',
      msg: 'This action is permanet and will restrict your current account access to Org Admin. Promote to Org Owner?',
      okText: 'Promote',
      btnClass: 'btn-green'
    },
    admin: {
      title: 'Promote to Org Admin?',
      msg: 'An Org Admin will be able to edit all organization Users, Groups, and Events. Promote to Org Admin?',
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
      title: 'Remove from Organization?',
      msg: 'Removing a user from an organization will remove them from all groups and events as well.',
      okText: 'Remove',
      btnClass: 'btn-red'
    },
  }
  const showConfirmModal = (type, user, action) => {
    if(type === 'remove') {
      if(user.role === 'owner') {
        alert.error('To remove a Org Owner you must first transfer ownership of the organization to another member.')
        return false
      }
    }
    if(type === 'owner') {
      props.owenrshipModal()
      return false
    }
    const set = settingsList[type]
    set.user = user
    set.user.actionType = type
    set.user.actionData = action
    setSettings(set)
    setConfirmModal(true)
  }
  const hideConfirmModal = () => {
    setConfirmModal(false)
  }
  const confirmCallBack = (user) => {
    console.log(user)
    const action = user.actionData
    if(action.type === 'role') {
      changeUserRole(user, action.role)
    } else {
      removeUserFromOrg(user)
    }
  }
  const changeUserRole = (user, role) => {
    dispatch(changeAdminUserRoleRequest({user_id: user.identifier, role: role}))
  }
  const removeUserFromOrg = (user) => {
    dispatch(removeUserFromOrgRequest({user_id: user.identifier}))
  }

  return (

    <div className="grid-view mt-2 grid-table-view">

      <SuccessModal
        showModal={showSuccessModalFlag}
        onHideModal={hideSuccessModal}
        msg={successMsg}
      />

      <ConfirmModal
        showModal={showConfirmModalFlag}
        onHideModal={hideConfirmModal}
        onOkModal={confirmCallBack}
        settings={settings}
      />

      <InviteToGroupModal
        showModal={showInviteModalFlag}
        inviteUser={inviteUser}
        onHideModal={hideInviteModal}
      />

      <OwnershipModal
        showModal={showOwnershipModalFlag}
        onHideModal={hideOwnershipModal}
        currentOwnerUser={currentOwnershipUser}
      />
      <div className="grid-title-list bg-black-900">
        <div className='row'>
          <div className="grid-person-name table-header"> <p onClick={() => filtterByColumn('name', orderType)} > Member  {(orderBy === 'name' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon} </p></div>
          <div className="gril-person-email table-header"> <p onClick={() => filtterByColumn('email', orderType)}> Email {(orderBy === 'email' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon} </p> </div>
          <div className="grid-user-roll table-header"> <p onClick={() => filtterByColumn('role', orderType)}> User Role {(orderBy === 'role' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon} </p> </div>
          <div className="grid-user-group table-header"> <p > Groups </p> </div>
          <div className="grid-user-status table-header"> <p onClick={() => filtterByColumn('status', orderType)}> Status {(orderBy === 'status' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon} </p> </div>
          <div className="grid-event-communication table-header"> </div>
        </div>
      </div>
      {componentLoad && list.length > 0 &&
        <div className="grid-person-list green-border">
          {list.map((item, key) => {
            return (
              <div className="row grid-person-data bg-gray" key={key} ref={lastListElementRef} onClick={(e) => openUser(item.identifier, e)}>
                <div className="grid-person-name both-center">
                  <div className="person-data align-items-center">
                    <div className="person-info">
                      <div className="person-img">
                        <div className="img-round img-60">
                            { item.avatar_url &&
                            <Image src={item.avatar_url} altText="User" />
                            }
                            { !item.avatar_url &&
                                    <a href="#" className="clr-white">{ item.initials }</a>
                            }
                        </div>
                      </div>
                      <div className="person">
                        <h4>{item.name ? <TruncationText content={item.name} /> : '-'}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="gril-person-email both-center" >
                  <p title={item.email}>{item.email ? <TruncationText content={item.email} limit={getEmailLengthLimit(item.email)} /> : '-'}</p>
                </div>
                <div className="grid-user-roll both-center" onClick={() => openUser(item.identifier)}>
                  {item.role === 'owner' &&
                    <a className="btn btn-round btn-blue" href="#"> Org Owner </a>
                  }
                  {item.role === 'admin' &&
                    <a className="btn btn-round btn-yellow" href="#"> Org Admin </a>
                  }
                  {item.role === 'member' &&
                    <a className="btn btn-round btn-black" href="#"> Member </a>
                  }
                  {item.role === 'user' &&
                    <a className="btn btn-round btn-black" href="#"> Member </a>
                  }
                </div>
                <div className="grid-user-group both-center" >
                  <p>{item.group_count}</p>
                </div>
                <div className="grid-user-status both-center" >
                  <p>{Str('active').capitalize().s}</p>
                </div>
                <div className="grid-event-communication both-center">
                  <UserActions user={item} owenrshipModal={showOwnershipModal} inviteModal={showInviteModal} showConfirmModal={showConfirmModal} extraClasses={`btn more-btn btn-click`} />
                </div>
              </div>
            )
          })
          }
          <UserDetailsModal
            showModal={showDetailsModal}
            hideDetailsModal={hideDetailsModal}
            owenrshipModal={showOwnershipModal}
            inviteModal={showInviteModal}
            showConfirmModal={showConfirmModal}
          />
        </div>
      }



      {componentLoad && !listLoading && props.search !== '' && list.length === 0 &&
        <EmptyUser />
      }
    </div>
  )
}
SubContentAll.propTypes = {
  search: PropTypes.string,
};
SubContentAll.defaultProps = {
  search: '',
};
export default SubContentAll;
