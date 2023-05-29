import React, {Component} from "react";
import LoginNavbar from "./loginNavbar";

class LoginHeader extends Component {
  render() {
    return (<header className="login-header">
      <LoginNavbar />
    </header>);
  }
}
export default LoginHeader;
