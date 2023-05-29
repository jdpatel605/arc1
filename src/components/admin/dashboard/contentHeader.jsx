import React, {forwardRef, useState} from "react";
import PropTypes from 'prop-types';
import {SearchIcon, CalanderIcon, ChevronDownIcon} from "../../../utils/Svg";
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';


const ContentHeader = forwardRef((props, ref) => {

  const [state, setState] = useState({ start: moment().startOf('month'), end: moment().endOf('month') });
  const { start, end } = state;
  const label = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
  
  const handleCallback = (start, end) => {
    setState({ start, end });
  };

  const searchArc = (event) => {
    if(event.key !== ' ') {
      props.searchArc(event.target.value);
    }
  }

  return (
    <div className="content-title flex-wrap" ref={ref}>
      <div className="d-flex w-100 justify-content-between mb-2">
        <h1>Organization Dashboard</h1>
        <div className="date-box">
          <DateRangePicker
            maxDate={moment()}
            initialSettings={{
              opens: 'left',
              startDate: start.toDate(),
              endDate: end.toDate(),
              ranges: {
                Today: [moment().toDate(), moment().toDate()],
                Yesterday: [
                  moment().subtract(1, 'days').toDate(),
                  moment().subtract(1, 'days').toDate(),
                ],
                'This Week': [
                  moment().startOf('week').toDate(),
                  moment().endOf('week').toDate(),
                ],
                'This Month': [
                  moment().startOf('month').toDate(),
                  moment().endOf('month').toDate(),
                ],
                'This Year': [
                  moment().startOf('year').toDate(),
                  moment().endOf('year').toDate(),
                ],
              },
            }}
            onCallback={handleCallback}
          >
            <div
              id="reportrange"
              className="date-range-box"
            >
              <div className="calandericon"> {CalanderIcon} </div> 
              <span>{label}</span> 
              <div className="downarrow"> {ChevronDownIcon} </div>
            </div>
          </DateRangePicker>
        </div>
        {/* <div className="search-box">
          <input type="text" id="txtsearch" className="search" placeholder="Search..." onKeyUp={e => searchArc(e)} />
          <a className="btn-search" href="#">
            {SearchIcon}
          </a>
        </div> */}
      </div>
    </div>
  )
})
ContentHeader.propTypes = {
  searchArc: PropTypes.func,
};
ContentHeader.defaultProps = {
};
export default ContentHeader;
