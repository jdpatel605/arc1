import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import PropTypes from 'prop-types';
import Image from '../../common/Image';
import TruncationText from "../../common/TruncationText";
import Dropdown from 'react-bootstrap/Dropdown'
import {ChevronDownIcon, ChevronUpIcon, KebabIcon} from "../../../utils/Svg";
import GroupDetailsModal from './GroupDetailsModal';
import InviteToGroupModal from './InviteToGroupModal';
import AssignToOwnerModal from './AssignToOwnerModal';

import {adminGroupListRequest, adminGroupListUpdate, changeVisibilityRequest, deleteAdminGroupRequest, adminGroupDetailsRequest} from '../../../store/actions';

import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\group\\contentAllGroup.jsx";

const ContentAllGroup = props => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem("admin_identifier");
  const {loadingAdmGrp, admGrpListloading, adminGroupList, adminGroupPageInfo, visibilitySuccess, visibilityError, deleteGroupSuccess, deleteGroupError, adminGroupDetails, groupCreateFlag} = useSelector(({adminGroup}) => adminGroup);
  const [componentLoad, setComponentLoad] = useState(false);
  const [grpPageNumber, setGrpPageNumber] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderBy, setOrderBy] = useState('name');
  const [orderType, setOrderType] = useState('asc');

  const filtterByColumn = (column, type) => {
    setGrpPageNumber(1);
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

  const getAdminGroupData = () => {
    const data = {organizationId: organizationId, search: props.search, page: grpPageNumber, order: orderBy, dir: orderType}
    dispatch(adminGroupListRequest(data));
  }

  // Get serach reacord from ALL API
  useEffect(() => {
    setGrpPageNumber(1);
    if(props.search !== '') {
      getAdminGroupData();
    }
    else {
      getAdminGroupData();
    }
  }, [props.search])

  useEffect(() => {
    if(componentLoad && orderBy !== '' && orderType !== '') {
      getAdminGroupData();
    }
  }, [orderBy, orderType])

  useEffect(() => {
    // Success
    try {
      if(groupCreateFlag === 1) {
        setGrpPageNumber(1);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:groupCreateFlag'})
    }
  }, [groupCreateFlag]);

  useEffect(() => {
    try {
      setComponentLoad(true);
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:adminGroupList'})
    }
  }, [adminGroupList])

  const observer = useRef()
  const lastGroupElementRef = useCallback(node => {
    try {
      if(admGrpListloading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(grpPageNumber < adminGroupPageInfo.total_pages) {
            setGrpPageNumber(grpPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'discoverLastGrouplementRef'})
    }
  }, [admGrpListloading])

  useEffect(() => {
    try {
      if(componentLoad && grpPageNumber !== 1) {
        setGrpPageNumber(grpPageNumber);
        getAdminGroupData();
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:grpPageNumber'})
    }
  }, [grpPageNumber]);

  const openGroup = (identifier) => {
    if(!loadingAdmGrp) {
      dispatch(adminGroupDetailsRequest(identifier));
    }
  }

  const hideDetailsModal = (value) => {
    setShowDetailsModal(value);
  }

  useEffect(() => {
    try {
      if(!showDetailsModal && adminGroupDetails && adminGroupDetails.name) {
        setShowDetailsModal(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:adminGroupDetails'})
    }
  }, [adminGroupDetails]);


  const changeVisiblity = (identifier, visibility) => {
    const data = {visibility: visibility}
    dispatch(changeVisibilityRequest({
      id: identifier,
      data
    }));
  }

  useEffect(() => {
    try {
      if(visibilitySuccess) {
        const {identifier, visibility} = visibilitySuccess;
        const updatedList = adminGroupList.map(data => data.identifier === identifier ? {...data, visibility} : data);
        dispatch(adminGroupListUpdate(updatedList));
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:visibilitySuccess'})
    }
  }, [visibilitySuccess])

  useEffect(() => {
    try {
      console.log(visibilityError);
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:visibilityError'})
    }
  }, [visibilityError]);

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

  const removeGroup = (identifier) => {
    dispatch(deleteAdminGroupRequest(identifier));
  }

  const [inviteBoxShow, setInviteBoxShow] = useState(false);
  const [groupId, setGroupId] = useState('');
  const showInviteBox = (identifier) => {
    setGroupId(identifier);
    setInviteBoxShow(true);
  }

  const hideInviteBox = (event) => {
    setGroupId('');
    setInviteBoxShow(false);
  }

  useEffect(() => {
    try {
      if(deleteGroupSuccess) {
        const {identifier} = deleteGroupSuccess;
        const updatedList = adminGroupList.filter(data => data.identifier !== identifier && data);
        dispatch(adminGroupListUpdate(updatedList));
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:deleteGroupSuccess'})
    }
  }, [deleteGroupSuccess])

  useEffect(() => {
    try {
      if(deleteGroupError && deleteGroupError.status) {
        if(deleteGroupError.message.message) {
          alert.error(deleteGroupError.message.message);
        }
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:deleteGroupError'})
    }
  }, [deleteGroupError]);

  const editGroup = (gID) => {
    props.editGroup(gID);
  }
  
  const updateOwnerName = (res) => {
        const user = res.user;
        const updatedList = adminGroupList.map(data => data.identifier === res.group_id ? {...data, owner: user} : data);
        dispatch(adminGroupListUpdate(updatedList));
  }
  
  return (
    <div className="grid-view mt-2 grid-table-view">
      <div className="grid-title-list bg-black-900">
        <div className='row'>
          <div className="grid-person-name table-header text-left" onClick={() => filtterByColumn('name', orderType)}> <p> Group  {(orderBy === 'name' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon} </p></div>
          <div className="grid-person-owner table-header" onClick={() => filtterByColumn('owner_name', orderType)}> <p> Owner {(orderBy === 'owner_name' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon} </p> </div>
          <div className="grid-person-member table-header" > <p> Members </p> </div>
          <div className="grid-person-events table-header" > <p> Events </p> </div>
          <div className="grid-event-privacy table-header" onClick={() => filtterByColumn('visibility', orderType)}> <p> Privacy {(orderBy === 'visibility' && orderType === 'asc') ? ChevronUpIcon : ChevronDownIcon} </p> </div>
          <div className="grid-event-communication table-header"> <p>  </p> </div>
        </div>
      </div>
      {componentLoad && adminGroupList.length > 0 &&
        <>
          <div className="grid-person-list green-border">
            {adminGroupList.map((item, key) => {
              return (
                <div className="row grid-person-data bg-gray" key={key} ref={lastGroupElementRef}>
                  <div className="grid-person-name both-center">
                    <div className="person-data align-items-center" onClick={() => openGroup(item.identifier)}>
                      <div className="person-info">
                        <div className="person-img">
                          <div className="img-round img-60">
                            <Image src={item.avatar_url} altText="Admin Group" />
                          </div>
                        </div>
                        <div className="person">
                          <h4>{item.name ? <TruncationText content={item.name} /> : '-'}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid-person-owner both-center">
                    <p>{item?.owner?.name ? item?.owner?.name : '-'}</p>
                  </div>
                  <div className="grid-person-member both-center">
                    <p>{item?.member_count ? item.member_count : '0'}</p>
                  </div>
                  <div className="grid-person-events both-center">
                    <p>{item?.event_count ? item.event_count : '0'}  Scheduled</p>
                  </div>
                  <div className="grid-event-privacy both-center">
                    <div className="member-info privacy-box">
                      <div className="communication">
                        <Dropdown>
                          <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                            {item.visibility === 'private' ? 'Private' : item.visibility === 'public' ? 'Public' : 'Org Public'} {ChevronDownIcon}
                          </Dropdown.Toggle>
                          <Dropdown.Menu alignRight="true" className="option-menu">
                            {(item.visibility === 'public' || item.visibility === 'organization_public') &&
                              <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item.identifier, 'private')}
                                className="img-private">Make Private</Dropdown.Item>
                            }
                            {(item.visibility === 'private' || item.visibility === 'public') &&
                              <Dropdown.Item eventKey="1" onClick={() => changeVisiblity(item.identifier, 'organization_public')}
                                className="img-public">Make Public to Organization</Dropdown.Item>
                            }
                            {(item.visibility === 'private' || item.visibility === 'organization_public') &&
                              <Dropdown.Item eventKey="2" onClick={() => changeVisiblity(item.identifier, 'public')}
                                className="img-public">Make Public</Dropdown.Item>
                            }
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  <div className="grid-event-communication both-center">
                    <div className="communication">
                      <Dropdown>
                        <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
                          {KebabIcon}
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight="true" className="option-menu">
                          <Dropdown.Item eventKey="2" onClick={() => showAssignGroupOwner(item)}
                            className="img-transfer-ownership clr-blue">Transfer Ownership</Dropdown.Item>
                          <Dropdown.Item eventKey="1" onClick={() => showInviteBox(item.identifier)}
                            className="img-resend-invite">Invite Member</Dropdown.Item>
                          <Dropdown.Item onClick={() => removeGroup(item.identifier)} className="img-exit clr-red">Remove Group</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <GroupDetailsModal
            showModal={showDetailsModal}
            hideDetailsModal={hideDetailsModal}
            showInviteBox={showInviteBox}
            showAssignGroupOwner={showAssignGroupOwner}
            editGroup={editGroup}
          />
          <InviteToGroupModal
            showModal={inviteBoxShow}
            organization_id={organizationId}
            group_id={groupId}
            onHideModal={hideInviteBox}
          />
          <AssignToOwnerModal
            showModal={assignModalShow}
            groupData={assignOwnerGroup}
            onHideModal={hideAssignGroupOwner}
            updateOnParent={true}
            updateOnParentData={updateOwnerName}
          />
        </>
      }
      {!admGrpListloading && adminGroupList.length === 0 &&
        <div className="row grid-person-data bg-gray">
          <div className="col-lg-12 both-center pt-2 pb-2 text-center">
            <div colSpan="100%">
              <p>No groups found.</p>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
ContentAllGroup.propTypes = {
  search: PropTypes.string,
  editGroup: PropTypes.func,
};
ContentAllGroup.defaultProps = {
  search: '',
};
export default ContentAllGroup;
