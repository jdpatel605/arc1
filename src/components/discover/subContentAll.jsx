import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import Image from '../common/Image';
import useInfiniteScroll from "../common/useInfiniteScroll";
import TruncationText from "../common/TruncationText";
import {defaultDiscoverRequest, allDiscoverRequest} from '../../store/actions';
import {LockIcon, ChevronRightIcon, PublicGroupIcon} from "../../utils/Svg";
import SingleProfile from "../profile/SingleProfile";
import CallButton from './../common/CallButton';
import {Helper} from './../../utils/helper';
import EmptyDiscover from './emptyDiscover';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\discover\\subContentAll.jsx";

const SubContentAll = props => {
  const dispatch = useDispatch();
  const {listLoading, list, listPageInfo} = useSelector(({discover}) => discover);
  const [componentLoad, setComponentLoad] = useState(false);
  const [ListPageNumber, setListPageNumber] = useState(1);

  // Get serach reacord from ALL API
  useEffect(() => {
    if(props.search !== '') {
      setComponentLoad(false);
      setListPageNumber(1);
      const data = {search: props.search, page: 1}
      dispatch(allDiscoverRequest(data));
    }
    else {
      setComponentLoad(false);
      setListPageNumber(1);
      const data = {page: 1}
      dispatch(defaultDiscoverRequest(data));
    }
  }, [props.search])

  useEffect(() => {
    try {
      if(list) {
        setComponentLoad(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:discoverList'})
    }
  }, [list])

  const observer = useRef()
  const lastListElementRef = useCallback(node => {
    try {
      if(listLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(ListPageNumber < listPageInfo.total_pages) {
            setListPageNumber(ListPageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'discoverLastListElementRef'})
    }
  }, [listLoading])

  useEffect(() => {
    if(componentLoad) {
      if(props.search !== '') {
        const data = {search: props.search, page: ListPageNumber}
        dispatch(allDiscoverRequest(data));
      }
      else {
        const data = {page: ListPageNumber}
        dispatch(defaultDiscoverRequest(data));
      }
    }
  }, [ListPageNumber]);

  const goToSinglePage = (type, id) => {
    if(type === 'organization') {
      props.showOrg(id);
    } else if(type === 'event') {
      props.showEvent(id);
    } else if(type === 'group') {
      props.showGroup(id);
    } else if(type === 'user') {
      // code
    }
  }
    const isLoggedInUser = (identifier) => {
        const currentIdentifier = localStorage.getItem("identifier");
        return currentIdentifier === identifier;
    }
  return (

    <div>
      {props.search === '' && list.length > 0 &&
        <div className="chat-person-list green-border col-lg-9 group-search">
          {list.map((item, key) => {
            if(item.type === 'organization') {
              return (
                <div className="chat-person-data bg-gray" key={key} ref={lastListElementRef}>
                  <div className="person-data align-items-center" onClick={e => goToSinglePage(item.type, item.identifier)}>
                    <div className="person-info">
                      <div className="person-img">
                        <div className="img-round img-60">
                          <Image src={item.avatar_url} altText="Discover" />
                        </div>
                      </div>
                      <div className="person">
                        <h4>{item.title ? <TruncationText content={item.title} /> : '-'}</h4>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                    <div className="communication pt-0">
                      <a className="lock-btn" href="#">
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
                      <a className="view-more-btn" href="#">
                        {ChevronRightIcon}
                      </a>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      }
      {componentLoad && !listLoading && props.search === '' && list.length === 0 &&
        <EmptyDiscover />
      }
      {props.search !== '' && list.length > 0 &&
        <div className="chat-person-list green-border col-lg-9 group-search">
          {list.map((item, key) => {
            var typeHtml = '';
            if(item.type === 'event') {
              typeHtml = <div className="time-data">
                <label>{Helper.formatDateTz(item.begins_at, 'MMMM DD')}</label>
                <a className="btn btn-round btn-green bg-black-600" href="#">
                  {Helper.formatDateTz(item.begins_at, 'h:mma')}
                </a>
              </div>;
            }
            else {
              var visibilityIcon = '';
              if(item.visibility === 'public') {
                visibilityIcon = PublicGroupIcon;
              }
              else if(item.visibility === 'private') {
                visibilityIcon = LockIcon;
              }
              typeHtml = <a className="lock-btn" href="#">
                {visibilityIcon}
              </a>;
            }
            return (
              <div className="chat-person-data bg-gray" key={key} ref={lastListElementRef}>
                {item.type === 'user' &&
                  <div className="person-data align-items-center">
                    <SingleProfile name={item.title} avatarUrl={item.avatar_url} detail={item.detail} userId={item.identifier} from="discover" />
                    <div className="communication pt-0">
                      { !isLoggedInUser(item.identifier) &&
                        <CallButton callee_id={item.identifier} call_type="user" confirm={true} name={item.title}/>
                      }
                      <a className="lock-btn" href="#">
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
                      {/*<a className="view-more-btn" href="#">
                        {ChevronRightIcon}
                      </a>*/}
                    </div>
                  </div>
                }
                {(item.type === 'organization' || item.type === 'event' || item.type === 'group') &&
                  <div className="person-data" onClick={e => goToSinglePage(item.type, item.identifier)}>
                    <div className="person-info">
                      <div className="person-img">
                        <div className="img-round img-60">
                          <Image src={item.avatar_url} altText="Discover" />
                        </div>
                      </div>
                      <div className="person">
                        <h4>{item.title ? <TruncationText content={item.title} /> : '-'}</h4>
                        <p>{item.detail ? <TruncationText content={item.detail} /> : '-'}</p>
                      </div>
                    </div>
                    <div className="communication">
                      {typeHtml}
                      <a className="view-more-btn" href="#">
                        {ChevronRightIcon}
                      </a>
                    </div>
                  </div>
                }
              </div>
            );
          })}
        </div>
      }
      {componentLoad && !listLoading && props.search !== '' && list.length === 0 &&
        <EmptyDiscover />
      }
    </div>
  )
}
SubContentAll.propTypes = {
  search: PropTypes.string,
  showOrg: PropTypes.func,
  showEvent: PropTypes.func,
  showGroup: PropTypes.func
};
SubContentAll.defaultProps = {
  search: '',
};
export default SubContentAll;
