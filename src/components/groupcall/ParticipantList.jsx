import React , { useState, useEffect } from "react";
import ParticipantMainButtons from './ParticipantMainButtons';
import ParticipantIndividualButtons from './ParticipantIndividualButtons';
import UnjoinedControles from './UnjoinedControles';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PropTypes from 'prop-types';
import Tooltip from 'react-bootstrap/Tooltip';

const ParticipantList = ({parent, state}) => {
    
    const getTotalCount = (p, k, u, type = 'total') => {
        const unMemCnt = Object.keys(u).length
        const kikMemCnt = Object.keys(k).length
        const prtMemCnt = Object.keys(p).length
        let total = unMemCnt + kikMemCnt + prtMemCnt
        
        if(type === 'p'){
            return prtMemCnt
        } else if(type === 'k'){
            return kikMemCnt
        }else if(type === 'u'){
            return unMemCnt
        }else{
            if(!state.isMeetingOwner){
                total = prtMemCnt
            }
            return total
        }
    }
    
    return (
        <>
            { getTotalCount(state.allMembers, state.kickedMembers, state.unjoinedMembers) === 0 &&
                <div className="no-data">
                    <div className="text-center">
                        <img className="mb-4" src="images/user-icon.png" alt="" srcSet="" />
                        <label >You are the only one in the event.</label>
                    </div>
                </div>
            }
            { getTotalCount(state.allMembers, state.kickedMembers, state.unjoinedMembers) &&
                <div className="member-list">
                    {/*<div className="member-list-header">
                        <h5>Participants ({getTotalCount(state.allMembers, state.kickedMembers, state.unjoinedMembers, 'p')}/{getTotalCount(state.allMembers, state.kickedMembers, state.unjoinedMembers)})</h5>
                        {state.isMeetingOwner &&
                            <ParticipantMainButtons parent={parent}></ParticipantMainButtons>
                        }
                    </div> */}
                    <div className="member-list-data">
                        <div>
                            <div className="group">
                                <div className="member-title">
                                    <label>In Meeting ({getTotalCount(state.allMembers, state.kickedMembers, state.unjoinedMembers, 'p')}/{getTotalCount(state.allMembers, state.kickedMembers, state.unjoinedMembers)})</label>
                                    {state.isMeetingOwner &&
                                        <ParticipantMainButtons parent={parent}></ParticipantMainButtons>
                                    }
                                </div>
                            </div>
                            {
                                Object.keys(state.groupedUser).map((brkout, key) => {
                                    const bo = state.groupedUser[brkout]
                                    return (
                                        <div className="group" key={`group-${key}`}>
                                            {
                                                Object.keys(state.groupedUser).length > 1 &&
                                                <div className="member-title">
                                                    <label> {brkout} ({Object.keys(bo).length})</label>
                                                </div>
                                            }
                                            {
                                                Object.keys(bo).map((v, k) => {
                                                    v = bo[v]
                                                    let name = v.name
                                                    if(name.length > 21){
                                                        name = `${name.substring(0, 21)}...` 
                                                    }
                                                    return (
                                                        <div className="member-info" key={`member-${k}`}>
                                                            <div className="member">
                                                                <div className="member-img">
                                                                    
                                                                    <a href="#">
                                                                        {v.initials}
                                                                    </a>
                                                                </div>
                                                                <div className="member-data">
                                                                    <a href="#" title={v.name}>{name}</a>
                                                                </div>
                                                            </div>

                                                            <ParticipantIndividualButtons parent={parent} participantValue={v}></ParticipantIndividualButtons>

                                                        </div>
                                                    )

                                                })
                                            }
                                        </div>
                                    )
                                })

                            }
                            { Object.keys(state.unjoinedMembers).length > 0 && state.isMeetingOwner &&
                                <div className="group" >
                                            
                                    <div className="member-title">
                                        <label> Not Yet Joined ({Object.keys(state.unjoinedMembers).length})</label>
                                    </div>
                                {            
                                Object.keys(state.unjoinedMembers).map((v, k) => {
                                    v = state.unjoinedMembers[v]
                                    let name = v.name
                                    if(name.length > 21){
                                        name = `${name.substring(0, 21)}...` 
                                    }
                                    return (
                                        <div className="member-info" key={`member-${k}`}>
                                            <div className="member">
                                                <div className="member-img">
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                Assign Host
                                                    </Tooltip>
                                                        }>
                                                        <a href="#">
                                                            {v.initials}
                                                        </a>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="member-data">
                                                    <a href="#" title={v.name}>{name}</a>
                                                </div>
                                            </div>
                                            <UnjoinedControles parent={parent} user={v} type="unjoined"/>
                                        </div>
                                    )
                                })
                                }
                                </div>
                            }
                            { Object.keys(state.kickedMembers).length > 0 && state.isMeetingOwner &&
                                <div className="group" >
                                            
                                    <div className="member-title">
                                        <label> Kicked ({Object.keys(state.kickedMembers).length})</label>
                                    </div>
                                {            
                                Object.keys(state.kickedMembers).map((v, k) => {
                                    v = state.kickedMembers[v]
                                    let name = v.name
                                    if(name.length > 21){
                                        name = `${name.substring(0, 21)}...` 
                                    }
                                    return (
                                        <div className="member-info" key={`member-${k}`}>
                                            <div className="member">
                                                <div className="member-img">
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                Assign Host
                                                    </Tooltip>
                                                        }>
                                                        <a href="#">
                                                            {v.initials}
                                                        </a>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="member-data">
                                                    <a href="#" title={v.name}>{name}</a>
                                                </div>
                                            </div>
                                            <UnjoinedControles parent={parent} user={v} type="blocked"/>
                                        </div>
                                    )
                                })
                                }
                                </div>
                            }
                        </div>
                    </div>
                
                </div>
            }
            
        </>
    )
}
ParticipantList.propTypes = {
  parent: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
};
export default ParticipantList;
