import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal'
import { useDispatch, useSelector } from 'react-redux';
import {
  searchOrganizationMemberRequest, inviteOrganizationMemberRequest,
  cancelOrganizationMemberInvitationRequest, resetOrganizationMemberInvitation
} from '../../store/actions';
import Image from '../common/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ArrowBackIcon, ChevronDownIcon, AppLogo } from "../../utils/Svg";
import InviteModelMessage from './../common/InviteModelMessage';
import { Logger } from './../../utils/logger';

const fileLocation = "src";

const InviteToOrganizationModal = props => {

  const dispatch = useDispatch();
  const [searchText, setSearch] = useState("");
  const [copiedText, setCopiedText] = useState("Copy");
  const [inviteToEmailPhone, setInviteToEmailPhone] = useState(false);
  const { membersList, refreshMemberList } = useSelector(({ organization }) => organization);

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);
  const validatePhone = phone => Number.isInteger(parseInt(phone)) && phone.length >= 12;

  // Reset invitation when modal is loaded
  useEffect(() => {
    dispatch(resetOrganizationMemberInvitation());
  }, [dispatch]);

  useEffect(() => {
    if(refreshMemberList === 1) {
      searchMembers(searchText);
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
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:searchText:membersList' })
    }
  }, [searchText, membersList])

  const searchMembers = (search) => {
    setSearch(search);
  }

  const inviteMember = (identifier, resend = false, reset = false) => {
    try {
      const payload = {
        organization_id: props.organization_id,
        identifier
      }

      dispatch(inviteOrganizationMemberRequest(payload));
      if(reset === true) {
        setSearch("");
        setInviteToEmailPhone(false);
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'inviteMember' })
    }
  }

  const cancelMemberInvitation = identifier => {
    try {
      const payload = {
        organization_id: props.organization_id,
        identifier
      }
      dispatch(cancelOrganizationMemberInvitationRequest(payload));
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'cancelMemberInvitation' })
    }
  }

  const onCopy = identifier => {
    setCopiedText('Copied!');
  }

  const resetModal = () => {
    setCopiedText('Copy');
  }

  return (
    <Modal size="lg" show={ props.showModal } backdrop="static" onExited={ () => resetModal() } onHide={ () => props.showInviteModal(false) } aria-labelledby="example-modal-sizes-title-lg" >
      <Modal.Header>
        <div className="back-btn">
          <span className="cursor-pointer" onClick={ () => props.showInviteModal(false) }>
            { ArrowBackIcon }
          </span>
        </div>
        <Modal.Title id="example-modal-sizes-title-lg" className="ml-2">
          Invite to Organization
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="full-search-box ui-widget">
          <input type="text" value={ searchText } onChange={ (e) => searchMembers(e.target.value) } className="txt-search" id="txt-search" placeholder="Type here to find users..." />
          { inviteToEmailPhone && <a href="#/" onClick={ () => inviteMember(searchText, false, true) } className="btn btn-round btn-green btn-invited text-white">+ Invite</a> }
        </div>

        {/* If no member found */ }
        { membersList.length === 0 &&
          <div className="col-sm-12 pl-4 pr-4">
            <InviteModelMessage />
          </div>
        }
        {/* Loop through members */ }
        { membersList.length > 0 &&
          <div className="member-list-data">
            { membersList.map((data, key) =>
              <div key={ key } className="member-info">
                <div className="member">
                  <div className="member-img">
                    <OverlayTrigger
                      placement='top'
                      overlay={
                        <Tooltip id={ `tooltip-${key}` }>
                          Assign Host
                              </Tooltip>
                      }>
                      <a href="#/">
                        <Image src={ data.avatar_url } altText="Member" />
                      </a>
                    </OverlayTrigger>
                  </div>
                  <div className="member-data">
                    <a href="#/">{ data.name }</a>
                  </div>
                </div>
                <div className="communication">
                  {
                    data.subscription_status === 'member'
                      ?
                      <Dropdown>
                        <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                          Invited
                          { ChevronDownIcon }
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight="true" className="option-menu">
                          <Dropdown.Item eventKey="1" onClick={ () => inviteMember(data.identifier, true) } className="img-resend-invite">Resend Invite</Dropdown.Item>
                          <Dropdown.Item eventKey="2" onClick={ () => cancelMemberInvitation(data.identifier) } className="img-close clr-red">Cancel Invite</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      : <span onClick={ () => inviteMember(data.identifier) } className="btn btn-round btn-green btn-invited">+ Invite</span>
                  }
                </div>
              </div>
            )
            }
          </div>
        }
        <div className="invite-box-logo">{ AppLogo }</div>
      </Modal.Body>
    </Modal>
  )
}

InviteToOrganizationModal.propTypes = {
  image: PropTypes.string,
  show: PropTypes.bool,
  onCropCompleted: PropTypes.func,
  onCropCancelled: PropTypes.func,
};
InviteToOrganizationModal.defaultProps = {
  show: false,
};

export default InviteToOrganizationModal;
