import React from "react";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import * as Svg from '../../utils/Svg';
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\groupcall\\BottomRightButtons.jsx";

const BottomRightButtons = ({ parent, state, eventTypes, viewMode }) => {

    const manageMobileSettingMenu = () => {
        try {
            parent.changeState('mobileSettingOpen', !parent.state.mobileSettingOpen)
        } catch({ message }) {
            Logger.error({ fileLocation, message, trace: 'manageMobileSettingMenu' })
        }
    }

    return (
        <div className={ classNames({ "bottom-right-bar": true, 'd-none': !state.canJoin || !state.displayWhileScrenShare }) }>
            {
                state.showModeButton === true &&
                <div className={ classNames({ "view-mode": true, "slide-left": state.isRightSideBar }) }>
                    { eventTypes.PRESENTATION === state.eventType &&
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    Theatre Mode
                            </Tooltip>
                            }>
                            <a className={ classNames({ "btn-slide presentation-mode": true, 'd-none': (viewMode.FULL !== state.viewMode) }) } href="#" onClick={ () => parent.changeViewMode(viewMode.PRESENTATION, true) }>
                                <img src="images/presentation-mode.svg" alt="" />
                            </a>
                        </OverlayTrigger>
                    }
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                Full Screen
                            </Tooltip>
                        }>
                        <a className={ classNames({ "btn-slide full-mode": true, "d-none": (viewMode.PRESENTATION !== state.viewMode && viewMode.GRID !== state.viewMode) }) } href="#" onClick={ () => parent.changeViewMode(viewMode.FULL, true) }>
                            <img src="images/view-full.svg" alt="" />
                        </a>
                    </OverlayTrigger>
                    { eventTypes.DISCUSSION === state.eventType &&
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    Grid View
                            </Tooltip>
                            }>
                            <a className={ classNames({ "btn-slide view-grid-mode": true, "d-none": (viewMode.FULL !== state.viewMode) }) } href="#" onClick={ () => parent.changeViewMode(viewMode.GRID, true) }>
                                <img src="images/view-grid.svg" alt="" />
                            </a>
                        </OverlayTrigger>
                    }
                </div>
            }
            <div className={ classNames({ "toggle-mobmenu-btn": true }) } onClick={ () => manageMobileSettingMenu() }>
                <a className={ classNames({ "toggle-menu": true, "btn-close": state.mobileSettingOpen }) } onClick={ () => manageMobileSettingMenu() } href="#">
                    <Svg.MobileToggleSettingButton />
                </a>
            </div>
            <div className={ classNames({ "chat-box-slide": true, "active": state.mobileSettingOpen }) }>
                <div className="slide-chat-btn" onClick={ (e) => parent.manageRightSideBar('user', true) }>
                    <a className="btn-participant" href="#">
                        <img src="images/user-small.png" alt="" />
                        <label>{ Object.keys(state.allMembers).length }</label>
                    </a>
                </div>
                <div className="slide-chat-btn  btn-chat new-notification" onClick={ (e) => parent.manageRightSideBar('chat', true) }>
                    <a href="#">
                        <img src="images/chat-small.png" alt="" />
                    </a>
                    { state.totalUnreadChats > 0 &&
                        <label > { state.totalUnreadChats }</label>
                    }
                </div>
                <div className="slide-chat-btn btn-setting" onClick={ (e) => parent.manageRightSideBar('setting', true) }>
                    <a href="#">
                        <img src="images/gear.png" alt="" />
                    </a>
                </div>
            </div>
        </div>
    )
}
BottomRightButtons.propTypes = {
    parent: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    eventTypes: PropTypes.object.isRequired,
    viewMode: PropTypes.object.isRequired,
};
export default BottomRightButtons;
