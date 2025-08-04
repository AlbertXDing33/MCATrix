import {useAuth} from "@clerk/clerk-react"

//hook that retrieves authentication token from Clerk, builds an API request with it, sends a request to backend, returns the parsed JSON response.
export const useApi = () => {
    //Calls useAuth(), a function that retrieves the user's current auth token from Clerk.
    const {getToken} = useAuth()

    const makeRequest = async (endpoint, options = {}) => {
        //Retrieves the user's Clerk-issued token
        const token = await getToken()
        //Default Header: request body is JSON, token with the request
        const defaultOptions = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        }
        
        //Makes API request with the merged default header and custom options
        const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
            ...defaultOptions,
            ...options
        })

        return response.json()
    }

    return {makeRequest}
}