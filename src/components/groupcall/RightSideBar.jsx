import React from "react";
import classNames from 'classnames';
import Settings from './Settings';
import ParticipantList from './ParticipantList';
import PropTypes from 'prop-types';
import Chats from './Chats';

const RightSideBar = ({parent, state, eventTypes, alertType}) => {
    return (
        <>
            <div className="close-action" onClick={(e) => parent.manageRightSideBar('close', false)}>
                <a href="#">
                    <img src="images/icon-right-arrow.png" />
                </a>
            </div>
            <div className="tab-section">
                <ul id="tabs" className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a id="tab-A" href="#pane-A" className={classNames({"nav-link": true, "active show": state.activeSideBar === 'user'})} onClick={(e) => parent.manageRightSideBar('user', true)}>Participants</a>
                    </li>
                    <li className="nav-item">
                        <a id="tab-B" href="#pane-B" className={classNames({"nav-link": true, "active show": state.activeSideBar === 'chat'})} onClick={(e) => parent.manageRightSideBar('chat', true)}>
                            <label>Chat
                            {state.totalUnreadChats > 0 &&
                                <div className="NewChat"></div>
                            }
                            </label>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a id="tab-C" href="#pane-C" className={classNames({"nav-link": true, "active show": state.activeSideBar === 'setting'})} onClick={(e) => parent.manageRightSideBar('setting', true)}>Settings</a>
                    </li>
                </ul>
                <div id="content" className="tab-content" role="tablist">
                    <div id="pane-A" className={classNames({"card tab-pane fade": true, "show active": state.activeSideBar === 'user'})} role="tabpanel" aria-labelledby="tab-A">
                        <div className="card-header" role="tab" id="heading-A">
                            <h5 className="mb-0">
                                <a data-toggle="collapse" href="#collapse-A" aria-expanded="true" aria-controls="collapse-A">
                                    Participants
                                </a>
                            </h5>
                        </div>
                        <div id="collapse-A" className="collapse show" data-parent="#content" role="tabpanel"
                            aria-labelledby="heading-A">
                            <ParticipantList parent={parent} state={state}></ParticipantList>
                        </div>
                    </div>
                    <div id="pane-B" className={classNames({"card tab-pane fade": true, "show active": state.activeSideBar === 'chat'})} role="tabpanel" aria-labelledby="tab-B">
                        <Chats parent={parent} state={state} alertType={alertType}></Chats>
                    </div>
                    <div id="pane-C" className={classNames({"card tab-pane fade": true, "show active": state.activeSideBar === 'setting'})} role="tabpanel" aria-labelledby="tab-C">
                        <div className="card-header" role="tab" id="heading-C">
                            <h5 className="mb-0">
                                <a className="collapsed" data-toggle="collapse" href="#collapse-C" aria-expanded="false"
                                    aria-controls="collapse-C">
                                    Settings
                                </a>
                            </h5>
                        </div>
                        <div id="collapse-C" className="collapse" data-parent="#content" role="tabpanel" aria-labelledby="heading-C">
                            <Settings parent={parent} state={state} eventTypes={eventTypes}></Settings>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
RightSideBar.propTypes = {
  parent: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  eventTypes: PropTypes.object.isRequired,
  alertType: PropTypes.object.isRequired,
};
export default RightSideBar;
