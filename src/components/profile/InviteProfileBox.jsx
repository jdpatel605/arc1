import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from 'react-redux';
import Image from '../common/Image';
import ReadMoreText from './../common/ReadMoreText';
import {CloseProfileIcon, ChevronDownIcon} from "../../utils/Svg";
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';

import {singleProfileRequest} from '../../store/actions';

const InviteProfileBox = (props) => {

    const dispatch = useDispatch();
    const {singleProfile, loader} = useSelector(({profile}) => profile);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        if(props.searchText !== '') {
            const data = {user_id: props.userId};
            dispatch(singleProfileRequest(data));
        }
        else {
            setShowProfile(false);
        }
    }, [props.searchText])

    useEffect(() => {
        setShowProfile(props.isShow);
    }, [props.isShow])

    const handleClose = (event) => {
        setShowProfile(false);
    };

    const inviteMember = (identifier, resend = false) => {
        if(props.from === 'event') {
            props.inviteMember(identifier);
        }
        else {
            props.inviteMember(identifier, resend);
        }
    }

    const cancelMemberInvitation = identifier => {
        if(props.from === 'event') {
            props.cancelMemberInvitation(identifier, 'cancel');
        }
        else {
            props.cancelMemberInvitation(identifier);
        }
    }

    return (
        <>
            {!loader && showProfile &&
            <div>
                <div className="popover-sec">
                    <div className="popover-header">
                        <a href="#/" className="close" onClick={handleClose}>
                            {CloseProfileIcon}
                        </a>
                        <div className="upload-img-info ">
                            <div className="upload-img">
                                <div className="img-upload">
                                    <Image id="blah" src={singleProfile.avatar_url} altText="User" />
                                </div>
                            </div>
                            <div className="img-data">
                                <h3>{singleProfile.name}</h3>
                                <p><a className="btn-link" href="#/"> {singleProfile.email} </a></p>
                            </div>
                        </div>
                    </div>
                    <div className="popover-body">
                        {singleProfile.bio && singleProfile.bio.length > 140 &&
                            <div>
                                <h5>Bio</h5>
                                <p>
                                    <ReadMoreText
                                        content={singleProfile.bio}
                                        limit={140}
                                        linkClass="load-more cursor-pointer text-email"
                                    />
                                </p>
                            </div>
                        }
                        {singleProfile.bio && singleProfile.bio.length <= 140 &&
                            <div>
                                <h5>Bio</h5>
                                <p>{singleProfile.bio}</p>
                            </div>
                        }
                        {
                            props.subscription === 'invited' &&
                            <Dropdown>
                                <Dropdown.Toggle as="a" className="btn btn-round btn-gray btn-invited btn-click" >
                                    Invited
                                {ChevronDownIcon}
                                </Dropdown.Toggle>
                                <Dropdown.Menu alignRight="true" className="option-menu">
                                    <Dropdown.Item eventKey="1" onClick={() => inviteMember(props.userId, true)} className="img-resend-invite">Resend Invite</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={() => cancelMemberInvitation(props.userId)} className="img-close clr-red">Cancel Invite</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                        {props.subscription === 'member' &&
                            <span className="btn btn-round btn-gray btn-invited">Member</span>
                        }
                        {props.subscription !== 'member' && props.subscription !== 'invited' &&
                            <span onClick={() => inviteMember(props.userId)} className="btn btn-round btn-green btn-invited">+ Invite</span>
                        }
                    </div>
                </div>
            </div>
            }
        </>
    );
}
InviteProfileBox.propTypes = {
    name: PropTypes.string,
    userId: PropTypes.string,
};
InviteProfileBox.defaultProps = {
    name: '',
    userId: '',
};
export default InviteProfileBox;
