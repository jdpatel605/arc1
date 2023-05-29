import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import SubContentAll from './subContentAll';
import SubContentGroup from './subContentGroup';
import SubContentEvent from './subContentEvent';
import SubContentPeople from './subContentPeople';

const TabContent = (props) => {

  const [tab, setTab] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTab(props.panel)
  }, [props.panel]);

  useEffect(() => {
    setSearch(props.search)
  }, [props.search]);

  const showOrg = (item) => {
    props.showOrg(item);
  }

  const showEvent = (item) => {
    props.showEvent(item);
  }

  const showGroup = (item) => {
    props.showGroup(item);
  }

  return (
    <div className="tab-content align-items-start">
      <div className="card tab-pane active">
        <div className="collapse show">
          {tab === 'all' && <SubContentAll search={search} showOrg={showOrg} showEvent={showEvent} showGroup={showGroup} />}
          {tab === 'events' && <SubContentEvent search={search} showEvent={showEvent} />}
          {tab === 'groups' && <SubContentGroup search={search} showGroup={showGroup} />}
          {tab === 'people' && <SubContentPeople search={search} />}
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
