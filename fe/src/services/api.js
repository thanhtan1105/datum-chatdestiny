import axios from 'axios'
import { sendMessageToBedrock, isBedrockConfigured } from './bedrockApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const USE_BEDROCK = import.meta.env.VITE_USE_BEDROCK === 'true'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const sendMessage = async (prompt, actorId, sessionId) => {
  // Use Bedrock if configured and enabled
  if (USE_BEDROCK && isBedrockConfigured()) {
    return await sendMessageToBedrock(prompt, actorId, sessionId)
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
