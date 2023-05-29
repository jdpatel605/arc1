import React from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';

const ParticipantIndividualButtons = ({parent, participantValue}) => {
    return (
        <div className="communication right-action">
            { parent.state.isMeetingOwner && participantValue.role !== 'owner' &&
            <>
                {/*<OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Kick-Out</Tooltip>}>
                    <a className="box-50 icon-red" href="#/" title="" onClick={() => parent.handleAllAttendeeKickout(participantValue.identifier)}>
                        <Svg.Kickout/>
                    </a>
                </OverlayTrigger>*/}
                { participantValue.mikeEnabled &&
                    <OverlayTrigger
                        placement='top'
                        overlay={<Tooltip>Mute microphone</Tooltip>}>
                        <a className="box-50" href="#" title="" onClick={() => parent.handleAllAttendeeMike(participantValue.identifier, false)}>
                            <Svg.MikeOnNoColor/>
                        </a>
                    </OverlayTrigger>
                }
                { !participantValue.mikeEnabled &&
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Can't Unmute microphone</Tooltip>}>
                        <a className="box-50" href="#" title="" onClick={() => parent.handleAllAttendeeMike(participantValue.identifier, true)}>
                            <Svg.MikeOffNoColor/>
                        </a>
                    </OverlayTrigger>
                }
                { !participantValue.videoEnabled &&
                    <OverlayTrigger
                        placement='top'
                        overlay={<Tooltip>Can't turn on video</Tooltip>}>
                        <a className="box-50" href="#" title="" onClick={() => parent.handleAllAttendeeVideo(participantValue.identifier, true)}>
                            <Svg.VideoOffNoColor/>
                        </a>
                    </OverlayTrigger>
                }
                { participantValue.videoEnabled &&
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Turn off video</Tooltip>}>
                    <a className="box-50" href="#"  title="" onClick={() => parent.handleAllAttendeeVideo(participantValue.identifier, false)}>
                        <Svg.VideoOnNoColor/>
                    </a>
                </OverlayTrigger>
                }
                <div className="box-50">
                    <Dropdown>
                        <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
                            {Svg.KebabIcon}
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight="true" className="option-menu">
                            <Dropdown.Item onClick={() => parent.handleAllAttendeeKickout(participantValue.identifier)} className="img-block-user clr-red">Kick User</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </>
            }
            { participantValue.identifier !== parent.loginUserId && false && /* remove false when implement breakout */
            <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Start Breakout</Tooltip>}>
                    <a className="box-50" href="#" onClick={() => parent.startBreakout(participantValue.identifier)}>
                        <Svg.Breakout/>
                    </a>
            </OverlayTrigger>
            }
            </div>
        )
}
ParticipantIndividualButtons.propTypes = {
  parent: PropTypes.object.isRequired,
  participantValue: PropTypes.object.isRequired,
};
export default ParticipantIndividualButtons;