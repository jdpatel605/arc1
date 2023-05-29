import React, { Component } from "react";
import { Helper } from "../../utils/helper";

class LoginNavbar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          <img src="/images/logo-lg.svg" width="156px" alt="" srcSet="" />
          <span className="app-env">{ Helper.getAppEnv() }</span>
        </a>
      </nav>
    );
  }
}
export default LoginNavbar;
