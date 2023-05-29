import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {SearchIcon, PlusIcon} from './../../utils/Svg';
import {organizationListRequest} from './../../store/actions/group';

const ContentHeader = props => {

  const dispatch = useDispatch();
  const {orgList} = useSelector(({group}) => group);

  useEffect(() => {
    dispatch(organizationListRequest());
  }, []);


  return (

    <div className="content-title">
      <div className="d-flex">
        <h1>My Events</h1>
        <div className="search-box hide-mob">
          <input type="text" value={props.searchEvent} onChange={(e) => props.handleSearchEvent(e)} className="search" placeholder="Search..." />
          <a className="btn-search" style={{backgroundColor: '#191c20'}} href="#/">{SearchIcon}</a>
        </div>
      </div>
      {orgList && orgList.eventData && orgList && orgList.eventData.entries.length > 0 &&
        <div className="click-btn-div">
          <div className="add-data">
            <a
              href="#"
              className="btn btn-add btn-green btn-click"
              onClick={props.handleShowEventModal}
            >{PlusIcon}</a>
          </div>
        </div>
      }
    </div>

  );

}

ContentHeader.propTypes = {
  searchEvent: PropTypes.string,
  handleShowEventModal: PropTypes.func,
  handleSearchEvent: PropTypes.func,
};
ContentHeader.defaultProps = {
  searchEvent: '',
};

export default ContentHeader;
