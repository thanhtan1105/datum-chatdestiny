const TOKEN_STORAGE_KEY = 'oauth_tokens'
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'


export const storeTokens = (tokens, provider = 'google') => {
  try {
    const tokenData = {
      ...tokens,
      provider,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      stored_at: Date.now(),
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData))
    console.log(`${provider} tokens stored successfully`)
  } catch (error) {
    console.error('Error storing tokens:', error)
    throw error
  }
}

export const getStoredTokens = () => {
  try {
    const tokenData = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!tokenData) {
      return null
    }

    const tokens = JSON.parse(tokenData)

    // Check if tokens are expired
    if (tokens.expires_at && Date.now() >= tokens.expires_at) {
      return { ...tokens, expired: true }
    }

    return tokens
  } catch (error) {
    console.error('Error retrieving stored tokens:', error)
    return null
  }
}

export const refreshAccessToken = async (refreshToken, clientId, clientSecret) => {
  try {
    const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Token refresh failed: ${errorData.error_description || errorData.error}`)
    }

    const tokenData = await response.json()

    const existingTokens = getStoredTokens()
    const updatedTokens = {
      ...existingTokens,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      refresh_token: tokenData.refresh_token || existingTokens.refresh_token,
    }

    storeTokens(updatedTokens, existingTokens.provider || 'google')

    return updatedTokens
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}


export const getValidAccessToken = async () => {
  try {
    const tokens = getStoredTokens()

    if (!tokens) {
      console.log('No tokens found in storage')
      return null
    }

    if (!tokens.expired && tokens.access_token) {
      return tokens.access_token
    }

    if (tokens.refresh_token) {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET

      if (!clientId || !clientSecret) {
        console.warn('Missing Google OAuth credentials for token refresh')
        return null
      }

      console.log('Refreshing expired access token')
      const newTokens = await refreshAccessToken(
        tokens.refresh_token,
        clientId,
        clientSecret
      )
      return newTokens.access_token
    }

    console.log('No valid tokens available')
    return null
  } catch (error) {
    console.error('Error getting valid access token:', error)
    return null
  }
}

export const clearStoredTokens = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  console.log('Stored tokens cleared')
}

export const getTokenProvider = () => {
  try {
    const tokens = getStoredTokens()
    return tokens ? tokens.provider : null
  } catch (error) {
    console.error('Error getting token provider:', error)
    return null
  }
}

export const isTokenFromProvider = (provider) => {
  const currentProvider = getTokenProvider()
  return currentProvider === provider
}
