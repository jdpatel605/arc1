import React, {forwardRef} from "react";
import {SearchIcon} from './../../../utils/Svg';

const ContentHeader = forwardRef((props, ref) => {
  
  return (
    <div className="content-title flex-wrap mt-2" ref={ref}>
      <div className="d-flex">
        <h1>User Management</h1>
      </div>
        <div className="click-btn-div">
            <div className="search-box hide-mob">
            <input type="text" value={props.searchEvent} onChange={(e) => props.handleSearchEvent(e.target.value)} className="search" placeholder="Search..." />
            <a className="btn-search" style={{backgroundColor: '#191c20'}} href="#/">{SearchIcon}</a>
          </div>
        </div>
    </div>
  )
})
export default ContentHeader;
