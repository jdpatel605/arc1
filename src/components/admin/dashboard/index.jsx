import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAlert} from "react-alert";
import ContentHeader from './contentHeader';
import Loader from '../../Loader';
import {resetSomeAdminGroupState} from '../../../store/actions';
import Dropdown from 'react-bootstrap/Dropdown'
import {KebabIcon, UserIcon, GroupsIcon, EventIcon} from "../../../utils/Svg";

const Index = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const {loadingAdmGrp} = useSelector(({adminGroup}) => adminGroup);
  const [componentLoad, setComponentLoad] = useState(false);
  const [search, setSearch] = useState('');

  const searchArc = (item) => {
    setSearch(item);
  }

  useEffect(() => {
    dispatch(resetSomeAdminGroupState());
  }, [])

  const clickHere = () => {

  }

  return (
    <div className="content-sec">
      <div className="scroll" id="main-content" style={{'scrollBehavior': 'smooth'}}>
        <div className="container-fluid">
          <Loader visible={loadingAdmGrp} />
          <ContentHeader searchArc={searchArc} />
          <div className="page-contain dashboard">
            {/* <h4 className="title">Overview</h4> */}
            <div className="row dashboard-row">
              <div className="col-md-4">
                <div className="dashboard-box">
                  <div className="box-header">
                    <h4>Members</h4>
                    <div className="communication">
                    </div>
                  </div>
                  <div className="box-content">
                    <div className="box-content-icon">
                      <a href="#" className="icon">{UserIcon}</a>
                    </div>
                    <div className="box-content-section">
                      <h3>132</h3>
                      <p>Total Members</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="dashboard-box">
                  <div className="box-header">
                    <h4>Groups</h4>
                    <div className="communication">
                    </div>
                  </div>
                  <div className="box-content">
                    <div className="box-content-icon">
                      <a href="#" className="icon">{GroupsIcon}</a>
                    </div>
                    <div className="box-content-section">
                      <h3>132</h3>
                      <p>Total Groups</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="dashboard-box">
                  <div className="box-header">
                    <h4>Events</h4>
                    <div className="communication">
                    </div>
                  </div>
                  <div className="box-content">
                    <div className="box-content-icon">
                      <a href="#" className="icon">{EventIcon}</a>
                    </div>
                    <div className="box-content-section">
                      <h3>132</h3>
                      <p>Scheduled Events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <h4 className="title mt-5">Insights</h4> */}
            <div className="row dashboard-row">
              <div className="col-md-4">
                <div className="dashboard-box">
                  <div className="box-header">
                    <h4>Total Event Time</h4>
                    <div className="communication">
                    </div>
                  </div>
                  <div className="box-content">
                    <div className="box-content-time">
                      <h3>132</h3>
                      <p>hrs</p>
                      <h3>18</h3>
                      <p>min</p>
                    </div>
                  </div>
                  <p className="ratio clr-green">+2.4%</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="dashboard-box">
                  <div className="box-header">
                    <h4>Avg Event Length</h4>
                    <div className="communication">
                    </div>
                  </div>
                  <div className="box-content">
                    <div className="box-content-time">
                      <h3>132</h3>
                      <p>hrs</p>
                      <h3>18</h3>
                      <p>min</p>
                    </div>
                  </div>
                  <p className="ratio clr-green">+2.4%</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="dashboard-box">
                  <div className="box-header">
                    <h4>Avg Event Participants</h4>
                    <div className="communication">
                    </div>
                  </div>
                  <div className="box-content">
                    <div className="box-content-time">
                      <h3>132</h3>
                      <p>hrs</p>
                      <h3>18</h3>
                      <p>min</p>
                    </div>
                  </div>
                  <p className="ratio clr-red">-2.4%</p>
                </div>
              </div>
            </div>
            {/* <h4 className="title mt-5">Scheduled</h4> */}
            <div className="row dashboard-row ml-0 mr-0">
              <div className="col-md-12 event-box mt-2">
                <div className="box-header">
                  <h4>Upcoming Meetings</h4>
                  <div className="communication">
                    <Dropdown>
                      <Dropdown.Toggle as="a" className={`btn more-btn btn-click`} >
                        {KebabIcon}
                      </Dropdown.Toggle>
                      <Dropdown.Menu alignRight="true" className="option-menu">
                        <Dropdown.Item onClick={() => clickHere()}
                          className="">Click Here</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="box-content">
                  <div className="chat-person-list green-border">
                    <div>
                      <div className="title"><label>Today</label></div>
                      <div className="chat-person-data bg-gray">
                        <div className="person-data">
                          <div className="person-info">
                            <div className="person-img">
                              <div className="img-round img-60">
                                <img id="" className="" src="https://s3.amazonaws.com/arcapp.us-sandbox/organizations/avatars/4763ffb2-a205-11ea-be6d-c48e8ff5e241/original.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIA4BAIK6FGIAJXXWHU%2F20201215%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20201215T100232Z&amp;X-Amz-Expires=300&amp;X-Amz-SignedHeaders=host&amp;X-Amz-Signature=9ac897d5703449b868f382dd452101a76b0d5715cc789f563b9b79b3520744bf" alt="Event" />
                              </div>
                            </div>
                            <div className="person">
                              <h4 title="custom recurring812">custom recurring812</h4>
                              <p title="3 Cirlce Chruch">3 Cirlce Chruch</p>
                            </div>
                          </div>
                          <div className="communication pt-2">
                            <div className="time-data"><label>Tuesday 15</label><a href="#/" role="button" className="btn btn-round btn-green bg-black-600">8:00am</a></div>
                            <div className="click-btn-div">
                              <div className="dropdown">
                                <a className="btn more-btn btn-click false dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="#95A1AC" fillRule="evenodd" d="M12 16c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"></path>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Index;
