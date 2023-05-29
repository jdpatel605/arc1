import React, {useEffect, useState} from "react";
import {NavLink} from 'react-router-dom';
import rightArrow from "../../assets/icons/SVG/chevron-right.svg"
import {useDispatch, useSelector} from "react-redux";
import {unreadNotifCountRequest} from '../../store/actions/notificationActions';

const Sidebar = () => {
    const [isExpand, setExpand] = useState(false);
    const dispatch = useDispatch();
    const flipMenu = () => {
        setExpand(!isExpand)
    }
    const {unreadCount} = useSelector(({notification}) => notification);
    useEffect(() => {
        dispatch(unreadNotifCountRequest());
    }, [dispatch]);
    return (
        <div className={isExpand ? 'left-sidebar fliph' : 'left-sidebar'}>
            <div className="sidebar">
                <ul className="list-group first-menu">
                    <li className="list-group-item">
                        <NavLink to="/events" title="My Events">
                            <i className="far fa-calendar"></i>
                            <span className="align-middle">My Events</span>
                        </NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to="/discover" title="Discover">
                            <i className="fas fa-search"></i>
                            <span className="align-middle">Discover</span>
                        </NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to="/notifications" className="new-notification" title="Notifications">
                            <i>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={25} viewBox="0 0 24 25">
                                    <path fill="#95A1AC" fillRule="evenodd" d="M12 21.967c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32v-.68c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-2.86.68-4.5 3.24-4.5 6.32v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                                </svg>
                                <label>{unreadCount}</label>
                            </i>
                            <span className="align-middle">Notifications</span>
                        </NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to="/group" title="Group">
                            <i className="fas fa-user-friends"></i>
                            <span className="align-middle">Groups</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="fliph-btn">
                <a href="#/" onClick={e => flipMenu()} className="fliph-btn-left">
                    <img src={rightArrow} height="24" width="24" alt="Navigation" />
                </a>
            </div>
        </div>
    );
}
export default Sidebar;
