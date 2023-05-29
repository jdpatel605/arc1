import React, {useState, useEffect, useRef, useCallback} from "react";
import Modal from 'react-bootstrap/Modal'
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import {SearchIcon, PublicGroupIcon, LockIcon, PlusIcon, VideoWhiteIcon, ChevronDownIcon, KebabIcon, CloseProfileIcon} from "../../../utils/Svg";
import Image from '../../common/Image';
import ReadMoreText from './../../common/ReadMoreText';
import GroupList from './GroupList';
import EventList from './EventList';
import {Logger} from './../../../utils/logger';
import UserActions from './userActions';
import { updateUserDetail } from '../../../store/actions';
const fileLocation = "src\\components\\group\\InviteToGroupModal.jsx";

const UserDetailsModal = props => {
  const dispatch = useDispatch();
  const {adminUserDetails} = useSelector(({user}) => user);
  const currentIdentifier = localStorage.getItem("identifier");
  const [tab, setTab] = useState('groups');

  const tabPannelClick = (item) => {
    setTab(item);
  }

  const hideDetailsModal = (value) => {
    props.hideDetailsModal(value);
  }

  const resetModal = () => {
      dispatch(updateUserDetail({}))
  }
  
  return (
    <Modal size="lg" className="user-detail-modal" show={props.showModal} onExited={() => resetModal()} onHide={() => props.hideDetailsModal(false)} aria-labelledby="example-modal-sizes-title-lg">
      <Modal.Body className="modal-details-group">
        { adminUserDetails &&
          <div className="chat-history">
            <div className="group-info">
              <div className="group-person-data">
                <div className="group-info-header mt-4">
                  <div className="back-btn" onClick={() => hideDetailsModal(false)}>
                    <a href="#">
                      {CloseProfileIcon}
                    </a>
                  </div>
                  <div className="group-property">
                    <UserActions user={adminUserDetails} owenrshipModal={props.owenrshipModal} inviteModal={props.inviteModal} showConfirmModal={props.showConfirmModal} extraClasses={`btn-add btn-gray`}/>
                  </div>
                </div>
                
                <div className="person-data">
                  <div className="person-info">
                    <div className="person-img">
                      <div className="img-round img-76">
                        { adminUserDetails.avatar_url &&
                        <Image className="group_details" src={adminUserDetails.avatar_url} altText="Users" />
                        }
                        { !adminUserDetails.avatar_url &&
                                <a href="#" className="clr-white">{ adminUserDetails.initials }</a>
                        }
                      </div>
                    </div>
                    <div className="person">
                    <div className="header-data-sec">
                        <div className="row header-name-sec">
                            <div className="data-sec">
                                <h4>{adminUserDetails.name}</h4>
                                <a href={void(0)}>{adminUserDetails.email}</a>
                            </div>
                            <div className="data-btn">
                                { adminUserDetails.role === 'owner' &&
                                    <a className="btn btn-round btn-blue" href={void(0)}> Org Owner </a>
                                }
                                { adminUserDetails.role === 'admin' &&
                                    <a className="btn btn-round btn-yellow" href={void(0)}> Org Admin </a>
                                }
                                { adminUserDetails.role === 'member' &&
                                    <a className="btn btn-round btn-black" href={void(0)}> Member </a>
                                }
                                
                                { adminUserDetails.role === 'user' &&
                                    <a className="btn btn-round btn-black" href={void(0)}> Member </a>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="data-sec">
                                <p>Phone</p>
                                <h6>{ adminUserDetails.mobile_phone_number }</h6>
                            </div>
                            <div className="data-sec">
                                <p>Birthday</p>
                                <h6>{ adminUserDetails.date_of_birth ? adminUserDetails.date_of_birth : '-' }</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="data-sec">
                                <p>Country</p>
                                <h6>{ adminUserDetails.country }</h6>
                            </div>
                            <div className="data-sec">
                                <p>Timezone</p>
                                <h6> { adminUserDetails.time_zone } </h6>
                            </div>
                        </div>
                        { adminUserDetails.bio &&
                        <div className="row">
                            <div className="data-sec w-100">
                            <p>Bio</p>
                            <p>
                           {adminUserDetails.bio && adminUserDetails.bio.length > 147 &&
                             
                               <ReadMoreText
                                 content={adminUserDetails.bio}
                                 limit={147}
                                 linkclassName="load-more cursor-pointer text-white"
                               />
                             
                           }
                           {adminUserDetails.bio && adminUserDetails.bio.length <= 147 &&
                             
                               <> {adminUserDetails.bio}</>
                             
                           }
                           </p>
                           </div>
                        </div>
                        }
                    </div>
                    </div>
                  </div>
                </div>
               
                
              </div>
            </div>
            <div className="member-list group-details-tab">
              <nav className="nav nav-pills nav-fill">
                <a href="#" onClick={e => tabPannelClick('groups')} className={`nav-item nav-link ${tab === 'groups' ? 'active' : '' }`}>Groups</a>
                <a href="#" onClick={e => tabPannelClick('events')} className={`nav-item nav-link ${tab === 'events' ? 'active' : '' }`}>Events</a>
              </nav>
              <div className="tab-content align-items-start headers">
                <div className="card tab-pane active">
                  <div className="collapse show">
                    {tab === 'groups' && <GroupList />}
                    {tab === 'events' && <EventList />}
                  </div>
                </div>
              </div>
            </div>
          </div>
         }
      </Modal.Body>
    </Modal>
  )
}
UserDetailsModal.propTypes = {
  showModal: PropTypes.bool,
  hideDetailsModal: PropTypes.func,
};
UserDetailsModal.defaultProps = {
  showModal: false,
};
export default UserDetailsModal;
