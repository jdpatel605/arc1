import React, {useState, useEffect, useRef, useCallback} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import { getAllInvitGroupRequest, updateAllInvitGroupUser, inviteGroupMemberRequest, cancleInviteGroupMemberRequest, resetAllInvitGroupUser } from '../../../store/actions';
import Dropdown from 'react-bootstrap/Dropdown';
import {ChevronUpIcon, CloseProfileIcon, ChevronDownIcon} from "../../../utils/Svg";
import SingleProfile from "../../profile/SingleProfile";
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\user\\InviteToGroupModal.jsx";

const InviteToGroupModal = props => {
  const dispatch = useDispatch();
  const [currentIdentifier, setIdentifier] = useState("");
  const [searchText, setSearch] = useState("");
  const { ownerGroupListLoading, ownerGroupList, ownerGroupListPageInfo, orgDetail } = useSelector(({user}) => user);
  const { inviteGrpMemberFlag, inviteGrpMemberSuccess, canInviteGrpMemberFlag, canInviteGrpMemberSuccess} = useSelector(({adminGroup}) => adminGroup);
  const [pageNumber, setPageNumber] = useState(1);
  const [showError, setShowError] = useState(false);


  // Reset invitation when modal is loaded
  useEffect(() => {
    // dispatch(resetMemberInvitation());
    if(props.showModal === true) {
//      searchMembers('');
      dispatch(resetAllInvitGroupUser({}))
    }
  }, [props.showModal]);

  const searchMembers = (search) => {
    setSearch(search);
    
    if(search.length > 2){
        setPageNumber(1);
        setShowError(false)
        const payload = { page: 1, search, user_id: props.inviteUser.identifier}
        dispatch(getAllInvitGroupRequest(payload));
    }else if(!search){
        dispatch(resetAllInvitGroupUser({}))
        setShowError(false)
    }else{
        setShowError(true)
    }
  }

  const observer = useRef()
  const lastInviteMemberElementRef = useCallback(node => {
    try {
      if(ownerGroupListLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          nextPageMembers();
        }
      })
      if(observer.current && node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'lastInviteGroupMemberElementRef'})
    }
  }, [ownerGroupListLoading])

  // Set next page
  const nextPageMembers = () => {
    if(pageNumber < ownerGroupListPageInfo.total_pages) {
      setPageNumber(pageNumber + 1);
    }
  }
  
  useEffect(() => {
    try {
      if(inviteGrpMemberFlag === 1) {
        const {identifier, subscription_status, group_id} = inviteGrpMemberSuccess;
        const updatedList = ownerGroupList.map(data => data.identifier === group_id ? {...data, status: subscription_status} : data);
        dispatch(updateAllInvitGroupUser(updatedList));
      } 
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteMemList'})
    }
  }, [inviteGrpMemberFlag])
  
  useEffect(() => {
    try {
      if(canInviteGrpMemberFlag === 1) {
        const {identifier, status, group_id} = canInviteGrpMemberSuccess;
        const updatedList = ownerGroupList.map(data => data.identifier === group_id ? {...data, status} : data);
        dispatch(updateAllInvitGroupUser(updatedList));
      } 
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteMemList'})
    }
  }, [canInviteGrpMemberFlag])
  
  useEffect(() => {
    if(pageNumber > 1) {
      const payload = { page: pageNumber, search: searchText, user_id: props.inviteUser.identifier}
      dispatch(getAllInvitGroupRequest(payload));
    }
  }, [pageNumber]);

  const inviteMember = (identifier, resend = false, reset = false) => {
    const payload = {
      group_id: identifier,
      identifier: props.inviteUser.identifier
    }
    setIdentifier(props.inviteUser.identifier);
    dispatch(inviteGroupMemberRequest(payload));
    if(reset === true) {
      setSearch("");
    }
  }
  
  const cancelMemberInvitation = (identifier) => {
    const payload = {
      group_id: identifier,
      identifier: props.inviteUser.identifier
    }
    dispatch(cancleInviteGroupMemberRequest(payload));
  }

  const resetModal = () => {
    setIdentifier("");
    setSearch("");
    setPageNumber(1);
    dispatch(resetAllInvitGroupUser({}))
  }
 
  const errorStyle = {
    position: 'absolute',
    bottom: '-19px',
    left: '0',
    color: '#fe5444',
  }
 
  return (
    <Modal size="lg" show={props.showModal} backdrop="static" onExited={() => resetModal()} onHide={() => props.onHideModal(false)} aria-labelledby="example-modal-sizes-title-lg" className="invite-assign-modal">
      <Modal.Header>
        <div className="back-btn">
          <a href="#" onClick={() => props.onHideModal(false)}>
            {CloseProfileIcon}
          </a>
        </div>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Invite to Group
      </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-invite-group">
        <div className="full-search-box ui-widget ">
          <input type="text" value={searchText} onChange={(e) => searchMembers(e.target.value)} className="txt-search" id="txt-search" placeholder=" Search for groups " />
          { showError &&
          <span style={errorStyle}>Please enter atleast 3 characters to search</span>
          }
        </div>

        {/* Loop through members */}
        {ownerGroupList && ownerGroupList.length > 0 &&
        <>
          <div className="invite-heading">
            <h4>{orgDetail.name}</h4>
            <p>({ownerGroupListPageInfo?.total_entries} Groups) {ChevronUpIcon}</p>
          </div>
          <div className="member-list-data admin-panel">
            {ownerGroupList.map((data, key) =>
              <div key={key} className="member-info admin-part" ref={lastInviteMemberElementRef}>
                <SingleProfile name={data.name} avatarUrl={data.avatar_url} from="admin" detail={`${data.member_count} Members`} userId={data.identifier} />
                <div className="communication">
                  {data.status === 'invited' &&
                    <Dropdown>
                      <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                        Invited
                        {ChevronDownIcon}
                      </Dropdown.Toggle>
                      <Dropdown.Menu alignRight="true" className="option-menu">
                        <Dropdown.Item eventKey="1" onClick={() => inviteMember(data.identifier, true)} className="img-resend-invite">Resend Invite</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={() => cancelMemberInvitation(data.identifier)} className="img-close clr-red">Cancel Invite</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                  {( data.status === 'member' || data.status === 'owner') &&
                    <span className="btn btn-round btn-gray btn-invited">Member</span>
                  }
                  {data.status !== 'member' && data.status !== 'invited' && data.status !== 'owner' &&
                    <span onClick={() => inviteMember(data.identifier)} className="btn btn-round btn-green btn-invited">+ Invite</span>
                  }
                </div>
              </div>
            )
            }
          </div>
        </>
        }
        {ownerGroupList && ownerGroupList.length == 0 &&
        <>
          <div className="invite-heading">
            <h4>{orgDetail.name}</h4>
            <p>(0 Groups) {ChevronUpIcon}</p>
          </div>
          <div className="member-list-data admin-panel">
            <div className="member-info admin-part">
              <p className="m-0 text-center w-100">No groups found</p>
            </div>
          </div>
        </>
        }
      </Modal.Body>
      <Modal.Footer className="admin-member-list-close">
        <button type="button" className={`btn btn-green md-box btn-medium`}
          onClick={() => props.onHideModal(false)} >Done </button>
      </Modal.Footer>
    </Modal>
  )
}
InviteToGroupModal.propTypes = {
  showModal: PropTypes.bool,
  organization_id: PropTypes.string,
  inviteUser: PropTypes.object,
  onHideModal: PropTypes.func,
};
InviteToGroupModal.defaultProps = {
  showModal: false,
  organization_id: '',
};
export default InviteToGroupModal;
