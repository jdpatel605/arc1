import React from "react";
import moment from "moment"
import classNames from 'classnames';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';
import { Helper } from '../../utils/helper'
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\groupcall\\Chats.jsx";

const componentDecorator = (href, text, key) => (
    <a href={ href } key={ key } target="_blank" rel="noopener noreferrer">
        {text }
    </a>
);

const Chats = ({ parent, state, alertType }) => {
    let currentChatUser = ''
    if(parent.chatUserDetails[state.activeChat]) {
        currentChatUser = state.activeChat === parent.loginUserId ? 'You' : parent.chatUserDetails[state.activeChat].name
    }
    const openChatUserList = () => {
        parent.changeState('isChatListOpen', !parent.state.isChatListOpen)
    }
    const changeChatTo = (id) => {
        parent.changeState('chatTo', id)
        parent.changeState('isChatListOpen', false)
    }
    const changeActiveChat = (chatUser) => {
        try {
            parent.changeState('activeChat', chatUser)
            if(chatUser) {
                parent.changeState('chatTo', chatUser)
                const oldCount = parent.chatNewMsgCount[chatUser]
                parent.chatNewMsgCount[chatUser] = 0
                parent.changeState('totalUnreadChats', parent.state.totalUnreadChats - oldCount)
            } else {
                parent.changeState('chatTo', 'Everyone')
            }
        } catch({ message }) {
            Logger.error({ fileLocation, message, trace: 'changeActiveChat' })
        }
    }
    const sendChatMessage = () => {
        try {
            const userId = parent.state.chatTo
            if(!parent.state.chatMsg.trim() && !parent.state.chatFile) {
                return
            }
            if(userId === 'Everyone') {
                parent.event[parent.mainEventId].push("message:new", { msg: parent.state.chatMsg, from: parent.loginUserId, file: parent.state.chatFile }).receive('ok', chatSent).receive('error', chatError)
            } else {
                const event = `message:new:${userId}`
                parent.event[parent.mainEventId].push(event, { msg: parent.state.chatMsg, file: parent.state.chatFile }).receive('ok', chatSent).receive('error', chatError)
            }
            const user = { name: parent.state.allMembers[parent.loginUserId].name, identifier: parent.loginUserId }
            parent.setChatMessages(userId, { body: { msg: parent.state.chatMsg, from: parent.loginUserId, file: parent.state.chatFile }, timestamp: moment().valueOf(), user: user })
            parent.changeState('chatMsg', '')
            parent.changeState('chatFile', null)
            document.getElementById('content').scrollTop = 99999;
        } catch({ message }) {
            Logger.error({ fileLocation, message, trace: 'sendChatMessage' })
        }
    }
    const chatSent = (data) => {
        //        console.log('chat sent', data)
    }
    const chatError = (data) => {
        console.log('chat error', data)
    }
    const detectEnterOnChatBox = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            sendChatMessage()
        }
    }
    const setChatMessage = (e) => {
        parent.changeState('chatMsg', e.target.value)
    }
    const checkFile = (e) => {
        try {
            parent.changeState('chatFile', null)
            const files = e.target.files
            if(files.length > 0) {
                const file = files[0]
                const allowedSize = 2 // in mb
                const mbConverter = 1024 * 1024
                const size = file.size / mbConverter
                if(size > allowedSize) {
                    e.target.value = null
                    return parent.showAlert(`File size should not be more than ${allowedSize} MB.`, alertType.ERROR)
                }
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                }).then(data => {
                    const fileData = {
                        name: file.name,
                        data: data
                    }
                    parent.changeState('chatFile', fileData)
                }).catch(err => {
                    console.log('error', err)
                    return parent.showAlert(`This file may be corrupted. Try another file.`, alertType.ERROR)
                })
            }
        } catch({ message }) {
            Logger.error({ fileLocation, message, trace: 'checkFile' })
        }
    }
    
    const sortName = (name) => {
        let n = name
        if(name.length > 21){
            n = `${name.substring(0, 21)}...` 
        }
        return n
    }
    return (
        <>
            <div className="card-header" role="tab" id="heading-B">
                <h5 className="mb-0">
                    <a className="collapsed" data-toggle="collapse" href="#collapse-B" aria-expanded="false"
                        aria-controls="collapse-B">
                        Chat
                    </a>
                </h5>
            </div>
            <div id="collapse-B" className="collapse" data-parent="#content" role="tabpanel" aria-labelledby="heading-B">
                <div className={ classNames({ "no-data": true, 'd-none': Object.keys(state.allChats).length }) } >
                    <div className="text-center">
                        <img className="mb-4" src="images/chat.png" height="72" width="72" alt="" />
                        <label >Begin the chat by typing in the box below.</label>
                    </div>
                </div>
                <div className="chat-box-list" id="chat-box-list">
                    <div className="group">
                        { state.activeChat &&
                            <div className="member-title">
                                <label>
                                    <span className="cursor-pointer" onClick={ () => changeActiveChat(null) }>
                                        <Svg.BackButton />
                                    </span>
                                &nbsp;
                                { state.activeChat === 'Everyone' ? state.activeChat : currentChatUser }
                                </label>
                            </div>
                        }
                        {
                            !state.activeChat && Object.keys(state.allChats).map((v, k) => {
                                const chatUser = v
                                v = state.allChats[v]
                                const latest = v[v.length - 1]
                                return (
                                    <div className="chat-person cursor-pointer" onClick={ () => changeActiveChat(chatUser) } key={ `all-chat-${k}` } style={ { borderBottom: '1px solid' } }>
                                        <div className="chat-person-title">
                                            <div className="chat-person-name" title={chatUser === 'Everyone' ? 'Everyone' : parent.chatUserDetails[chatUser].name}>
                                                <h6 >{ chatUser === 'Everyone' ? 'Everyone' : sortName(parent.chatUserDetails[chatUser].name) } <label>{ chatUser === 'Everyone' ? 'Group Chat' : 'direct' }</label></h6>
                                            </div>
                                            <div className="chat-person-timeline">
                                                <label className="chat-time">{ Helper.formatDate(latest.timestamp, 'hh:mm a') }</label>
                                                <a className="chat-arrow-right" href="#">
                                                    <img src="images/navigate-right.png" alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="chat-person-chat">
                                            <p>{ latest.body.msg.length > 35 ? `${latest.body.msg.substring(0, 35)}..` : latest.body.msg }</p>
                                            {
                                                latest.body.file &&
                                                <p>{ latest.body.file.name }</p>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className= { classNames({ "group-chat": true, 'd-none': Object.keys(state.allChats).length === 0 }) }>
                        {
                            state.activeChat && state.allChats[state.activeChat].map((v, k) => {
                                let isNew = false
                                if(parent.chatNewMsgIndex[state.activeChat] !== null && parent.chatNewMsgIndex[state.activeChat] === k) {
                                    isNew = true
                                    parent.chatNewMsgIndex[state.activeChat] = null
                                }
                                
                                return (
                                    <div key={ `direct--chat-${k}` }>
                                        {
                                            isNew === true &&
                                            <div className="group-title">
                                                <label>New</label>
                                            </div>
                                        }
                                        <div className="chat-person" key={ `direct-chat-${k}` } style={ { borderBottom: '1px solid' } }>
                                            <div className="chat-person-title">
                                                <div className="chat-person-name" title={v.user.identifier === parent.loginUserId ? 'You' : v.user.name}>
                                                    <h6>{ v.user.identifier === parent.loginUserId ? 'You' : sortName(v.user.name) } </h6>
                                                </div>
                                                <div className="chat-person-timeline">
                                                    <label className="chat-time">{ Helper.formatDate(v.timestamp, 'hh:mm a') }</label>
                                                </div>
                                            </div>
                                            <div className="chat-person-chat">
                                                <Linkify componentDecorator={ componentDecorator }>
                                                    <p>{ v.body.msg }</p>
                                                </Linkify>
                                                {
                                                    v.body.file &&
                                                    <a href={ v.body.file.data } download={ v.body.file.name }>{ v.body.file.name }</a>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                )
                                
                                
                            })
                           
                        }
                         </div>
                    </div>
                </div>
                <div className="group-chat-box">
                    { !state.activeChat &&
                        <div className="group-chat-title">
                            <label >Chat with</label>
                            <div className='select'>
                                <div id="selected-chat-user" className={ classNames({ "select-styled": true, "active": state.isChatListOpen }) } onClick={ () => openChatUserList() }
                                title={state.chatTo === 'Everyone' ? 'Everyone' : parent.chatUserDetails[state.chatTo].name} >
                                    { state.chatTo === 'Everyone' ? 'Everyone' : sortName(parent.chatUserDetails[state.chatTo].name) }
                                </div>
                                <ul className={ classNames({ "select-options": true, 'd-none': !state.isChatListOpen, 'd-block': state.isChatListOpen }) }>
                                    <li rel="Everyone" title="Everyone" onClick={ () => changeChatTo('Everyone') }>Everyone</li>
                                    {
                                        Object.keys(state.allMembers).map((v, k) => {
                                            v = state.allMembers[v]
                                            if(v.identifier === parent.loginUserId) {
                                                return ''
                                            }
                                            return (
                                                <li rel={ v.name } onClick={ () => changeChatTo(v.identifier) } key={ `chat-user-${k}` } title={v.name}>{ sortName(v.name) }</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                    <div className="msg-box">
                        <div className="full-msg-box">
                            <textarea className="txt-msg"
                                onChange={ (e) => setChatMessage(e) }
                                onKeyPress={ (e) => detectEnterOnChatBox(e) }
                                value={ state.chatMsg }
                                cols="30" rows="1" placeholder="Type message here..."
                                style={ { resize: 'none' } }></textarea>
                            <a className="btn-send" href="#" onClick={ () => sendChatMessage() }>
                                <Svg.SendButton />
                            </a>
                        </div>
                        <div className="attechment">
                            <input type="file" onChange={ (e) => checkFile(e) } />
                            { state.chatFile &&
                                <label>!</label>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
Chats.propTypes = {
    parent: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    alertType: PropTypes.object.isRequired,
};
export default Chats;
