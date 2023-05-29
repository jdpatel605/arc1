import React, {useState} from "react";
import {NavLink} from 'react-router-dom';
import rightArrow from "../../assets/icons/SVG/chevron-right.svg"
import {DashboardIcon, UserIcon, UserManagementIcon, GroupManagementIcon, EventManagementIcon, PaymentIcon} from "../../utils/Svg";
const AdminSidebar = () => {
    const [isExpand, setExpand] = useState(false);
    const flipMenu = () => {
        setExpand(!isExpand)
    }
    return (
        <div className={isExpand ? 'admin-menu left-sidebar fliph' : 'admin-menu left-sidebar'}>
            <div className="sidebar">
                <ul className="list-group first-menu">
                    {/* <li className="list-group-item">
                        <NavLink to="/admin/dashboard" title="Dashboard">
                            <i> {DashboardIcon} </i>
                            <span className="align-middle">Dashboard</span>
                        </NavLink>
                    </li> */}
                    <li className="list-group-item">
                        <NavLink to="/admin/profile" title="Admin Profile">
                            <i> {UserIcon} </i>
                            <span className="align-middle">Profile</span>
                        </NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to="/admin/users" title="User Management">
                            <i> {UserManagementIcon} </i>
                            <span className="align-middle">User Management</span>
                        </NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to="/admin/group" title="Group Management">
                            <i> {GroupManagementIcon} </i>
                            <span className="align-middle">Group Management</span>
                        </NavLink>
                    </li>
                    <li className="list-group-item">
                        <NavLink to="/admin/event" title="Event Management">
                            <i> {EventManagementIcon} </i>
                            <span className="align-middle">Event Management</span>
                        </NavLink>
                    </li>
                    {/* <li className="list-group-item">
                        <NavLink to="/admin/billing" title="Billing Information">
                            <i> {PaymentIcon} </i>
                            <span className="align-middle">Billing Information</span>
                        </NavLink>
                    </li> */}
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
export default AdminSidebar;
