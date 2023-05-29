import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';
import ContentHeader from "./contentHeader";
import ContentLeft from "./contentLeft";
import ContentRight from "./contentRight";
import {getProfileUsingHook} from '../../store/actions/user';
import {setUserOrgList} from "../../store/actions/actionCreators";
import Loader from '../Loader';

const Profile = (props) => {
    const dispatch = useDispatch()
    const {loader} = useSelector(({profile}) => profile);
    const org = useSelector(state => state.organizations);

    useEffect(() => {
        getProfileUsingHook(dispatch)
        dispatch(setUserOrgList({loading: false, data: {}, first: true}))
    }, [])

    const [panel, setPanel] = useState('ORG');

    const leftPanelClick = (item) => {
        if(item === 'ORG') {
            dispatch(setUserOrgList({loading: false, data: {}, first: true}))
        }
        setPanel(item);
    }

    return (
        <div className="content-sec">
            <div className="scroll">
                <div className="container-fluid">
                    <Loader visible={org.loading} visible={loader} />
                    <ContentHeader />
                    <div className="page-contain">
                        <div className="row bg-gray">
                            <div className="col-lg-4">
                                <ContentLeft onClick={leftPanelClick} history={props.history} />
                            </div>
                            <div className="col-lg-8 pl-0">
                                <ContentRight panel={panel} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile
