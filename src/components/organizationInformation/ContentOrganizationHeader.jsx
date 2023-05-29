import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import InviteToOrganizationModal from './InviteToOrganizationModal';
import { useSelector, useDispatch } from 'react-redux';
import { manageOrgNotifRequest } from '../../store/actions';
import { Link } from 'react-router-dom';
import CreateGroup from '../group/CreateGroup';
import { ArrowBackIcon, PlusIcon } from '../../utils/Svg';
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\organizationInformation\\ContentOrganizationHeader.jsx";

const ContentOrganizationHeader = forwardRef((props, ref) => {

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const { muted } = useSelector(({ organization }) => organization);
  const [closeIcon, setCloseIcon] = useState(false);

  const showInviteModal = state => {
    setShowModal(state);
  }

  const muteOrganization = () => {
    try {
      const id = props.params;
      dispatch(manageOrgNotifRequest({ id, muted: !muted }));
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'muteOrganization' })
    }
  }

  const showCreateGroupModal = () => {
    setShowGroupModal(true)
  }
  const hideCreateGroupModal = () => {
    setShowGroupModal(false)
  }

  return (
    <div className={ `content-title ${props.mainClass}` } ref={ ref }>
      {
        props.from === 'discover' &&
        <h3 onClick={ () => props.closeBox() }>
          <a href="#/">{ ArrowBackIcon }</a>
          Back to Results
        </h3>
      }
      {
        props.from === 'organization' &&
        <h3><Link to="/profile">{ ArrowBackIcon }</Link>Back</h3>
      }
      <div className="add-data">
        { props.isSubscribed && props.from === 'organization' &&
          <Dropdown onToggle={ (e) => setCloseIcon(!closeIcon) } onClick={ (e) => e.stopPropagation() }>
            <Dropdown.Toggle as="a" className={ `btn btn-add btn-green btn-click ${closeIcon && 'btn-close'}` }>
              { PlusIcon }
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight="true" className="option-menu">
              <Dropdown.Item onClick={ () => showCreateGroupModal() } className="img-plus">Create Group</Dropdown.Item>
              {/* <Dropdown.Item onClick={ () => showInviteModal(true) } className="img-add">Invite to Organization</Dropdown.Item> */}
              <Dropdown.Item onClick={ muteOrganization } className={ muted ? 'img-resume' : 'img-mute' }>
                { muted ? 'Resume' : 'Mute' } Organization
                </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
        <InviteToOrganizationModal
          showModal={ showModal }
          organization_id={ props.params }
          showInviteModal={ showInviteModal }
        />
        { props.data &&
          <CreateGroup
            show={ showGroupModal }
            hide={ hideCreateGroupModal }
            organizationId={ props.params }
            organizationName={ props.data.name }
          />
        }
      </div>
    </div>
  )
})

ContentOrganizationHeader.propTypes = {
  params: PropTypes.string,
  data: PropTypes.object,
  isSubscribed: PropTypes.bool,
  from: PropTypes.string,
  mainClass: PropTypes.string,
};
ContentOrganizationHeader.defaultProps = {
  params: '',
  data: {},
  isSubscribed: false,
  from: 'organization',
  mainClass: '',
};

export default ContentOrganizationHeader;
