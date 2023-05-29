import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import SingleProfile from "../../profile/SingleProfile";
import {Logger} from './../../../utils/logger';
import { Helper } from './../../../utils/helper';
import UserImage from '../../common/UserImage';
import Image from '../../common/Image';
import {KebabIcon, RecurringEventIcon} from "../../../utils/Svg";
const fileLocation = "src\\components\\admin\\user\\EventList.jsx";

const EventList = (props) => {
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem('identifier');
  const {adminUserDetails} = useSelector(({user}) => user);
  const [sections, setSections] = useState({});
  const userRole = 'owner';
  
  
    useEffect(() => {
      try {
        if(adminUserDetails.events) {

          // Manipulate the object
          const tmpSections = {};
          adminUserDetails.events.forEach(event => {
            const tempArray = tmpSections[event.section] ? tmpSections[event.section] : [];
            tmpSections[event.section] = [...tempArray, event];
          });
          setSections(tmpSections);
        }
      } catch({ message }) {
        Logger.error({ fileLocation, message, trace: 'useEffect:adminUserDetails.events' })
      }
    }, [adminUserDetails.events]);

return (
  <div className="member-list-data">
        {
          // Loop through each section
          Object.keys(sections).map((section, sKey) => (

            sections[section].length > 0 &&
            <div key={ sKey }>
              <div className="title"><label>{ section }</label></div>
              {
                // Loop through each event
                sections[section].map((event, key) => (
                  
                    <div className={ `` } key={ key }>
                        <div className="person-data" >
                          <div className="person-info">
                            <div className="person-img">
                              <div className="img-round img-60">
                                <Image src={ event.avatar_url } altText="Event" />
                              </div>
                            </div>
                            <div className="person">
                              <h4 title={ event.name }>{ Helper.textLimit(event.name, 32) }</h4>
                              <p title={ event.organization_name }>{ Helper.textLimit(event.organization_name, 32) }</p>
                            </div>
                          </div>
                          <div className="communication pt-2">
                            { event.recursion_identifier &&
                            <a href={void(0)} role="button" className="btn btn-add btn-blue">{RecurringEventIcon}</a>
                            }   
                            <div className="time-data">
                              <label>
                                {
                                  (event.section === 'Today' || event.section === 'This week')
                                    ?
                                    Helper.formatDateTz(event.begins_at, 'dddd DD')
                                    :
                                    Helper.formatDateTz(event.begins_at, 'MMMM DD')
                                }
                              </label>
                              <a href={void(0)} role="button" className="btn">{ Helper.formatDateTz(event.begins_at, 'h:mma') }</a>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                  
                ))
              }
            </div>
          ))
        }
    {adminUserDetails.events.length === 0 &&
        <div className="member-info">
          <div className="member">
            <div className="member-data m-4">
              <a href="#">No events!</a>
            </div>
          </div>
        </div>
      }
  </div>
)
}
EventList.propTypes = {
};
EventList.defaultProps = {
};
export default EventList;
