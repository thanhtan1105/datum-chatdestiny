import axios from 'axios'
import { isBedrockConfigured } from './bedrockApi'
import { getValidAccessToken } from './tokenService'
import { signRequest } from '../utils/awsSignature'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const USE_BEDROCK = import.meta.env.VITE_USE_BEDROCK === 'true'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await getValidAccessToken()
      if (accessToken) {
        config.headers['X-Amzn-Bedrock-AgentCore-Runtime-Custom-App-Auth'] = `Bearer ${accessToken}`
      }
    } catch (error) {
      console.error('Error adding access token to request:', error)
      // Continue with request even if token fails
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const sendMessage = async (prompt, actorId, sessionId) => {
  // Use Bedrock if configured and enabled
  if (USE_BEDROCK && isBedrockConfigured()) {
    const url = import.meta.env.VITE_AGENT_RUNTIME_URL

    const credentials = {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
    }

    const requestBody = JSON.stringify({
      prompt,
      actor_id: actorId,
      session_id: sessionId,
    })

    const signedHeaders = signRequest('POST', url, {}, requestBody, credentials)

    const response = await api.post(url, requestBody, {
      headers: signedHeaders
    })

    console.log("Response: ", response)
    return response.data
  }

  // Otherwise use local backend
  try {
    const response = await api.post('/invocations', {
      prompt,
      actor_id: actorId,
      session_id: sessionId,
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getConversationHistory = async (actorId, sessionId, maxResults = 10) => {
  try {
    const response = await api.get(`/events/${actorId}/${sessionId}`, {
      params: { max_results: maxResults }
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getSessionMessages = async (actorId, sessionId, maxResults = 50) => {
  try {
    const response = await api.get(`/messages/${actorId}/${sessionId}`, {
      params: { max_results: maxResults }
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const checkHealth = async () => {
  try {
    const response = await api.get('/ping')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default api
