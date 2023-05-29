import React, {forwardRef} from "react";
import PropTypes from 'prop-types';

const ContentHeader = forwardRef((props, ref) => {
  const searchArc = (event) => {
    if(event.key !== ' ') {
      props.searchArc(event.target.value);
    }
  }

  return (
    <div className="content-title flex-wrap" ref={ref}>
      <div className="d-flex w-100">
        <h1>Discover</h1>
      </div>
      <div className="d-flex w-100">
        <div className={`col-lg-9 search-box-lg pl-0 ${props.mainClass}`}>
          <div className="search-box mw-100">
            <input type="text" id="txtsearch" className="search w-100" placeholder="Search ARC..." onKeyUp={e => searchArc(e)} />
            <a className="btn-search" href="#">
              <img src="images/search.png" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
})
ContentHeader.propTypes = {
  searchArc: PropTypes.func,
  loading: PropTypes.bool,
  mainClass: PropTypes.string,
};
ContentHeader.defaultProps = {
  loading: false,
  mainClass: '',
};
export default ContentHeader;
