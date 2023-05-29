import React from "react";
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import * as Svg from '../../../utils/Svg';
import {Logger} from './../../../utils/logger';

const fileLocation = "src\\components\\admin\\user\\userActions.jsx";

const UserActions = props => {
    const loginUserRole =  localStorage.getItem('user_role');
    const currentIdentifier = localStorage.getItem("identifier");
    
    
    return (
            <>
                
                <div className="communication">
                    <Dropdown>
                        <Dropdown.Toggle as="a" className={props.extraClasses} >
                            {Svg.KebabIcon}
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight="true" className="option-menu">
                            { currentIdentifier !== props.user.identifier &&
                                <>
                                {/* props.user.role === 'owner' && loginUserRole === 'owner' &&
                                <Dropdown.Item onClick={() => props.showConfirmModal('owner', props.user, { type: 'role', role: 'owner' })} className="img-block-user clr-blue">Transfer Ownership</Dropdown.Item>
                                */}
                                { props.user.role === 'member' &&
                                <Dropdown.Item onClick={() => props.showConfirmModal('admin', props.user, { type: 'role', role: 'admin' })} className="img-promote-admin clr-squash">Promote to Org Admin</Dropdown.Item>
                                }
                                { props.user.role === 'admin' && loginUserRole === 'owner' &&
                                <Dropdown.Item onClick={() => props.showConfirmModal('member', props.user, { type: 'role', role: 'member' })} className="img-add ">Demote to Member</Dropdown.Item>
                                }   
                                <Dropdown.Item onClick={() => props.inviteModal(props.user)} className="img-plus ">Invite to Group</Dropdown.Item>
                               
                                { props.user.role !== 'owner' && loginUserRole === 'owner' &&
                                <Dropdown.Item onClick={() => props.showConfirmModal('remove', props.user, { type: 'remove' })} className="img-exit clr-red">Remove from Org</Dropdown.Item>
                                }
                                { ( props.user.role === 'member' || props.user.role === 'user') && loginUserRole === 'admin' &&
                                <Dropdown.Item onClick={() => props.showConfirmModal('remove', props.user, { type: 'remove' })} className="img-exit clr-red">Remove from Org</Dropdown.Item>
                                }
                                </>
                            }
                            { currentIdentifier === props.user.identifier &&
                                <Dropdown.Item onClick={() => props.inviteModal(props.user)} className="img-plus ">Invite to Group</Dropdown.Item>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </>
    )
}
UserActions.propTypes = {
  user: PropTypes.object,
  extraClasses: PropTypes.string,
};
UserActions.defaultProps = {
  user: {},
};
export default UserActions;