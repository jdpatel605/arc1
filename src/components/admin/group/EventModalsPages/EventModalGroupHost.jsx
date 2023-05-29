import React, {useContext} from "react";
import {EventContext} from '../EventContext';
import {useSelector} from "react-redux";
import Image from './../../../common/Image';
import {ArrowBackIcon} from './../../../../utils/Svg';

const EventModalGroupHost = () => {

  const {eventHostList} = useSelector(({events}) => events);
  const {setEventDetails, setCurrentPage, setValidationErrors} = useContext(EventContext);
  const handelSelectHost = (data, type = 'group') => {
    const eventGroupHost = {
      name: data.name,
      id: data.identifier,
      hostType: type
    }
    setValidationErrors(prevProps => ({...prevProps, eventGroupHost: {valid: true, message: ''}}));
    setEventDetails(prevProps => ({...prevProps, eventGroupHost}));
    setCurrentPage('mainPage');
  }

  return (
    <>
      <div className="modal-header inner-header justify-content-between pt-0">
        <div>
          <h4 className="modal-title d-flex align-items-center">
            <div className="back-btn d-flex mr-2 back-btn-host">
              <a href="#/" onClick={() => setCurrentPage('mainPage')}>{ArrowBackIcon}</a>
            </div>
            Event Host
          </h4>
          <label style={{paddingLeft: '5px'}}>Select the group or organization you would like to be the event host.</label>
        </div>
      </div>
      <div className="modal-body inner-body modal-scroll" style={{marginBottom: '-65px'}} >
        <p className="d-inline-block mb-1">My Organizations</p>
        <div className="chat-person-list">
          {
            eventHostList.organizations
              ?
              eventHostList.organizations.map((data, key) => (
                <div className="chat-person-data" key={key}>
                  <div className="person-data">
                    <div className="person-info">
                      <div className="person-img">
                        <div className="img-round img-44">
                          <Image src={data.avatar_url} altText="Organization" />
                        </div>
                      </div>
                      <div className="person">
                        <div><h5>{data.name}</h5></div>
                      </div>
                    </div>
                    <div className="communication">
                      <span className="btn btn-green" onClick={() => handelSelectHost(data, 'organization')}>Select</span>
                    </div>
                  </div>
                </div>
              ))
              :
              <div className="no-events">Organizations not found</div>
          }
        </div>
        {eventHostList.groups.length > 0 &&
        <p className="d-inline-block mb-1">My Groups</p>
        }
        <div className="chat-person-list">
          {
            eventHostList.groups
              ?
              eventHostList.groups.map((data, key) => (
                <div className="chat-person-data" key={key}>
                  <div className="person-data">
                    <div className="person-info right-space">
                      <div className="person-img">
                        <div className="img-round img-44">
                          <Image src={data.avatar_url} altText="Group" />
                        </div>
                      </div>
                      <div className="person">
                        <div>
                          <h5>{data.name}</h5>
                          <p>{data.organization_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="communication">
                      <span className="btn btn-green" onClick={() => handelSelectHost(data, 'group')}>Select</span>
                    </div>
                  </div>
                </div>
              ))
              : <div className="no-events">Group not found</div>
          }
        </div>
      </div>
    </>
  );

}

export default EventModalGroupHost;
