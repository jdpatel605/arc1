import React from "react";
import {AppLogoWithName} from './../utils/Svg';

const UnsupportedFeature = () => {
  return (
    <>
      <header>
        <nav className="navbar">
          <a className="navbar-brand" href="#">{AppLogoWithName}</a>
        </nav>
      </header>
      <div className="content">
        <div className="box-section">
          <div className="container">
            <div className="row">
              <div className="box-contain bg-black-900 browser-sec">
                <div className="align-content">
                  <img src="images/unsupported.jpg" alt="" />
                  <h4>Uh Oh, ARC doesn't support mobile browsers yet.</h4>
                  <p>We're working on adding this feature, but until then, you can join through your desktop browser or the mobile app if you're a beta user.</p>
                  <a className="btn btn-medium btn-green video-btn" href="/" role="button" >
                    Go to home page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnsupportedFeature;
