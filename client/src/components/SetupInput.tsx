import React, { useState, useEffect } from 'react'
import '../style/Home.css'
import { useAuth0 } from '@auth0/auth0-react'

const SetupInput = (): React.ReactElement => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0()
  const [hasSetup, setHasSetup] = useState<boolean>(false)
  const [hasLoaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const getToken = async (): Promise<string> => {
      let token: string | undefined
      try {
        token = await getAccessTokenSilently()
        return token
      } catch (e) {
        console.log(e)
      }
      return ''
    }

    const checkSetup = async (token: string | undefined): Promise<void> => {
      try {
        void fetch(`http://localhost:8080/user/${user?.sub}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((response) => {
            setLoaded(true)
            if (response.status === 200) {
              setHasSetup(true)
            } else {
              setHasSetup(false)
            }
          })
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (!isLoading) {
      void getToken().then(async token => { await checkSetup(token) })
    }
  }, [isLoading])

  const handleSetupUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement

    const formData = {
      phoneNumber: form.phone.value.toString(),
      major: form.major.value,
      year: parseInt(form.year.value as string)
    }

    let token: string
    try {
      token = await getAccessTokenSilently()
    } catch (e) {
      console.log(e)
      return
    }

    fetch('http://localhost:8080/user/setup/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(async (response) => {
        if (!response.ok) {
          console.error('User could not be created')
        }
        return await response.json()
      })
      .catch((error) => {
        console.error('Error occurred during setup:', error)
      })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
        <div>
            {hasLoaded
              ? (
                  hasSetup
                    ? (
                    <h2>You have already set up your account!</h2>
                      )
                    : (
                    <div className='setup-user'>
                        <h2>Complete Your User Setup</h2>
                        <form id="adForm" onSubmit={(event) => { void handleSetupUser(event) }}>
                            <label htmlFor="phone">Phone Number:</label>
                            <input type="text" id="phone" name="phone" required onKeyDown={handleKeyDown}/>
                            <br/>

                            <label htmlFor="major">Major:</label>
                            <input type="text" id="major" name="major" required onKeyDown={handleKeyDown}/>
                            <br/>

                            <label htmlFor="year">Year:</label>
                            <input type="number" id="year" name="year" required maxLength={1} onKeyDown={handleKeyDown}/>
                            <br/>

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                      )
                )
              : (
                <></>
                )}
        </div>
  )
}

export default SetupInput
