import React, {Component} from "react";
import Navbar from "./navbar";

class Header extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (<header className="inner-header">
      <Navbar history={this.props.history} />
    </header>);
  }
}

export default Header;
