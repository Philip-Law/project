import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faList, faCog, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'
import './style/Dashboard.css'

interface Props {
  name: string
  desiredView: string
  setDesiredView: React.Dispatch<React.SetStateAction<string>>
}

const Dashboard: React.FC<Props> = ({ name, desiredView, setDesiredView }): React.ReactElement => {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date()
      const hours = (now.getHours() % 12 === 0) ? 12 : now.getHours() % 12
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM'
      setCurrentTime(`${hours}:${minutes} ${ampm}`)
    }

    updateTime() // Initial update when component mounts

    // Set up interval to check for minute changes every second
    const intervalId = setInterval(() => {
      const now = new Date()
      const currentMinutes = now.getMinutes()
      if (currentMinutes !== parseInt(currentTime.split(':')[1], 10)) {
        // Update the time only if the minutes have changed
        updateTime()
      }
    }, 1000)

    // Clear interval on component unmount
    return () => { clearInterval(intervalId) }
  }, [currentTime]) // Re-run effect when currentTime changes

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h1>Hey {name.split(' ')[0]}!</h1>
        <h3>{currentTime} Local Time</h3>
      </div>
      <div className='card-row'>
        <div className='card' onClick={() => { setDesiredView('users') }}>
          <div className='card-header'>
            <h2>Manage Users</h2>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className='card-content'>
            <p>View and manage user accounts on the platform. This module contains sensitive information.</p>
          </div>
          <div className='card-footer'>
            <FontAwesomeIcon className='select-icon' icon={faCircleArrowRight} />
          </div>
        </div>
        <div className='card' onClick={() => { setDesiredView('listings') }}>
          <div className='card-header'>
            <h2>Manage Listings</h2>
            <FontAwesomeIcon icon={faList} />
          </div>
          <div className='card-content'>
            <p>View and manage listings currently posted to TMU Connect. Contains moderation tools to ensure compliance with guidelines.</p>
          </div>
          <div className='card-footer'>
            <FontAwesomeIcon className='select-icon' onClick={() => { setDesiredView('listings') }} icon={faCircleArrowRight} />
          </div>
        </div>
        <div className='card' onClick={() => { setDesiredView('settings') }}>
          <div className='card-header'>
            <h2>Manage Settings</h2>
            <FontAwesomeIcon icon={faCog} />
          </div>
          <div className='card-content'>
            <p>Make system adjustments here. Provides a visual interface for admins to configure TMU Connect.</p>
          </div>
          <div className='card-footer'>
            <FontAwesomeIcon className='select-icon' onClick={() => { setDesiredView('settings') }} icon={faCircleArrowRight} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
