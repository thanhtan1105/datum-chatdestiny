# Using Bedrock Agent Runtime with Frontend

This guide shows how to configure the frontend to call AWS Bedrock Agent Runtime directly.

## Overview

The frontend can connect to:
1. **Local Backend** (default) - FastAPI server on localhost:8000
2. **Bedrock Agent Runtime** (direct) - AWS Bedrock service via AWS SDK

## Setup for Bedrock

### 1. Deploy Your Agent to Bedrock

First, deploy your agent to Bedrock Agent Runtime:

```bash
cd be
python app/scripts/deploy_agent.py
```

This will output your Agent Runtime ARN:
```
arn:aws:bedrock-agentcore:us-east-1:859552982781:runtime/hosted_agent_xxx
```

### 2. Configure Frontend Environment

Create or update `fe/.env`:

**For Permanent Credentials (IAM User):**
```env
# Enable Bedrock mode
VITE_USE_BEDROCK=true

# AWS Credentials
VITE_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
VITE_AWS_REGION=us-east-1

# Your Agent Runtime ARN
VITE_AGENT_RUNTIME_ARN=arn:aws:bedrock-agentcore:us-east-1:859552982781:runtime/hosted_agent_xxx
```

**For Temporary Credentials (STS/Cognito):**
```env
# Enable Bedrock mode
VITE_USE_BEDROCK=true

# AWS Temporary Credentials
VITE_AWS_ACCESS_KEY_ID=ASIAIOSFODNN7EXAMPLE
VITE_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
VITE_AWS_SESSION_TOKEN=IQoJb3JpZ2luX2VjEEsaCXVzLWVhc3QtMSJIMEYCIQDS...
VITE_AWS_REGION=us-east-1

# Your Agent Runtime ARN
VITE_AGENT_RUNTIME_ARN=arn:aws:bedrock-agentcore:us-east-1:859552982781:runtime/hosted_agent_xxx
```

### 3. Run Frontend

```bash
npm run dev
```

The frontend will now call Bedrock directly!

## How It Works

### API Service (`fe/src/services/api.js`)

The `sendMessage` function checks if Bedrock is enabled:

```javascript
export const sendMessage = async (prompt, actorId, sessionId) => {
  if (USE_BEDROCK && isBedrockConfigured()) {
    return await sendMessageToBedrock(prompt, actorId, sessionId)
  }
  
  // Otherwise use local backend
  return await api.post('/invocations', { ... })
}
```

### Bedrock API (`fe/src/services/bedrockApi.js`)

Calls Bedrock Agent Runtime using AWS SDK:

```javascript
const command = new InvokeAgentRuntimeCommand({
  agentRuntimeArn: AGENT_RUNTIME_ARN,
  runtimeSessionId: generateRuntimeSessionId(),
  qualifier: "DEFAULT",
  payload: new TextEncoder().encode(JSON.stringify({
    prompt,
    actor_id: actorId,
    session_id: sessionId
  }))
})

const response = await client.send(command)
const textResponse = await response.response.transformToString()
```

## Security Considerations

### ⚠️ WARNING: Don't Hardcode Credentials in Production!

The current setup is for **development only**. For production:

### Option 1: AWS Cognito (Recommended)

Use AWS Cognito for user authentication and temporary credentials:

```javascript
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"

const client = new BedrockAgentCoreClient({
  region: AWS_REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: AWS_REGION }),
    identityPoolId: "us-east-1:xxx-xxx-xxx"
  })
})
```

### Option 2: Backend Proxy (Recommended)

Keep credentials on the backend and proxy requests:

```env
VITE_USE_BEDROCK=false
VITE_API_URL=https://your-backend.com
```

Backend handles Bedrock calls with secure credentials.

### Option 3: AWS STS Temporary Credentials

Use AWS STS to get temporary credentials:

```javascript
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts"
```

## Testing

### Test Bedrock Connection

```bash
# In browser console
console.log('Bedrock configured:', isBedrockConfigured())
```

### Test Message

Send a test message through the UI and check:
- Browser Network tab for AWS API calls
- CloudWatch Logs for agent execution
- Response in chat interface

## Troubleshooting

### Error: "Missing credentials"

**Solution:** Check that all AWS environment variables are set:
```bash
echo $VITE_AWS_ACCESS_KEY_ID
echo $VITE_AWS_SECRET_ACCESS_KEY
```

### Error: "Access Denied"

**Solution:** Ensure your AWS credentials have permissions:
```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock-agentcore:InvokeAgentRuntime"
  ],
  "Resource": "arn:aws:bedrock-agentcore:*:*:runtime/*"
}
```

### Error: "Agent Runtime not found"

**Solution:** Verify your Agent Runtime ARN:
```bash
aws bedrock-agentcore list-agent-runtimes --region us-east-1
```

### CORS Issues

Bedrock Agent Runtime doesn't have CORS issues since it's called directly from the browser using AWS SDK, not via HTTP fetch.

## Switching Between Modes

### Use Local Backend
```env
VITE_USE_BEDROCK=false
VITE_API_URL=http://localhost:8000
```

### Use Bedrock
```env
VITE_USE_BEDROCK=true
VITE_AGENT_RUNTIME_ARN=arn:aws:bedrock-agentcore:...
```

Restart the dev server after changing:
```bash
npm run dev
```

## Cost Considerations

When using Bedrock directly from frontend:
- Each user request = 1 Bedrock invocation
- Charges based on model usage and runtime
- Monitor usage in AWS Cost Explorer

Consider using backend proxy to:
- Implement rate limiting
- Add caching
- Monitor usage per user
- Control costs

## Next Steps

1. ✅ Deploy agent to Bedrock
2. ✅ Configure frontend environment
3. ✅ Test connection
4. 🔒 Implement proper authentication (Cognito)
5. 📊 Set up monitoring (CloudWatch)
6. 💰 Configure billing alerts
