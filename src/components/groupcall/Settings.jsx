import React from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';

const Settings = ({parent, state, eventTypes}) => {
    return (
        <div className="setting-detail">
            <label >Event Description</label>
            <p className="mb-2">{state.eventDescription}</p>
            {state.isMeetingOwner &&
                <div className="setting-sec">
                    <Dropdown>
                        <label>Type of Event</label>
                        <Dropdown.Toggle as="a" className="btn">
                            {state.eventType}
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            <Dropdown.Item className="checkbox" onClick={() => parent.changeEventType(eventTypes.PRESENTATION)}>
                                <input type="checkbox" readOnly={true} className="checkbox-input" checked={state.eventType === eventTypes.PRESENTATION ? true : false} />
                                <label className="checkbox-lable">{eventTypes.PRESENTATION}</label>
                            </Dropdown.Item >
                            <Dropdown.Item className="checkbox" onClick={() => parent.changeEventType(eventTypes.DISCUSSION)}>
                                <input type="checkbox" readOnly={true} className="checkbox-input" checked={state.eventType === eventTypes.DISCUSSION ? true : false} />
                                <label className="checkbox-lable">{eventTypes.DISCUSSION}</label>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>}
            <label className="mt-3">Audio Settings</label>
            <div className="setting-sec">
                <Dropdown>
                    <label>Microphone</label>
                    <Dropdown.Toggle as="a" className="btn">
                        {state.audioDevice ? state.audioDevice.label : 'Select microphone'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        {!state.audioInputDevices.length &&
                            <Dropdown.Item className="checkbox" >
                                <label className="checkbox-lable">Select microphone</label>
                            </Dropdown.Item >
                        }
                        {
                            state.audioInputDevices.map((v, k) => {
                                return (
                                    <Dropdown.Item className="checkbox" key={`audio-device-${k}`} onClick={() => parent.changeAudioDevice(v)}>
                                        <input type="checkbox" readOnly={true} className="checkbox-input" checked={state.audioDevice?.value === v.value ? true : false} />
                                        <label className="checkbox-lable">{v.label}</label>
                                    </Dropdown.Item >
                                )
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="setting-sec">
                <Dropdown>
                    <label>Speakers</label>
                    { state.isSupportedAudioSelection &&
                        <>
                        <Dropdown.Toggle as="a" className="btn">
                            {state.outputDevice ? state.outputDevice.label : 'Select speaker'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            {!state.audioOutputDevices.length &&
                                <Dropdown.Item className="checkbox" >
                                    <label className="checkbox-lable">Select speaker</label>
                                </Dropdown.Item >
                            }
                            {
                                state.audioOutputDevices.map((v, k) => {
                                    return (
                                        <Dropdown.Item className="checkbox" key={`audio-output-device-${k}`} onClick={() => parent.changeAudioOutputDevice(v)}>
                                            <input type="checkbox" readOnly={true} className="checkbox-input" checked={state.outputDevice?.value === v.value ? true : false} />
                                            <label className="checkbox-lable">{v.label}</label>
                                        </Dropdown.Item >
                                    )
                                })
                            }
                        </Dropdown.Menu>
                        </>
                    }
                    { !state.isSupportedAudioSelection &&
                        <Dropdown.Toggle as="a" className="btn">
                                Your browser doesn't support audio output selection
                        </Dropdown.Toggle>
                    }
                </Dropdown>
            </div>
            <label className="mt-3">Video Settings</label>
            <div className="setting-sec">
                <Dropdown>
                    <label>Camera</label>
                    <Dropdown.Toggle as="a" className="btn">
                        {state.videoDevice ? state.videoDevice.label : 'Select camera'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        {!state.videoInputDevices.length &&
                            <Dropdown.Item className="checkbox" >
                                <label className="checkbox-lable">Select camera</label>
                            </Dropdown.Item >
                        }
                        {
                            state.videoInputDevices.map((v, k) => {
                                return (
                                    <Dropdown.Item className="checkbox" key={`video-device-${k}`} onClick={() => parent.changeVideoDevice(v)} >
                                        <input type="checkbox" readOnly={true} className="checkbox-input" checked={state.videoDevice?.value === v.value ? true : false} />
                                        <label className="checkbox-lable">{v.label}</label>
                                    </Dropdown.Item >
                                )
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            {state.isMeetingOwner &&
                <>
                    <label className="mt-3">Admin Settings</label>

                    <div className="setting-sec">
                        <div className="d-flex align-items-center">
                            <div className="form-group checkbox" onClick={() => parent.handleDisableRemoteVideo(null, !state.allVideoDisabled)}>
                                <input type="checkbox" className="checkbox-input" readOnly={true} checked={state.allVideoDisabled} />
                                <label className="checkbox-lable">Disable video for all users</label>
                            </div>
                        </div>
                    </div>
                    <div className="setting-sec">
                        <div className="d-flex align-items-center">
                            <div className="form-group checkbox" onClick={() => parent.handleDisableRemoteScreenShare(null, !state.allScreenShareDisabled)}>
                                <input type="checkbox" className="checkbox-input" readOnly={true} checked={state.allScreenShareDisabled} />
                                <label className="checkbox-lable">Disable screen share for all users</label>
                            </div>
                        </div>
                    </div>
                    <div className="setting-sec">
                        <div className="d-flex align-items-center">
                            <div className="form-group checkbox" onClick={() => parent.handleDisableRemoteAudio(null, !state.allAudioDisabled)}>
                                <input type="checkbox" className="checkbox-input" readOnly={true} checked={state.allAudioDisabled} />
                                <label className="checkbox-lable">Disable microphones for all users</label>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
Settings.propTypes = {
  parent: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  eventTypes: PropTypes.object.isRequired,
};
export default Settings;