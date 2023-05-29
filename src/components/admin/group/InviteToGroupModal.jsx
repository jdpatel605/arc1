import React, {useState, useEffect, useRef, useCallback} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {inviteToGroupMemberListRequest, inviteToGroupMemberListUpdate, inviteGroupMemberRequest, cancleInviteGroupMemberRequest} from '../../../store/actions';
import Dropdown from 'react-bootstrap/Dropdown';
import {ChevronUpIcon, CloseProfileIcon, ChevronDownIcon} from "../../../utils/Svg";
import SingleProfile from "../../profile/SingleProfile";
import InviteModelMessage from './../../common/InviteModelMessage';
import {Logger} from './../../../utils/logger';
const fileLocation = "src\\components\\admin\\group\\InviteToGroupModal.jsx";

const InviteToGroupModal = props => {
  const dispatch = useDispatch();
  const adminName = localStorage.getItem("admin_name");
  const [currentIdentifier, setIdentifier] = useState("");
  const [searchText, setSearch] = useState("");
  const [inviteToEmailPhone, setInviteToEmailPhone] = useState(false);
  const {inviteMemLoading, inviteMemList, inviteMemPageInfo, inviteGrpMemberFlag, inviteGrpMemberSuccess, canInviteGrpMemberFlag, canInviteGrpMemberSuccess} = useSelector(({adminGroup}) => adminGroup);
  const [pageNumber, setPageNumber] = useState(1);

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => Number.isInteger(parseInt(phone)) && phone.length >= 12;

  // Reset invitation when modal is loaded
  useEffect(() => {
    // dispatch(resetMemberInvitation());
    if(props.showModal === true) {
      searchMembers('');
    }
  }, [props.showModal]);

  // Hook for member list
  useEffect(() => {
    try {
      if(inviteMemList.length === 0) {
        if(searchText.trim() !== '') {
          const isEmail = validateEmail(searchText);
          const isPhone = validatePhone(searchText);
          if(isEmail === true || isPhone === true) {
            setInviteToEmailPhone(true);
          } else {
            setInviteToEmailPhone(false);
          }
        }
      } else {
        setInviteToEmailPhone(false);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteMemList'})
    }
  }, [searchText, inviteMemList])

  const searchMembers = (search) => {
    setSearch(search);
    setPageNumber(1);
    const payload = {organization_id: props.organization_id, group_id: props.group_id, page: 1, search}
    dispatch(inviteToGroupMemberListRequest(payload));
  }

  const observer = useRef()
  const lastInviteMemberElementRef = useCallback(node => {
    try {
      if(inviteMemLoading) {
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
  }, [inviteMemLoading])

  // Set next page
  const nextPageMembers = () => {
    if(pageNumber < inviteMemPageInfo.total_pages) {
      setPageNumber(pageNumber + 1);
    }
  }

  useEffect(() => {
    if(pageNumber > 1) {
      const payload = {organization_id: props.organization_id, group_id: props.group_id, page: pageNumber, search: searchText}
      dispatch(inviteToGroupMemberListRequest(payload));
    }
  }, [pageNumber]);

  const inviteMember = (identifier, resend = false, reset = false) => {
    const payload = {
      group_id: props.group_id,
      identifier
    }
    setIdentifier(identifier);
    dispatch(inviteGroupMemberRequest(payload));
    if(reset === true) {
      setSearch("");
      setInviteToEmailPhone(false);
    }
  }

  useEffect(() => {
    try {
      if(inviteGrpMemberFlag === 1) {
        const {identifier, subscription_status} = inviteGrpMemberSuccess;
        const updatedList = inviteMemList.map(data => data.identifier === identifier ? {...data, subscription_status} : data);
        dispatch(inviteToGroupMemberListUpdate(updatedList));
      } 
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteMemList'})
    }
  }, [inviteGrpMemberFlag])

  const cancelMemberInvitation = identifier => {
    const payload = {
      group_id: props.group_id,
      identifier
    }
    dispatch(cancleInviteGroupMemberRequest(payload));
    setIdentifier(identifier);
  }

  useEffect(() => {
    try {
      if(canInviteGrpMemberFlag === 1) {
        const {identifier, subscription_status} = canInviteGrpMemberSuccess;
        const updatedList = inviteMemList.map(data => data.identifier === identifier ? {...data, subscription_status} : data);
        dispatch(inviteToGroupMemberListUpdate(updatedList));
      } 
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:inviteMemList'})
    }
  }, [canInviteGrpMemberFlag])

  const [copiedText, setCopiedText] = useState("Copy");
  const onCopy = identifier => {
    setCopiedText('Copied!');
  }

  const resetModal = () => {
    setIdentifier("");
    setSearch("");
    setInviteToEmailPhone(false);
    setPageNumber(1);
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
          <input type="text" value={searchText} onChange={(e) => searchMembers(e.target.value)} className="txt-search" id="txt-search" placeholder=" Search for users " />
          {inviteToEmailPhone && <a href="#/" onClick={() => inviteMember(searchText, false, true)} className="btn btn-round btn-green btn-invited text-white">+ Invite</a>}
        </div>

        {/* Loop through members */}
        {inviteMemList && inviteMemList.length > 0 &&
        <>
          <div className="invite-heading">
            <h4>{adminName}</h4>
            <p>({inviteMemPageInfo?.total_entries} Members) {ChevronUpIcon}</p>
          </div>
          <div className="member-list-data admin-panel">
            {inviteMemList.map((data, key) =>
              <div key={key} className="member-info admin-part" ref={lastInviteMemberElementRef}>
                <SingleProfile name={data.name} avatarUrl={data.avatar_url} userId={data.identifier} detail={adminName} from='admin'/>
                <div className="communication">
                  {data.subscription_status === 'invited' &&
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
                  {data.subscription_status === 'member' &&
                    <span className="btn btn-round btn-gray btn-invited">Member</span>
                  }
                  {data.subscription_status !== 'member' && data.subscription_status !== 'invited' &&
                    <span onClick={() => inviteMember(data.identifier)} className="btn btn-round btn-green btn-invited">+ Invite</span>
                  }
                </div>
              </div>
            )
            }
          </div>
        </>
        }
        {inviteMemList && inviteMemList.length == 0 &&
        <>
          <div className="invite-heading">
            <h4>{adminName}</h4>
            <p>(0 Members) {ChevronUpIcon}</p>
          </div>
          {!inviteMemLoading &&
          <div className="member-list-data admin-panel">
            <div className="member-info admin-part">
              <p className="m-0 text-center w-100">No member found</p>
            </div>
          </div>
          }
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
  group_id: PropTypes.string,
  onHideModal: PropTypes.func,
};
InviteToGroupModal.defaultProps = {
  showModal: false,
  organization_id: '',
  group_id: '',
};
export default InviteToGroupModal;
