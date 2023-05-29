import React from "react";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as Svg from '../../utils/Svg';
import { Logger } from './../../utils/logger';

const fileLocation = "src\\components\\groupcall\\WaitingRoomList.jsx";

const Empty = () => {
	return (<></>)
}

const WaitingRoomList = ({ parent, state }) => {

	const admitUser = (userId) => {
		try {
//			console.log('admit user ', userId)
			parent.event[parent.activeEventId].push('admit:user', { identifier: userId })
                        .receive("ok", resp => { console.log("User admitted successfully ", userId, resp) })
                        .receive("error", resp => { console.log("Error while admitting user ", userId, resp) })
                        .receive("timeout", () => console.log("Networking issue. Still waiting... for user id ", userId));
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'admitUser' })
		}
	}

	const admitAllUser = () => {
		try {
			const newMemberList = parent.state.newMembers
			Object.keys(newMemberList).map((v, k) => {
//				parent.event[parent.activeEventId].push('admit:user', { identifier: v })
                                admitUser(v)
				return v
			})
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'admitAllUser' })
		}

	}

	const rejectUser = (userId) => {
		try {
			const data = {
				type: 'userRejected',
				payload: {
					from: parent.loginUserId,
					user: userId,
				}
			}
			parent.event[parent.activeEventId].push("cmd", data)
		} catch({ message }) {
			Logger.error({ fileLocation, message, trace: 'rejectUser' })
		}
	}
        
        const sortName = (name, len = 21) => {
            let n = name
            if(name.length > len){
                n = `${name.substring(0, len)}...` 
            }
            return n
        }
	return (
		<>
			<div className="waiting-list">
				<a className={ classNames({ "btn btn-round bg-black-500 setting-btn btn-click": true, 'btn-close': state.admitDropdown }) } href="#" onClick={ () => parent.showWaitingList() }>
					In Waiting Room ({ Object.keys(state.newMembers).length })
                    <Svg.ArrowDown />
				</a>
				<div className={ classNames({ "option-menu setting-dropdown": true, 'show': state.admitDropdown }) }>
					{ Object.keys(state.newMembers).map((v, k) => {
						v = state.newMembers[v]
						return (
							<div className="setting-opt" key={ `waiting-user-${k}` }>
								<div className="user-info-sec">
                                                                    <h5 title={v.name}><a href="#">{ sortName(v.name) }</a></h5>
                                                                    <p>In waiting room</p>
								</div>
								{ state.isMeetingOwner === true &&
									<div className="d-flex user-info-btn">
										<a className="btn rounded-circle bg-black" href="#" onClick={ () => rejectUser(v.identifier) }>
											<Svg.RejectButton />
										</a>
										<a className="btn rounded-circle btn-green" href="#" onClick={ () => admitUser(v.identifier) }>
											<Svg.AcceptButton />
										</a>
									</div>
								}
							</div>
						)
					})
					}
					{ Object.keys(state.newMembers).length <= 0 &&
						<div className="setting-opt" >
							<p>No user in waiting room</p>
						</div>
					}
					{ Object.keys(state.newMembers).length > 1 && state.isMeetingOwner === true &&
						<div className="option-footer justify-content-end">
							<a className="btn btn-green btn-sm" href="#" onClick={ () => admitAllUser() }>Admit All
                            <Svg.AcceptButton />
							</a>
						</div>
					}
				</div>
			</div>
			<div className="waiting-room-sec" >
				{ Object.keys(state.newMembers).map((v, k) => {
					v = state.newMembers[v]
					if(v.alertShow) {
						return (

							<div className="waiting-room-part" key={ `alert-${k}` }>
								<h5 title={v.name}>{ sortName(v.name, 34) } <label>joined the waiting room.</label></h5>
								{ state.isMeetingOwner === true &&
									<div className="action-align">
										<a className="btnr-close" href="#">
											<img src="/images/close-red.png" alt="img" onClick={ () => rejectUser(v.identifier) } />
										</a>
										<a className="btn-check" href="#">
											<img src="/images/icon-check.png" alt="img" onClick={ () => admitUser(v.identifier) } />
										</a>
									</div>
								}
							</div>

						)
					} else {
						return <Empty key={ `alert-${k}` }></Empty>
					}
				})
				}
			</div>
		</>
	)
}
WaitingRoomList.propTypes = {
	parent: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
};
export default WaitingRoomList;
