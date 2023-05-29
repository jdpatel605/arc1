import React, {useRef, useEffect, useState, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from '../common/Image';
import TruncationText from "../common/TruncationText";
import CallButton from './../common/CallButton';
import {organizationGroupListUpdate, muteGroupRequest, resumeGroupRequest} from '../../store/actions/group';
import {VideoIcon, KebabIcon, NoGroupIcon} from "../../utils/Svg";
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\group\\contentLeft.jsx";

const ContentLeft = props => {

    const orgId = localStorage.getItem('organization_id');
    const dispatch = useDispatch();
    const {grpListloading, groupList, muteGroupSuccess, resumeGroupSuccess, orgList, groupDetails} = useSelector(({group}) => group);
    const [componentLoad, setComponentLoad] = useState(false);
    
    const openGroup = (id) => {
        props.openGroup(id);
    }

    const leaveGroup = (id) => {
        props.leaveGroup(id);
    }

    const deleteGroup = (id) => {
        props.deleteGroup(id);
    }

    const muteGroup = (id) => {
        const muteData = {group_id: id}
        dispatch(muteGroupRequest(muteData));
    }

    useEffect(() => {
        try {
            if(componentLoad && muteGroupSuccess) {
                const {id, notification_status} = muteGroupSuccess;
                const updatedList = groupList.map(data => data.identifier === id ? {...data, notification_status} : data);
                dispatch(organizationGroupListUpdate(updatedList));
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:muteGroupSuccess'})
        }
    }, [muteGroupSuccess]);

    const resumeGroup = (id) => {
        dispatch(resumeGroupRequest(id));
    }

    useEffect(() => {
        try {
            if(componentLoad && resumeGroupSuccess) {
                const {id, notification_status} = resumeGroupSuccess;
                const updatedList = groupList.map(data => data.identifier === id ? {...data, notification_status} : data);
                dispatch(organizationGroupListUpdate(updatedList));
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:resumeGroupSuccess'})
        }
    }, [resumeGroupSuccess]);

    const showEditGroup = (grpIp) => {
        props.editGroup(grpIp);
    }

    const createGroupBox = (value) => {
        props.createGroupBox(value);
    }

    const [lastRow, setLastRow] = useState({});
    useEffect(() => {
        try {
            if(groupList) {
                setComponentLoad(true);
                const lastRowData = groupList.slice(-1)[0];
                if(lastRowData && lastRow.identifier) {
                    setLastRow(lastRowData);
                }
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'useEffect:groupList'})
        }
    }, [groupList]);

    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        try {
            if(grpListloading) {
                return
            }
            if(observer.current) {
                observer.current.disconnect()
            }
            observer.current = new IntersectionObserver(entries => {
                if(entries[0].isIntersecting) {
                    props.nextPageGroups();
                }
            })
            if(node) {
                observer.current.observe(node)
            }
        } catch({message}) {
            Logger.error({fileLocation, message, trace: 'lastGroupElementRef'})
        }
    }, [grpListloading]);

    return (
        <>
            {groupList.length > 0 &&
                <div className="col-lg-5 col-sm-12" ref={props.scrollRef}>
                    <div className="chat-person-list green-border">
                        {groupList.map((data, key) => {
                            var activeClass = '';
                            if(data.identifier === groupDetails.identifier) {
                                activeClass = 'active';
                            }
                            return (
                                <div className={`chat-person-data bg-gray ${activeClass}`} key={key} ref={lastBookElementRef}
                                    onClick={() => openGroup(data.identifier)}>
                                    <div className="person-data">
                                        <div className="person-info">
                                            <div className="person-img">
                                                <div className="img-round img-60">
                                                    <Image className="group_img" src={data.avatar_url} altText="Groups" />
                                                </div>
                                            </div>
                                            <div className="person">
                                                <h4 className="w-100">{data.name !== 'null' ? <TruncationText content={data.name} /> : '-'}</h4>
                                                <p>{data.organization !== 'null' ? <TruncationText content={data.organization.name} /> : '-'}</p>
                                            </div>
                                        </div>
                                        <div className="communication">
                                            {data.status === 'active' &&
                                                <CallButton callee_id={data.identifier}/>
                                            }
                                            <Dropdown onClick={(e) => e.stopPropagation()}>
                                                <Dropdown.Toggle as='a' id="dropdown-custom-components-1" className='more-btn'>
                                                    {KebabIcon}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu alignRight="true" className="option-menu">
                                                    {props.panel === 'my_group' &&
                                                        <Dropdown.Item href="#" className="img-edit-icon" onClick={() => showEditGroup(data.identifier)}>Edit Group</Dropdown.Item>
                                                    }
                                                    {data.notification_status === 'unmuted' &&
                                                        <Dropdown.Item href="#" className="img-mute" onClick={() => muteGroup(data.identifier)}>Mute Group</Dropdown.Item>
                                                    }
                                                    {data.notification_status === 'muted' &&
                                                        <Dropdown.Item href="#" className="img-resume" onClick={() => resumeGroup(data.identifier)}>Resume Group</Dropdown.Item>
                                                    }
                                                    <Dropdown.Item href="#" className="img-leave clr-red" onClick={() => leaveGroup(data.identifier)}>Leave Group</Dropdown.Item>
                                                    {props.panel === 'my_group' &&
                                                        <Dropdown.Item href="#" className="img-trash clr-red" onClick={() => deleteGroup(data.identifier)}>Delete Group</Dropdown.Item>
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        }
                    </div>
                </div>
            }
            {!grpListloading && groupList.length === 0 &&
                <div className="black-box d-flex mt-5">
                    <div style={{'margin': 'auto'}}>
                        {NoGroupIcon}

                        <h4>{props.panel === 'join_group' ? "You Haven't Joined Any Groups" : 'No Groups'}</h4>
                        <p>It seems you don’t have any groups, a group is a collection of
                        individuals you can quickly setup an event or call
                    with.</p>
                        {orgList && orgList.eventData && orgList && orgList.eventData.entries.length > 0 &&
                            <a className="btn btn-medium btn-green" href="#" onClick={() => createGroupBox(true)}>Create Group</a>
                        }
                    </div>
                </div>
            }
        </>
    );
}
ContentLeft.propTypes = {
    scrollRef: PropTypes.object,
    panel: PropTypes.string,
    nextPageGroups: PropTypes.func,
    openGroup: PropTypes.func,
    editGroup: PropTypes.func,
    leaveGroup: PropTypes.func,
    isCreateShow: PropTypes.bool,
    createGroupBox: PropTypes.func,
};
ContentLeft.defaultProps = {
    scrollRef: {},
    panel: 'my_group',
    isCreateShow: false,
};

export default ContentLeft;
