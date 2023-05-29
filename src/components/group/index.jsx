import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import ContentHeader from "./contentHeader";
import ContentLeft from "./contentLeft";
import ContentRight from "./contentRight";
import CreateGroup from "./CreateGroup";
import Loader from '../Loader';
import {
    organizationGroupListRequest, groupDetailsRequest, groupEditDetailsRequest, leaveGroupRequest, deleteGroupRequest,
    organizationGroupListUpdate, resetGroupState
} from '../../store/actions/group';
import { Logger } from './../../utils/logger';
const fileLocation = "src\\components\\group\\index.jsx";

const Index = props => {
    const alert = useAlert();
    const orgId = localStorage.getItem('organization_id');
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const {
        loadingGrp, groupList, groupPageInfo, groupDetails, groupEditDetails, leaveGroupSuccess, leaveGroupError,
        deleteGroupSuccess, deleteGroupError, createFlag, updateFlag, updateGroupData, ownerSuccess
    } = useSelector(({ group }) => group);

    const [componentLoad, setComponentLoad] = useState(false);
    const [createGroupShow, setCreateGroupShow] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [rightSide, shoRightSide] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [editData, setEditData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [panel, setPanel] = useState('my_group');
    const topPanelClick = (item) => {
        setPanel(item);
        shoRightSide(false);
        if (item === 'my_group') {
            setPageNumber(1);
            getMygroup();
        }
        else if (item === 'join_group') {
            setPageNumber(1);
            getJoingroup();
        }
    }

    const refreshJoinGroupList = (event) => {
        setPageNumber(1);
        getJoingroup();
    }

    useEffect(() => {
        dispatch(resetGroupState());
    }, []);

    useEffect(() => {
        try {
            if (groupList) {
                setComponentLoad(true);
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:groupList' })
        }
    }, [groupList]);

    const showCreateGroupBox = (event) => {
        setCreateGroupShow(event);
        setEditData({})
        setIsEdit(false)
    }

    const getMygroup = (event) => {
        const postdata = { search: searchValue, filter: 'owned', page: pageNumber }
        dispatch(organizationGroupListRequest(postdata));
    }

    const getJoingroup = (event) => {
        const postdata = { search: searchValue, filter: 'subscribed', page: pageNumber }
        dispatch(organizationGroupListRequest(postdata));
    }

    useEffect(() => {
        if (panel === 'my_group') {
            getMygroup();
        }
        else if (panel === 'join_group') {
            getJoingroup();
        }
        const { params } = props.match;
        if (params.id) {
            openGroup(params.id);
        }
    }, [dispatch, pageNumber]);
    // Set next page
    const nextPageGroups = () => {
        if (pageNumber < groupPageInfo.total_pages) {
            setPageNumber(pageNumber + 1);
        }
    }

    // Hook, make owner successfully
    useEffect(() => {
        shoRightSide(false);
    }, [ownerSuccess]);

    useEffect(() => {
        try {
            if (groupDetails.name) {
                shoRightSide(true);
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:groupDetails' })
        }
    }, [groupDetails]);

    const openGroup = (gID) => {
        setCurrentGroup(gID)
        const groupData = { group_id: gID }
        dispatch(groupDetailsRequest(groupData));
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    useEffect(() => {
        try {
            if (groupEditDetails.name) {
                setEditData(groupEditDetails);
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:groupEditDetails' })
        }
    }, [groupEditDetails]);

    const showEditGroup = (gID) => {
        setIsEdit(true);
        const groupData = { group_id: gID }
        dispatch(groupEditDetailsRequest(groupData));
        setCreateGroupShow(true);
    }

    const createGroupSuccess = () => {
        try {
            setCreateGroupShow(false);
            if (createFlag === 2) {
                if (panel === 'my_group') {
                    setPageNumber(1);
                    getMygroup();
                }
                else if (panel === 'join_group') {
                    topPanelClick('my_group')
                }
            }
            if (updateFlag === 2) {
                const { identifier, name, avatar_url } = updateGroupData;
                const updatedList = groupList.map(data => data.identifier === identifier ? { ...data, name, avatar_url } : data);
                dispatch(organizationGroupListUpdate(updatedList));

                if (rightSide === true) {
                    const groupData = { group_id: currentGroup }
                    dispatch(groupDetailsRequest(groupData));
                }
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:handleCreateGroupSuccess' })
        }
    }

    const hideRightSide = (event) => {
        shoRightSide(false);
    }

    useEffect(() => {
        if (componentLoad) {
            if (panel === 'my_group') {
                setPageNumber(1);
                getMygroup();
            }
            else if (panel === 'join_group') {
                setPageNumber(1);
                getJoingroup();
            }
        }
    }, [dispatch, searchValue]);

    const searchGroup = (search) => {
        setSearchValue(search);
        shoRightSide(false);
    }

    const leaveGroup = (id) => {
        dispatch(leaveGroupRequest(id));
    }

    useEffect(() => {
        try {
            if (componentLoad && leaveGroupSuccess.id) {
                if (rightSide === true) {
                    shoRightSide(false);
                }
                else {
                    shoRightSide(false);
                }
                setPageNumber(1);
                getJoingroup();
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:leaveGroupSuccess' })
        }
    }, [leaveGroupSuccess]);

    useEffect(() => {
        try {
            if (componentLoad && leaveGroupError.message) {
                if (leaveGroupError.message.message) {
                    alert.error(leaveGroupError.message.message);
                }
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:leaveGroupError' })
        }
    }, [leaveGroupError]);

    const deleteGroup = (id) => {
        dispatch(deleteGroupRequest(id));
    }

    useEffect(() => {
        try {
            if (componentLoad && deleteGroupSuccess.id) {
                const grpIdentifier = deleteGroupSuccess.id
                const updatedList = groupList.filter(group => group.identifier !== grpIdentifier && group);
                dispatch(organizationGroupListUpdate(updatedList));
                shoRightSide(false);
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:deleteGroupSuccess' })
        }
    }, [deleteGroupSuccess]);
    
    useEffect(() => {
        try {
            if (componentLoad && deleteGroupError.status) {
                if (deleteGroupError?.message?.message) {
                    alert.error(deleteGroupError.message.message);
                }
            }
        } catch ({ message }) {
            Logger.error({ fileLocation, message, trace: 'useEffect:deleteGroupSuccess' })
        }
    }, [deleteGroupError]);

    return (
        <div className="content-sec">
            <Loader visible={loadingGrp} />
            <div className="scroll">
                <div className="container-fluid">
                    <ContentHeader searchGroup={searchGroup} createGroupBox={showCreateGroupBox} />
                    <div className="page-contain">
                        <div className="tab-section">
                            <ul id="tabs" className="nav nav-tabs" role="tablist">
                                <li className="nav-item">
                                    <a id="tab-A" href="#/"
                                        onClick={e => topPanelClick('my_group')}
                                        className={panel === 'my_group' ? 'nav-link active' : 'nav-link'}
                                        data-toggle="tab" role="tab">My Groups</a>
                                </li>
                                <li className="nav-item">
                                    <a id="tab-B" href="#/"
                                        onClick={e => topPanelClick('join_group')}
                                        className={panel === 'join_group' ? 'nav-link active' : 'nav-link'}
                                        data-toggle="tab" role="tab">Joined Groups</a>
                                </li>
                            </ul>
                            <div className="tab-content align-items-start">
                                <div className="card tab-pane active">
                                    <div className="collapse show">
                                        <div className="row">
                                            {/* { groupList.length > 0 && !loadingGrp && */}
                                            <div className="chat-box">
                                                <ContentLeft
                                                    scrollRef={scrollRef}
                                                    panel={panel}
                                                    nextPageGroups={nextPageGroups}
                                                    openGroup={openGroup}
                                                    editGroup={showEditGroup}
                                                    leaveGroup={leaveGroup}
                                                    deleteGroup={deleteGroup}
                                                    createGroupBox={showCreateGroupBox}
                                                />
                                                {rightSide === true && groupDetails.name &&
                                                    <ContentRight
                                                        hideRightSide={hideRightSide}
                                                        editGroup={showEditGroup}
                                                        leaveGroup={leaveGroup}
                                                        deleteGroup={deleteGroup}
                                                        refreshJoinGroupList={refreshJoinGroupList}
                                                        listFrom="index"
                                                    />
                                                }
                                            </div>
                                            {/* } */}
                                            <CreateGroup
                                                show={createGroupShow}
                                                hide={showCreateGroupBox}
                                                organizationId={orgId}
                                                onSuccess={createGroupSuccess}
                                                editData={editData}
                                                is_edit={isEdit}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;
