import React from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';

const UnjoinedControles = ({parent, user, type}) => {

    const resendInvitation = (id) => {
        parent.event[parent.activeEventId].push('attendee:reinvite', {identifier: id})
            .receive("ok", resp => {parent.props.alert.success('The invitation has been sent.');})
            .receive("error", resp => {parent.props.alert.error('The invitation has failed.')})
            .receive("timeout", () => console.log("Networking issue. Still waiting... for user id "));
    }
    const cancelInvitation = (id) => {

    }
    const blockUser = (id) => {
        parent.handleAllAttendeeKickout(id)
    }
    const unblockUser = (id) => {
        parent.handleUnkickUser(id)
    }

    return (
        <div className="communication">
            {  type === 'unjoined' &&
                <a className="btn btn-round btn-gray btn-invited btn-click resend-btn" href="#" onClick={() => resendInvitation(user.identifier)}>
                    Resend
                </a>
            /*
            <Dropdown>
                <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click resend-btn">
                    Resend
                    {Svg.ChevronDownIcon}
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight="true" className="option-menu">
                    <Dropdown.Item eventKey="1"
                        className="img-resend-call-invite clr-green" onClick={() => resendInvitation(user.identifier)}>Resend Invite</Dropdown.Item>
                    <Dropdown.Item eventKey="2" 
                        className="img-cancel-call-invite clr-red" onClick={() => cancelInvitation(user.identifier)}>Cancel Invite</Dropdown.Item>
                    <Dropdown.Item eventKey="3" 
                        className="img-block-user clr-red" onClick={() => blockUser(user.identifier)}>Kick User</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            } */}
            { type === 'blocked' &&
                <Dropdown>
                    <Dropdown.Toggle as="a" className="btn btn-round btn-red btn-invited btn-click" >
                        Kicked
                    {Svg.ChevronDownIcon}
                    </Dropdown.Toggle>
                    <Dropdown.Menu alignRight="true" className="option-menu">
                        <Dropdown.Item eventKey="1"
                            className="img-resend-call-invite unblock-user-link clr-green" onClick={() => unblockUser(user.identifier)}>
                            Restore Access</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
        </div>
    )
}
UnjoinedControles.propTypes = {
    parent: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
};
export default UnjoinedControles;
