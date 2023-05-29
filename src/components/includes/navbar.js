import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import history from '../../history/history';
import { Helper } from "../../utils/helper";
import Dropdown from 'react-bootstrap/Dropdown'
import TruncationText from "../common/TruncationText";
import UserImage from '../common/UserImage';
import { logoutUser } from "../../store/actions/actionCreators";
import { getOrganizationDetailRequest, getUserSessionRequest, adminEventListReset } from "../../store/actions";
import CallButton from './../common/CallButton';
import { isMobile } from "react-device-detect";
import { useLocation } from 'react-router';

const Navbar = () => {
  const dispatch = useDispatch()
  const [orgCode, setOrgCode] = useState('');
  const user = useSelector(state => state.user)
  const { orgDetailFlag, orgDetail, sessionDetail } = useSelector(({ user }) => user);
  const [adminList, setAdminList] = useState();
  const currentUser = localStorage.getItem("current_identifier");
  const currentIdentifier = localStorage.getItem("identifier");
  const useRole = localStorage.getItem("user_role");
  const adminName = localStorage.getItem("admin_name");
  const adminAvatar = localStorage.getItem("admin_avatar");
  const adminIdentifier = localStorage.getItem("admin_identifier");
  const alert = useAlert()
  const location = useLocation();

  const getProfile = (event) => {
    history.push('/profile');
  }


  useEffect(() => {
    //get user admin org list when route change
    // dispatch(getUserSessionRequest({}))
    var currentURL = new URL(window.location.href);
    currentURL = currentURL.pathname.split('/');
    if (currentURL && currentURL[1] === 'admin' && useRole === 'member') {
      dispatch(logoutUser());
      history.push('/login');
    }
  }, [location.pathname]);

  useEffect(() => {

    if (ownerOrAdmin()) {
      if (!orgDetail) {
        dispatch(getOrganizationDetailRequest({}))
      } else if (orgDetail.name) {
        setOrgCode(orgDetail.affiliation_code)
      }
    }
  }, [orgDetail])

  useEffect(() => {
    if (!sessionDetail) {
      dispatch(getUserSessionRequest({}))
    } else {
      if (sessionDetail.administerable_organizations) {
        if (sessionDetail.administerable_organizations.length === 0 && ownerOrAdmin()) {
          userNavigate(currentIdentifier, true)
          return false
        } else if (sessionDetail.administerable_organizations.length > 0 && ownerOrAdmin()) {
          let isExist = false
          sessionDetail.administerable_organizations.forEach((v) => {
            if (v.identifier === adminIdentifier) {
              isExist = true
            }
          })
          if (!isExist) {
            userNavigate(currentIdentifier, true)
            return false
          }
        }
        setAdminList(sessionDetail.administerable_organizations)
      }
    }
  }, [sessionDetail])

  const userNavigate = (identifier, goToGroup = false) => {
    dispatch(adminEventListReset())
    if (currentIdentifier === identifier && useRole === 'member') {
      history.push('/profile');
    }
    else if (currentIdentifier === identifier && (useRole === 'admin' || useRole === 'owner')) {
      localStorage.setItem('current_identifier', identifier);
      localStorage.setItem('admin_identifier', '');
      localStorage.setItem('admin_name', '');
      localStorage.setItem('admin_avatar', '');
      localStorage.setItem('user_role', 'member');
      if (goToGroup) {
        history.push('/group');
      } else {
        history.push('/profile');
      }
      window.location.reload();
    }
    else {
      const data = sessionDetail.administerable_organizations.find(admin => admin.identifier === identifier);
      localStorage.setItem('current_identifier', data.identifier);
      localStorage.setItem('admin_identifier', data.identifier);
      localStorage.setItem('admin_name', data.name);
      localStorage.setItem('admin_avatar', data.avatar_url);
      localStorage.setItem('user_role', data.user_role);
      history.push('/admin/profile');
      window.location.reload();
    }
  }
  const ownerOrAdmin = () => {
    return useRole === 'admin' || useRole === 'owner'
  }

  const onCopy = e => {
    alert.success('Org Code copied!')
  }

  const goToHome = (e) => {
    if (useRole === 'admin' || useRole === 'owner') {
      localStorage.setItem('current_identifier', currentIdentifier);
      localStorage.setItem('admin_identifier', '');
      localStorage.setItem('admin_name', '');
      localStorage.setItem('admin_avatar', '');
      localStorage.setItem('user_role', 'member');
      history.push('/group');
      window.location.reload();
    }
    else if (useRole === 'member') {
      history.push('/group');
    }
  }

  const logOut = (e) => {
    dispatch(logoutUser());
    history.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="#" onClick={goToHome}>
          <img src="/images/logo-lg.svg" width="124px" alt="" />
          <span className="app-env">{Helper.getAppEnv()}</span>
        </a>
      </div>
      <div className={`rightbar-nav ${useRole === 'member' ? '' : 'admin-header'}`}>

        {useRole === 'member' &&
          <CallButton call_type="event" withText={true} />
        }
        {ownerOrAdmin() && orgCode &&

          <div className="mycode-sec">
            <div className="align-code">
              <p>My Org Code</p>
              <label>{orgCode}</label>
            </div>
            <div className="align-code-icon">
              <CopyToClipboard onCopy={(e) => onCopy(e)} text={orgCode}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21">
                  <path fill="#18B99A" fillRule="evenodd" d="M13.333.958h-10c-.916 0-1.666.75-1.666 1.667v11.667h1.666V2.625h10V.958zm2.5 3.334H6.667C5.75 4.292 5 5.042 5 5.958v11.667c0 .917.75 1.667 1.667 1.667h9.166c.917 0 1.667-.75 1.667-1.667V5.958c0-.916-.75-1.666-1.667-1.666zm0 13.333H6.667V5.958h9.166v11.667z" />
                </svg>
              </CopyToClipboard>
            </div>
          </div>
        }
        <div style={{ cursor: 'pointer' }}>
          {/* <a className="user-name" href="#">{user.profile.name ? user.profile.name : ''}</a>
          <a className="user-email" href="#">{user.profile.email ? user.profile.email : ''}</a> */}
          <Dropdown className='user-switch-dropdown'>
            <Dropdown.Toggle as='div' id="profile-dropdown" className="user-sec">
              {useRole === 'member' &&
                <>
                  <div className="user-data">
                    <a className="user-name" href="#">{user.profile.name ? <TruncationText content={user.profile.name} limit={20} /> : ''}</a>
                    <a className="user-email" href="#">{user.profile.email ? user.profile.email : ''}</a>
                  </div>
                  <UserImage className="user-img large" src={user.profile.avatar_url ? user.profile.avatar_url : ''} name={user.profile.name ? user.profile.name : ''} altText="User" />
                </>
              }
              {(useRole === 'admin' || useRole === 'owner') &&
                <>
                  <div className="user-data">
                    <a className="user-name" href="#">{adminName ? <TruncationText content={adminName} limit={20} /> : ''}</a>
                    <a className="user-email" href="#">{useRole === 'admin' ? 'Administrator' : useRole === 'owner' ? 'Owner' : ''}</a>
                  </div>
                  <UserImage className="user-img large" src={adminAvatar ? adminAvatar : ''} name={adminName ? adminName : ''} altText="User" />
                </>
              }
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight="true" className="option-menu">
              <div className="dropdown-height">
                <Dropdown.Item href="#" className="user-list" onClick={() => userNavigate(user.profile.identifier)}>
                  <div className="user-box">
                    <div className="user-box-img">
                      <UserImage src={user.profile.avatar_url ? user.profile.avatar_url : ''} name={user.profile.name ? user.profile.name : ''} altText="User" />
                    </div>
                    <div className="user-box-data ml-2">
                      <h4 className={`${currentUser === user.profile.identifier ? 'active' : ''}`}>{user.profile.name ? <TruncationText content={user.profile.name} limit={20} /> : ''}</h4>
                      <p>Member</p>
                    </div>
                  </div>
                </Dropdown.Item>
                {!isMobile && adminList && adminList.length > 0 &&
                  <>
                    {adminList.map((admin, key) => {
                      return (
                        <Dropdown.Item key={key} href="#" className="user-list" onClick={() => userNavigate(admin.identifier)}>
                          <div className="user-box">
                            <div className="user-box-img">
                              <UserImage src={admin.avatar_url} name={admin.name} altText="User" />
                            </div>
                            <div className="user-box-data ml-2">
                              <h4 className={`${currentUser === admin.identifier ? 'active' : ''}`}><TruncationText content={admin.name} limit={20} /></h4>
                              <p>{admin.user_role === 'admin' ? 'Administrator' : admin.user_role === 'owner' ? 'Owner' : ''}</p>
                            </div>
                          </div>
                        </Dropdown.Item>
                      )
                    })}
                  </>
                }
              </div>
              <Dropdown.Item href="#" className="clr-green btn-exit" onClick={e => logOut(e)}><b>Log Out</b></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* <UserImage className="user-img large" src={user.profile.avatar_url ? user.profile.avatar_url : ''} name={user.profile.name ? user.profile.name : ''} altText="User" /> */}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
