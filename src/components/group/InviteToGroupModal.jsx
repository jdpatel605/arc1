import React, {useState, useEffect, useRef, useCallback} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {searchMemberRequest, inviteMemberRequest, cancelMemberInvitationRequest, resetMemberInvitation, searchMemberFailed} from '../../store/actions/group';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from '../common/Image';
import {LogoWhiteIcon, ArrowBackIcon, ChevronDownIcon} from "../../utils/Svg";
import SingleProfile from "../profile/SingleProfile";
import InviteModelMessage from './../common/InviteModelMessage';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\group\\InviteToGroupModal.jsx";

const InviteToGroupModal = props => {
  const dispatch = useDispatch();
  const [currentIdentifier, setIdentifier] = useState("");
  const [searchText, setSearch] = useState("");
  const [loadingText, setLoadingText] = useState("Searching members");
  const [inviteToEmailPhone, setInviteToEmailPhone] = useState(false);
  const {memberLoading, membersList, refreshMemberList, groupMemberPageInfo} = useSelector(({group}) => group);
  const [pageNumber, setPageNumber] = useState(1);

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => Number.isInteger(parseInt(phone)) && phone.length >= 12;

  // Reset invitation when modal is loaded
  useEffect(() => {
    dispatch(resetMemberInvitation());
  }, [dispatch]);

  // Refresh Member list
  useEffect(() => {
    try {
      if(refreshMemberList === 1 && currentIdentifier !== '') {
        searchMembers(searchText);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:refreshMemberList'})
    }
  }, [refreshMemberList]);

  // Hook for member list
  useEffect(() => {
    try {
      if(membersList.length === 0) {
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
      Logger.error({fileLocation, message, trace: 'useEffect:membersList'})
    }
  }, [searchText, membersList])

  const searchMembers = (search) => {
    setSearch(search);
    setPageNumber(1);
    const payload = {organization_id: props.organization_id, group_id: props.group_id, page: 1, search}
    setLoadingText(loadingText);
    dispatch(searchMemberFailed({}));
    dispatch(searchMemberRequest(payload));
  }

  const observer = useRef()
  const lastInviteMemberElementRef = useCallback(node => {
    try {
      if(memberLoading) {
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
  }, [memberLoading])

  // Set next page
  const nextPageMembers = () => {
    if(pageNumber < groupMemberPageInfo.total_pages) {
      setPageNumber(pageNumber + 1);
    }
  }

  useEffect(() => {
    if(pageNumber > 1) {
      const payload = {organization_id: props.organization_id, group_id: props.group_id, page: pageNumber, search: searchText}
      dispatch(searchMemberRequest(payload));
    }
  }, [pageNumber]);

  const inviteMember = (identifier, resend = false, reset = false) => {
    const payload = {
      group_id: props.group_id,
      identifier
    }
    setIdentifier(identifier);
    if(resend === true) {
      setLoadingText("Resending invitation");
    } else {
      setLoadingText("Sending invitation");
    }
    dispatch(inviteMemberRequest(payload));
    if(reset === true) {
      setSearch("");
      setInviteToEmailPhone(false);
    }
  }

  const cancelMemberInvitation = identifier => {
    const payload = {
      group_id: props.group_id,
      identifier
    }
    setLoadingText("Cancelling invitation");
    dispatch(cancelMemberInvitationRequest(payload));
    setIdentifier(identifier);
  }

  const [copiedText, setCopiedText] = useState("Copy");
  const onCopy = identifier => {
    setCopiedText('Copied!');
  }

  const resetModal = () => {
    setIdentifier("");
    setSearch("");
    setInviteToEmailPhone(false);
    setPageNumber(1);
    dispatch(searchMemberFailed({}));
  }

  return (
    <Modal size="lg" show={props.showModal} backdrop="static" onExited={() => resetModal()} onHide={() => props.onHideModal(false)} aria-labelledby="example-modal-sizes-title-lg" >
      {/* <Loader visible={memberLoading} content={loadingText}  /> */}
      <Modal.Header>
        <div className="back-btn">
          <a href="#" onClick={() => props.onHideModal(false)}>
            {ArrowBackIcon}
          </a>
        </div>
        <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
          Invite to Group
      </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-invite-group">
        <div className="full-search-box ui-widget ">
          <input type="text" value={searchText} onChange={(e) => searchMembers(e.target.value)} className="txt-search" id="txt-search" placeholder="Type here to find users..." />
          {inviteToEmailPhone && <a href="#/" onClick={() => inviteMember(searchText, false, true)} className="btn btn-round btn-green btn-invited text-white">+ Invite</a>}
        </div>

        {/* If no member found */}
        {membersList.length === 0 &&
          <div className="col-sm-12 pl-4 pr-4">
            <InviteModelMessage />
          </div>
        }
        {/* Loop through members */}
        {
          membersList.length > 0 &&
          <div className="member-list-data">
            {membersList.map((data, key) =>
              <div key={key} className="member-info" ref={lastInviteMemberElementRef}>
                <SingleProfile name={data.name} avatarUrl={data.avatar_url} userId={data.identifier} />
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
        }
        <div className="invite-box-logo">
          {LogoWhiteIcon}
        </div>
      </Modal.Body>
    </Modal>
  )
}
InviteToGroupModal.propTypes = {
  showModal: PropTypes.bool,
  organization_id: PropTypes.string,
  group_id: PropTypes.string,
  onHideModal: PropTypes.func,
  onClickModal: PropTypes.func,
};
InviteToGroupModal.defaultProps = {
  showModal: false,
  organization_id: '',
  group_id: '',
};
export default InviteToGroupModal;
