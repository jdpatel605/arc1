import React, { useState, forwardRef } from "react";
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import { ChevronDownIcon, KebabIcon } from './../../utils/Svg';
import SingleProfile from "../profile/SingleProfile";
import CallButton from './../common/CallButton';

const EventMemberBox = forwardRef((props, ref) => {
  const [closeIcon, setCloseIcon] = useState(false);

  const isOwner = (member) => {
    const currentIdentifier = localStorage.getItem("identifier");
    return currentIdentifier === member.identifier;
  }
  const canEditEvent = () => {
    const currentIdentifier = localStorage.getItem("identifier");
    return currentIdentifier === props.event?.owner?.identifier;
  }

  return (
    <div className="member-info align-info" ref={ ref }>
      <SingleProfile name={ props.item.name } avatarUrl={ props.item.avatar_url } userId={ props.item.identifier } />
      <div className="communication">
        { !isOwner(props.item) && props.item.membership_status !== 'invited' && !(props.event.is_attending === false && props.event.joinable === false) &&
            <CallButton callee_id={props.item.identifier} call_type="user" confirm={true} name={props.item.name}/>
        }
        {
          // (props.item.membership_status === 'invited' && props.canInviteMember() && isOwner(props.item)) &&
          (props.item.membership_status === 'invited' && !isOwner(props.item) && canEditEvent()) &&
          <Dropdown onToggle={ (e) => setCloseIcon(!closeIcon) }>
            <Dropdown.Toggle as="a" className={ `btn btn-round btn-gray btn-invited btn-click ${closeIcon && 'btn-close'}` } >
              Invited
              { ChevronDownIcon }
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight="true" className="option-menu">
              {/* <Dropdown.Item onClick={() => props.handleResendInvitation(props.item)} className="img-add-user">Resend Invite</Dropdown.Item> */ }
              <Dropdown.Item onClick={ () => props.handleCancelInvitation(props.item) } className="img-close clr-red">Cancel Invite</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
        {
          (props.item.membership_status === 'member' && !isOwner(props.item) && canEditEvent()) &&
          <Dropdown onToggle={ (e) => setCloseIcon(!closeIcon) }>
            <Dropdown.Toggle as="a" className={ `btn more-btn btn-click ${closeIcon && 'btn-close'}` } >
              { KebabIcon }
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight="true" className="option-menu">
              <Dropdown.Item onClick={ () => props.handleRemoveMember(props.item) } className="img-trash clr-red">Delete Member</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
      </div>
    </div>
  )

});
EventMemberBox.propTypes = {
  item: PropTypes.object,
  handleResendInvitation: PropTypes.func,
  handleCancelInvitation: PropTypes.func,
  canInviteMember: PropTypes.func
};
EventMemberBox.defaultProps = {
  item: {},
};
export default EventMemberBox;
