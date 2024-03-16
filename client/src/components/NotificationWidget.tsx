import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import '../style/Nav.css'

export interface Notification {
  type: string
  message: string
  date: string
  link: string
}

interface NotificationWidgetProps {
  notifications: Notification[]
}

const NotificationWidget: React.FC<NotificationWidgetProps> = ({ notifications }) => {
  const [isOpen, setOpen] = useState(false)
  const handleNavToggle = (): void => {
    setOpen(!isOpen)
  }
  return (
        <div className='notifications'>
            <FontAwesomeIcon icon={faBell} className='nav-icon' onClick={handleNavToggle} />
            <div id={`${isOpen ? 'show' : 'hidden'}`} className='notification-dropdown'>
                <h3>Notifications</h3>
                <p className='notif-subtitle'>View all your notifications here.</p>
                <div className='notification-list'>
                    <div className='notification'>
                        {
                            notifications.map((notification, index) => (
                                <div key={index} className='notification-item'>
                                    <p>{notification.message}</p>
                                    <p>{notification.date}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
        </div>
    </div>
  )
}

export default NotificationWidget
