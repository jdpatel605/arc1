import React, {  Component } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal'
import { withAlert } from 'react-alert'
import { connect } from 'react-redux';
import { compose } from "redux";
import { isMobile } from "react-device-detect";
import Draggable from 'react-draggable'
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MultiLogger,
  MeetingSessionPOSTLogger,
  MeetingSessionConfiguration,
  MeetingSessionStatusCode,
  DefaultModality,
  DefaultActiveSpeakerPolicy,
  DefaultBrowserBehavior,
  SimulcastLayers,
  Versioning
} from 'amazon-chime-sdk-js';

//import members from './members.json'

import Swiper from 'react-id-swiper';
import classNames from 'classnames';
import { Logger } from './../../utils/logger';
import {SOCKET_URL, API_URL} from "../../config"
import InviteToGroupModal from './InviteToGroupModal';
import TruncationText from './../common/TruncationText';
import ParticipantHoverButtons from './ParticipantHoverButtons';
import ParticipantNameOnVideo from './ParticipantNameOnVideo';
import Header from './Header';
import LeaveModal from './LeaveModal';
import WaitingUserScreen from './WaitingUserScreen';
import RightSideBar from './RightSideBar';
import BottomRightButtons from './BottomRightButtons';
import WaitingTone from './WaitingTone';
import MeetingErrorModal from './MeetingErrorModal';
import ConfirmSettingsModal from './ConfirmSettingsModal';
import {Socket} from "phoenix"
import moment from "moment"
import {eventsByIdRequest, createBreakoutRequest} from "../../store/actions";
import {Helper} from '../../utils/helper';
import * as Svg from '../../utils/Svg';
import FetchInterceptor from 'fetch-intercept';

const fileLocation = "src\\components\\groupcall\\index.js";
const swiperNextButton = '.swiper-button-next'
const swiperPrevButton = '.swiper-button-prev'
const swiperParamsPres = {
        slidesPerView: 4,
        spaceBetween: 8,
        freeMode: true,
        setWrapperSize: true,
        navigation: {
            nextEl: swiperNextButton,
            prevEl: swiperPrevButton,
        },
    }
const swiperParamsGrid = {
            slidesPerView: 3,
            slidesPerColumn: 2,
            freeMode: true,
            setWrapperSize: true,
            navigation: {
                nextEl: swiperNextButton,
                prevEl: swiperPrevButton,
            },
        }
const swiperParamsFull = {
        slidesPerView: 6,
        spaceBetween: 8,
        freeMode: true,
        setWrapperSize: true,
        navigation: {
            nextEl: swiperNextButton,
            prevEl: swiperPrevButton,
        },
        breakpoints: {
            1371: {
                slidesPerView: 6,
            },
            1100: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 4,
            },
            992: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 3,
            },
            600: {
                slidesPerView: 2,
            },
            500: {
                slidesPerView: 1,
            }
        }
    }
const eventTypes = {
    PRESENTATION : 'Presentation',
    DISCUSSION : 'Discussion',
}
const viewMode = {
    GRID : 'GRID',
    FULL: 'FULL',
    PRESENTATION: 'PRESENTATION'
}
const videoIds = {
    GRID: 'grid',
    FULL: 'full',
    PRESENTATION: 'presentation'
}
const alertType = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
}
const eventPrefix = 'event-'
const constants = {
    ON: 'on',
    OFF: 'off',
    ENABLED: 'enabled',
    DISABLED: 'disabled',
}

const LOGGER_BATCH_SIZE = 85
const LOGGER_INTERVAL_MS = 2000

const EmptyTag = () => {
   return <></>
}

// Register interceptor hooks
const interceptor = FetchInterceptor.register({
    request: function (url, config) {
        // Modify the url or config here
        
        const chimeUrl = url.split('/').pop()
        if(chimeUrl === 'chime-error-log'){
            let authToken = Helper.authHeader()
            authToken = {...authToken, 'Content-Type': 'application/json',}
            if(config && config.headers){
                const headers = { ...authToken, ...config.headers}
                config = {...config, headers}
            }else{
                const headers = authToken
                config = {...config, headers}
            }
        }
//        console.log(url, config)
        return [url, config];
    },

    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
    },

    response: function (response) {
        // Modify the reponse object
        return response;
    },

    responseError: function (error) {
        // Handle an fetch error
        return Promise.reject(error);
    }
});

 class Groupcall extends Component{
     constructor(props) {
        super(props);
        this.startVideo = this.startVideo.bind(this);
        this.endCall = this.endCall.bind(this);
        this.stopVideo = this.stopVideo.bind(this);
        this.playVideo = this.playVideo.bind(this);
        this.manageRightSideBar = this.manageRightSideBar.bind(this);
        this.muteUnmuteMe = this.muteUnmuteMe.bind(this);
        this.handleLocalVideo = this.handleLocalVideo.bind(this);
        this.state ={
            eventDescription: null,
            errorMsg: '',
            videoDevice: null,
            audioDevice: null,
            outputDevice: null,
            meetingId: null,
            attendeeId: null,
            isRightSideBar: false,
            activeSideBar: null,
            enableMyVideo: false,
            enableMymike: false,
            screenShare: false,
            inviteBox: false,
            meetingUrl: '',
            admitDropdown: false,
            breakoutDropdown: false,
            isLoaded: false,
            eventType: eventTypes.PRESENTATION,
//            eventType: eventTypes.DISCUSSION,
            viewMode: viewMode.FULL,
//            viewMode: viewMode.GRID,
            mainVideoId: videoIds.FULL,
            gridMemberLength: 0,
            isMeetingOwner: false,
            allMembers: {},
            newMembers: {},
            groupedUser: {},
            loggedInAttenddee: null,
            currentEventId: null,
            showModeButton: true,
            btnAllVideoEnable: false,
            btnAllAudioEnable: false,
            localVideoDisabled: false,
            localAudioDisabled: false,
            localScreenShareDisabled: false,
            allVideoDisabled: false,
            allAudioDisabled: false,
            allScreenShareDisabled: false,
            canJoin: null,
            audioInputDevices: [],
            videoInputDevices: [],
            audioOutputDevices: [],
            chatTo: 'Everyone',
            isChatListOpen: false,
            chatMsg: '',
            allChats: {},
            activeChat: null,
            totalUnreadChats: 0,
            isAdmitted: true,
            speakingUserId: null,
            breakoutInvitations: {},
            mobileSettingOpen: false,
            playWaitingTone: false,
            showLocalVideo: null,
            chatFile: null,
            isEventError: false,
            eventError: null,
            reloadOnError: false,
            videoButtonClicked: false,
            isKickedOut: false,
            showFirstTimeInviteModal: false,
            unjoinedMembers: {},
            kickedMembers: {},
            showSettingBox: false,
            screenShareStarted: false,
            screenShareTileActive: true,
            displayWhileScrenShare: true,
            dragablePosition: null, 
            currentUser: {},
            isHoverFlag: false,
            isSupportedAudioSelection: true,
            showLeaveModal: false
        };
        this.activeModeId = videoIds.FULL
        this.members = 17;
        this.logger = null
        this.deviceController = null
        this.meetingSession = null
        this.selfAttendeeId = '';
        this.contentSharedId = null
        this.contentShareStarted = false
        this.event = {}
        this.eventApiLoaded = false
        this.loginUserId = false
        this.chatNewMsgIndex = {}
        this.chatNewMsgCount = {}
        this.chatUserDetails = {}
        this.breakoutCreated = false
        this.mainEventId = null
        this.breakoutEventId = null
        this.activeEventId = null
        this.meetingStarted = false
        this.socket = null
        this.screenShareEventRecieved = false
        this.isConnected = true
        this.originalEventType = null
        this.canClickVideoButton = true
        this.canClickAudioButton = true
        this.canClickScreenButton = true
        this.canClickViewModeButton = true
        this.canStartLocalVideo = true
        this.reConnectTimeOut = false
        this.setTimeoutObj = null
        this.hasJoinedEvent = false
        this.userControles = {}
        this.localVideoTileId = null
        this.settingConfirmed = true
        this.applyActiveSpeaker = true
        this.isPausedAllVideo = false
        this.timedelay = 1
        this.screenShareTileId = null
        this.dragedData = null
        
        this.childRef = React.createRef()
    }
    delayCheck = () => {
        if(this.timedelay === 10)
        {
            if(this.state.screenShareStarted && !this.state.inviteBox && !this.state.isRightSideBar && !this.state.admitDropdown && !this.state.isHoverFlag){
                this.changeState( 'displayWhileScrenShare',  false );
            }
            this.timedelay = 1
        }
        this.timedelay = this.timedelay + 1
    }
    setHoverFlag = ( flag ) => {
        this.changeState( 'isHoverFlag',  flag );
    }
    handleChange = (name, e) => {
        this.changeState( name,  e.target.value );
    }
    changeEventType(type){
        if(type !== this.state.eventType){
            this.changeEventState(type)
            this.event[this.activeEventId].push("cmd", {"type": "switch-view", "payload": {"to": type}})
            localStorage.setItem(eventPrefix + this.activeEventId, JSON.stringify({type: type}))
            this.saveFullModeToStorage()
        }
    }
    changeEventState(type){
        this.changeState('eventType', type)
        this.changeViewMode(viewMode.FULL)
    }
    showInviteBox = (val) => {
        this.changeState('inviteBox' , val);
    }
    showWaitingList = () => {
        this.changeState('admitDropdown' , !this.state.admitDropdown);
    }
    showBreakoutList = () => {
        this.changeState('breakoutDropdown' , !this.state.breakoutDropdown);
    }
    async changeState(name, val){
        await this.setState({ [name]: val });
    }
    async changeMemberState(name, val, id = null){
        try{
            if(id){
                await this.setState(prevState => ({
                    ...prevState,
                    [name]: {...prevState[`${name}`], [id]: val},
                }));
            }else{
                await this.setState(prevState => ({
                    ...prevState,
                    [name]: val,
                }));
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'changeMemberState' })
        }
    }
    setKeyFromQueryString(search, set){
        const urlParams = new URLSearchParams(this.props.location.search)
        const key = urlParams.get(search)
        if(key){
            this.changeState(set, key)
        }else{
            this.changeState(set, null)
        }
    }
    setEventType(newType){
        try{
            const currentEventId = this.activeEventId
            const currentEventType = this.state.eventType
            let eTp = newType.toLowerCase() === eventTypes.PRESENTATION.toLowerCase() ? eventTypes.PRESENTATION : eventTypes.DISCUSSION
            if(newType.toLowerCase() !== currentEventType.toLowerCase() ){
                const obj = {type: eTp}
                localStorage.setItem(eventPrefix + currentEventId, JSON.stringify(obj))

                this.changeEventState(eTp)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setEventType' })
        }
    }
    componentDidUpdate(nextProps){
        try{
            const currentEventId = this.activeEventId
            const currentEventType = this.state.eventType
            if(currentEventId !== null){
                const eventData = this.getEventFromLocalStorage(currentEventId)
                if(nextProps.eventDetails && nextProps.eventDetails.type && this.eventApiLoaded === false){
                    this.eventApiLoaded = true
                    this.changeState('eventDescription', nextProps.eventDetails.description)
                    const eType = nextProps.eventDetails.type
                    let eTp = eType.toLowerCase() === eventTypes.PRESENTATION.toLowerCase() ? eventTypes.PRESENTATION : eventTypes.DISCUSSION
                    this.originalEventType = eTp
                    /*if(eType.toLowerCase() !== currentEventType.toLowerCase() || eventData){
                        if(eventData){
                            eTp = eventData.type
                        }else{
                            const obj = {type: eTp}
                            localStorage.setItem(eventPrefix + currentEventId, JSON.stringify(obj))
                        }
                        this.changeEventState(eTp)
                    }*/
                }
                if(nextProps.breakout && nextProps.breakout.flag === 1 && this.breakoutCreated === false ){
                    const breakout = nextProps.breakout.data
                    this.breakoutCreated = true
                    const data= {
                        breakout_id: breakout.identifier,
                        from: this.loginUserId,
                        name: breakout.name
                    }
                    this.event[this.mainEventId].push(`breakout:${breakout.identifier}:invite`, {"identifier": breakout.invited_user_id})
                }
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'componentDidUpdate' })
        }
    }
    getEventFromLocalStorage(id){
        let eventData = localStorage.getItem(eventPrefix + id)
        if(eventData){
            eventData = JSON.parse(eventData)
            return eventData
        }
        return null
    }
    setScreenShareHeight(){
        const ele = document.getElementById('main-calling-div')
        if(ele){
            if(this.contentShareStarted === true){
                ele.classList.add('full-screen-calling')
            }else{
                ele.classList.remove('full-screen-calling')
            }
        }
    }
    setDragablePosition() {
        const bodyWidth = document.querySelector('body').offsetWidth
        const bodyHeight = document.querySelector('body').offsetHeight
//        console.log('this.dragedData', this.dragedData, bodyWidth, bodyHeight)
        if(this.dragedData){
            if( this.dragedData.x ){
                let newX = this.dragedData.x
                if(this.dragedData.x > bodyWidth){
                    let diff = (this.dragedData.x - bodyWidth)
                    if(diff <= 500){
                        diff = 500
                    }
                    newX = bodyWidth - diff
                    if(newX < 0){
                        newX = 0
                    }
                    this.fakeDrag()
                }
                let newY = this.dragedData.y
//                if(this.dragedData.y <= 0 || (this.dragedData.y <= 150 && ( bodyHeight <= 150 || ( bodyHeight - this.dragedData.y >= 150 ) ) ) ){
                if(this.dragedData.y <= 0 || (this.dragedData.y <= 150) ){
//                if(this.dragedData.y > bodyHeight){
//                    newY = 0
                    this.fakeDrag()
                }
//                console.log('newX', newX, 'newY', newY)
//                this.changeState('dragablePosition', { x: newX, y: -newY})
            }
            
            else if( this.dragedData.changedTouches && this.dragedData.changedTouches[0] ){
                const changeData = this.dragedData.changedTouches[0]
                let diff = (changeData.screenX - bodyWidth)
                if(diff < 500){
                    diff = 500
                }
                let newX = bodyWidth - diff
                if(newX < 0){
                    newX = 0
                    this.fakeDrag()
                }
                let newY = changeData.clientY
//                if(changeData.clientY > bodyHeight){
//                if(changeData.clientY < bodyHeight){
                if(changeData.clientY <= 0 || (changeData.clientY <= 150)){
                    newY = 0
                    this.fakeDrag()
                }
//                console.log('newX', newX)
//                this.changeState('dragablePosition', { x: newX, y: -newY } )
            }
        }
    }
    onWindowResize = () => {
        this.fakeDrag();
    }

    fakeDrag = () => {
        const clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent ("mousedown", true, true);
        this.childRef.current.dispatchEvent(clickEvent);
    }
    async componentDidMount(){
        try{
            Helper.setReferrerURL();
            console.log('sdk version : ', Versioning.sdkVersion)
            this.changeState('isLoaded', true)
            this.loginUserId = localStorage.getItem('identifier')
            if(isMobile){
                window.location = '/unsupported-feature'
                return
            }
            await this.setKeyFromQueryString('mid', 'meetingId')
            await this.setKeyFromQueryString('aid', 'attendeeId')
            await this.setKeyFromQueryString('e', 'currentEventId')
            this.startVideo()
            document.addEventListener("mousemove", (e) => {
                this.timedelay = 1
                if(!this.state.displayWhileScrenShare){
                    this.changeState( 'displayWhileScrenShare',  true );
                }
                clearInterval(this._delay);
                this._delay = setInterval(this.delayCheck, 500);
            });
            this._delay = setInterval(this.delayCheck, 500)
            document.addEventListener("click", (e) => {
                const isOpen = this.state.isChatListOpen
                if(isOpen && e.target.id !== 'selected-chat-user'){
                    this.changeState('isChatListOpen', false)
                }
            });
            
            window.addEventListener('resize', (e) => {
                this.setDragablePosition()
//                this.onWindowResize()
            });
            
            this.callType = localStorage.getItem('callType')
            if(this.callType === 'event'){
                this.changeState('showFirstTimeInviteModal', true)
                localStorage.removeItem('callType');
            }
            this.setAudioVideoSetings()

            const browser = new DefaultBrowserBehavior({enableUnifiedPlanForChromiumBasedBrowsers: true})
            const isSupported = browser.isSupported()
            const supportedBrowsers = browser.supportString()
            if(!isSupported){
                this.changeState('isEventError', true)
                this.changeState('eventError', `Supported browsers are : ${supportedBrowsers}`)
            }
            const isSupportedAudioSelection = browser.supportsSetSinkId()
            this.changeState('isSupportedAudioSelection', isSupportedAudioSelection)
            
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'componentDidMount' })
        }
    }
    setDisabledButtons(control){
        try{
            const allAudioDisable = control.audio === constants.DISABLED ? true : false
            const allVideoDisable = control.video === constants.DISABLED ? true : false
            const allScreenShareDisable = control.screen_share === constants.DISABLED ? true : false
            // set local buttons using event controls value
            if(!this.state.isMeetingOwner){
                this.setLocalDisabledButtons(control)
            }
            
            if(allAudioDisable){
                this.changeState('allAudioDisabled', true)
            }
            if(allVideoDisable){
                this.changeState('allVideoDisabled', true)
            }
            if(allScreenShareDisable){
                this.changeState('allScreenShareDisabled', true)
            }
            
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setDisabledButtons' })
        }
    }
    setLocalDisabledButtons(control){
        try{
            const audioDisable = control.audio === constants.DISABLED ? true : false
            const videoDisable = control.video === constants.DISABLED ? true : false
            const screenShareDisable = control.screen_share === constants.DISABLED ? true : false
            if(!this.state.allAudioDisabled){
                this.changeState('localAudioDisabled', audioDisable)
            }
            if(!this.state.allVideoDisabled){
                this.changeState('localVideoDisabled', videoDisable)
            }
            if(!this.state.allScreenShareDisabled){
                this.changeState('localScreenShareDisabled', screenShareDisable)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setLocalDisabledButtons' })
        }
    }
    setAudioVideoSetings(){
        try{
            const allAudioDisable = Helper.getAudioVideoSettings('allAudioDisabled')
            const allVideoDisable = Helper.getAudioVideoSettings('allVideoDisabled')
            const allScreenShareDisable = Helper.getAudioVideoSettings('allScreenShareDisabled')
            const localVideoDisable = Helper.getAudioVideoSettings('localVideoDisabled')
            const localScreenShareDisable = Helper.getAudioVideoSettings('localScreenShareDisabled')
            const localAudioDisable = Helper.getAudioVideoSettings('localAudioDisabled')
            if(allAudioDisable){
                this.changeState('allAudioDisabled', true)
            }
            if(allVideoDisable){
                this.changeState('allVideoDisabled', true)
            }
            if(allScreenShareDisable){
                this.changeState('allScreenShareDisabled', true)
            }
            if(localVideoDisable){
                this.changeState('localVideoDisabled', true)
            }
            if(localScreenShareDisable){
                this.changeState('localScreenShareDisabled', true)
            }
            if(localAudioDisable){
                this.changeState('localAudioDisabled', true)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setAudioVideoSetings' })
        }
    }
    audioVideoDidStartConnecting(reconnecting){ /* used in chime */
        console.log('--------------------------------------------')
        console.log(`session connecting. reconnecting: ${reconnecting}`);
        if(reconnecting){
//            window.location.reload()
        }
    }
    audioVideoDidStart(){ /* used in chime */
        try{
            console.log('--------------------------------------------')
            console.log('session started');
            this.meetingStarted = true
            this.canClickVideoButton = true
            this.canClickAudioButton = true
            this.canClickScreenButton = true
            this.canClickViewModeButton = true

            if(this.isConnected){
                if(this.state.enableMymike === false){
                    this.meetingSession.audioVideo.realtimeMuteLocalAudio();
                }
                if(this.settingConfirmed){
//                const myMic = Helper.getAudioVideoSettings('enableMymike')
                   const myMic = this.userControles.audio === constants.ON ? true : false
//                if(myMic !== false && this.state.enableMymike === false){
                    if(myMic === true && this.state.enableMymike === false && !this.state.localAudioDisabled){
                        this.muteUnmuteMe()
                    }

                    const myVideo = this.userControles.video === constants.ON ? true : false
                    if(myVideo === true && this.state.enableMyVideo === false && this.canStartLocalVideo && !this.state.localVideoDisabled){
                        this.handleLocalVideo()
                    }
                }
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'audioVideoDidStart' })
        }
    }
    audioVideoDidStop(sessionStatus){ /* used in chime */
        const code = sessionStatus.statusCode()
        console.log('audiovideo did stop ', code)
        if (code === MeetingSessionStatusCode.AudioCallEnded) {
          this.stopVideo()
          return
        }
        if(code === MeetingSessionStatusCode.ICEGatheringTimeoutWorkaround || code === MeetingSessionStatusCode.ConnectionHealthReconnect || code === MeetingSessionStatusCode.TaskFailed){
            this.isConnected = false
        }
    }
    contentShareDidStart (){ /* used in chime */
        console.log('Screen share started');
        this.changeState('screenShare', true)
        this.event[this.activeEventId].push("cmd", {"type": "screenShare", "payload": {"id": this.loginUserId, 'type': 'start'}})
    }
    contentShareDidStop () { /* used in chime */
        // Chime SDK allows 2 simultaneous content shares per meeting.
        // This method will be invoked if two attendees are already sharing content
        // when you call startContentShareFromScreenCapture or startContentShare.
        console.log('Screen share stopped');
        this.changeState('screenShare', false)
        this.event[this.activeEventId].push("cmd", {"type": "screenShare", "payload": {"id": this.loginUserId, 'type': 'stop'}})
    }
    videoTileDidUpdate(tileState) { /* used in chime */
        console.log(`video tile updated: `);
        try{
            
            if (!tileState.boundAttendeeId ) {
                return false;
            }
            const memberList = this.state.allMembers
            const uId = tileState.boundExternalUserId
            this.selfAttendeeId = this.meetingSession.configuration.credentials.attendeeId;
            
            const modality = new DefaultModality(tileState.boundAttendeeId);
            const attendeeIdOrg = modality.base()
            const isContentTile = modality.hasModality(DefaultModality.MODALITY_CONTENT)
            if (attendeeIdOrg === this.selfAttendeeId && isContentTile) {
              // don't bind one's own content
              return false;
            }
            console.log('tileState', tileState, memberList[uId])
            
            if(tileState.localTile && tileState.active){
                this.changeState('enableMyVideo', true)
                this.sendVideoStatusToAdmin(null, true)
                this.changeState('showLocalVideo', true)
                this.changeState('videoButtonClicked', false)
                this.localVideoTileId = tileState.tileId
            }
            
            if(isContentTile && this.contentSharedId && this.contentSharedId !== attendeeIdOrg){
                return false
            }
            
            let tileIndex = tileState.localTile ? 16 : uId;

            if(this.contentSharedId === null){
                this.contentSharedId = isContentTile ? attendeeIdOrg : null
            }
            
            if(memberList[uId]){
                if(isContentTile){
                    memberList[uId].tileActive = tileState.active
                    memberList[uId].screenEnabled = true
                    memberList[uId].screenIndex = tileIndex
                    memberList[uId].screenTileId = tileState.tileId
                    memberList[uId].screenSrc = tileState.boundVideoStream
                    this.screenShareTileId = tileState.tileId
                    this.changeState('screenShareStarted', true)
                    this.changeState('screenShareTileActive', tileState.active)
                }else{
                    memberList[uId].tileActive = tileState.active
                    if(tileState.localTile){
                        memberList[uId].videoEnabled = tileState.active
                    }else{
                        memberList[uId].videoEnabled = true
                    }
                    memberList[uId].isPaused = tileState.paused
                    memberList[uId].videoIndex = tileIndex
                    memberList[uId].videoTileId = tileState.tileId
                    memberList[uId].videoSrc = tileState.boundVideoStream
                }
                this.changeMemberState('allMembers', memberList[uId], uId)
                this.manageGlobalVideoButton()
            }
            
            let elementId = tileIndex === 16 ? '' : `${this.state.mainVideoId}-`
            if(isContentTile){
                elementId = 'main-screen-share'
                tileIndex = ''
            }
            const videoElement = document.getElementById(`video-${elementId}${tileIndex}`);
            
            console.log(`binding video tile ${tileState.tileId} to ${videoElement.id}`);
            this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
            
            setTimeout(() => {
                const mainVideo = document.getElementById(`video-main-${uId}`)
                const presentationVideo = document.getElementById(`video-${videoIds.PRESENTATION}-${uId}`)
                const gridVideo = document.getElementById(`video-${videoIds.GRID}-${uId}`)
                const screenShareVideo = document.getElementById(`video-main-screen-share`)
                console.log('presentationVideo', presentationVideo)
                if(isContentTile){
                    if(screenShareVideo){
                        screenShareVideo.srcObject = tileState.boundVideoStream
                        this.saveOldModeForScreenShare()
                        this.contentShareStarted = true
//                        this.setScreenShareHeight()
                    }
                }else{
                    if(mainVideo){
                        mainVideo.srcObject = tileState.boundVideoStream
                    }
                    if(presentationVideo){
                        presentationVideo.srcObject = tileState.boundVideoStream
                    }
                    if(gridVideo){
                        gridVideo.srcObject = tileState.boundVideoStream
                    }
                }
                
                if(this.isPausedAllVideo && !tileState.localTile){
                    this.pauseUnpauseSingleVideo(memberList[uId], false)
                }
                
            },300)
            
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'videoTileDidUpdate' })
        }
    }
    handlePresenceChange = (presentAttendeeId, present, externalUserId) => { /* used in chime */
        try{
            const isContentAttendee = new DefaultModality(presentAttendeeId).hasModality(DefaultModality.MODALITY_CONTENT);
            if(present){
                
            }else{
                if(isContentAttendee){
                    this.contentSharedId = null
                    this.contentShareStarted = false
                    this.setScreenShareHeight()
                }
                
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handlePresenceChange' })
        }
    }
    addClassToGridView(){
        try{
            const totalUsers = Object.keys(this.state.allMembers).length
            const slider = document.getElementById('grid-view-slider').children
            const container = slider[0].children
            const wraper = container[0]
            wraper.classList.remove('oneslide')
            wraper.classList.remove('twoslide')
            wraper.classList.remove('threeslide')
            wraper.classList.remove('fourslide')
            wraper.classList.remove('fiveslide')
            wraper.classList.remove('sixslide')
            if(totalUsers === 2){
                wraper.classList.add('oneslide')
            }else if(totalUsers === 3){
                wraper.classList.add('twoslide')
            }else if(totalUsers === 4){
                wraper.classList.add('threeslide')
            }else if(totalUsers === 5){
                wraper.classList.add('fourslide')
            }else if(totalUsers === 6){
                wraper.classList.add('fiveslide')
            }else if(totalUsers === 7){
                wraper.classList.add('sixslide')
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'addClassToGridView' })
        }
    }
    
    manageLocalVideoTile(isSHow){
        this.changeState('showLocalVideo', isSHow)
    }
    getUserFromTileId(tileId) {
        const memberList = this.state.allMembers
        let detail = {}
        Object.keys(memberList).map((v) => {
            const user = memberList[v]
            if(user.videoTileId === tileId){
                detail = user
                return v
            }else if(user.screenTileId === tileId){
                detail = user
                return v
            }
        })
        return detail
    }
    
    encodingSimulcastLayersDidChange(simulcastLayer) {  /* used in chime */
        const SimulcastLayerMapping = {
            [SimulcastLayers.Low]: 'Low',
            [SimulcastLayers.LowAndMedium]: 'Low and Medium',
            [SimulcastLayers.LowAndHigh]: 'Low and High',
            [SimulcastLayers.Medium]: 'Medium',
            [SimulcastLayers.MediumAndHigh]: 'Medium and High',
            [SimulcastLayers.High]: 'High',
        };
        console.log(
          `current active simulcast layers changed to: `, SimulcastLayerMapping[simulcastLayer]
        );
    }
    
    videoTileWasRemoved(tileId){ /* used in chime */
        console.log(`video tile removed: ${tileId}`);
        
        try{
            const user = this.getUserFromTileId(tileId)
            if(user.name){
                console.log('removed video user ', user)
                const memberList = this.state.allMembers
                this.meetingSession.audioVideo.unbindVideoElement(tileId)
                const uId = user.identifier
                if(user.videoTileId === tileId){
                    memberList[uId].videoEnabled = false
                    memberList[uId].isPaused = false
                    memberList[uId].videoIndex = null
                    memberList[uId].videoTileId = null
                    memberList[uId].videoSrc = null
                }else{
                    this.contentSharedId = null
                    this.contentShareStarted = false
                    this.setScreenShareHeight()
                    
                    memberList[uId].screenEnabled = false
                    memberList[uId].screenIndex = null
                    memberList[uId].screenTileId = null
                    memberList[uId].screenSrc = null
                    
                    this.changeState('screenShareStarted', false)
                    this.changeState('screenShareTileActive', true)
                    this.changeState( 'displayWhileScrenShare',  true );
                    if(this.screenShareEventRecieved){
                        this.removeOldModeForScreenShare()
                    }
                }
                
                this.changeMemberState('allMembers', memberList)
                this.manageGlobalVideoButton()
            }else{
                if(this.screenShareTileId === tileId){
                    this.contentSharedId = null
                    this.contentShareStarted = false
                    this.setScreenShareHeight()
                    this.changeState('screenShareStarted', false)
                    this.changeState('screenShareTileActive', true)
                    this.changeState( 'displayWhileScrenShare',  true );
                    if(this.screenShareEventRecieved){
                        this.removeOldModeForScreenShare()
                    }
                    this.screenShareTileId = null
                }
            }
            
            if(this.localVideoTileId === tileId){
                console.log('removing local video')
                this.changeState('showLocalVideo', null)
                this.changeState('videoButtonClicked', false)
                if(this.state.enableMyVideo){
                    this.stopLocalVideo()
                }
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'videoTileWasRemoved' })
        }
    }
    
    videoAvailabilityDidChange(availability){ /* used in chime */
        this.canStartLocalVideo = availability.canStartLocalVideo
        console.log(`video availability changed: canStartLocalVideo  ${availability.canStartLocalVideo}`);
    }
    connectionDidBecomePoor(){ /* used in chime */
        this.showAlert(`Your connection is poor.`, alertType.ERROR)
    }
    connectionDidBecomeGood(){ /* used in chime */
        this.showAlert(`Yay! Your connection is good now.`, alertType.SUCCESS)
    }
    connectionDidSuggestStopVideo(){ /* used in chime */
        this.showAlert(`We recommend turning off your video to get a better experience.`)
    }
    videoSendDidBecomeUnavailable(){ /* used in chime */
        this.showAlert(`sending video is not available`, alertType.ERROR)
    }
    videoNotReceivingEnoughData(data){ /* used in chime */
//        console.log('---------------------------------')
//        console.log('videoNotReceivingEnoughData', data)
        data.map((v) => {
            const user = this.getAttendeeDetailFromId(v.attendeeId)
            console.log('video not received for user ', user?.name)
            if(user?.videoTileId){
                const tile = this.meetingSession.audioVideo.getVideoTile(user.videoTileId)
//                console.log(tile)
                if(tile && tile.tileState.boundVideoStream){
//                    console.log(tile.tileState.boundVideoStream.getVideoTracks())
                }else{
//                    console.log('no stream bounded to ', user?.name)
                }
            }
            return v
        })
    }
    connectionHealthDidChange(data){ /* used in chime */
//        console.log('---------------------------------')
//        console.log('connectionHealthDidChange', data)
    }
    metricsDidReceive(data){ /* used in chime */
//        console.log('---------------------------------')
//        console.log('metricsDidReceive', data)
    }
    videoSendBandwidthDidChange(newKbps, oldKbps, ackCountperSec){ /* used in chime */
//        console.log('---------------------------------')
//        console.log('videoSendBandwidthDidChange', newKbps, oldKbps, ackCountperSec)
    }
    videoReceiveBandwidthDidChange(newKbps, oldKbps){ /* used in chime */
//        console.log('---------------------------------')
//        console.log('videoReceiveBandwidthDidChange', newKbps, oldKbps)
    }
    estimatedDownlinkBandwidthLessThanRequired(estimated, required){ /* used in chime */
//        console.log('---------------------------------')
//        console.log('estimatedDownlinkBandwidthLessThanRequired', estimated, required)
    }
    
    getAttendeeDetailFromId(attendeeId){
        const memberList = this.state.allMembers
        let detail = {}
        Object.keys(memberList).map((v) => {
            const user = memberList[v]
            if(user.bridge_identifier === attendeeId){
                detail = user
                return v
            }
        })
        return detail
    }
    async setMemberList(newList, isMainEvent){
        try{
            return new Promise( async (resolve) => {
                const memberList = this.state.allMembers
                const loggedInUserId = this.loginUserId
                const l = newList
                l.initials = this.getIntialName(l.name)
                l.videoEnabled = false
                l.mikeEnabled = false
                l.videoIndex = -1
                if(isMainEvent){
                    l.breakout = 'Main Event'
                }else{
                    l.breakout = 'Breakout Event'
                }
                if(l.role === 'owner' && this.state.isMeetingOwner !== true && loggedInUserId === l.identifier){
                    await this.changeState('isMeetingOwner', true)
                }
                memberList[l.identifier] = l
                this.chatUserDetails[l.identifier] = l
                const sorted = this.setGroupMembers(memberList)
                await this.changeMemberState('allMembers', sorted)
                if(loggedInUserId === l.identifier){
                    this.setLoginUserName()
                    this.changeState('currentUser', l)
                }else{
                    if(!this.state.speakingUserId){
                        this.changeState('speakingUserId', l.identifier)
                    }
                }
                this.addClassToGridView()
                resolve()
            })
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setMemberList' })
        }
    }
    
    setAsCurrentUserIfNotSet(userId){ /* used from Header.jsx */
        if(this.loginUserId !== userId){
            this.loginUserId = userId
            if(!this.state.loggedInAttenddee){
                this.setLoginUserName()
                if( this.state.allMembers[this.loginUserId] ){
                    this.changeState('currentUser', this.state.allMembers[this.loginUserId])
                    if(this.state.allMembers[this.loginUserId].role === 'owner'){
                        this.changeState('isMeetingOwner', true)
                    }
                }
                else if(this.state.newMembers[this.loginUserId]){
                    this.changeState('currentUser', this.state.newMembers[this.loginUserId])
                }
            }
        }
    }
    
    setGroupMembers(memberList){
        try{
            const sorted = Object.entries(memberList)
            .sort((a, b) => { return a[1]['name'].toLowerCase() < b[1]['name'].toLowerCase() ? -1 : (a[1]['name'].toLowerCase() > b[1]['name'].toLowerCase() ? 1 : 0) })
            .reduce((acc, pair) => {
              acc[pair[0]] = pair[1]
              return acc
            }, {})
            const groupedUser = {}
            Object.keys(sorted).map((v) => {
                if(groupedUser[sorted[v].breakout]){
                    groupedUser[sorted[v].breakout][sorted[v].identifier] = sorted[v]
                }else{
                    groupedUser[sorted[v].breakout] = {}
                    groupedUser[sorted[v].breakout][sorted[v].identifier] = sorted[v]
                }
                return v
            })
            
            this.changeMemberState('groupedUser', groupedUser)
            return sorted
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setGroupMembers' })
        }
    }
    setWaitingUserList(newList){
        try{
            const newMemberList = this.state.newMembers
            const loggedInUserId = this.loginUserId
            const l = newList
            const uId = l.identifier
            l.initials = this.getIntialName(l.name)
            l.alertShow = true
            l.hideAlert = this.addAlertTimer(l)
            newMemberList[uId] = l
            this.changeMemberState('newMembers', newMemberList)
            if(loggedInUserId === uId){
                this.setLoginUserName()
                this.changeState('currentUser', l)
            }else{
                if(!this.state.playWaitingTone){
                    this.changeState('playWaitingTone', true)
                }
            }
            if(this.state.showFirstTimeInviteModal){
                this.changeState('showFirstTimeInviteModal', false)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setWaitingUserList' })
        }
    }
    setUnjoinedUserList(newList){
        try{
            const newMemberList = this.state.unjoinedMembers
            const loggedInUserId = this.loginUserId
            const l = {
                email: newList.email,
                identifier: newList.identifier,
                mobile_phone_number: newList.mobile_phone_number,
                name: newList.name ? newList.name : ( newList.email ? newList.email : newList.mobile_phone_number )
            }
            l.initials = this.getIntialName(l.name)
            const uId = l.identifier
            newMemberList[uId] = l
            this.changeMemberState('unjoinedMembers', newMemberList)
            
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setUnjoinedUserList' })
        }
    }
    removeUnjoinedUser(id){
        const newmemberList = this.state.unjoinedMembers
        if(newmemberList[id]){
            delete newmemberList[id]
            this.changeState('unjoinedMembers', newmemberList)
        }
    }
    removeUnjoiedUserFromState(newUser){
        const old = this.state.unjoinedMembers
        for ( var i in old) {
            let isExist = false
            newUser.forEach( (v) => {
                if(i === v.identifier){
                    isExist = true
                }
            } )
            if(!isExist){
                console.log('!isExist', old[i])
                delete old[i]
            }
        }
        this.changeMemberState('unjoinedMembers', old)
    }
    
    setKickedUserList(newList){
        try{
            const newMemberList = this.state.kickedMembers
            const loggedInUserId = this.loginUserId
            const l = {
                email: newList.email,
                identifier: newList.identifier,
                mobile_phone_number: newList.mobile_phone_number,
                name: newList.name ? newList.name : ( newList.email ? newList.email : newList.mobile_phone_number )
            }
            l.initials = this.getIntialName(l.name)
            const uId = l.identifier
            newMemberList[uId] = l
            this.changeMemberState('kickedMembers', newMemberList)
            
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setKickedUserList' })
        }
    }
    removeKickedUserFromState(newUser){
        const old = this.state.kickedMembers
        for ( var i in old) {
            let isExist = false
            newUser.forEach( (v) => {
                if(i === v.identifier){
                    isExist = true
                }
            } )
            if(!isExist){
                delete old[i]
            }
        }
        this.changeMemberState('kickedMembers', old)
    }
    removeMemberFromList(list){
        try{
            if(this.loginUserId !== list.identifier) {
                const memberList = this.state.allMembers
                if(memberList[list.identifier]){
                    delete memberList[list.identifier]
                }
                const sorted = this.setGroupMembers(memberList)
                this.changeState('allMembers', sorted)
            }
            const newmemberList = this.state.newMembers
            if(newmemberList[list.identifier]){
                delete newmemberList[list.identifier]
            }
            this.changeState('newMembers', newmemberList)
            if(Object.keys(newmemberList).length <= 0){
                this.changeState('admitDropdown', false)
            }
            this.addClassToGridView()
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'removeMemberFromList' })
        }
    }
    hideWaitingAlert(identifier){
        const newmemberList = this.state.newMembers
        const user = newmemberList[identifier]
        if(user){
            user.alertShow = false
            user.hideAlert = null
            newmemberList[identifier] = user
            this.changeState('newMembers', newmemberList)
        }
    }
    addAlertTimer(user){
        if(user.alertShow){
            const identifier = user.identifier
            setTimeout( ()=> {
                this.hideWaitingAlert(identifier)
            }, 2000, identifier )
        }
    }
    setLoginUserName(){
        try{
            const loggedInUser = this.loginUserId
            if(this.state.allMembers[loggedInUser]){
                const name = this.state.allMembers[loggedInUser].initials
                this.changeState('loggedInAttenddee', name)
            }else if(this.state.newMembers[loggedInUser]){
                const name = this.state.newMembers[loggedInUser].initials
                this.changeState('loggedInAttenddee', name)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setLoginUserName' })
        }
    }
    showAlert(msg, type){
        if(this.state.canJoin){
            if(type === alertType.SUCCESS){
                this.props.alert.success(msg)
            }else if(type === alertType.ERROR){
                this.props.alert.error(msg)
            }else{
                this.props.alert.show(msg)
            }
        }
    }
    manageGlobalMikeButton(){
        try{
            let isMikeEnabled = false
            let cnt = 0
            Object.keys(this.state.allMembers).map((v) => {
                const user = this.state.allMembers[v]
                if(user.identifier !== this.loginUserId && user.mikeEnabled){
                    cnt++
                }
                return v
            })
            if(cnt > 0 ){
                isMikeEnabled = true
            }
            this.changeState('btnAllAudioEnable', isMikeEnabled)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'manageGlobalMikeButton' })
        }
    }
    manageGlobalVideoButton(){
        try{
            let isVideoEnabled = false
            let cnt = 0
            Object.keys(this.state.allMembers).map((v) => {
                const user = this.state.allMembers[v]
                if(user.identifier !== this.loginUserId && user.videoEnabled){
                    cnt++
                }
                return v
            })
    //        if(cnt === (Object.keys(this.state.allMembers).length -1) ){
            if(cnt > 0 ){
                isVideoEnabled = true
            }
            this.changeState('btnAllVideoEnable', isVideoEnabled)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'manageGlobalVideoButton' })
        }
    }
    prepareUnJoinMember(data){
        const obj = {}
        if(data.type === 'guest'){
            obj.identifier = data.identifier
            obj.name = data.text
            obj.email = data.text
            obj.mobile_phone_number = data.text
        }else{
            obj.identifier = data.identifier
            obj.email = data.email
            obj.mobile_phone_number = data.mobile_phone_number
            obj.name = data.name ? data.name : ( data.email ? data.email : data.mobile_phone_number )
        }
        return obj
    }
    async startVideo(){
        this.changeState('errorMsg', '');
        try{
            // Join User with socket connection
            const url = new URL(window.location.href);
            const eventId = url.searchParams.get('e');
            const breakoutId = url.searchParams.get('b');
            const type = url.searchParams.get('type');
            if (eventId) {
                let jwt = localStorage.getItem(eventId);
                if(!jwt){
                    jwt = localStorage.getItem('accessToken');
                    if(!jwt){
                        localStorage.setItem('reload', true);
                        window.location = '/'
                        return
                    }
                    localStorage.setItem(eventId, jwt)
                }
                this.props.eventsByIdRequest(eventId);
                this.mainEventId = eventId
                this.breakoutEventId = eventId
                this.activeEventId = breakoutId ? breakoutId : eventId;
                const params = {params: {token: jwt}};
                this.socket = new Socket(SOCKET_URL, params)
                this.socket.connect();
                this.socket.onClose( (reason) => {
                    console.log("the phoenix connection has gone away gracefully") 
//                    this.isConnected = false
                    /*this.setTimeoutObj = setTimeout(() => {
                        //display reload popup if reconnect after 30 sec
                        this.reConnectTimeOut = true
                    }, 30000)*/
                })
                let isStateSent = false
                // Join with event
                const allEvents = [ eventId ]
                if(breakoutId){
                    allEvents.push(breakoutId)
                }
                allEvents.map((evntId) => {
                    this.event[evntId] = this.socket.channel(`event:${evntId}`,{});
                    this.event[evntId].join()
                    .receive("ok", resp => { console.log("Joined successfully for eventId ", evntId, resp) })
                    .receive("error", resp => { console.log("Unable to join evntId ", evntId, resp) })
                    .receive("timeout", () => console.log("Networking issue. Still waiting... for event id ", evntId));
                    // Get the Chime details
                    this.event[evntId].on("join", async chimeData => {
                        if(evntId !== this.activeEventId){
                            return
                        }
                        /*if(!this.isConnected){
//                            window.location.reload()
                            if(this.reConnectTimeOut){
                                this.changeState('isEventError', true)
                                this.changeState('reloadOnError', true)
                                this.changeState('eventError', null)
                            }
                            clearTimeout(this.setTimeoutObj)
                            return
                        } */
                        console.log('user controles', chimeData.controls)
                        this.userControles = chimeData.controls
                        this.setLocalDisabledButtons(chimeData.controls)
                        this.changeState('canJoin', true)
                        
                        const showSettingBox = Helper.getAudioVideoSettings('showSettingBox')
                        if(!this.state.isMeetingOwner && showSettingBox){
                            this.changeState('showSettingBox', true)
                            this.settingConfirmed = false
                        }
                        
                        if(!this.hasJoinedEvent || !this.isConnected){
                            this.hasJoinedEvent = true
                            this.isConnected = true
                        }else{
                            return
                        }
                        // Configure meeting
                        const meet = {
                            meeting : chimeData.response_body,
                            attendee: chimeData.attendee.response_body
                        }
//                          return;
                        await this.configureMeeting(meet);
                        this.meetingSession.audioVideo.addContentShareObserver(this)
                        this.meetingSession.audioVideo.addObserver(this)
                        this.joinMeeting();
                    })
                    
                    this.event[evntId].on("kicked", msg => { 
                        if(evntId !== this.activeEventId){
                            return
                        }
                        this.changeState('canJoin', false)
                        this.changeState('isKickedOut', true)
                        console.log("kickout received", msg) 
                    })
                    this.event[evntId].on("wait", msg => { 
                        if(evntId !== this.activeEventId){
                            return
                        }
                        this.changeState('canJoin', false)
                        this.changeState('isKickedOut', false)
                        console.log("WAIT message received", msg) 
                    })
                    this.event[evntId].on("error", msg => { console.log("ERROR message received for eventid ", evntId, msg) })
                    this.event[evntId].on("event:attendee:joined", data => {
                        console.log('event:attendee:joined event id', evntId)
                        console.log('event:attendee:joined', data)
                        const memberList = this.state.allMembers
                        if(!memberList[data.identifier]){
                            this.setMemberList(data, evntId === this.mainEventId)
                        }
                        if(data.role === 'owner' && this.loginUserId !== data.identifier){
                            if(this.state.localAudioDisabled === false){
                                this.sendMikeStatusToAdmin(data.identifier, this.state.enableMymike)
                            }
                        }
                        if(this.loginUserId === data.identifier){
                            this.setLoginUserName()
                        }
                    })
                    this.event[evntId].on("event:attendee:left", data => {
                        console.log('event:attendee:left event id', evntId)
                        const u = this.getAttendeeDetailFromId(data.bridge_identifier)
                        console.log('event:attendee:left', data, u)
                        this.removeMemberFromList(data)
                    })
                    this.event[evntId].on("event:waitee:joined", data => {
                        console.log('event:waitee:joined event id', evntId)
                        console.log('event:waitee:joined', data)
                        this.setWaitingUserList(data)
                    })
                    this.event[evntId].on("event:waitee:left", data => {
                        console.log('event:waitee:left event id', evntId)
                        console.log('event:waitee:left', data)
                        this.removeMemberFromList(data)
                    })
                    this.event[evntId].on("event:unjoined:left", data => {
                        console.log('event:unjoined:left event id', evntId)
                        console.log('event:unjoined:left', data)
                        this.removeUnjoinedUser(data.identifier)
                    })
                    this.event[evntId].on("event:unjoined:added", data => {
                        console.log('event:unjoined:added event id', evntId)
                        console.log('event:unjoined:added', data)
                        const obj = this.prepareUnJoinMember(data)
                        this.setUnjoinedUserList(obj)
                    })
                    this.event[evntId].on("event:attendee:disconnected", data => {
                        console.log('event:attendee:disconnected event id', evntId)
                        console.log('event:attendee:disconnected', data)
                    })
                    this.event[evntId].on("event:state", async data => {
                        console.log('event:state event id', evntId)
                        console.log('event:state', data)
                        
                        this.setEventType(data.event_type)
                        
                        let i = 0
                        let j = 0
//                        data.attendees.map( async (v) => {
                        for(let k = 0; k < data.attendees.length; k++){
                            const v = data.attendees[k]
                            i++
                            const memberList = this.state.allMembers
                            if(!memberList[v.identifier]){
                                j++;
                                await this.setMemberList(v, evntId === this.mainEventId).then(res => console.log('member list set for user'))
                                console.log('in for loop ', k)
                            }
//                            return v
                        }
//                        })
                        const totalMemberList = this.state.allMembers
                        console.log('loop iterated for i ', i, 'j', j, 'total attendee in state', data.attendees.length, 'members in state', Object.keys(totalMemberList).length)
                        
                        for(let k = 0; k < data.waitees.length; k++){
                            const v = data.waitees[k]
                            await this.setWaitingUserList(v)
                        }
                        
                        for(let k = 0; k < data.unjoined_attendees.length; k++){
                            const v = data.unjoined_attendees[k]
                            const obj = this.prepareUnJoinMember(v)
                            await this.setUnjoinedUserList(obj)
                        }
                        this.removeUnjoiedUserFromState(data.unjoined_attendees)
                        
                        for(let k = 0; k < data.kickeds.length; k++){
                            const v = data.kickeds[k]
                            await this.setKickedUserList(v)
                        }
                        this.removeKickedUserFromState(data.kickeds)
                        
//                        data.waitees.map( async (v) => {
//                            await this.setWaitingUserList(v)
//                            return v
//                        })

                        this.setDisabledButtons(data.event_control)
                        
                        if(this.state.isMeetingOwner && !isStateSent){
                            isStateSent = true
                            this.event[evntId].push('state:send', {})
                        }
                    })
                    this.event[evntId].on("cmd", msg => {
                        console.log('cmd received', msg)
                        if(this.state.isMeetingOwner === false){
                            if(msg.type === 'switch-view'){
                                const eventData = msg.payload
                                localStorage.setItem(eventPrefix + this.activeEventId, JSON.stringify({type : eventData.to}))
                                this.changeEventState(eventData.to)
                                this.saveFullModeToStorage()
                                this.showAlert(`Admin has changed the event type to ${eventData.to}.`)
                            }
                        }
                        if(msg.type === 'screenShare'){
                                const eventData = msg.payload
                                if(eventData.id !== this.loginUserId){
                                    const userName = this.state.allMembers[eventData.id]?.name
                                    if(eventData.type === 'start'){
                                        this.screenShareEventRecieved = true
                                        this.saveOldModeForScreenShare()
                                        this.showAlert(`${userName} has started screen sharing.`)
                                    }else{
                                        this.removeOldModeForScreenShare()
                                        this.screenShareEventRecieved = false
                                        this.showAlert(`${userName} has stopped screen sharing.`)
                                    }
                                }
                        }
                        if(msg.type === 'remoteVideo'){
                            const eventData = msg.payload
                                console.log('remotevideo current user id', this.loginUserId)
                                if(eventData.from !== this.loginUserId){
                                    const enabled = this.state.enableMyVideo
                                    console.log('local video status', enabled)
                                    if(eventData.to !== null){
                                        if( eventData.to === this.loginUserId){
                                            if(eventData.enable !== enabled){
                                                if(enabled === true){
                                                    this.handleLocalVideo()
                                                    this.showAlert(`Admin has turned off your video.`)
                                                }else{
                                                    this.showAlert(`Admin has requested to turn on video`)
                                                }
                                            }
                                        }
                                    }else{
                                        if(eventData.enable !== enabled){
                                            if(enabled === true){
                                                this.handleLocalVideo()
                                                this.showAlert(`Admin has turned off your video.`)
                                            }else{
                                                this.showAlert(`Admin has requested to turn on video`)
                                            }
                                        }
                                    }
                                }
                        }
                        if(msg.type === 'remoteMike'){
                            const eventData = msg.payload
                                if(eventData.from !== this.loginUserId){
                                    const enabled = this.state.enableMymike
                                    if(eventData.to !== null){
                                        if( eventData.to === this.loginUserId){
                                            if(eventData.enable !== enabled){
                                                if(enabled === true){
                                                    this.muteUnmuteMe()
                                                    this.showAlert(`Admin has muted you.`)
                                                }else{
                                                    this.showAlert(`Admin has requested to unmute your microphone`)
                                                }
                                            }
                                        }
                                    }else{
                                        if(eventData.enable !== enabled){
                                            if(enabled === true){
                                                this.muteUnmuteMe()
                                                this.showAlert(`Admin has muted you.`)
                                            }else{
                                                this.showAlert(`Admin has requested to unmute your microphone`)
                                            }
                                        }
                                    }
                                }
                        }
                        if(msg.type === 'disableAudio'){
                            const eventData = msg.payload
                                if(eventData.from !== this.loginUserId){
                                    if(eventData.to !== null){
                                        if( eventData.to === this.loginUserId){
                                            this.disableAudio(eventData.enable, true)
                                        }
                                    }else{
                                        this.disableAudio(eventData.enable, true)
                                    }
                                }
                        }
                        if(msg.type === 'disableVideo'){
                            const eventData = msg.payload
                                if(eventData.from !== this.loginUserId){
                                    if(eventData.to !== null){
                                        if( eventData.to === this.loginUserId){
                                            this.disableVideo(eventData.enable, true)
                                        }
                                    }else{
                                        this.disableVideo(eventData.enable, true)
                                    }
                                }
                        }
                        if(msg.type === 'disableScreenShare'){
                            const eventData = msg.payload
                                if(eventData.from !== this.loginUserId){
                                    if(eventData.to !== null){
                                        if( eventData.to === this.loginUserId){
                                            this.disableScreenShare(eventData.enable, true)
                                        }
                                    }else{
                                        this.disableScreenShare(eventData.enable, true)
                                    }
                                }
                        }
                        if(msg.type === 'attendeeMikeUpdated'){
                            const eventData = msg.payload
                                if(eventData.from !== this.loginUserId && this.state.isMeetingOwner){
                                    const memberList = this.state.allMembers
                                    const user = memberList[eventData.from]
                                    if(user){
                                        memberList[eventData.from].mikeEnabled = eventData.enable
                                        this.changeMemberState('allMembers', memberList[eventData.from], eventData.from)
//                                        this.manageGridAudioButton(eventData.from, eventData.enable)
                                        this.manageGlobalMikeButton()
                                    }
                                }
                        }
                        if(msg.type === 'kickOut'){
                            const eventData = msg.payload
                                const sendFromAdmin = this.getIsAdmin(eventData.from)
                                if(eventData.from !== this.loginUserId && sendFromAdmin){
                                    
                                        const etype = eventData.type
                                        let endType = 2
                                        if(etype === 'ended'){
                                            endType = 3
                                        }
                                    if(this.state.canJoin || endType === 3){
                                        if(eventData.to !== null){
                                            if( eventData.to === this.loginUserId){
                                                this.stopVideo(endType)
                                            }
                                        }else{
                                            this.stopVideo(endType)
                                        }
                                    }
                                }
                        }
                        if(msg.type === 'userRejected'){
                            const eventData = msg.payload
                                if(eventData.user !== this.loginUserId ){
                                    const newmemberList = this.state.newMembers
                                    if(newmemberList[eventData.user]){
                                        delete newmemberList[eventData.user]
                                    }
                                    this.changeState('newMembers', newmemberList)
                                    if(Object.keys(newmemberList).length <= 0){
                                        this.changeState('admitDropdown', false)
                                    }
                                }else{
                                    this.changeState('isAdmitted', false)
                                }
                        }
                        if(msg.type === 'invitation'){
                            const eventData = msg.payload
                            const allInvitations = this.state.breakoutInvitations
                            allInvitations[eventData.breakout_id] = eventData
                            allInvitations[eventData.breakout_id].isAccepted = false
                            allInvitations[eventData.breakout_id].user_name = this.state.allMembers[eventData.from].name
                            this.changeState('breakoutInvitations', allInvitations)
                        }
                    })
                    this.event[evntId].on("message:new", msg => { 
                        if(msg.type === 'broadcast'){
                            if(msg.user.identifier !== this.loginUserId ){
                                this.setChatMessages('Everyone', msg)
                            }
                        }else{
                            this.setChatMessages(msg.user.identifier, msg)
                        }
                    })
                    this.event[evntId].on("breakout:created", msg => {
                        console.log("New breakout created", msg)
                    })
                    this.event[evntId].on("breakout:invite", data => {
                        console.log("New breakout invitation", data)
                    })
                    return evntId
                })
            }
        }catch(err){
            console.log(err);
            console.log(err.response);
            Logger.error({ fileLocation, message: err.message, trace: 'startVideo' })
        }
    }
    disableAudio(newStatus, displayAlert){
        const enabled = this.state.localAudioDisabled
        const mikeEnabled = this.state.enableMymike
        if(newStatus !== enabled){
            if(mikeEnabled){
                this.muteUnmuteMe()
            }
            this.changeState('localAudioDisabled', newStatus)
            if(displayAlert){
                if(enabled === true){
                    this.showAlert(`Admin has permitted you to use your microphone.`, alertType.SUCCESS)
                }else{
                    this.showAlert(`Admin has disabled your microphone.`)
                }
            }
            Helper.setAudioVideoSettingsInStorage('localAudioDisabled', newStatus)
        }
    }
    disableVideo(newStatus, displayAlert){
        const enabled = this.state.localVideoDisabled
        const videoEnabled = this.state.enableMyVideo
        if(newStatus !== enabled){
            if(videoEnabled){
                this.handleLocalVideo()
            }
            this.changeState('localVideoDisabled', newStatus)
            if(displayAlert){
                if(enabled === true){
                    this.showAlert(`Admin has permitted you to use your video.`, alertType.SUCCESS)
                }else{
                    this.showAlert(`Admin has disabled your video.`)
                }
            }
            Helper.setAudioVideoSettingsInStorage('localVideoDisabled', newStatus)
        }
    }
    disableScreenShare(newStatus, displayAlert){
        const enabled = this.state.localScreenShareDisabled
        const screenShareStarted = this.state.screenShare
        if(newStatus !== enabled){
            if(screenShareStarted){
                this.stopScreenShare()
            }
            this.changeState('localScreenShareDisabled', newStatus)
            if(displayAlert){
                if(enabled === true ){
                    this.showAlert(`Admin has permitted you to use your screen sharing.`, alertType.SUCCESS)
                }else{
                    this.showAlert(`Admin has disabled your screen sharing.`)
                }
            }
            Helper.setAudioVideoSettingsInStorage('localScreenShareDisabled', newStatus)
        }
    }
     addDeviceChangeObserver(){ /* used in chime */
        try{
            const deviceObserver = {
                audioInputsChanged: async freshAudioInputDeviceList => {
                  // An array of MediaDeviceInfo objects
                  console.log('Audio inputs updated: ', freshAudioInputDeviceList);
                  let isExistCurrentDevice = false
                  let audioList = []
                  freshAudioInputDeviceList.forEach((v) => {
                      if(v.deviceId === this.state.audioDevice?.value){
                          isExistCurrentDevice = true
                      }
                      audioList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                  })
                  if(!isExistCurrentDevice){
                      const a = audioList.length > 0 ? audioList[0] : null
                      await this.changeState('audioDevice', a);
                      this.selectAudioInput()
                  }
                  await this.changeState('audioInputDevices', audioList);
                },
                audioOutputsChanged: async freshAudioOutputDeviceList => {
                  console.log('Audio outputs updated: ', freshAudioOutputDeviceList);
                  let isExistCurrentDevice = false
                  let audioList = []
                  freshAudioOutputDeviceList.forEach((v) => {
                      if(v.deviceId === this.state.outputDevice?.value){
                          isExistCurrentDevice = true
                      }
                      audioList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                  })
                  if(!isExistCurrentDevice){
                      const a = audioList.length > 0 ? audioList[0] : null
                      await this.changeState('outputDevice', a);
                      this.selectAudioOutput()
                  }
                  this.changeState('audioOutputDevices', audioList);
                },
                videoInputsChanged: async freshVideoInputDeviceList => {
                  console.log('Video inputs updated: ', freshVideoInputDeviceList);
                  let isExistCurrentDevice = false
                  let videoList = []
                  freshVideoInputDeviceList.forEach((v) => {
                      if(v.deviceId === this.state.videoDevice?.value){
                          isExistCurrentDevice = true
                      }
                      videoList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
                  })
                  if(!isExistCurrentDevice){
                      const a = videoList.length > 0 ? videoList[0] : null
                      await this.changeState('videoDevice', a);
                      this.selectVideoInput()
                      if(this.state.enableMyVideo){
                          this.handleLocalVideo()
                      }
                  }
                  this.changeState('videoInputDevices', videoList);
                }
            };

            const triggerDeviceLable = () =>{
                console.log('trigger device label')
                return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            }
    //        this.meetingSession.audioVideo.setDeviceLabelTrigger(triggerDeviceLable)
            this.meetingSession.audioVideo.addDeviceChangeObserver(deviceObserver)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'addDeviceChangeObserver' })
        }
    }
    async configureMeeting(joinInfo){
        var meeting = joinInfo.meeting
        var attendee = joinInfo.attendee
        try{
            const configuration = new MeetingSessionConfiguration(meeting, attendee);
            const logLevel = LogLevel.INFO;
//            const logLevel = LogLevel.OFF;
            const consoleLogger = new ConsoleLogger('WEBSDK', logLevel);
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                this.logger = consoleLogger;
            } else {
                this.logger = new MultiLogger(
                  consoleLogger,
                  new MeetingSessionPOSTLogger(
                    'WEBSDK',
                    configuration,
                    LOGGER_BATCH_SIZE,
                    LOGGER_INTERVAL_MS,
                    `${API_URL}open/chime-error-log`,
                    logLevel
                  ),
                );
            }
            this.deviceController = new DefaultDeviceController(this.logger, { enableWebAudio : true });
//            configuration.enableWebAudio = true;
            configuration.enableUnifiedPlanForChromiumBasedBrowsers = true;
            configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = true;
            this.meetingSession = new DefaultMeetingSession(
              configuration,
              this.logger,
              this.deviceController
            );
            if(configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers){
                this.meetingSession.audioVideo.chooseVideoInputQuality(1280, 720, 15, 1400);
//                this.meetingSession.audioVideo.chooseVideoInputQuality(50, 50, 30, 600)
            }
            await this.setupDevices();
            this.addDeviceChangeObserver()
            this.setupMuteHandler();
            this.setupCanUnmuteHandler();
        }catch(err){
            console.log('configureMeeting err', err)
            console.log('configureMeeting err', err.message)
            this.changeState('isEventError', true)
            this.changeState('eventError', err.message)
            Logger.error({ fileLocation, message: err.message, trace: 'configureMeeting' })
        }
    }
    confirmWaitingRoomSettings(states){
        this.changeState('showSettingBox', false)
        Helper.setAudioVideoSettingsInStorage('showSettingBox', false)
        
        this.userControles.audio = states.audio === true ? constants.ON : constants.OFF
        this.userControles.video = states.video === true ? constants.ON : constants.OFF
        if(this.meetingStarted){
            if(states.video){
                this.handleLocalVideo()
            }
            
            if(states.audio){
                this.muteUnmuteMe()
            }
        }
        this.settingConfirmed = true
    }
    async setupDevices(){
        try{
            const settings = Helper.getAudioVideoSettings()
            const selected = {
                mic : settings?.selectedAudio ,
                camera : settings?.selectedVideo ,
                speaker : settings?.selectedOutput,
            }
            let audioInputsList = []
            let videoInputsList = []
            let audioOutputList = []
            const audioInputs = await this.meetingSession.audioVideo.listAudioInputDevices();
            audioInputs.forEach((v) => {
                audioInputsList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
            })
            if(audioInputsList.length > 0 && !selected.mic){
                selected.mic = audioInputsList[0]
            }
            await this.changeState('audioDevice', selected.mic);
            await this.changeState('audioInputDevices', audioInputsList);
            const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();
            videoInputDevices.forEach((v) => {
                videoInputsList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
            })
            if(videoInputsList.length > 0 && !selected.camera){
                selected.camera = videoInputsList[0]
            }
            await this.changeState('videoDevice', selected.camera);
            await this.changeState('videoInputDevices', videoInputsList);
            const audioOutputDevice = await this.meetingSession.audioVideo.listAudioOutputDevices()
            audioOutputDevice.forEach((v) => {
                audioOutputList.push({label: v.label ? v.label : 'No label', value: v.deviceId})
            })
            if(audioOutputList.length > 0 && !selected.speaker){
                selected.speaker = audioOutputList[0]
            }
            await this.changeState('outputDevice', selected.speaker);
            await this.changeState('audioOutputDevices', audioOutputList);
            
            const audioOutputElement = document.getElementById('audio-1');
            this.meetingSession.audioVideo.bindAudioElement(audioOutputElement);
            
        }catch(err){
            console.log('setupDevices err', err)
            Logger.error({ fileLocation, message: err.message, trace: 'setupDevices' })
        }
    }
    async changeVideoDevice(key){
        try{
            if(this.state.videoDevice.value === key.value){
                return
            }
            await this.changeState('videoDevice', key)
            Helper.setAudioVideoSettingsInStorage('selectedVideo', key)
            const isVideoEnabled = this.state.enableMyVideo
            if(isVideoEnabled){
                this.handleLocalVideo()
            }
            this.selectVideoInput()
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'changeVideoDevice' })
        }
    }
    async changeAudioDevice(key){
        try{
            await this.changeState('audioDevice', key);
            Helper.setAudioVideoSettingsInStorage('selectedAudio', key)
            this.selectAudioInput()
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'changeAudioDevice' })
        }
    }
    async changeAudioOutputDevice(key){
        try{
            await this.changeState('outputDevice', key);
            Helper.setAudioVideoSettingsInStorage('selectedOutput', key)
            this.selectAudioOutput()
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'changeAudioOutputDevice' })
        }
    }
    async selectVideoInput(){
        try{
            await this.meetingSession.audioVideo.chooseVideoInputDevice(this.state.videoDevice?.value);
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'selectVideoInput' })
        }
    }
    async selectAudioInput(){
        try{
            await this.meetingSession.audioVideo.chooseAudioInputDevice(this.state.audioDevice?.value);
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'selectAudioInput' })
        }
    }
    async selectAudioOutput(){
        try{
            await this.meetingSession.audioVideo.chooseAudioOutputDevice(this.state.outputDevice?.value);
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'selectAudioOutput' })
        }
    }
    chimeFatelError(error){
        console.log('--------------------------------------')
        console.log('chime error', error)
    }
    async joinMeeting(){
        console.log('join meeting called');
        try{
            window.addEventListener('unhandledrejection', (event) => {
                console.log('unhandledrejection');
                event.preventDefault();
                console.log(event.reason);
            });
            await this.selectAudioInput();
            await this.selectAudioOutput();
            
            this.meetingSession.audioVideo.start();
            this.meetingSession.audioVideo.realtimeSubscribeToFatalError(this.chimeFatelError);
    //        this.changeState('enableMymike' , true)
            this.meetingSession.audioVideo.subscribeToActiveSpeakerDetector(
                new DefaultActiveSpeakerPolicy(),
                this.activeSpeakerCallback, 
                0
            )
            this.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(this.handlePresenceChange);
            console.log('meeting started');
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'joinMeeting' })
        }
    }
    setupMuteHandler() {
        try{
            const handler = (isMuted) => {
              console.log(`muted = ${isMuted}`);
            };
            this.meetingSession.audioVideo.realtimeSubscribeToMuteAndUnmuteLocalAudio(handler);
            const isMute = this.meetingSession.audioVideo.realtimeIsLocalAudioMuted();
            handler(isMute);
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setupMuteHandler' })
        }
    }
    setupCanUnmuteHandler() {
        const handler = (canUnmute) => {
          console.log(`canUnmute = ${canUnmute}`);
        };
        this.meetingSession.audioVideo.realtimeSubscribeToSetCanUnmuteLocalAudio(handler);
        handler(this.meetingSession.audioVideo.realtimeCanUnmuteLocalAudio());
    }
    
    async playVideo(){
//        this.meetingSession.audioVideo.chooseVideoInputQuality(640, 360, 15, 600)
//        this.meetingSession.audioVideo.chooseVideoInputQuality(50, 50, 30, 600)
        try{
            await this.selectVideoInput();
            this.meetingSession.audioVideo.startLocalVideoTile();
//            this.changeState('enableMyVideo', true)
        }catch(err){
            this.showAlert(`Something went wrong while starting your video`, alertType.ERROR)
            console.log('local video start error', err)
            console.log(err.response);
            Logger.error({ fileLocation, message: err.message, trace: 'playVideo' })
        }
    }
    getIsAdmin(identifier){
        const members = this.state.allMembers
        if(members[identifier]){
            if(members[identifier].role === 'owner'){
                return true
            }
        }
        return false
    }
    getAdminUser(){
        const members = this.state.allMembers
        let user = false
        Object.keys(members).map((v) => {
            const u = this.members[v]
            if(u.role === 'owner'){
                user = u
            }
        })
        return user
    }
    
    activeSpeakerCallback = attendeeIds => {
        try{
            if (attendeeIds.length) {
                const chimeAttendeeId = attendeeIds[0]
                const u = this.getAttendeeDetailFromId(chimeAttendeeId)
                console.log(`${chimeAttendeeId}, ${u.name} is the most active speaker`);
//                if(this.contentSharedId !== null){
//                    return
//                }
                
                const userId = u.identifier
                if(userId && userId !== this.state.speakingUserId && this.loginUserId !== userId){
                    this.changeState('speakingUserId', userId)
                }
                
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'activeSpeakerCallback' })
        }
    }
    saveFullModeToStorage(){
        localStorage.setItem(`${eventPrefix}-${this.activeEventId}-modeBeforeScreenShare`, viewMode.FULL)
    }
    saveOldModeForScreenShare(){
        if(this.state.viewMode !== viewMode.FULL){
            localStorage.setItem(`${eventPrefix}-${this.activeEventId}-modeBeforeScreenShare`, this.state.viewMode)
            this.changeViewMode(viewMode.FULL)
        }
        if(this.state.showModeButton){
            this.changeState('showModeButton', false)
        }
    }
    removeOldModeForScreenShare(){
        const modeBeforeScreenShare = localStorage.getItem(`${eventPrefix}-${this.activeEventId}-modeBeforeScreenShare`)
        if(modeBeforeScreenShare){
            this.changeViewMode(modeBeforeScreenShare)
            localStorage.removeItem(`${eventPrefix}-${this.activeEventId}-modeBeforeScreenShare`)
        }
        this.changeState('showModeButton', true)
    }
    
    async stopVideo(type = 0){
      if(this.state.isMeetingOwner) {
        this.setState({showLeaveModal: true})
      } else {
        this.processEndCall(type)
      }
    }

   endCall = () => {
     this.processEndCall(0, true)
   }

   leaveCall = () => {
     this.processEndCall()
   }

    async processEndCall(type = 0, forAll = false){
        try{
            const url = new URL(window.location.href);
            const eventId = url.searchParams.get('e');
            localStorage.removeItem(eventId);
            localStorage.removeItem(eventPrefix + this.activeEventId);
            localStorage.removeItem('referrer_url');
            localStorage.removeItem('guestUser');
            localStorage.removeItem('audioVideoSettings')
            localStorage.setItem('second', localStorage.getItem(`${this.mainEventId}-second`))
            if(this.state.screenShare){
                this.contentShareDidStop()
            }
            if(forAll){
                this.handleAllAttendeeKickout(null, 'ended')
                type = 1
            }else if(type !== 2){ // if not kicked out , end call for self, so other user get attendee:left event
                this.endCallForSelf()
            }
            if(this.meetingSession){
                await this.meetingSession.audioVideo.stopLocalVideoTile();
                this.meetingSession.audioVideo.removeObserver(this)
                await this.meetingSession.audioVideo.stop();
            }
            if(this.state.enableMyVideo){
                this.stopLocalVideo()
            }
            setTimeout(() => {
                if(this.socket){
                    this.socket.disconnect()
                    this.socket = null
                }
                localStorage.removeItem(`${this.mainEventId}-second`)
                window.location = `/event/ended?t=${type}`;
            }, 1000)
            
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'stopVideo' })
        }
    }
    manageRightSideBar(type, val){
        if(val){
            this.changeState('activeSideBar', type)
            this.changeState('isRightSideBar', true)
        }else{
            this.changeState('isRightSideBar', false)
            this.changeState('activeSideBar', null)
        }
    }
    muteUnmuteMe(){
        try{
            if(!this.canClickAudioButton){
                return false
            }
            if(!this.meetingSession){
                this.lockAudioClick()
                this.showAlert(`Please wait while your mic is connecting...`, alertType.ERROR)
                return
            }
            if(!this.meetingStarted){
                this.lockAudioClick()
                this.showAlert(`Please wait while your mic is connecting...`, alertType.ERROR)
                return
            }
            if(this.state.localAudioDisabled){
                this.lockAudioClick()
                this.showAlert(`Your microphone is disabled.`, alertType.ERROR)
                return
            }
            const muted = this.state.enableMymike
            if(muted){
                this.meetingSession.audioVideo.realtimeMuteLocalAudio();
                this.userControles.audio = constants.OFF
            }else{
                this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
                this.userControles.audio = constants.ON 
            }
            this.changeState('enableMymike', !muted)
            this.sendMikeStatusToAdmin(null, !muted)
            Helper.setAudioVideoSettingsInStorage('enableMymike', !muted)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'muteUnmuteMe' })
        }
    }
    sendMikeStatusToAdmin(id, makeEnable){
        const data = {
            type: 'attendeeMikeUpdated',
            payload: {
                from: this.loginUserId,
                to: id,
                enable: makeEnable
            }
        }
        this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
    }
    sendVideoStatusToAdmin(id, makeEnable){
        const data = {
            type: 'attendeeVideoUpdated',
            payload: {
                from: this.loginUserId,
                to: id,
                enable: makeEnable
            }
        }
        this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
    }
    startScreenShare = async () =>{
        try{
            if(!this.canClickScreenButton){
                return false
            }
            if(!this.meetingSession){
                this.lockScreenClick()
                this.showAlert(`Please wait while your screen is connecting...`, alertType.ERROR)
                return
            }
            if(!this.meetingStarted){
                this.lockScreenClick()
                this.showAlert(`Please wait while your screen is connecting...`, alertType.ERROR)
                return
            }
            if(this.state.localScreenShareDisabled){
                this.lockScreenClick()
                this.showAlert(`Screen sharing is disabled.`, alertType.ERROR)
                return
            }
            const isShare = this.state.screenShare
            if(!isShare){
                if(this.contentSharedId === null ){
                    await this.meetingSession.audioVideo.startContentShareFromScreenCapture();
                }
            }else{
                await this.stopScreenShare()
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'startScreenShare' })
        }
    }
    async stopScreenShare(){
        await this.meetingSession.audioVideo.stopContentShare();
    }
    lockVideoClick(){
        this.canClickVideoButton = false
        setTimeout(() => {
            this.canClickVideoButton = true
        }, 4900)
    }
    lockAudioClick(){
        this.canClickAudioButton = false
        setTimeout(() => {
            this.canClickAudioButton = true
        }, 4900)
    }
    lockScreenClick(){
        this.canClickScreenButton = false
        setTimeout(() => {
            this.canClickScreenButton = true
        }, 4900)
    }
    lockViewModeClick(){
        this.canClickViewModeButton = false
        this.applyActiveSpeaker = false
        setTimeout(() => {
            this.canClickViewModeButton = true
            this.ViewModeButtonClicked = false
            this.applyActiveSpeaker = true
        }, 4900)
    }
    handleLocalVideo(){
        try{
            if(!this.canClickVideoButton){
                return false
            }
            if(!this.meetingSession){
                this.lockVideoClick()
                this.showAlert(`Please wait while your video is connecting...`, alertType.ERROR)
                return
            }
            if(!this.meetingStarted){
                this.lockVideoClick()
                this.showAlert(`Please wait while your video is connecting...`, alertType.ERROR)
                return
            }
            if(this.state.localVideoDisabled){
                this.lockVideoClick()
                this.showAlert(`Video is disabled.`, alertType.ERROR)
                return
            }
            const isOn = this.state.enableMyVideo
            if(!isOn){
                if(this.state.videoInputDevices.length === 0){
                    this.lockVideoClick()
                    this.showAlert(`No camera found.`)
                    return
                }
            }
            if(this.state.videoButtonClicked){
                // do not allow to multiple clicks until video processed
                return
            }
            if(isOn){
                this.changeState('videoButtonClicked', true)
                this.stopLocalVideo()
            }else{
                if(this.canStartLocalVideo){
                    this.changeState('videoButtonClicked', true)
                    this.playVideo()
                    this.userControles.video = constants.ON
                }else{
                    this.showAlert(`You cannot start your video.`, alertType.ERROR)
                }
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleLocalVideo' })
        }
    }
    async stopLocalVideo(){
        console.log('stopping local video')
        try{
            this.changeState('enableMyVideo', false)
            this.sendVideoStatusToAdmin(null, false)
            await this.meetingSession.audioVideo.stopLocalVideoTile();
            this.changeState('videoButtonClicked', false)
            this.userControles.video = constants.OFF
            const video = document.getElementById(`video-16`);
            video.classList.remove('d-none')
            const memberList = this.state.allMembers
            const uId = this.loginUserId
            if(memberList[uId]){
                memberList[uId].videoEnabled = false
                memberList[uId].videoIndex = -1
                this.changeMemberState('allMembers', memberList[uId], uId)
            }
            this.changeState('showLocalVideo', null)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'stopLocalVideo' })
        }
    }
    async changeViewMode(mode, makeDisable = false){
        try{
            if(makeDisable && false){
                
                if(!this.canClickViewModeButton){
                    if(!this.ViewModeButtonClicked){
                        this.ViewModeButtonClicked = true
                        this.showAlert(`Please wait while your view is setting up...`, alertType.ERROR)
                        return false
                    }
                    return false
                }
                
                this.lockViewModeClick()
            }
            await this.changeState('viewMode', mode)
            this.activeModeId = videoIds[mode]
            this.bindVideoOnPresentationMode()
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'changeViewMode' })
        }
    }
    bindVideoOnPresentationMode(){
        if(this.state.viewMode === viewMode.PRESENTATION){
            const memberList = this.state.allMembers
            Object.keys(memberList).forEach( (v) => {
                const user = memberList[v]
                if(user.videoEnabled){
                    const fullVideo = document.getElementById(`video-${videoIds.FULL}-${v}`)
                    const presentationVideo = document.getElementById(`video-${videoIds.PRESENTATION}-${v}`)
                    if(presentationVideo && fullVideo && !presentationVideo.srcObject){
                        presentationVideo.srcObject = fullVideo.srcObject
                    }
                }
            } )
        }
    }
    getIntialName(name){
        var initials = name.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
//        if(initials.length === 1){
//            initials = initials + initials
//        }
        return initials
    }
    getCmdChannelName(id){
        let name = 'cmd';
        if(id !== null){
            name = `cmd:${id}`
        }
        return name
    }
    handleAllAttendeeVideo(id, makeEnable){
        try{
            if(this.state.allVideoDisabled){
                this.showAlert(`Video is disabled.`, alertType.ERROR)
                return false
            }
            if(makeEnable){
                this.showAlert(`You are not allowed to turn on participant's video.`, alertType.ERROR)
                return false
            }
            const data = {
                type: 'remoteVideo',
                payload: {
                    from: this.loginUserId,
                    to: id,
                    enable: makeEnable
                }
            }
            this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
            if(id === null){
    //            this.changeState('btnAllVideoEnable', makeEnable)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleAllAttendeeVideo' })
        }
    }
    handleAllAttendeeMike(id, makeEnable){
        try{
            if(this.state.allAudioDisabled){
                this.showAlert(`Microphone is disabled.`, alertType.ERROR)
                return false
            }
            if(makeEnable){
                this.showAlert(`You will have to ask the user to turn on their own mic.`, alertType.ERROR)
                return false
            }
            const data = {
                type: 'remoteMike',
                payload: {
                    from: this.loginUserId,
                    to: id,
                    enable: makeEnable
                }
            }
            this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
            if(id === null){
    //            this.changeState('btnAllAudioEnable', makeEnable)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleAllAttendeeMike' })
        }
    }
    handleAllAttendeeKickout(id, type='kickout'){
        try{
            const data = {
                type: 'kickOut',
                payload: {
                    from: this.loginUserId,
                    to: id,
                    type: type,
                }
            }
            this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
                    .receive("ok", resp => {  })
                    .receive("error", resp => { this.showAlert(`Unable to block/kick user`, alertType.ERROR) })
            this.event[this.activeEventId].push('state:send', {})
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleAllAttendeeKickout' })
        }
    }
    endCallForSelf(){
        try{
            const data = {
                identifier: this.loginUserId
            }
            this.event[this.activeEventId].push('attendee:leave', data)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleAllAttendeeKickout' })
        }
    }
    handleUnkickUser(id){
        try{
            const data = {
                identifier: id,
            }
            this.event[this.activeEventId].push('attendee:unkick', data)
                    .receive("ok", resp => { this.showAlert(`User access restored successfully.`, alertType.SUCCESS) })
                    .receive("error", resp => { this.showAlert(`Unable to block user.`, alertType.ERROR) })
            this.event[this.activeEventId].push('state:send', {})
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleUnkickUser' })
        }
    }
    handleDisableRemoteAudio(id, enabled){
        try{
            const data = {
                type: 'disableAudio',
                payload: {
                    from: this.loginUserId,
                    to: id,
                    senderIgnore: true,
                    enable: enabled
                }
            }
            this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
            if(id === null){
                this.changeState('allAudioDisabled', enabled)
                Helper.setAudioVideoSettingsInStorage('allAudioDisabled', enabled)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleDisableRemoteAudio' })
        }
    }
    handleDisableRemoteVideo(id, enabled){
        try{
            const data = {
                type: 'disableVideo',
                payload: {
                    from: this.loginUserId,
                    to: id,
                    senderIgnore: true,
                    enable: enabled
                }
            }
            this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
            if(id === null){
                this.changeState('allVideoDisabled', enabled)
                Helper.setAudioVideoSettingsInStorage('allVideoDisabled', enabled)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleDisableRemoteVideo' })
        }
    }
    handleDisableRemoteScreenShare(id, enabled){
        try{
            const data = {
                type: 'disableScreenShare',
                payload: {
                    from: this.loginUserId,
                    to: id,
                    senderIgnore: true,
                    enable: enabled
                }
            }
            this.event[this.activeEventId].push(this.getCmdChannelName(id), data)
            if(id === null){
                this.changeState('allScreenShareDisabled', enabled)
                Helper.setAudioVideoSettingsInStorage('allScreenShareDisabled', enabled)
            }
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleDisableRemoteScreenShare' })
        }
    }
    setChatMessages(userId, msg){
        try{
            const allChats = this.state.allChats
            if(allChats[userId]){
                if(this.chatNewMsgIndex[userId] === null && this.state.activeChat !== userId){
                    this.chatNewMsgIndex[userId] = allChats[userId].length 
                }
                if(this.state.activeChat !== userId && msg.body.from !== this.loginUserId){
                    this.chatNewMsgCount[userId] = ( this.chatNewMsgCount[userId] ? parseInt(this.chatNewMsgCount[userId]) : 0 ) + 1 
                }
                allChats[userId].push(msg)
            }else{
                this.chatNewMsgIndex[userId] = 0
                if(msg.body.from !== this.loginUserId){
                    this.chatNewMsgCount[userId] = 1
                }
                allChats[userId] = [ msg ]
            }
            let count = 0
            Object.keys(this.chatNewMsgCount).map((v, k) => {
                count += this.chatNewMsgCount[v]
                return v
            })
            this.changeState('totalUnreadChats', count)
            this.changeState('allChats', allChats)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'setChatMessages' })
        }
    }
    
    handleGridViewNameMike(userId){
        try{
            const user = this.state.allMembers[userId]
            const makeEnable = user.mikeEnabled
            this.handleAllAttendeeMike(userId, !makeEnable)
        }catch(err){
            Logger.error({ fileLocation, message: err.message, trace: 'handleGridViewNameMike' })
        }
    }
    
    handleGridViewNameVideo(userId){
        const user = this.state.allMembers[userId]
        const makeEnable = user.videoEnabled
        this.handleAllAttendeeVideo(userId, !makeEnable)
    }
    startBreakout(userId){
        this.breakoutCreated = false
//        const eventId = this.mainEventId
//        this.props.createBreakoutRequest({eventId: eventId, userId: userId})
    }
    pauseUnpauseVideos(){
        console.log('pause/unpause')
        if(this.meetingSession?.audioVideo){
            const allTiles = this.meetingSession.audioVideo.getAllRemoteVideoTiles()
//            console.log(allTiles)
            const oldStatus = this.isPausedAllVideo
            this.isPausedAllVideo = ! oldStatus
            
            const memberList = this.state.allMembers
            let isUpdated = false
            allTiles.forEach((v) => {
                const tile = v.tileState
                if(!tile.isContent && !tile.localTile){
                    if(oldStatus){
                        if(tile.paused){
                            this.meetingSession.audioVideo.unpauseVideoTile(tile.tileId)
                            memberList[tile.boundExternalUserId].isPaused = false
                            isUpdated = true
                        }
                    }else{
                        if(!tile.paused){
                            this.meetingSession.audioVideo.pauseVideoTile(tile.tileId)
                            memberList[tile.boundExternalUserId].isPaused = true
                            isUpdated = true
                        }
                    }
                }
            })
            if(isUpdated){
                this.changeMemberState('allMembers', memberList)
            }
        }
    }
    pauseUnpauseSingleVideo(user, play){
        if(this.meetingSession?.audioVideo){
            const tile = this.meetingSession.audioVideo.getVideoTile(user.videoTileId)?.tileState
            if(tile){
                const memberList = this.state.allMembers
                const uId = user.identifier
                
                if(play){
                    if(tile.paused){
                        this.meetingSession.audioVideo.unpauseVideoTile(tile.tileId)
                        memberList[uId].isPaused = false
                        this.changeMemberState('allMembers', memberList)
                    }
                }else{
                    if(!tile.paused){
                        this.meetingSession.audioVideo.pauseVideoTile(tile.tileId)
                        memberList[uId].isPaused = true
                        this.changeMemberState('allMembers', memberList)
                    }
                }
            }
        }
    }

    dragStart( ){
        if(this.state.dragablePosition){
            this.changeState('dragablePosition', null)
        }
    }

    dragStop( data ){
//        console.log('dragStop data', data, 'screen width', window.screen.availWidth)
        this.dragedData = data
    }

    render() {
        const { showLeaveModal } = this.state
        const state = this.state;
        const eventDetails = this.props.eventDetails;
        document.title = 'ARC ' + (eventDetails.name ? '- '+ eventDetails.name : '')
    return (
        <div className={classNames({'videocall-section': true})}>
          {showLeaveModal &&
           <LeaveModal onCancelClick={() => this.setState({showLeaveModal: false})}
                       onEndClick={this.endCall}
                       onLeaveClick={this.leaveCall} />}
            <audio id="audio-1" style={{display: 'none'}}></audio>
            {
            state.canJoin && 
            <WaitingTone parent={this} state={state}/>
            }
            <div className={classNames({"main-screen": true, 'd-none': !state.canJoin})}>
            <a href="#" onClick={ () => { this.pauseUnpauseVideos() }} style={{display: 'none', position: 'absolute', left: '50%', top: '30px', zIndex: '10'}}> pause/resume all video </a>
                <div className={classNames({"sidebar-right-bar": true, open: this.state.isRightSideBar && state.displayWhileScrenShare})}>
                    <RightSideBar parent={this} state={state}  eventTypes={eventTypes} alertType={alertType}></RightSideBar>
                </div>
                <div className={classNames({"preview-screen ": state.viewMode === viewMode.FULL, "half-screen": state.viewMode === viewMode.PRESENTATION, "d-none": state.viewMode === viewMode.GRID})}>
                    <div className="main-calling" id="main-calling-div">
                        
                        <div className={classNames({"display-view": true, "d-none" : ! state.screenShareStarted})}  id={`video-div-main-screen-share`} >
                            <video className="main-screen" id={`video-main-screen-share`} style={{objectFit: 'contain'}} autoPlay={true}>
                                Your browser does not support the video tag.
                            </video>
                            { !state.screenShareTileActive &&
                                <label style={{position: 'absolute', left: '30%', top: '30%', fontSize: 'xx-large'}}>Screen share content not loaded yet</label>
                            }
                        </div>
                        
                        {
                            Object.keys(state.allMembers).map((v, k) => {
                                v = state.allMembers[v]
                                if( !v.videoEnabled ){
                                    return (
                                        <div className={classNames({"display-view": true, "d-none" : state.screenShareStarted || ( ( v.identifier !== state.speakingUserId && state.eventType !== eventTypes.PRESENTATION ) || (v.identifier === this.loginUserId && state.eventType !== eventTypes.PRESENTATION ) || (v.role !== 'owner' && state.eventType === eventTypes.PRESENTATION ))})} id={`video-div-main-${v.identifier}`} key={`main-calling-${v.identifier}`}>
                                            <div className="slide-person-name" id={`name-main-${v.identifier}`}>
                                                <div className="member-shortname">
                                                    <label id={`main-name-label-${v.identifier}`}>{v.initials}</label>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }else{
                                    let style = {}
                                    if(v.identifier === this.loginUserId){
                                        style = { transform: 'rotateY(180deg)' }
                                    }
                                    return(  
                                        <div className={classNames({"display-view": true, "d-none" : state.screenShareStarted || ( ( v.identifier !== state.speakingUserId && state.eventType !== eventTypes.PRESENTATION ) || (v.identifier === this.loginUserId && state.eventType !== eventTypes.PRESENTATION ) || (v.role !== 'owner' && state.eventType === eventTypes.PRESENTATION ))})}  id={`video-div-main-${v.identifier}`} key={`main-calling-video-${v.identifier}`}>
                                            <video className="main-screen" id={`video-main-${v.identifier}`} style={style} autoPlay={true}>
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className={classNames({'connecting-user custom-grid': true, "d-none": state.viewMode !== viewMode.PRESENTATION})}>
                        <Swiper {...swiperParamsPres} shouldSwiperUpdate>
                            
                                {
                                    Object.keys(state.allMembers).map((v, k) => {
                                        v = state.allMembers[v]
                                        if( v.identifier !== this.loginUserId  && !v.videoEnabled && (state.eventType === eventTypes.PRESENTATION && v.role !== 'owner') ){
                                            return (
                                                <div className={classNames({"swiper-slide": true, 'slide-active-presentation': state.speakingUserId === v.identifier})} key={`tile-${videoIds.PRESENTATION}-${v.identifier}`} id={`tile-${videoIds.PRESENTATION}-${v.identifier}`}>
                                                    <div className={classNames({"slide-person-name": true, 'slide-active': state.speakingUserId === v.identifier })} id={`remote-shortname-${videoIds.PRESENTATION}-${v.identifier}`}>
                                                        <div className="member-shortname">
                                                            <label id={`remote-name-${videoIds.PRESENTATION}-${v.identifier}`}>{v.initials}</label>
                                                        </div>
                                                    </div>
                                                    <ParticipantNameOnVideo parent={this} dataId={v.identifier} idPrefix={videoIds.PRESENTATION} isFullName={true} user={v} name={v.name}></ParticipantNameOnVideo>
                                                    <ParticipantHoverButtons parent={this} participant={v} dataId={v.identifier} isVideo={false} idPrefix={videoIds.PRESENTATION} displayButton={state.isMeetingOwner}></ParticipantHoverButtons>
                                                </div>  
                                            )
                                        }
                                        else if(v.identifier !== this.loginUserId  && v.videoEnabled && (state.eventType === eventTypes.PRESENTATION && v.role !== 'owner')){
                                            return (
                                                <div className={classNames({"swiper-slide": true, 'slide-active-presentation': state.speakingUserId === v.identifier})} key={`tile-${videoIds.PRESENTATION}-${v.identifier}`} id={`tile-${videoIds.PRESENTATION}-${v.identifier}`}>
                                                    <div className={classNames({"slide-video": true, 'slide-active': state.speakingUserId === v.identifier })} id={`remote-video-${videoIds.PRESENTATION}-${v.identifier}`}>
                                                        <video id={`video-${videoIds.PRESENTATION}-${v.identifier}`} autoPlay={true}>
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                    <ParticipantNameOnVideo parent={this} dataId={v.identifier} idPrefix={videoIds.PRESENTATION} user={v} name={v.name} isFullName={true}></ParticipantNameOnVideo>
                                                    <ParticipantHoverButtons participant={v} parent={this} dataId={v.identifier} isVideo={true} idPrefix={videoIds.PRESENTATION} displayButton={state.isMeetingOwner}></ParticipantHoverButtons>
                                                </div> 
                                            )
                                        }
                                        else{
                                         return  <EmptyTag key={`tile-${videoIds.PRESENTATION}-${v.identifier}`}></EmptyTag>   
                                        }
                                    })
                                }
                        </Swiper>
                    </div>
                </div>
                <div className={classNames({"main-calling grid-view custom-grid": true, "d-none": state.viewMode !== viewMode.GRID})} id="grid-view-slider">
                    <Swiper {...swiperParamsGrid} shouldSwiperUpdate>
                        
                            {
                                Object.keys(state.allMembers).map((v, k) => {
                                    v = state.allMembers[v]
                                    if(this.loginUserId !== v.identifier && !v.videoEnabled ) {
                                        return (
                                            <div className={classNames({"swiper-slide": true, "slide-active-temp" : state.speakingUserId === v.identifier})} key={`tile-${videoIds.GRID}-${v.identifier}`} id={`tile-${videoIds.GRID}-${v.identifier}`}>
                                                <div className={classNames({"slide-person-name": true, "slide-active" : state.speakingUserId === v.identifier})} id={`remote-shortname-${videoIds.GRID}-${v.identifier}`}>
                                                    <div className="member-shortname">
                                                        <label id={`remote-name-${videoIds.GRID}-${v.identifier}`}>{v.initials}</label>
                                                    </div>
                                                </div>
                                                <ParticipantNameOnVideo parent={this} dataId={v.identifier} idPrefix={videoIds.GRID} isFullName={true} user={v} name={v.name} ></ParticipantNameOnVideo>
                                                <ParticipantHoverButtons parent={this}  dataId={v.identifier} participant={v} isVideo={false} idPrefix={videoIds.GRID} displayButton={state.isMeetingOwner} ></ParticipantHoverButtons>
                                            </div>
                                        )
                                    }
                                    else if(this.loginUserId !== v.identifier && v.videoEnabled) {
                                        return (
                                            <div className={ classNames({"swiper-slide": true, "slide-active-temp" : state.speakingUserId === v.identifier}) } key={`tile-${videoIds.GRID}-${v.identifier}`} id={`tile-${videoIds.GRID}-${v.identifier}`}>
                                                <div className={classNames({"slide-video": true, "slide-active" : state.speakingUserId === v.identifier})} id={`remote-video-${videoIds.GRID}-${v.identifier}`}>
                                                    <video id={`video-${videoIds.GRID}-${v.identifier}`} autoPlay={true}>
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                                <ParticipantNameOnVideo parent={this} dataId={v.identifier} idPrefix={videoIds.GRID} user={v} name={v.name} isFullName={true} ></ParticipantNameOnVideo>
                                                <ParticipantHoverButtons participant={v} parent={this} dataId={v.identifier} isVideo={true} idPrefix={videoIds.GRID} displayButton={state.isMeetingOwner}></ParticipantHoverButtons>
                                            </div>
                                        )
                                    }
                                    else{
                                        return  <EmptyTag key={`tile-${videoIds.GRID}-${v.identifier}`}></EmptyTag>
                                    }
                                })
                            }
                    </Swiper>
                </div>
            </div>
            
            <Header parent={this} state={state} eventDetails={ eventDetails }></Header>
            
            { state.showFirstTimeInviteModal && state.canJoin &&
            <div className="content inviteuser-modal">
                <a href="#" className="btn-close" onClick={ () => { this.changeState('showFirstTimeInviteModal', false);  } } aria-label="Close">
                    { Svg.CloseProfileIcon }
                </a>
                <div className="box-contain bg-black-900 w-100">
                    <div className="text-left mb-1">
                        <h4 className="clr-white">You are all alone.</h4>
                        <label>Send invites to other people so they can join.</label>
                    </div>
                    <div className="text-center mt-3">
                        <button type="button" className="btn btn-medium btn-green round-4"  onClick={() => { this.showInviteBox(true); this.changeState('showFirstTimeInviteModal', false);  } }>
                            Invite Users
                        </button>
                    </div>
                </div>
            </div>
            }
        { state.canJoin &&
        <Draggable bounds="parent" onStart={ () => this.dragStart() } onStop={ (a) => this.dragStop(a) } position={ state.dragablePosition } >
            <div ref={this.childRef} onMouseEnter={ () => { this.setHoverFlag(true) } } onMouseLeave={ () => { this.setHoverFlag(false) } }
                style={{zIndex: '999'}} className={classNames({"bottom-left-bar": true, 'd-none': !state.canJoin || !state.displayWhileScrenShare })}>
                <div className={classNames({"small-screen": true, 'd-none': state.showLocalVideo !== true || state.eventType === eventTypes.PRESENTATION && state.isMeetingOwner})} id="small-screen-16">
                    <i className={classNames({"fa fa-arrow-down self-video-minimize": true, active: state.showLocalVideo === true, 'd-none': (eventTypes.PRESENTATION === state.eventType && state.isMeetingOwner)})} title="Minimize" onClick={() => this.manageLocalVideoTile(false)}></i>
                    
                    <video className="main-screen active" style={{zIndex: 'unset'}} id="video-16">
                        Your browser does not support the video tag.
                    </video>

                <div className="speaker-view">
                    <a className="btn call-name" href="#">
                        <TruncationText content={state.currentUser.name} limit={20} />
                    </a>
                </div>
                </div>
                <i className={classNames({"fa fa-arrow-up self-video-maximize": true, 'd-none': state.showLocalVideo !== false || (eventTypes.PRESENTATION === state.eventType && state.isMeetingOwner)})} title="Maximize" onClick={() => this.manageLocalVideoTile(true)}></i>
                <div className="btn-section">
                    <span className={classNames({"btn btn-round bg-black-500 call-microphone-btn": true, disabled: state.localAudioDisabled, active: state.enableMymike, stop: !state.enableMymike && !state.localAudioDisabled})}
                    onClick={(e) => this.muteUnmuteMe()} href="#">
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    Mute Microphone
                                </Tooltip>
                            }>
                            <div className={classNames({microphone: true, active: state.enableMymike})}>
                                <Svg.MikeOn/>
                            </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    { state.localAudioDisabled ? 'Microphone Disabled' : 'Unmute'}
                                </Tooltip>
                            }>
                            <div className={classNames({"microphone-mute": true, active: !state.enableMymike, stop: !state.enableMymike})}>
                                <Svg.MikeOff/>
                            </div>
                        </OverlayTrigger>
                    </span>
                    <span className={classNames({"btn btn-round bg-black-500 call-video-btn": true, disabled: state.localVideoDisabled || state.videoButtonClicked, active: state.enableMyVideo, stop: !state.enableMyVideo && !state.localVideoDisabled})} href="#"
                     onClick={(e)=> this.handleLocalVideo()}>
                         <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    Stop Video
                                </Tooltip>
                            }>
                            <div className={classNames({video: true, active: state.enableMyVideo})}>
                                <Svg.VideoOn/>
                            </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    { state.localVideoDisabled ? 'Video Disabled' : 'Start Video'}
                                </Tooltip>
                            }>
                            <div className={classNames({"video-mute": true, active: !state.enableMyVideo})}>
                                <Svg.VideoOff/>
                            </div>
                        </OverlayTrigger>
                    </span>
                    <span className={classNames({"btn btn-round bg-black-500 share-btn": true, disabled: state.localScreenShareDisabled , active: state.screenShare, stop: state.screenShare})} href="#"
                     onClick={(e) => this.startScreenShare(e)}>
                         <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    { state.localScreenShareDisabled ? 'Sharing Disabled' : 'Share Screen' }
                                </Tooltip>
                            }>
                        <div className={classNames({share: true, active: !state.screenShare})}>
                            <Svg.ScreenShareOff/>
                        </div>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    Stop Sharing
                                </Tooltip>
                            }>
                            <div className={classNames({'share-mute': true, active: state.screenShare})}>
                                <Svg.ScreenShareOn/>
                            </div>
                        </OverlayTrigger>
                    </span>
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip>
                                Leave Call
                            </Tooltip>
                        }>
                        <span className="btn btn-sm bg-red clr-white call-end-btn" onClick={(e) => this.stopVideo()} href="#">Leave</span>
                    </OverlayTrigger>
                </div>
            </div>
        </Draggable>
        }
            <div className={classNames({"bottom-center-bar": true, 'd-done': !state.canJoin})}></div>
        { state.canJoin &&
            <div className={classNames({"add-connect-user": true, "slide-left": this.state.isRightSideBar, "d-none": state.viewMode !== viewMode.FULL || !state.displayWhileScrenShare })} 
                onMouseEnter={ () => { this.setHoverFlag(true) } } onMouseLeave={ () => { this.setHoverFlag(false) } } >
                <Swiper {...swiperParamsFull} shouldSwiperUpdate>
                        
                        {
                            Object.keys(state.allMembers).map((v, k) => {
                                v = state.allMembers[v]
                                if(v.identifier !== this.loginUserId && !v.videoEnabled ){
                                return (
                                     <div className={classNames({"swiper-slide": true, "slide-active-temp" : state.speakingUserId === v.identifier, "d-none" : (state.eventType === eventTypes.DISCUSSION && v.identifier === state.speakingUserId && !state.screenShareStarted) || (state.eventType === eventTypes.PRESENTATION && v.role === 'owner' && !state.screenShareStarted)})} key={`tile-${videoIds.FULL}-${v.identifier}`} id={`tile-${videoIds.FULL}-${v.identifier}`}>
                                        <div className={classNames({"slide-person-name": true, "slide-active" : state.speakingUserId === v.identifier })} id={`remote-shortname-${videoIds.FULL}-${v.identifier}`}>
                                            <div className="member-shortname">
                                                <label id={`remote-name-${videoIds.FULL}-${v.identifier}`}>{v.initials}</label>
                                            </div>
                                        </div>
                                        <ParticipantNameOnVideo parent={this} dataId={v.identifier} idPrefix={videoIds.FULL} isFullName={false} user={v} name={v.name} ></ParticipantNameOnVideo>
                                    </div>   
                                )
                                }
                                else if(v.identifier !== this.loginUserId && v.videoEnabled){
                                return (
                                     <div className={classNames({"swiper-slide": true, "slide-active-temp" : state.speakingUserId === v.identifier, "d-none" : (state.eventType === eventTypes.DISCUSSION && v.identifier === state.speakingUserId && !state.screenShareStarted) || (state.eventType === eventTypes.PRESENTATION && v.role === 'owner' && !state.screenShareStarted)})} key={`tile-${videoIds.FULL}-${v.identifier}`} id={`tile-${videoIds.FULL}-${v.identifier}`}>
                                        <div className={classNames({"slide-video": true, "slide-active" : state.speakingUserId === v.identifier})} id={`remote-video-${videoIds.FULL}-${v.identifier}`}>
                                            <video id={`video-${videoIds.FULL}-${v.identifier}`} autoPlay={true}>
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <ParticipantNameOnVideo parent={this} dataId={v.identifier} idPrefix={videoIds.FULL} user={v} name={v.name} isFullName={false}></ParticipantNameOnVideo>
                                    </div>  
                                )
                                }
                                else{
                                    return  <EmptyTag key={`tile-${videoIds.FULL}-${v.identifier}`}></EmptyTag>
                                }
                            })
                        }
                    </Swiper>
            </div>
        }
        { state.canJoin && 
            <BottomRightButtons parent={this} state={state} eventTypes={eventTypes} viewMode={viewMode}/>
        }
        { state.canJoin === false &&
            <div className={classNames({"box-section": true, 'd-none': state.isMeetingOwner})}>
                <WaitingUserScreen parent={this} state={state} ></WaitingUserScreen>
            </div>
        }
            <InviteToGroupModal
                parent={this} 
                showModal={this.state.inviteBox} 
                meetingUrl={this.state.meetingUrl}
                onHideModal={this.showInviteBox} 
                onClickModal={this.showInviteBox}
                alert={this.props.alert}
            />
            <MeetingErrorModal
                showModal={state.isEventError} 
                msg={state.eventError}
                reloadButton={state.reloadOnError}
                closeEvent={this.stopVideo}
                hideErrorModal={ () => {this.changeState('isEventError', false) } }
            />
            { state.showSettingBox &&
            <ConfirmSettingsModal
                parent={this} 
                initials={state.loggedInAttenddee}
            />
            }
        </div>
    );
    }
}

const mapStateToProps = state => {
    return {
        eventDetails: state.events.current,
        breakout: state.events.breakout
    };
};

export default compose(withAlert(), connect(mapStateToProps , { eventsByIdRequest, createBreakoutRequest }))(Groupcall)
