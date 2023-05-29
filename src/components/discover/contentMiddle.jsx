import React, {useState} from "react";
import PropTypes from 'prop-types';

const ContentMiddle = (props) => {

  const activeClass = 'nav-link active';
  const [activeTab, setTab] = useState('all');

  const tabClick = (item) => {
    props.onClick(item);
    setTab(item);
  }

  return (
    <ul id="tabs" className="nav nav-tabs" role="tablist">
      <li className="nav-item">
        <a href="#" onClick={e => tabClick('all')} className={activeTab === 'all' ? activeClass : 'nav-link'} >All</a>
      </li>
      <li className="nav-item">
        <a href="#" onClick={e => tabClick('events')} className={activeTab === 'events' ? activeClass : 'nav-link'} >Events</a>
      </li>
      <li className="nav-item">
        <a href="#" onClick={e => tabClick('groups')} className={activeTab === 'groups' ? activeClass : 'nav-link'} >Groups</a>
      </li>
      <li className="nav-item">
        <a href="#" onClick={e => tabClick('people')} className={activeTab === 'people' ? activeClass : 'nav-link'} >People</a>
      </li>
    </ul>
  )
}
ContentMiddle.propTypes = {
  onClick: PropTypes.func
};
export default ContentMiddle;
