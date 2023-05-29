import React from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';

const ParticipantMainButtons = ({parent}) => {
    return (
        <div className="communication">
            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip>
                        Kick Out All
                    </Tooltip>
                }>
                <a className="box-50 icon-green" href="#" onClick={() => parent.handleAllAttendeeKickout(null)}>
                    <Svg.Kickout/>
                </a>
            </OverlayTrigger>
            { parent.state.btnAllAudioEnable &&
            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip>
                        Mute All
                    </Tooltip>
                }>
                <a className="box-50 icon-green" href="#" onClick={() => parent.handleAllAttendeeMike(null, false)}>
                    <Svg.MikeOnNoColor/>
                </a>
            </OverlayTrigger>
            }
            { !parent.state.btnAllAudioEnable &&
            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip>
                        Can't unmute
                    </Tooltip>
                }>
                <a className="box-50 icon-green" href="#" onClick={() => parent.handleAllAttendeeMike(null, true)}>
                    <Svg.MikeOffNoColor/>
                </a>
            </OverlayTrigger>
            }
            { !parent.state.btnAllVideoEnable &&
            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip>
                        Can't turn on video
                    </Tooltip>
                }>
                <a className="box-50 icon-green" href="#" title="" onClick={() => parent.handleAllAttendeeVideo(null, true)}>
                    <Svg.VideoOffNoColor/>
                </a>
            </OverlayTrigger>
            }
            { parent.state.btnAllVideoEnable &&
            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip>
                        Turn Off Video All
                    </Tooltip>
                }>
                <a className="box-50 icon-green" href="#" title="" onClick={() => parent.handleAllAttendeeVideo(null, false)}>
                    <Svg.VideoOnNoColor/>
                </a>
            </OverlayTrigger>
            }
            <a className="box-50" href="#"></a>
        </div>
        )
}
ParticipantMainButtons.propTypes = {
  parent: PropTypes.object.isRequired,
};
export default ParticipantMainButtons;
