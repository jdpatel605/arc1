import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  notificationListRequest, acceptRejectInviteRequest, deleteNotificationRequest,
  readUnreadNotifRequest, updateNotificationList, resetNotificationState, unreadNotifCountRequest, getProfileRequest
} from '../../store/actions';
import NotificationBox from './NotificationBox';
import Loader from '../Loader';
import NotificationEmpty from './NotificationEmpty';
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\notifications\\index.jsx";

const Notifications = () => {

  const dispatch = useDispatch();
  const [componentLoad, setComponentLoad] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const {
    list, loading, listLoading, pageInfo, readStatus, deleteStatus, acceptRejectStatus
  } = useSelector(({ notification }) => notification);
  const { profile } = useSelector(({ profile }) => profile);

  const acceptRejectInvite = (url, id, method, organizationId, label) => {
    const payload = { id, url, method };
    dispatch(acceptRejectInviteRequest(payload));

    const orgId = localStorage.getItem('organization_id');
    if((orgId === 'null' || orgId === 'undefined' || orgId === '') && label === 'accept') {
      localStorage.setItem('organization_id', organizationId);
    }
  }

  useEffect(() => {
    if(list) {
      setComponentLoad(true)
    }
  }, [list]);

  useEffect(() => {
    if(profile && profile.home_organization) {
      localStorage.setItem('organization_id', profile.home_organization.identifier);
    }
  }, [profile]);

  useEffect(() => {
    dispatch(unreadNotifCountRequest());
    return () => {
      dispatch(resetNotificationState());
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(notificationListRequest(pageNumber));
  }, [dispatch, pageNumber]);

  // Delete notification notification
  const deleteNotification = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotificationRequest(id));
  }
  useEffect(() => {
    try {
      const { id } = deleteStatus;
      if(id !== '') {
        const updatedList = list.filter(data => data.identifier !== id && data);
        dispatch(updateNotificationList(updatedList));
        dispatch(unreadNotifCountRequest());

        const orgId = localStorage.getItem('organization_id');
        if(orgId === 'null' || orgId === 'undefined' || orgId === '') {
          dispatch(getProfileRequest());
        }
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:deleteStatus' })
    }
  }, [dispatch, deleteStatus]);

  useEffect(() => {
    try {
      const { id, status } = acceptRejectStatus;
      if(id !== '') {
        const updatedList = list.map(data => data.identifier === id ? { ...data, status } : data);
        dispatch(updateNotificationList(updatedList));
        dispatch(unreadNotifCountRequest());
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:acceptRejectStatus' })
    }
  }, [dispatch, acceptRejectStatus]);


  // Update the Read and Unread notification state
  const readNotification = ({ identifier, status }) => {
    if(status === 'unread') {
      const isRead = status === 'unread' ? 'read' : 'unread';
      const payload = {
        id: identifier,
        status: isRead
      }
      dispatch(readUnreadNotifRequest(payload));
    }
  }
  useEffect(() => {
    try {
      const { id, status } = readStatus;
      if(id !== '') {
        const updatedList = list.map(data => data.identifier === id ? { ...data, status } : data);
        dispatch(updateNotificationList(updatedList));
        dispatch(unreadNotifCountRequest());
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'useEffect:readStatus' })
    }
  }, [dispatch, readStatus]);

  const observer = useRef()
  const lastNotifElementRef = useCallback(node => {
    try {
      if(listLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(pageNumber < pageInfo.total_pages) {
            setPageNumber(pageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({ message }) {
      Logger.error({ fileLocation, message, trace: 'lastNotifElementRef' })
    }
  }, [listLoading])

  return (

    <div className="content-sec">
      <Loader visible={ loading } />
      <div className="scroll">
        <div className="container-fluid">
          <div className="content-title">
            <div className="d-flex">
              <h1>Notifications</h1>
            </div>
          </div>
          <div className="page-contain">
            <div className="row">
              {
                (componentLoad && !listLoading && list.length === 0) && <NotificationEmpty />
              }
              <div className="notification-section">
                <div className="col-lg-9">
                  {
                    list.map((data, key) =>
                      <NotificationBox
                        ref={ (key + 1) === list.length ? lastNotifElementRef : null }
                        readNotification={ readNotification }
                        key={ key }
                        data={ data }
                        acceptRejectInvite={ acceptRejectInvite }
                        deleteNotification={ deleteNotification }
                      />
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Notifications;
