import React from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';

const ParticipantHoverButtons = ({parent, idPrefix, dataId, isVideo, displayButton, participant}) => {
    return (
    <>
        { displayButton === true &&
        <div className="calling-activity">
            <div className={classNames({"btn-section":true})}>
                <a className={classNames({"btn btn-round bg-black-500 call-microphone-btn": true, active:!parent.state.allAudioDisabled && participant.mikeEnabled, stop: !parent.state.allAudioDisabled && !participant.mikeEnabled  , disabled: parent.state.allAudioDisabled})} href="#" onClick={() => parent.handleGridViewNameMike(dataId)} id={`handle-mike-${idPrefix}-${dataId}`}>
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                { parent.state.allAudioDisabled ? 'Microphone is disabled' : 'Mute User' }
                            </Tooltip>
                        }>
                        <div className={classNames({"microphone": true, active: participant.mikeEnabled })}  data-toggle="tooltip" data-placement="top" id={`mute-audio-${idPrefix}-${dataId}`}>
                            <Svg.MikeOn/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                { parent.state.allAudioDisabled ? 'Microphone is disabled' : 'Can\'t unmute user'}
                            </Tooltip>
                        }>
                        <div className={classNames({"microphone-mute": true, active: !participant.mikeEnabled})} id={`unmute-audio-${idPrefix}-${dataId}`}>
                            <Svg.MikeOff/>
                        </div>
                    </OverlayTrigger>
                </a>
                <a className={classNames({"btn btn-round bg-black-500 call-video-btn": true, "active": !parent.state.allVideoDisabled  && participant.videoEnabled, "stop": !parent.state.allVideoDisabled  && !participant.videoEnabled, disabled: parent.state.allVideoDisabled})} onClick={() => parent.handleGridViewNameVideo(dataId) } id={`pause-${idPrefix}-${dataId}`} href="#">
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                Turn off video
                            </Tooltip>
                        }>
                        <div className={classNames({"video": true, "active": participant.videoEnabled})} id={`pause-video-${idPrefix}-${dataId}`} title="">
                            <Svg.VideoOn/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                { parent.state.allVideoDisabled ? 'Video is disabled' : 'Can\'t turn on participant video'}
                            </Tooltip>
                        }>
                        <div className={classNames({"video-mute": true, "active": !participant.videoEnabled})} id={`play-video-${idPrefix}-${dataId}`} title="">
                            <Svg.VideoOff/>
                        </div>
                    </OverlayTrigger>
                </a>
            </div>
        </div>
        }
    </>
        )
}
ParticipantHoverButtons.defaultProps = {
    displayButton: true,
    participant: {},
}
ParticipantHoverButtons.propTypes = {
  parent: PropTypes.object.isRequired,
  idPrefix: PropTypes.string.isRequired,
  dataId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]).isRequired,
  isVideo: PropTypes.bool.isRequired,
  displayButton: PropTypes.bool,
  participant: PropTypes.object,
};
export default ParticipantHoverButtons;
