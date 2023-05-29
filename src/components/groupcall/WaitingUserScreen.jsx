import React from "react";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';
import TestDevices from "./TestDevices";

const WaitingUserScreen = ({parent, state}) => {
    return (
            <div className="container">
                <div className="row">
                    <div className="box-contain bg-black-900">
                        <div className="text-center">
                            <TestDevices initials={state.loggedInAttenddee} parent={parent}/>
                            <div className="loading-img mb-4">
                                <Svg.Lock/>
                            </div>
                            <div>
                                { !state.isKickedOut &&
                                <>    
                                    <label className={classNames({"d-none": !state.isAdmitted})}>The event admin will securely admit you</label>
                                    <label className={classNames({"clr-red": true, "d-none": state.isAdmitted})}>Admin has rejected your request to enter the call.</label>
                                </>
                                }
                                { state.isKickedOut &&
                                    <label className={classNames({"clr-red": true})}>The event host has kicked you out of the event.</label>
                                }
                                <div className="btn-sec justify-content-center">
                                    <a href="/" className="btn btn-medium bg-black-600 clr-red mr-1">Cancel</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}
WaitingUserScreen.propTypes = {
  parent: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
};
export default WaitingUserScreen;
