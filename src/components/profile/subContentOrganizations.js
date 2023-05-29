import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getMyOrgs } from '../../store/actions/user';
import history from '../../history/history';
import useInfiniteScroll from "../common/useInfiniteScroll";
import Image from '../common/Image';
import TruncationText from "../common/TruncationText";
import imgRight from "../../assets/icons/SVG/chevron-right.svg"
import { NoGroupIcon } from "../../utils/Svg";

const pageParam = {
    page: 1,
    pageLimit: 25,
    totalPage: 1
}

const SubContentOrganizations = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        pageParam.page = 1
        pageParam.totalPage = 1
        getMyOrgs(dispatch, pageParam)
    }, [])

    const { loading, org, first } = useSelector(state => state.organizations)
    const [orgList, setOrgList] = useState([])

    useEffect(() => {
        setOrgList([])
    }, [])

    useEffect(() => {
        if(org && org.entries) {
            if(first) {
                setOrgList((org.entries))
            } else {
                setOrgList(prevState => ([...prevState, ...org.entries]))
            }
            setIsFetching(false);
            pageParam.totalPage = org.total_pages
            pageParam.page = org.page_number + 1;
        }
    }, [org])

    const fetchMoreListItems = () => {
        if(pageParam.page <= pageParam.totalPage) {
            getMyOrgs(dispatch, pageParam)
        }
    }
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

    const goToDetail = (orgId) => {
        history.push(`/organization/${orgId}/details`)
    }

    return (
        <div className="chat-person-list mob-space" id="orgList">
            {orgList.length > 0 && orgList.map((v, key) => {
                return (
                    <div className="chat-person-data" onClick={ e => goToDetail(v.identifier) } key={ key }>
                        <div className="person-data align-items-center">
                            <div className="person-info no-wrap">
                                <div className="person-img">
                                    <div className="img-round img-60">
                                        <Image src={ v.avatar_url } altText="Organization" />
                                    </div>
                                </div>
                                <div className="person">
                                    <div>
                                        <h4>{ v.name ? <TruncationText content={ v.name } /> : '-' }</h4>
                                        <p>{ v.subname }</p>
                                    </div>
                                </div>
                            </div>
                            <div className="communication pt-0">
                                <a className="view-more-btn" href="#">
                                    <img src={ imgRight } />
                                </a>
                            </div>
                        </div>
                    </div>
                )
            })
            }
            {!loading && orgList.length === 0 && (
                <div className="p-2">
                    <div className="black-box d-flex mt-5">
                        <div style={ { 'margin': 'auto' } }>
                            { NoGroupIcon }
                            <h4>No Organizations</h4>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
}
export default SubContentOrganizations
