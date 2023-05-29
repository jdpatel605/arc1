import React, {useState, useEffect, useRef, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import SingleProfile from "../profile/SingleProfile";
import CallButton from './../common/CallButton';
import {peopleDiscoverRequest} from '../../store/actions';
import {LockIcon, ChevronRightIcon, PublicGroupIcon} from "../../utils/Svg";
import EmptyDiscover from './emptyDiscover';
import EmptyDefaultDiscover from './emptyDefaultDiscover';
import {Logger} from './../../utils/logger';
const fileLocation = "src\\components\\discover\\subContentPeople.jsx";

const pageParam = {
  page: 1,
  pageLimit: 25,
  totalPage: 1
}

const SubContentPeople = (props) => {

  const dispatch = useDispatch();
  const {peopleLoading, peopleList, peoplePageInfo} = useSelector(({discover}) => discover);
  const [componentLoad, setComponentLoad] = useState(false);
  const [peoplePageNumber, setPeoplePageNumber] = useState(1);

  useEffect(() => {
    if(props.search !== '') {
      setComponentLoad(false);
      setPeoplePageNumber(1);
      const data = {search: props.search, page: 1};
      dispatch(peopleDiscoverRequest(data));
    }
  }, [props.search])

  useEffect(() => {
    try {
      if(peopleList) {
        setComponentLoad(true);
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'useEffect:discoverPeopleList'})
    }
  }, [peopleList])

  const observer = useRef()
  const lastPeopleElementRef = useCallback(node => {
    try {
      if(peopleLoading) {
        return
      }
      if(observer.current) {
        observer.current.disconnect()
      }
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
          if(peoplePageNumber < peoplePageInfo.total_pages) {
            setPeoplePageNumber(peoplePageNumber + 1);
          }
        }
      })
      if(node) {
        observer.current.observe(node)
      }
    } catch({message}) {
      Logger.error({fileLocation, message, trace: 'discoverLastGrouplementRef'})
    }
  }, [peopleLoading])

  useEffect(() => {
    if(componentLoad) {
      const data = {search: props.search, page: peoplePageNumber}
      dispatch(peopleDiscoverRequest(data));
    }
  }, [peoplePageNumber]);

    const isLoggedInUser = (identifier) => {
        const currentIdentifier = localStorage.getItem("identifier");
        return currentIdentifier === identifier;
    }
  return (

    <div>
      {props.search !== '' && peopleList.length > 0 &&
        <div className="chat-person-list green-border col-lg-9 group-search">
          {peopleList.map((item, key) => {
            return (
              <div className="chat-person-data bg-gray" key={key} ref={lastPeopleElementRef}>
                <div className="person-data">
                  <SingleProfile name={item.title} avatarUrl={item.avatar_url} detail={item.detail} userId={item.identifier} from="discover" />
                  <div className="communication">
                    { !isLoggedInUser(item.identifier) &&
                        <CallButton callee_id={item.identifier} call_type="user" confirm={true} name={item.title}/>
                    }
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
                    {/*<a className="view-more-btn" href="#/">
                      {ChevronRightIcon}
                    </a>*/}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
      {!peopleLoading && props.search !== '' && peopleList.length === 0 &&
        <EmptyDiscover />
      }
      {props.search === '' &&
        <EmptyDefaultDiscover />
      }
    </div>
  )
}
SubContentPeople.propTypes = {
  search: PropTypes.string,
};
SubContentPeople.defaultProps = {
  search: '',
};
export default SubContentPeople;
