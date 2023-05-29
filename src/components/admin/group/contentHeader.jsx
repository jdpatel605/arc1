import React, {forwardRef} from "react";
import PropTypes from 'prop-types';
import {SearchIcon, PlusIcon} from "../../../utils/Svg";

const ContentHeader = forwardRef((props, ref) => {

  const searchArc = (event) => {
    if(event.key !== ' ') {
      props.searchArc(event.target.value);
    }
  }

  return (
    <div className="content-title flex-wrap mt-2" ref={ref}>
      <div className="d-flex w-100 justify-content-between">
          <h1>Group Management</h1>
          <div className="d-flex justify-content-between">
            <div className="search-box">
                <input type="text" id="txtsearch" className="search" placeholder="Search..." onKeyUp={e => searchArc(e)} />
                <a className="btn-search" href="#">
                    {SearchIcon}
                </a>
            </div>
            <button className="btn btn-submit btn-green ml-4" href="#" onClick={() => props.showCreateGroupBox(true)}>
              + Create Group
            </button>
            </div>
      </div>
    </div>
  )
})
ContentHeader.propTypes = {
  searchArc: PropTypes.func,
  showCreateGroupBox: PropTypes.func,
};
ContentHeader.defaultProps = {
  loading: false,
};
export default ContentHeader;
