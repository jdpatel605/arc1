import React from "react";
import PropTypes from 'prop-types';

const ParticipantNameOnVideo = ({idPrefix, dataId, name, isFullName, user, parent}) => {
    let shortName = name
    if(name && !isFullName){
        if(name.length > 11){
            shortName = `${name.substring(0, 10)}..`
        }
    }else{
        if(Object.keys(parent.state.allMembers).length > 5 && name.length > 31){
            shortName = `${name.substring(0, 30)}..`
        }else if(name.length > 50){
            shortName = `${name.substring(0, 50)}..`
        }
    }
    
    return (
        <div className="caller-name">
            { user.videoEnabled &&
                <>
                {  user.isPaused &&
                    <img src="/images/play.svg" className="play-pause-button" onClick={ () => parent.pauseUnpauseSingleVideo(user, true) } title='Start receiving video' />
                }
                {  !user.isPaused &&
                    <img src="/images/pause.svg" className="play-pause-button" onClick={ () => parent.pauseUnpauseSingleVideo(user, false) } title='Stop receiving video' />
                }
                </>
            }
            <a className="btn call-name" href="#" id={`hover-name-${idPrefix}-${dataId}`} title={name}>
                {shortName}
            </a>
        </div>
        )
}
ParticipantNameOnVideo.defaultProps = {
    name: null,
    isFullName: true,
}
ParticipantNameOnVideo.propTypes = {
  idPrefix: PropTypes.string.isRequired,
  dataId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]).isRequired,
  name: PropTypes.string,
  isFullName: PropTypes.bool,
};
export default ParticipantNameOnVideo;
