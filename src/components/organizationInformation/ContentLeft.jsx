import React, {useState} from "react";
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from '../common/Image';
import ReadMoreText from './../common/ReadMoreText';
import PhoneFormat from './../common/PhoneFormat';
import {ChevronDownIcon, ChevronUpIcon, OrganizationIcon, LocationOutlineIcon, MailIcon, PhoneIcon, WebsiteIcon} from "../../utils/Svg";
import {Logger} from './../../utils/logger';

const fileLocation = "src\\components\\organizationInformation\\ContentLeft.jsx";

const ContentLeft = (props) => {

  const [closeIcon, setCloseIcon] = useState(false);

  const addressHeader = () => {
    try {
      const address = props.data.address ? props.data.address.formatted_line.split(", ") : '-';
      if(address.length > 0) {
        return address[0]
      } else {
        return '';
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'addressHeader'})
    }
  }
  const addressDetails = () => {
    try {
      const address = props.data.address ? props.data.address.formatted_line.split(", ") : '-';
      if(address.length > 1) {
        address.shift();
        return address.join(', ');
      } else {
        return '';
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'addressDetails'})
    }
  }

  const subscriptionButton = () => {
    try {
      if(props.isSubscribed === true) {
        return (
          <Dropdown onToggle={(e) => setCloseIcon(!closeIcon)} onClick={(e) => e.stopPropagation()}>
            <div className="btn-box">
              <Dropdown.Toggle as="a" className={`btn btn-join-org btn-round btn-gray btn-member btn-click ${closeIcon && 'btn-close'}`}>
                {props.data.current_user_role}{closeIcon === true ? ChevronUpIcon : ChevronDownIcon}
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight="true" className="option-menu">
                <Dropdown.Item onClick={() => props.handelSetSubscription(false)} className="img-exit">Leave Organization</Dropdown.Item>
                {(props.data.current_user_role === 'admin' || props.data.current_user_role === 'owner') &&
                  <Dropdown.Item onClick={() => props.handleShowEditOrganization(true)} className="img-edit-icon">Edit Organization</Dropdown.Item>
                }
              </Dropdown.Menu>
            </div>
          </Dropdown>
        )
      } else if(props.isSubscribed === false) {
        return (
          <span className="btn btn-round btn-green" onClick={() => props.handelSetSubscription(true)}>+ Join Organization</span>
        )
      } else {
        return '';
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'subscriptionButton'})
    }
  }

  return (
    <div className="col-lg-5">
      <div className="left-panal bg-black-900">
        <div className="person-data flex-wrap">
          <div className="person-cover">
            <Image src={props.data.billboard_url} size="medium" altText="Organization" />
            <div className="fix-btn">
              {subscriptionButton()}
            </div>
          </div>
          <div className="person-info">
            <div className="person-img">
              <Image src={props.data.avatar_url} altText="Organization" />
            </div>
            <div className="person">
              <h3>{props.data.name}</h3>
            </div>
          </div>
          {props.data.subname &&
            <div className="person">
              <h5 className="w-100">{props.data.subname}</h5>
              {props.data.description && props.data.description.length > 150 &&
                <p id="organizationDetails">
                  <ReadMoreText content={props.data.description} linkClass="load-more cursor-pointer text-white" />
                </p>
              }
              {props.data.description && props.data.description.length <= 150 &&
                <p id="organizationDetails">
                  {props.data.description}
                </p>
              }
            </div>
          }
        </div>
        <div className="info-list">
          <div className="info-data">
            <div className="list-info">
              <h5>This is a {props.data.visibility === 'private' ? 'Private' : 'Public'} Organization</h5>
              <p>{props.data.visibility === 'private' ? 'Only private member' : 'Anyone'} can see your organization’s info</p>
            </div>
            <div className="communication">
              <a href="/#">{OrganizationIcon}</a>
            </div>
          </div>
          {props.data.address &&
            <div className="info-data">
              <div className="list-info">
                <h5>{addressHeader()}</h5>
                <p>{addressDetails()}</p>
              </div>
              <div className="communication">
                <a href="/#">{LocationOutlineIcon}</a>
              </div>
            </div>
          }
          {props.data.main_phone_number &&
            <div className="info-data">
              <div className="list-info">
                {props.data.main_phone_number &&
                  <h5><PhoneFormat number={props.data.main_phone_number} /></h5>
                }
                {!props.data.main_phone_number &&
                  <h5>-</h5>
                }
                <p>{props.data.visibility === 'private' ? 'Only private member' : 'Anyone'} can see your organization’s info</p>
              </div>
              <div className="communication">
                <a href="/#">{PhoneIcon}</a>
              </div>
            </div>
          }
          {props.data.email &&
            <div className="info-data">
              <div className="list-info">
                <h5>{props.data.email ? props.data.email : "-"}</h5>
                <p>For general questions &amp; contact information</p>
              </div>
              <div className="communication">
                <a href="/#">{MailIcon}</a>
              </div>
            </div>
          }
          {props.data.give_url &&
            <div className="info-data">
              <div className="list-info">
                <h5>{props.data.give_url ? props.data.give_url : "-"}</h5>
                <p>Website</p>
              </div>
              <div className="communication">
                <a href="/#">{WebsiteIcon}</a>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

ContentLeft.propTypes = {
  data: PropTypes.object,
  isSubscribed: PropTypes.bool,
  handelSetSubscription: PropTypes.func,
};
ContentLeft.defaultProps = {
  data: {},
};

export default ContentLeft;
