import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import SubContentAll from './subContentAll';


const TabContent = (props) => {

  const [tab, setTab] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTab(props.panel)
  }, [props.panel]);

  useEffect(() => {
    setSearch(props.search)
  }, [props.search]);

  
  return (
    <div className="tab-content align-items-start headers">
      <div className="card tab-pane active">
        <div className="collapse show">
          {tab === 'all' && <SubContentAll search={search} />}
        </div>
      </div>
    </div>
  )
}
TabContent.propTypes = {
  panel: PropTypes.string,
  search: PropTypes.string,
  showOrg: PropTypes.func,
  showEvent: PropTypes.func,
  showGroup: PropTypes.func
};
TabContent.defaultProps = {
  panel: '',
  search: '',
};
export default TabContent;
