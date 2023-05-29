import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router, Route } from "react-router-dom";
import { matchPath, Redirect } from "react-router";
import { isMobile } from "react-device-detect";

import 'intersection-observer';
import './assets/css/app.scss';

import history from './history/history';
import { positions, Provider } from "react-alert";
//import AlertTemplate from "react-alert-template-basic";

import { getProfile } from './store/actions/user';

import LoginHeader from "./components/includes/loginHeader";
import Header from "./components/includes/header";
import Content from "./components/content";
import PrivateRoute from "./components/PrivateRoute";

import Signup from "./components/signup";
import Signin from "./components/signin";
import Thankyou from "./components/signup/thankyou";
import Sidebar from "./components/includes/sidebar";
import AdminSidebar from "./components/includes/adminSidebar";
import Group from "./components/group/index";
import Discover from "./components/discover/index";
import Confirm from "./components/signup/confirm";
import OrgCode from "./components/signup/orgcode";
import NoSeats from "./components/signup/noseats";
import RequestSent from "./components/signup/requestsent";
import OrgSuccess from "./components/signup/orgsuccess";
import forgotPassword from "./components/open/forgotPassword";
import resetPassword from "./components/open/resetPassword";
import Profile from "./components/profile";
import OrganizationInformation from './components/organizationInformation';
import Events from './components/events';
import Notifications from './components/notifications/index';
import Groupcall from './components/groupcall/index';
import CallEnded from './components/groupcall/Ended';
import JoinEvent from './components/groupcall/JoinEvent';
import UnsupportedBrowser from "./components/UnsupportedBrowser";
import UnsupportedFeature from "./components/UnsupportedFeature";

// admin
import adminDashboard from './components/admin/dashboard';
import adminProfile from './components/admin/profile';
import adminUsers from './components/admin/user';
import adminGroup from './components/admin/group';
import EventManagement from './components/admin/event';
import leftArrow from "./assets/icons/SVG/icon-arrow-left.svg"
import downArrow from "./assets/icons/SVG/icon-arrow-up.svg"

import { DefaultBrowserBehavior } from 'amazon-chime-sdk-js';

import AlertTemp from './components/common/AlertTemplate';

const options = {
  timeout: 5000,
  position: positions.TOPMIDDLE_CENTER,
};

const AlertTemplate = ({ style, options, message, close }) => (
  <AlertTemp style={style} options={options} message={message} close={close}  />
)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: localStorage.getItem('is_login'),
      isCall: false,
      isExpand: false
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    if (this.state.isLogin) {
      this.props.getProfile()
    }
    const eventGuestRoute = matchPath(history.location.pathname, {
      path: "/event/guest/:jwt",
      exact: true
    });
    const eventEndRoute = matchPath(history.location.pathname, {
      path: "/event/ended",
      exact: true
    });
    const adminRoute = matchPath(history.location.pathname, {
      path: "/admin/",
    });
    const checkedPath = history.location.pathname === '/event' || history.location.pathname === '/unsupported-feature' || history.location.pathname === '/unsupported-browser'
    if (checkedPath || eventGuestRoute || eventEndRoute) {
      this.setState({ isCall: true }); // set isCall true for hiding header and side bar
    }
    if(adminRoute && isMobile){
        this.setState({ isCall: true }); // to rediect on unsupported browser feature
    }
    let timmer = setInterval(() => {
      let element = document.getElementsByName('us-entrypoint-buttonV2');
      if (element.length > 0) {
        element[0].style.zIndex = -999;
        clearInterval(timmer);
      }
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.isAuthenticated) {
      if (!this.state.isLogin) {
        this.setState({ isLogin: true });
        this.props.getProfile()
      }
    } else {
      this.setState({ isLogin: false });
    }
  }

  supportedBrowser = () => {

    // Check for video support
    const browser = new DefaultBrowserBehavior({ enableUnifiedPlanForChromiumBasedBrowsers: true });
    const isSupported = browser.isSupported();
    const supportString = browser.supportString();
    const isSafari = browser.isSafari();
    const browserName = browser.name();
    const browserVersion = browser.majorVersion();
    const browserStringVersion = browser.version();

    var ua = navigator.userAgent;

    const browserDetails = {
      isSupported, supportString, browserName, browserVersion, browserStringVersion, ua
    }

    localStorage.setItem("browserDetails", JSON.stringify(browserDetails));

    if (!isSupported) {
      return false;
    }

    // Check for safari device
    if (isSafari) {
      return browserVersion >= 12;
    } else if (ua.indexOf('Mobile') !== -1) {
      if (ua.indexOf('CriOS') > -1) {
        return true;
      } else if (ua.indexOf('Chrome') > -1) {
        return true;
      } else {
        return false;
      }
    } else if (ua.indexOf('Safari') !== -1) {
      return ua.indexOf('Chrome') > -1;
    }

    return true;
  }

  openReportIssuse = () => {
    this.setState({ isExpand: !this.state.isExpand });
    let element = document.getElementsByName('us-entrypoint-buttonV2');
    var timmer = '';
    if (element.length > 0 && element[0].style.zIndex === "-999") {
      element[0].style.zIndex = 999;
      element[0].style.position = "relative";
      element[0].style.top = "16em";
      let isOpen = false;
      timmer = setInterval(() => {
        if (document.getElementsByName('us-entrypoint-widgetInternalBugTrackingV2').length > 0)
          isOpen = true;

        if (isOpen && document.getElementsByName('us-entrypoint-widgetInternalBugTrackingV2').length == 0) {
          this.setState({ isExpand: false });
          element[0].style.zIndex = -999;
          isOpen = false;
          clearInterval(timmer);
        }
      }, 100)
    }
    else if (element.length > 0 && (element[0].style.zIndex === "999" || element[0].style.zIndex === "2147483647")) {
      element[0].style.zIndex = -999;
      clearInterval(timmer);
    }
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ isExpand: false });
      let element = document.getElementsByName('us-entrypoint-buttonV2');
      if (element.length > 0 && (element[0].style.zIndex === "999" || element[0].style.zIndex === "2147483647")) {
        element[0].style.zIndex = -999;
      }
    }
  }

  render() {
    const isLogin = localStorage.getItem('is_login');
    const userRole = localStorage.getItem('user_role');
    var header = <LoginHeader />;
    var sidebar = '';
    if (isLogin) {
      header = <Header history={history} />;
      if(userRole === 'admin' || userRole === 'owner') {
        sidebar = <AdminSidebar />;
      }
      else {
        sidebar = <Sidebar />;
      }
    }
    if (this.state.isCall || this.supportedBrowser() === false) {
      header = '';
      sidebar = '';
    }
    return (
      <>
        <div className="fliph-btn-right" ref={this.wrapperRef} onClick={e => { this.openReportIssuse(e) }}>
          <img src={this.state.isExpand ? downArrow : leftArrow} height="23" width="23" />
        </div>
        <Router history={history}>
          <Provider template={AlertTemplate} {...options}>
            {header}
          </Provider>
          {!this.state.isCall &&
            <Content>
              {sidebar}
              <Route exact path="/" component={Signin} />
              <Route exact path="/login" component={Signin} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/confirm" component={Confirm} />
              <Route exact path="/orgcode" component={OrgCode} />
              <Route exact path="/noseats" component={NoSeats} />
              <Route exact path="/requestsent" component={RequestSent} />
              <Route exact path="/orgsuccess" component={OrgSuccess} />
              <Route exact path="/thankyou" component={Thankyou} />
              <Route exact path="/forgot-password" component={forgotPassword} />

              <Route exact path="/reset-password" component={resetPassword} />
              <Provider template={AlertTemplate} {...options}>
                <PrivateRoute exact path="/organization/:id/details" component={OrganizationInformation} />
                <PrivateRoute exact path="/group" component={Group} />
                <PrivateRoute exact path="/group/:id" component={Group} />
                <PrivateRoute exact path="/discover" component={Discover} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute exact path="/events" component={Events} />
                <PrivateRoute exact path="/notifications" component={Notifications} />
                <PrivateRoute exact path="/admin/dashboard" component={adminDashboard} />
                <PrivateRoute exact path="/admin/profile" component={adminProfile} />
                <PrivateRoute exact path="/admin/users" component={adminUsers} />
                <PrivateRoute exact path="/admin/group" component={adminGroup} />
                <PrivateRoute exact path="/admin/event" component={EventManagement} />
              </Provider>
            </Content>
          }
          <Route exact path="/unsupported-browser" component={UnsupportedBrowser} />
          <Route exact path="/unsupported-feature" component={UnsupportedFeature} />
          {
            isMobile === true && this.state.isCall === true && <Redirect to="/unsupported-feature" />
          }
          <Provider template={AlertTemplate} {...options}>
            <Route exact path="/event" component={Groupcall} />
            <Route exact path="/event/ended" component={CallEnded} />
            <Route exact path="/event/guest/:jwt" component={JoinEvent} />
          </Provider>
          {
            this.supportedBrowser() === false && <Redirect to="/unsupported-browser" />
          }
        </Router>
      </>
    )
  }
}

App.propTypes = {
  getProfile: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  errors: state.errors,
  user: state.user
})
export default connect(mapStateToProps, { getProfile })(App);
