import React, {useState} from "react";
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {logoutUser} from "../../store/actions/actionCreators";
import TruncationText from "../common/TruncationText";

import UserImage from '../common/UserImage';

import pencil from "../../assets/icons/SVG/pencil.svg"

const ContentLeft = ({onClick, history}) => {
    const [activeMenu, setMenu] = useState('ORG');
    const user = useSelector(state => state.user)
    const dispatch = useDispatch();
    const menuClick = (item) => {
        onClick(item);
        setMenu(item);
        if(item === 'LOGOUT') {
            logOut();
        }
    }
    const logOut = () => {
        dispatch(logoutUser());
        history.push('/login');
        // window.location.reload()
    }
    return (
        <div className="left-panal bg-black">
            <div className="person-data">
                <div className="person-info">
                    <div className="person-img">
                        {user.profile.name &&
                        <div className="img-round img-100">
                            <UserImage src={user.profile.avatar_url} name={user.profile.name} className="extra-large" altText="User" />
                        </div>
                        }
                    </div>
                    <div className="person">
                        <a className="edit-icon" href="#" onClick={e => menuClick('PROFILE')}>
                            <img src={pencil} />
                        </a>
                        <div className="pt-2">
                            <h4 className="clr-gray">{user.profile.name ? <TruncationText content={user.profile.name} limit={20}/> : ''}</h4>
                            <a className="btn-link" href="#"> {user.profile.email ? user.profile.email : ''} </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="left-menulink">
                <ul className="arrow-right">
                    <li onClick={e => menuClick('ORG')} className={activeMenu === 'ORG' ? 'active' : ''}><a href="#">My Organizations</a></li>
                    <li onClick={e => menuClick('SETTING')} className={activeMenu === 'SETTING' ? 'active' : ''}><a href="#">My Settings</a></li>
                    <li onClick={e => menuClick('HELP')} className={activeMenu === 'HELP' ? 'active' : ''}><a href="#">Get Help</a></li>
                    <li onClick={e => menuClick('TERMS')} className={activeMenu === 'TERMS' ? 'active' : ''}><a href="#">Terms of Service</a></li>
                    <li onClick={e => menuClick('LOGOUT')} className={activeMenu === 'LOGOUT' ? 'active' : ''}><a className="clr-green btn-exit" href="#">Log Out</a></li>
                </ul>
            </div>
        </div>
    );
}
ContentLeft.propTypes = {
    onClick: PropTypes.func,
    history: PropTypes.object,
};
ContentLeft.defaultProps = {
    history: {},
};
export default ContentLeft
