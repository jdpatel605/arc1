import React from 'react'
import NotificationIcon from '../../assets/icons/images/notification-outline@3x.png'
const NotificationEmpty = () => {
  return (
    <div className="chat-box">
      <div className="black-box text-center mt-5 notification-box" style={{'minHeight': 'auto'}}>
        <div className="w-100">
          <img className="box-icon" src={NotificationIcon} style={{width: '108px', height: 'auto'}} alt="Notifications" />
          <h4>All Done!</h4>
          <p style={{'maxWidth': '70%', margin: 'auto'}}>You don't have any new notification.</p>
        </div>
      </div>
    </div>
  )
}
export default NotificationEmpty;