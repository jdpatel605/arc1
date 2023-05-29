import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {useAlert} from "react-alert";
import ContentHeader from './contentHeader';
import ContentMiddle from './contentMiddle';
import TabContent from './tabContent';
import {getOrganizationDetailRequest, resetAdminGroupState} from "../../../store/actions";

import {Logger} from '../../../utils/logger';
import Loader from '../../Loader';
import smoothscroll from 'smoothscroll-polyfill';
const fileLocation = "src\\components\\admin\\user\\index.jsx";

const Index = props => {
  smoothscroll.polyfill();
  const alert = useAlert();
  const dispatch = useDispatch();
  
  const {orgDetailLoading, orgDetailFlag, orgDetail, loadingDis} = useSelector(({user}) => user);
  const [mainClass, setMainClass] = useState('');
  const [panel, setPanel] = useState('all');
  
  const [totalSeat, setTotalSeat] = useState(0);
  const [occupiedSeat, setOccupiedSeat] = useState(0);
  
  useEffect(() => {
    dispatch(resetAdminGroupState())
    if(!orgDetail){
      dispatch(getOrganizationDetailRequest({}))
    }
  }, [])
  
  useEffect(() => {
        if(orgDetailFlag === 1){
//            console.log(orgDetail)
            setOccupiedSeat(orgDetail.seats_occupied)
            setTotalSeat(orgDetail.seats_purchased)
        }
  }, [orgDetail, orgDetail?.seats_occupied])
  
  const topPanelClick = (item) => {
    setPanel(item);
  }
  const [search, setSearch] = useState('');
  const searchArc = (item) => {
    setSearch(item);
  }
  

  return (
    <div className="content-sec">
      <div className="scroll" id="main-content" style={{'scrollBehavior': 'smooth'}}>
        <div className="container-fluid">
           <Loader visible={loadingDis} />
          <ContentHeader searchEvent={search} handleSearchEvent={searchArc} />
          <div className="pl-2">
            <p className="clr-white mb-0">{occupiedSeat}/{totalSeat} seats</p>
            {/*<div className="btn-box " >
                <span className="btn btn-round btn-green btn-click">
                  Upgrade
                </span>
            </div>  */}
          </div>
          
          <div className="page-contain">
            <div className={`tab-section ${mainClass}`}>
              {/*<ContentMiddle onClick={topPanelClick} searchText={search} />*/}
              <TabContent panel={panel} search={search} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
