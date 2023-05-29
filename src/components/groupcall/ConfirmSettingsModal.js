import React, { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as Svg from '../../utils/Svg';
import { Helper } from '../../utils/helper';
import { useAlert } from 'react-alert'
import { Logger } from './../../utils/logger';

import {
	ConsoleLogger,
	DefaultDeviceController,
	LogLevel,
        DefaultBrowserBehavior
} from 'amazon-chime-sdk-js';

var deviceController = null

const fileLocation = "src\\components\\groupcall\\ConfirmSettingsModal.js";

const ConfirmSettingsModal = ({ initials , parent }) => {
	const [isSettingOpen, setSettingOpen] = useState(false)
	const [audioList, setAudioList] = useState([])
	const [videoList, setVideoList] = useState([])
	const [outputList, setOutputList] = useState([])
	const [selectedAudio, setSelectedAudio] = useState(null)
	const [selectedVideo, setSelectedVideo] = useState(null)
	const [selectedOutput, setSelectedOutput] = useState(null)
	const [isVideoStarted, setVideoStarted] = useState(false)
	const [isAudioStarted, setAudioStarted] = useState(false)
	const [isAudioOutputSupported, setAudioAudioOutputSupported] = useState(true)
	const alert = useAlert()

	const audioVideoSettings = Helper.getAudioVideoSettings()
	const selected = {
		mic: audioVideoSettings?.selectedAudio ,
		camera: audioVideoSettings?.selectedVideo,
		speaker: audioVideoSettings?.selectedOutput,
	}
        
	const audioOutput = document.getElementById('audio-output')
	useEffect(() => {

		try {
			const logger = new ConsoleLogger('WEBSDK', LogLevel.INFO)
			deviceController = new DefaultDeviceController(logger, {enableWebAudio: true})
//			deviceController.enableWebAudio(true)
                        
                        const defaultBrowserBehaviour = new DefaultBrowserBehavior()
                        const isAudioSupported = defaultBrowserBehaviour.supportsSetSinkId()
                        setAudioAudioOutputSupported(isAudioSupported)
                        
			getAudioDevices().then(res => {
				let audioInputsList = []
                                res.forEach((v) => {
                                    audioInputsList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                                })
                                if(audioInputsList.length > 0 && !selected.mic){
                                    selected.mic = audioInputsList[0]
                                }
                                const audio = selected.mic
				selectAudioInput(audio, true)
				setAudioList(audioInputsList)
			})
			getVideoDevices().then(res => {
				let videoInputsList = []
                                res.forEach((v) => {
                                    videoInputsList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                                })
                                if(videoInputsList.length > 0 && !selected.camera){
                                    selected.camera = videoInputsList[0]
                                }
                                const video = selected.camera
				selectVideoInput(video, true)
				setVideoList(videoInputsList)
			})
			getSpeakerDevices().then(res => {
				let audioOutputList = []
                                res.forEach((v) => {
                                    audioOutputList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                                })
                                if(audioOutputList.length > 0 && !selected.speaker){
                                    selected.speaker = audioOutputList[0]
                                }
                                const output = selected.speaker
				selectAudioOutput(output, true)
				setOutputList(audioOutputList)
				setAudioOutput(output)
			})
//			deviceController.setDeviceLabelTrigger(trigger)
			            deviceController.addDeviceChangeObserver(deviceObserver)
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'useEffect:Mount' })
		}
		return () => {
			/* Unmount */
			stopLocalVideo()
			removeLocalAudio()
                        deviceController.removeDeviceChangeObserver(deviceObserver)
		}
	}, [])

	useEffect(() => {
		try {
			if(audioVideoSettings?.isAudioStarted && !isAudioStarted && audioList.length) {
				manageAudioButton()
			}
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'useEffect:audioList' })
		}
	}, [audioList])

	useEffect(() => {
		try {
			if(audioVideoSettings?.isVideoStarted && !isVideoStarted && videoList.length) {
				manageVideoButton()
			}
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'useEffect:videoList' })
		}
	}, [videoList])

	useEffect(() => {
		try {
			if(isVideoStarted) {
				stopLocalVideo()
				startLocalVideo()
			}
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'useEffect:selectedVideo' })
		}
	}, [selectedVideo])

	const trigger = () => {
		try {
			console.log('trigger')
			return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'trigger' })
		}
	}

	const setAudioVideoSettingsInStorage = (key, val) => {
		try {
			Helper.setAudioVideoSettingsInStorage(key, val)
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'setAudioVideoSettingsInStorage' })
		}
	}
	const getAudioDevices = async () => {
		try {
			return await deviceController.listAudioInputDevices()
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'getAudioDevices' })
		}
	}
	const getVideoDevices = async () => {
		try {
			return await deviceController.listVideoInputDevices()
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'getVideoDevices' })
		}
	}
	const getSpeakerDevices = async () => {
		try {
			return await deviceController.listAudioOutputDevices()
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'getSpeakerDevices' })
		}
	}

	const selectAudioInput = (index, fromEffect = false) => {
		try {
			setSelectedAudio(index)
			startMike(index, isAudioStarted)
			setAudioVideoSettingsInStorage('selectedAudio', index)
                        if(!fromEffect){
                            parent.changeAudioDevice(index)
                        }
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'selectAudioInput' })
		}
	}
	const selectVideoInput = async (index, fromEffect = false) => {
		try {
			setSelectedVideo(index)
//                        await deviceController.chooseVideoInputDevice(index.value)
			setAudioVideoSettingsInStorage('selectedVideo', index)
                        if(!fromEffect){
                            parent.changeVideoDevice(index)
                        }
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'selectVideoInput' })
		}
	}
	const selectAudioOutput = (index, fromEffect = false) => {
		try {
			setSelectedOutput(index)
			setAudioOutput(index)
			setAudioVideoSettingsInStorage('selectedOutput', index)
                        if(!fromEffect){
                            parent.changeAudioOutputDevice(index)
                        }
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'selectAudioOutput' })
		}
	}
	const manageVideoButton = () => {
		try {
			const wasOn = isVideoStarted
			if(wasOn) {
				stopLocalVideo()
			} else {
				if(!videoList.length) {
					alert.error('No video input device found')
					return false
				}
				startLocalVideo()
			}
			const status = !isVideoStarted
			setVideoStarted(status)
                        setAudioVideoSettingsInStorage('isVideoStarted', status)
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'manageVideoButton' })
		}
	}
	const manageAudioButton = () => {
		try {
			const wasOn = isAudioStarted
			if(!wasOn) {
				if(!audioList.length) {
					alert.error('No audio input device found')
					return false
				}
				startMike(selectedAudio, true)
			} else {
				removeLocalAudio()
			}
			const status = !isAudioStarted
			setAudioStarted(!isAudioStarted)
                        setAudioVideoSettingsInStorage('isAudioStarted', status)
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'manageAudioButton' })
		}
	}
	const startMike = async (index, isAudiosSarted) => {
		try {
			if(selectedAudio !== null && isAudiosSarted) {
				await deviceController.chooseAudioInputDevice(index.value)
				startAudioPreview()
			}
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'startMike' })
		}
	}
	const startLocalVideo = async () => {
		try {
			if(selectedVideo !== null) {
				await deviceController.chooseVideoInputDevice(selectedVideo.value)
				deviceController.startVideoPreviewForVideoInput(document.getElementById('video-preview'))
			}
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'startLocalVideo' })
		}
	}
	const stopLocalVideo = () => {
		try {
			deviceController.stopVideoPreviewForVideoInput(document.getElementById('video-preview'))
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'stopLocalVideo' })
		}
	}
	const removeLocalAudio = async () => {
		try {
			await deviceController.chooseAudioInputDevice(null)
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'removeLocalAudio' })
		}
	}
	const setAudioOutput = async (index) => {
		try {
			if(selectedOutput !== null) {
				await deviceController.chooseAudioOutputDevice(index.value)
			}
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'setAudioOutput' })
		}
	}

	const deviceObserver = {
		audioInputsChanged: freshAudioInputDeviceList => {
			// An array of MediaDeviceInfo objects
			console.log('Audio inputs updated in confirm: ', freshAudioInputDeviceList);
                        const avs = Helper.getAudioVideoSettings()
                        let isExistCurrentDevice = false
                        let audioList1 = []
                        freshAudioInputDeviceList.forEach((v) => {
                            if(v.deviceId === avs?.selectedAudio?.value){
                                isExistCurrentDevice = true
                            }
                            audioList1.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                        })
                        if(!isExistCurrentDevice){
                            const a = audioList1.length > 0 ? audioList1[0] : null
                            setSelectedAudio(a)
                            selectAudioInput(a)
                        }
			setAudioList(audioList1)
		},
		audioOutputsChanged: freshAudioOutputDeviceList => {
			console.log('Audio outputs updated in confirm: ', freshAudioOutputDeviceList);
                        const avs = Helper.getAudioVideoSettings()
                        let isExistCurrentDevice = false
                        let audioList1 = []
                        freshAudioOutputDeviceList.forEach((v) => {
                            if(v.deviceId === avs?.selectedOutput?.value){
                                isExistCurrentDevice = true
                            }
                            audioList1.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                        })
                        if(!isExistCurrentDevice){
                            const a = audioList1.length > 0 ? audioList1[0] : null
                            setSelectedOutput(a)
                            selectAudioOutput(a)
                        }
			setOutputList(audioList1)
		},
		videoInputsChanged: freshVideoInputDeviceList => {
			console.log('Video inputs updated in confirm: ', freshVideoInputDeviceList);
                        const avs = Helper.getAudioVideoSettings()
                        let isExistCurrentDevice = false
                        let videoList1 = []
                        freshVideoInputDeviceList.forEach((v) => {
                            if(v.deviceId === avs?.selectedVideo?.value){
                                isExistCurrentDevice = true
                            }
                            videoList1.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                        })
                        if(!isExistCurrentDevice){
                            const a = videoList1.length > 0 ? videoList1[0] : null
                            setSelectedVideo(a)
                            selectVideoInput(a)
                            if(isVideoStarted){
                                stopLocalVideo()
                            }
                        }
			setVideoList(videoList1)
		}
	};

        const volumeStyle = {
            width: '100px',
            position: 'absolute',
            left: '5px',
            top: '-15px',
            display: 'flex',
            height: '5px'
        }
        const setAudioPreviewPercent = (percent) => {
            const audioPreview = document.getElementById('audio-preview');
            if(audioPreview){
                updateProperty(audioPreview.style, 'transitionDuration', '33ms');
                updateProperty(audioPreview.style, 'width', `${percent}%`);
                if (audioPreview.getAttribute('aria-valuenow') !== `${percent}`) {
                  audioPreview.setAttribute('aria-valuenow', `${percent}`);
                }
            }
        }
        const updateProperty = (obj, key, value) => {
            if (value !== undefined && obj[key] !== value) {
              obj[key] = value;
            }
        }
        var animationId = null
        const startAudioPreview = () => {
            if(animationId !== null){
                cancelAnimationFrame(animationId)
            }
            setAudioPreviewPercent(0);
            const analyserNode = deviceController.createAnalyserNodeForAudioInput();
            if (!analyserNode) {
                console.log('!analyserNode')
                return;
            }
            if (!analyserNode.getByteTimeDomainData) {
                console.log('!analyserNode.getByteTimeDomainData')
//              document.getElementById('audio-preview').parentElement.style.visibility = 'hidden';
              return;
            }
            const data = new Uint8Array(analyserNode.fftSize);
            
            let frameIndex = 0;
            const analyserNodeCallback = () => {
              if (frameIndex === 0) {
                analyserNode.getByteTimeDomainData(data);
                const lowest = 0.01;
                let max = lowest;
                for (const f of data) {
                  max = Math.max(max, (f - 128) / 128);
                }
                let normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
                let percent = Math.min(Math.max(normalized * 100, 0), 100);
                setAudioPreviewPercent(percent);
              }
              frameIndex = (frameIndex + 1) % 2;
              if(animationId !== null){
                  cancelAnimationFrame(animationId)
              }
              animationId = requestAnimationFrame(analyserNodeCallback);
            };
            animationId = requestAnimationFrame(analyserNodeCallback);
        }
        
        const confirmSettings = () => {
            const setting = {
                audio : isAudioStarted,
                video : isVideoStarted
            }
            parent.confirmWaitingRoomSettings(setting)
        }
	return (
		<Modal className="small-modal confirm-setting-modal" size="sm" show={true} backdrop="static" onHide={() => console.log('on hide')} aria-labelledby="example-modal-sizes-title-lg" >
                <Modal.Header>
                  <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
                    Confirm your Settings
					<p>Below you can toggle your camera and microphone on and off or change their source.</p>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
			<audio id="audio-output" autoPlay={ true } style={ { display: 'none' } }></audio>
			<div className="calling-person">
				<img src="/images/profile-bg.jpg" alt="" className={ classNames({ "d-none": isVideoStarted || initials !== null }) } />
				<video id="video-preview" className={ classNames({ "d-none": !isVideoStarted }) } style={ { width: '100%', height: '100%' } }>
					Your browser does not support the video tag.
                                </video>
				<div className="slide-person-name">
					<div className="member-shortname">
						<label>{ initials }</label>
					</div>
					{/* <label class="person-name">Andrew D.</label> */}
				</div>
			</div>
			<div className="btn-section calling-btn mb-4">
                                <div style={volumeStyle}>
                                    <div id="audio-preview" style={{ borderRadius: '5px', height: '5px', width: '0px', display: 'flex', flexDirection: 'column', backgroundColor: '#18b99a', position: 'absolute', bottom: '0'}}>&nbsp;</div>
                                </div>
                                <a className={ classNames({ "btn btn-round bg-black-500 call-microphone-btn": true, active: isAudioStarted, stop: !isAudioStarted }) } href="#" onClick={ () => { manageAudioButton() } }>
					<div className={ classNames({ "microphone": true, active: isAudioStarted }) }>
						<Svg.MikeOn />
					</div>
					<div className={ classNames({ "microphone-mute": true, active: !isAudioStarted }) }>
						<Svg.MikeOff />
					</div>
				</a>
				<a className={ classNames({ "btn btn-round bg-black-500 call-video-btn": true, active: isVideoStarted, stop: !isVideoStarted }) } href="#" onClick={ () => { manageVideoButton() } }>
					<div className={ classNames({ "video": true, active: isVideoStarted }) }>
						<Svg.VideoOn />
					</div>
					<div className={ classNames({ "video-mute": true, active: !isVideoStarted }) }>
						<Svg.VideoOff />
					</div>
				</a>
			</div>
                        <div className="setting-detail">
                                <label>Audio Settings</label>
                                <div className="setting-sec">
                                        <Dropdown>
                                                <label>Microphone</label>
                                                <Dropdown.Toggle as="a" className="btn">
                                                        { selectedAudio ? selectedAudio.label : 'No audio input device found' }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu >
                                                        { !audioList.length &&
                                                                <Dropdown.Item className="checkbox" >
                                                                        <label className="checkbox-lable">Select microphone</label>
                                                                </Dropdown.Item >
                                                        }
                                                        {
                                                                audioList.length && audioList.map((v, k) => {
                                                                        return (
                                                                                <Dropdown.Item className="checkbox" key={ `audio-device-${k}` } onClick={ () => selectAudioInput(v) }>
                                                                                        <input type="checkbox" readOnly={ true } className="checkbox-input" checked={ selectedAudio?.value === v.value ? true : false } />
                                                                                        <label className="checkbox-lable">{ v.label }</label>
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
                                                { isAudioOutputSupported &&
                                                    <>
                                                    <Dropdown.Toggle as="a" className="btn">
                                                            { selectedOutput ? selectedOutput.label : 'No audio output device found' }
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu >
                                                            { !outputList.length &&
                                                                    <Dropdown.Item className="checkbox" >
                                                                            <label className="checkbox-lable">Select speaker</label>
                                                                    </Dropdown.Item >
                                                            }
                                                            {
                                                                    outputList.length && outputList.map((v, k) => {
                                                                            return (
                                                                                    <Dropdown.Item className="checkbox" key={ `audio-output-device-${k}` } onClick={ () => selectAudioOutput(v) }>
                                                                                            <input type="checkbox" readOnly={ true } className="checkbox-input" checked={ selectedOutput?.value === v.value ? true : false } />
                                                                                            <label className="checkbox-lable">{ v.label }</label>
                                                                                    </Dropdown.Item >
                                                                            )
                                                                    })
                                                            }
                                                    </Dropdown.Menu>
                                                    </>
                                                }
                                                { !isAudioOutputSupported &&
                                                    <Dropdown.Toggle as="a" className="btn">
                                                            Your browser doesn't support audio output selection
                                                    </Dropdown.Toggle>
                                                }
                                        </Dropdown>
                                </div>
                                <label>Video Settings</label>
                                <div className="setting-sec">
                                        <Dropdown>
                                                <label>Camera</label>
                                                <Dropdown.Toggle as="a" className="btn">
                                                        { selectedVideo ? selectedVideo.label : 'No camera found' }
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu >
                                                        { !videoList.length &&
                                                                <Dropdown.Item className="checkbox" >
                                                                        <label className="checkbox-lable">Select camera</label>
                                                                </Dropdown.Item >
                                                        }
                                                        {
                                                                videoList.length && videoList.map((v, k) => {
                                                                        return (
                                                                                <Dropdown.Item className="checkbox" key={ `video-device-${k}` } onClick={ () => selectVideoInput(v) } >
                                                                                        <input type="checkbox" readOnly={ true } className="checkbox-input" checked={ selectedVideo?.value === v.value ? true : false } />
                                                                                        <label className="checkbox-lable">{ v.label }</label>
                                                                                </Dropdown.Item >
                                                                        )
                                                                })
                                                        }
                                                </Dropdown.Menu>
                                        </Dropdown>
                                </div>
                        </div>
				
			
		</Modal.Body>
                <Modal.Footer className="justify-content-center">
                  <button type="button" className={'btn btn-green lg-box btn-medium '}
                    onClick={(e) => confirmSettings()} >
                    Confirm Setting </button>
                </Modal.Footer>
              </Modal>
	)
}

ConfirmSettingsModal.defaultProps = {
	initials: null,
	parent: null,
}
ConfirmSettingsModal.propTypes = {
	initials: PropTypes.string,
	parent: PropTypes.object,
};

export default ConfirmSettingsModal
