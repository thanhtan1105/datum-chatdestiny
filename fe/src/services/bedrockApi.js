import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from "@aws-sdk/client-bedrock-agentcore"

// Configuration from environment variables (with VITE_ prefix for Vite)
const AGENT_RUNTIME_ARN = import.meta.env.VITE_AGENT_RUNTIME_ARN || 'arn:aws:bedrock-agentcore:us-east-1:161409283793:runtime/chatdestiny-CpdlPd2w1j'
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1'
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
const AWS_SESSION_TOKEN = import.meta.env.VITE_AWS_SESSION_TOKEN

// Build credentials provider function
const credentialsProvider = async () => {
  const accessKeyId = AWS_ACCESS_KEY_ID?.trim()
  const secretAccessKey = AWS_SECRET_ACCESS_KEY?.trim()
  const sessionToken = AWS_SESSION_TOKEN?.trim()

  const credentials = {
    accessKeyId,
    secretAccessKey
  }

  if (sessionToken) {
    credentials.sessionToken = sessionToken
  }

  return credentials
}

// Create Bedrock Agent Core client with credentials provider
const client = new BedrockAgentCoreClient({
  region: AWS_REGION,
  credentials: credentialsProvider
})
/**
 * Generate a runtime session ID (must be 33+ characters)
 */
const generateRuntimeSessionId = () => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2)
  return `session_${timestamp}_${random}_${Math.random().toString(36).substring(2)}`
}

/**
 * Send message to Bedrock Agent Runtime
 */
export const sendMessageToBedrock = async (prompt, actorId, sessionId) => {
  try {
    // Create the full JSON payload as a string (matching Python boto3 implementation)
    const payloadData = {
      prompt: prompt,
      actor_id: actorId,
      session_id: sessionId
    }

    const payloadString = JSON.stringify(payloadData)

    // Generate runtime session ID (33+ chars required)
    const runtimeSessionId = generateRuntimeSessionId()

    // Create command with qualifier - payload should be a string, not Uint8Array
    const command = new InvokeAgentRuntimeCommand({
      contentType: "application/json",
      accept: "application/json",
      agentRuntimeArn: AGENT_RUNTIME_ARN,
      runtimeSessionId: runtimeSessionId,
      qualifier: "DEFAULT",
      payload: payloadString
    })

    // Send command
    const response = await client.send(command)

    // Handle response based on the structure (matching Python's response['response'].read())
    let textResponse
    if (response.response) {
      // If response has a response property (stream or blob)
      if (typeof response.response.transformToString === 'function') {
        textResponse = await response.response.transformToString()
      } else if (response.response instanceof Uint8Array) {
        textResponse = new TextDecoder().decode(response.response)
      } else if (typeof response.response === 'string') {
        textResponse = response.response
      } else {
        textResponse = JSON.stringify(response.response)
      }
    } else {
      // Fallback to entire response
      textResponse = JSON.stringify(response)
    }

    // Try to parse as JSON, fallback to plain text
    let data
    try {
      data = JSON.parse(textResponse)
    } catch (e) {
      // If not JSON, treat as plain text response
      data = { response: textResponse }
    }

    return data

  } catch (error) {
    console.error('❌ Bedrock API Error:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      statusCode: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
      code: error.code,
      time: error.Time,
      fullError: JSON.stringify(error, null, 2)
    })

    // Check for signature errors
    if (error.name === 'AccessDeniedException' && error.message?.includes('signature')) {
      console.error('🔴 Signature Error - Possible causes:')
      console.error('  1. Credentials are expired (temporary credentials expire)')
      console.error('  2. Secret key has special characters that need encoding')
      console.error('  3. System clock is out of sync')
      console.error('  4. Wrong region or service endpoint')

      // Log current credentials being used (sanitized)
      const creds = await credentialsProvider()
      console.error('  Current credentials:')
      console.error('    AccessKeyId:', creds.accessKeyId?.substring(0, 10) + '...')
      console.error('    Has SessionToken:', !!creds.sessionToken)
      console.error('    Region:', AWS_REGION)
    }

    // Show user-friendly error
    if (error.$metadata?.httpStatusCode === 422) {
      throw new Error('Invalid request format. Please check CloudWatch logs for details. Error: ' + error.message)
    }

    throw error
  }
}

/**
 * Check if Bedrock credentials are configured
 */
export const isBedrockConfigured = () => {
  return !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AGENT_RUNTIME_ARN)
}

export default {
  sendMessageToBedrock,
  isBedrockConfigured
}
