import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import Popover from 'react-bootstrap/Popover';
import UserImage from '../common/UserImage';
import Overlay from 'react-bootstrap/Overlay';
import ReadMoreText from './../common/ReadMoreText';
import {CloseProfileIcon} from "../../utils/Svg";
import PropTypes from 'prop-types';

import {singleProfileRequest} from '../../store/actions';

const SingleProfile = (props) => {

    const dispatch = useDispatch();
    const {singleProfile, loader} = useSelector(({profile}) => profile);
    const [boxShow, setBoxShow] = useState(false);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [activeClass, setActiveClass] = useState('');
    const ref = useRef(null);

    const handleClick = (event) => {
        setBoxShow(true)
        setBoxShow(!boxShow)
        setShow(!show);
        setTarget(event.target);
        setActiveClass('popactive');
    };

    const handleClose = (event) => {
        setBoxShow(false)
        setShow(false);
        setActiveClass('');
    };

    const enteringMode = (event) => {
        // code
    };

    useEffect(() => {
        if(boxShow) {
            const data = {user_id: props.userId};
            dispatch(singleProfileRequest(data));
        }
    }, [show])

    return (
        <div ref={ref}>
            {props.from === 'discover' &&
                <div className="person-info">
                    <div className="person-img">
                        <div className="img-round img-60" onClick={handleClick}>
                            <UserImage src={props.avatarUrl} name={props.name} className="large" altText="Groups" />
                        </div>
                    </div>
                    <div className="person">
                        <h4 className={activeClass} onClick={handleClick}>{props.name}</h4>
                        <p>{props.detail}</p>
                    </div>
                </div>
            }
            {props.from === 'admin' &&
                <div className="member">
                    <div className="member-img" onClick={handleClick}>
                        <a href="#">
                            <UserImage src={props.avatarUrl} name={props.name} altText="User" />
                        </a>
                    </div>
                    <div className="member-data" onClick={handleClick}>
                        <h4 className={activeClass}>{props.name}</h4>
                        <p>{props.detail}</p>
                    </div>
                </div>
            }
            {!props.from &&
            <div className="member">
                <div className="member-img" onClick={handleClick}>
                    <a href="#">
                        <UserImage src={props.avatarUrl} name={props.name} altText="User" />
                    </a>
                </div>
                <div className="member-data" onClick={handleClick}>
                    <h4 className={activeClass}>{props.name}</h4>
                </div>
            </div>
            }
            <Overlay
                show={show}
                target={target}
                placement="right"
                container={ref.current}
                containerPadding={20}
                onEntering={enteringMode}
                rootClose
                onHide={handleClose}
            >
                <Popover id="popover-contained">
                    {!loader && singleProfile.name &&
                        <Popover.Title>
                            <a href="#/" className="close" onClick={handleClose}>
                                {CloseProfileIcon}
                            </a>
                            <div className="upload-img-info">
                                <div className="upload-img">
                                    <div className="img-upload">
                                        <UserImage src={singleProfile.avatar_url} name={singleProfile.name} className="extra-large" altText="User" />
                                    </div>
                                </div>
                                <div className="img-data">
                                    <h3>{singleProfile.name}</h3>
                                    <p><a className="btn-link" href="#/"> {singleProfile.email} </a></p>
                                </div>
                            </div>
                        </Popover.Title>
                    }
                    {!loader && singleProfile.bio &&
                        <Popover.Content>
                            <h5>Bio</h5>
                            {singleProfile.bio && singleProfile.bio.length > 140 &&
                                <p>
                                    <ReadMoreText
                                        content={singleProfile.bio}
                                        limit={140}
                                        linkClass="load-more cursor-pointer text-email"
                                    />
                                </p>
                            }
                            {singleProfile.bio && singleProfile.bio.length <= 140 &&
                                <p>{singleProfile.bio}</p>
                            }
                            {/* <a href="#/" className="btn btn-round btn-green btn-invited text-white">+ Invite</a> */}
                        </Popover.Content>
                    }
                </Popover>
            </Overlay>
        </div>
    );
}
SingleProfile.propTypes = {
    name: PropTypes.string,
    userId: PropTypes.string,
    avatarUrl: PropTypes.string,
};
SingleProfile.defaultProps = {
    name: '',
    userId: '',
    avatarUrl: '',
};
export default SingleProfile;
