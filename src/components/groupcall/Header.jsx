import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import BreakoutInvitationList from './BreakoutInvitationList';
import WaitingRoomList from './WaitingRoomList';
import PropTypes from 'prop-types';
import Timer from './timer';

const Header = ({parent, state, eventDetails}) => {
    
    const { profile }  = useSelector(({ user }) => user)

    useEffect( () => {
        if(profile.identifier){
//            console.log('profile', profile)
            parent.setAsCurrentUserIfNotSet(profile.identifier)
        }
    }, [profile.identifier] )
    
    return (
        <div className={classNames({"top-bar": true, 'd-none': !state.displayWhileScrenShare})}>
            <div className="left-top-bar">
                <div className="d-flex">
                    <div className="title-bar">
                        <h5><a href="#">{eventDetails && eventDetails.name}</a></h5>
                        <label >{eventDetails.host && eventDetails.host.name}</label>
                    </div>
                </div>
            </div>
            <div className="right-top-bar">
                <div className="user-sec">
                    <div className="d-flex">
                    <BreakoutInvitationList parent={parent} state={state}></BreakoutInvitationList>
                    {
                        state.canJoin && 
                        <WaitingRoomList parent={parent} state={state}></WaitingRoomList>
                    }
                    { 
                    state.canJoin && 
                        <span className="btn btn-green btn-sm" onClick={() => parent.showInviteBox(true)} >+ Invite</span>
                    }
                    </div>   
                    <div className="d-flex">
                    { state.isLoaded && state.canJoin &&
                    <Timer eventId = {parent.mainEventId}></Timer>
                    }
                    <div className="user-img">
                        <h4 className="clr-white">{state.loggedInAttenddee}</h4>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
Header.propTypes = {
  parent: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  eventDetails: PropTypes.object,
};
export default Header;
