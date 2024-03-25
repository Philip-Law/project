import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react'
import '../style/Admin.css'

interface Props {
  message: string
  permissions: string[]
}

const AuthDenied: React.FC<Props> = ({ message, permissions }): React.ReactElement => {
  const { loginWithRedirect } = useAuth0()
  return (
    <div className='authorization-denied'>
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <h1>Authorization Denied</h1>
        <p>{message}</p>
        {
            permissions.includes('admin:manage') || permissions.length > 0
              ? <button
                onClick={(_) => {
                  loginWithRedirect({
                    authorizationParams: {
                      scope: 'openid profile email'
                    }
                  })
                    .then(r => { console.log(r) })
                    .catch(e => { console.log(e) })
                }}><span id='left-text'>Authorize</span> <FontAwesomeIcon className='button-arrow' icon={faCircleArrowRight}></FontAwesomeIcon></button>
              : null
        }
    </div>
  )
}

export default AuthDenied
