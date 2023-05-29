import React, { useContext, useState } from "react";
import { EventContext } from '../EventContext';
import { ArrowBackIconGray } from './../../../../utils/Svg';

const EventModalAdvanceSettings = () => {

  const { eventDetails, setEventDetails, setCurrentPage } = useContext(EventContext);

  const [type, setType] = useState(eventDetails.type);
  const [visibility, setVisibility] = useState(eventDetails.visibility);
  const handleUpdateEventType = e => {
    const { target } = e;
    setType(target.name)
  }
  const handleUpdateEventVisibility = e => {
    const { target } = e;
    setVisibility(target.value);
  }
  const saveAdvanceSettings = () => {
    setEventDetails(prevProps => ({
      ...prevProps, type, visibility
    }));
    setCurrentPage('mainPage');
  }

  return (
    <>
      <div className="modal-header inner-header justify-content-between pt-0">
        <div>
          <h4 className="modal-title d-flex align-items-center">
            <div className="back-btn d-flex mr-2 back-btn-host">
              <a href="#/" onClick={ () => setCurrentPage('mainPage') }>{ ArrowBackIconGray }</a>
            </div>
            Advanced Settings
          </h4>
          <label style={ { paddingLeft: '5px', paddingTop: '5px' } }>Select the options below in order to create your event.</label>
        </div>
      </div>
      <div className="modal-body inner-body pb-0">
        <p>Event Type</p>
        <div className="mb-3">
          <a className="dropdown-item checkbox" href="#/">
            <input type="checkbox" name="discussion" className="checkbox-input" checked={ type === 'discussion' ? true : false } onChange={ (e) => handleUpdateEventType(e) } />
            <label className="checkbox-lable"><b>Discussion</b> A group video chat event</label>
          </a>
          <a className="dropdown-item checkbox" href="#/">
            <input type="checkbox" name="presentation" className="checkbox-input" checked={ type === 'presentation' ? true : false } onChange={ (e) => handleUpdateEventType(e) } />
            <label className="checkbox-lable">
              <b>Presentation</b>A live stream event</label>
          </a>
          {/* <a className="dropdown-item checkbox" href="#/">
            <input type="checkbox" name="narrowcast" className="checkbox-input" checked={type === 'narrowcast' ? true : false} onChange={(e) => handleUpdateEventType(e)} />
            <label className="checkbox-lable">
              <b>Narrowcast</b>A group event centered around an external video
            </label>
          </a> */}
        </div>
        <p>Event Privacy</p>
        <div className="radio-btn-sec">
          <div className="form-check">
            <input className="form-check-input" id="radioPrivate" type="radio" name="radioPrivatePublic" onChange={ (e) => handleUpdateEventVisibility(e) } defaultValue="private" checked={ (visibility === 'private') && true } />
            <label className="form-check-label" htmlFor="radioPrivate">Private</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" id="radioPublic" type="radio" name="radioPrivatePublic" onChange={ (e) => handleUpdateEventVisibility(e) } defaultValue="public" checked={ (visibility === 'public') && true } />
            <label className="form-check-label" htmlFor="radioPublic">Public</label>
          </div>
          {eventDetails?.eventGroupHost?.hostType === "group" &&
          <div className="form-check">
            <input className="form-check-input" id="radioGroupPublic" type="radio" name="radioPrivatePublic" onChange={ (e) => handleUpdateEventVisibility(e) } defaultValue="group_public" checked={ (visibility === 'group_public') && true } />
            <label className="form-check-label" htmlFor="radioGroupPublic">Group Public</label>
          </div>
          }
          {eventDetails?.eventGroupHost?.hostType === "organization" &&
          <div className="form-check">
            <input className="form-check-input" id="radioOrganizationPublic" type="radio" name="radioPrivatePublic" onChange={ (e) => handleUpdateEventVisibility(e) } defaultValue="organization_public" checked={ (visibility === 'organization_public') && true } />
            <label className="form-check-label" htmlFor="radioOrganizationPublic">Organization Public</label>
          </div>
          }
        </div>
        {
          visibility === 'private' ? <h6>Only current group members can see this event</h6> : visibility === 'public' ? <h6>Anyone in Arc can see this event</h6> : visibility === 'group_public' ? <h6>Only members of this group can see this event</h6> : visibility === 'organization_public' ? <h6>Only members of this organization can see this event</h6> : <h6>&nbsp;</h6>
        }
        <div className="btn-sec pt-3 pl-2 pr-2">
          <span className="btn btn-medium md-box btn-black clr-white" onClick={ () => setCurrentPage('mainPage') }>Cancel</span>
          <button type="button"
            onClick={ () => saveAdvanceSettings() }
            className={ `btn btn-medium md-box btn-submit btn-green` }
          >Save</button>
        </div>
      </div>
    </>
  );

}

export default EventModalAdvanceSettings;
