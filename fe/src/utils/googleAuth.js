// Google OAuth utility functions
import { storeTokens } from '../services/tokenService'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Initialize Google OAuth
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Auth can only be initialized in browser'))
      return
    }

    // Check if Google Identity Services is loaded
    if (!window.google) {
      reject(new Error('Google Identity Services not loaded'))
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: () => {}, // We'll handle this in the component
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// Get user information from Google API
const getUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user info')
    }

    const userInfo = await response.json()
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      avatar: userInfo.picture,
      provider: 'google'
    }
  } catch (error) {
    throw new Error('Failed to get user information: ' + error.message)
  }
}

// Handle credential response (for ID token flow)
export const handleCredentialResponse = (response) => {
  return new Promise((resolve, reject) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]))

      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        provider: 'google'
      }

      resolve(userData)
    } catch (error) {
      reject(new Error('Failed to decode Google credential: ' + error.message))
    }
  })
}

// Alternative method using popup
export const signInWithGooglePopup = () => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services not loaded'))
      return
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile https://www.googleapis.com/auth/user.birthday.read',
      callback: async (response) => {
        if (response.error) {
          reject(new Error(response.error))
          return
        }

        try {
          const res = await fetch("https://people.googleapis.com/v1/people/me?personFields=birthdays", {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          });
          const data = await res.json();
          console.log("User info:", data);

          // Store the tokens
          storeTokens({
            access_token: response.access_token,
            expires_in: response.expires_in || 3600,
            token_type: 'Bearer',
            scope: response.scope
          }, 'google')

          const userInfo = await getUserInfo(response.access_token)
          userInfo["birthday"] = data.birthdays?.[0]?.date || null
          resolve(userInfo)
        } catch (error) {
          reject(error)
        }
      }
    })

    client.requestAccessToken()
  })
}
