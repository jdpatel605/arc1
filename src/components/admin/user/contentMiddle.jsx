import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';

const ContentMiddle = (props) => {

  const activeClass = 'nav-link active';
  const [activeTab, setTab] = useState('all');
  const [panelTitle, setPanelTitle] = useState('All Members');

  const tabClick = (item) => {
    props.onClick(item);
    setTab(item);
  }
  useEffect(() => {
    if(props.searchText !== ''){
//        setPanelTitle('Filtered Members')
        setPanelTitle('All Members')
    }else{
        setPanelTitle('All Members')
    }
  }, [props.searchText])
  return (
    <ul id="tabs" className="nav nav-tabs" role="tablist">
      <li className="nav-item">
        <a href="#" onClick={e => tabClick('all')} className={activeTab === 'all' ? activeClass : 'nav-link'} >{ panelTitle }</a>
      </li>
    </ul>
  )
}
ContentMiddle.propTypes = {
  onClick: PropTypes.func,
  searchText: PropTypes.string
};
export default ContentMiddle;
