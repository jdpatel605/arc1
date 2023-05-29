import React from "react";
import {AppLogoWithName} from './../utils/Svg';

const ua = navigator.userAgent;

const UnsupportedBrowser = () => {
  return (
    <>
      <header>
        <nav className="navbar">
          <a className="navbar-brand" href="#/">{AppLogoWithName}</a>
        </nav>
      </header>
      <div className="content">
        <div className="box-section">
          <div className="container">
            <div className="row">
              <div className="box-contain bg-black-900 browser-sec">
                <div className="align-content">
                  <img src="images/unsupported.jpg" alt="" />
                  <h4>Please log into the ARC application with a supported browser. Suggested browsers include Chrome and Firefox.</h4>
                  <p>If you would like to download the app for your mobile device, please contact the person who invited you to get the latest download.</p>
                  <p>{ua}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnsupportedBrowser;
