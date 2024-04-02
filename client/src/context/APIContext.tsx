import React, { createContext, useCallback, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export interface ApiContextInterface {
  sendRequest: <T> (options: RequestBody) => Promise<RequestResponse<T>>
}

export interface RequestBody {
  method: Methods
  endpoint: string
  body?: any
}

export interface RequestResponse<T> {
  status: number
  response: T
  error?: string
}

const ApiContext = createContext<ApiContextInterface>({
  sendRequest: async <T,>(_: RequestBody): Promise<RequestResponse<T>> => {
    return {
      status: 0,
      response: 'This is a Stubbed Response' as T
    }
  }
})

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'

export const ApiProvider = (opts: { children: React.ReactNode }): React.ReactElement => {
  const { user, getAccessTokenSilently } = useAuth0()

  const sendRequest = useCallback(
    async <T,>(options: RequestBody): Promise<RequestResponse<T>> => {
      const init: RequestInit = {
        method: options.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: (options.body !== undefined) ? JSON.stringify(options?.body) : null
      }

      if (user !== undefined) {
        const accessToken = await getAccessTokenSilently()
        init.headers = {
          ...init.headers,
          Authorization: `Bearer ${accessToken}`
        }
      }

      return await fetch(`http://localhost:8080/${options?.endpoint}`, init)
        .then(async resp => {
          return {
            status: resp.status,
            response: await resp.json() as T
          }
        }).catch((err) => {
          console.log(err)
          return {
            status: err.code,
            response: '' as T,
            error: err.message
          }
        })
    }, [user]
  )

  return <ApiContext.Provider value={{ sendRequest }}>{opts.children}</ApiContext.Provider>
}

export const useApi = (): ApiContextInterface => useContext(ApiContext)
