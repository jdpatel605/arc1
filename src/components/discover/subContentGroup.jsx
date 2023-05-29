import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import Image from '../common/Image';
import TruncationText from "../common/TruncationText";
import {groupDiscoverRequest} from '../../store/actions';
import {LockIcon, ChevronRightIcon, PublicGroupIcon} from "../../utils/Svg";
import EmptyDiscover from './emptyDiscover';
import EmptyDefaultDiscover from './emptyDefaultDiscover';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\discover\\subContentGroup.jsx";

const SubContentGroup = (props) => {

  const dispatch = useDispatch();
  const {grpLoading, groupList, groupPageInfo} = useSelector(({discover}) => discover);
  const [componentLoad, setComponentLoad] = useState(false);
  const [grpPageNumber, setGrpPageNumber] = useState(1);

  useEffect(() => {
    if(props.search !== '') {
      setComponentLoad(false);
      setGrpPageNumber(1);
      const data = {search: props.search, page: 1}
      dispatch(groupDiscoverRequest(data));
    }
  }, [props.search])

  useEffect(() => {
    try {
      if(groupList) {
        setComponentLoad(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:discoverGroupList'})
    }
  }, [groupList])

  const observer = useRef()
  const lastGroupElementRef = useCallback(node => {
    try {
      if(grpLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(grpPageNumber < groupPageInfo.total_pages) {
            setGrpPageNumber(grpPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'discoverLastGrouplementRef'})
    }
  }, [grpLoading])

  useEffect(() => {
    if(componentLoad) {
      const data = {search: props.search, page: grpPageNumber}
      dispatch(groupDiscoverRequest(data));
    }
  }, [grpPageNumber]);

  const goToGroup = (grpId) => {
    props.showGroup(grpId);
  }

  return (

    <div>
      {props.search !== '' && groupList.length > 0 &&
        <div className="chat-person-list green-border col-lg-9 group-search">
          {groupList.map((item, key) => {
            return (
              <div className="chat-person-data bg-gray" key={key} ref={lastGroupElementRef}>
                <div className="person-data" onClick={e => goToGroup(item.identifier)}>
                  <div className="person-info">
                    <div className="person-img">
                      <div className="img-round img-60">
                        <Image src={item.avatar_url} altText="Discover" />
                      </div>
                    </div>
                    <div className="person" >
                      <h4>{item.title ? <TruncationText content={item.title} /> : '-'}</h4>
                      <p>{item.detail ? <TruncationText content={item.detail} /> : '-'}</p>
                    </div>
                  </div>
                  <div className="communication">
                    <a className="lock-btn" href="#/">
                      {item.visibility === 'public' &&
                      <>
                        {PublicGroupIcon}
                      </>
                      }
                      {item.visibility === 'private' &&
                      <>
                        {LockIcon}
                      </>
                      }
                    </a>
                    <a className="view-more-btn" href="#/">
                      {ChevronRightIcon}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
      {!grpLoading && props.search !== '' && groupList.length === 0 &&
        <EmptyDiscover />
      }
      {props.search === '' &&
        <EmptyDefaultDiscover />
      }
    </div>
  )
}
SubContentGroup.propTypes = {
  search: PropTypes.string,
  showGroup: PropTypes.func,
};
SubContentGroup.defaultProps = {
  search: '',
};
export default SubContentGroup;
