# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and choose your backend:

**Option A: Local Backend (Default)**
```env
VITE_API_URL=http://localhost:8000
VITE_USE_BEDROCK=false
```

**Option B: Bedrock Agent Runtime (Direct)**

For permanent credentials (IAM user):
```env
VITE_USE_BEDROCK=true
VITE_AWS_ACCESS_KEY_ID=your_access_key_id
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
VITE_AWS_REGION=us-east-1
VITE_AGENT_RUNTIME_ARN=arn:aws:bedrock-agentcore:us-east-1:859552982781:runtime/hosted_agent_xxx
```

For temporary credentials (STS, Cognito):
```env
VITE_USE_BEDROCK=true
VITE_AWS_ACCESS_KEY_ID=your_access_key_id
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
VITE_AWS_SESSION_TOKEN=your_session_token
VITE_AWS_REGION=us-east-1
VITE_AGENT_RUNTIME_ARN=arn:aws:bedrock-agentcore:us-east-1:859552982781:runtime/hosted_agent_xxx
```

**Option C: Production Backend**
```env
VITE_API_URL=https://your-backend-domain.com
VITE_USE_BEDROCK=false
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Backend Connection

The frontend supports two backend modes:

### Mode 1: Local/Remote Backend (Default)

Connects to a FastAPI backend at `VITE_API_URL`.

**Endpoints Used:**
- `POST /invocations` - Send chat messages
- `GET /messages/{actor_id}/{session_id}` - Load conversation history
- `GET /events/{actor_id}/{session_id}` - Get raw events
- `GET /ping` - Health check

### Mode 2: Bedrock Agent Runtime (Direct)

Connects directly to AWS Bedrock Agent Runtime using AWS SDK.

**Requirements:**
- AWS credentials with Bedrock access
- Deployed Bedrock Agent Runtime ARN
- `@aws-sdk/client-bedrock-agentcore` package (already installed)

**Configuration:**
```env
VITE_USE_BEDROCK=true
VITE_AWS_ACCESS_KEY_ID=your_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret
VITE_AWS_REGION=us-east-1
VITE_AGENT_RUNTIME_ARN=arn:aws:bedrock-agentcore:...
```

**Note:** For production, use AWS Cognito or temporary credentials instead of hardcoding keys in the frontend

### API Request Format

```javascript
{
  "prompt": "user message",
  "actor_id": "unique_user_id",
  "session_id": "unique_session_id"
}
```

### API Response Format

```javascript
{
  "response": "agent response text",
  "agent": "agent_name",
  "session_id": "session_id"
}
```

## Features

### 1. Markdown Support

Messages support full markdown formatting:
- **Bold** with `**text**`
- *Italic* with `*text*`
- `Code` with backticks
- Lists, headers, blockquotes
- Links and tables

### 2. Thinking Tags Removal

The frontend automatically removes `<thinking>` tags from bot responses, so internal reasoning is hidden from users.

### 3. Session Management

- Each user gets a unique UUID
- Sessions are persisted across page reloads
- Load previous conversations using the session manager

### 4. Character Avatar

- Animated 2D character with dynamic effects
- Reacts to typing state
- Flying head animation on response

### 5. Particle Effects

- Background particle field
- Ambient glow effects
- Typing indicators with animations

## Development

### Project Structure

```
fe/
├── src/
│   ├── components/
│   │   ├── WaifuChatInterface.jsx  # Main chat interface
│   │   ├── CharacterAvatar.jsx     # Character with effects
│   │   ├── Character3D.jsx         # 2D character SVG
│   │   ├── Message.jsx             # Message bubble
│   │   ├── SessionManager.jsx      # Session loading
│   │   └── ...
│   ├── services/
│   │   └── api.js                  # API client
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # Entry point
├── index.html
├── package.json
└── vite.config.js
```

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Building for Production

### 1. Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### 2. Deploy

Deploy the `dist/` directory to your hosting service:

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**AWS S3 + CloudFront:**
```bash
aws s3 sync dist/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 3. Environment Variables

Set `VITE_API_URL` in your hosting platform:

- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Build & Deploy → Environment
- **AWS Amplify:** App Settings → Environment Variables

## Troubleshooting

### CORS Issues

If you see CORS errors, make sure your backend allows the frontend origin:

```python
# In backend server.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Connection Failed

1. Check backend is running: `curl http://localhost:8000/ping`
2. Verify `VITE_API_URL` in `.env`
3. Check browser console for errors
4. Verify network tab in DevTools

### Markdown Not Rendering

Make sure these packages are installed:
```bash
npm install react-markdown remark-gfm rehype-raw
```

### Character Not Showing

1. Check browser console for errors
2. Verify SVG image URLs are accessible
3. Check if animations are supported in your browser

## Performance Optimization

### 1. Code Splitting

The app uses dynamic imports for better performance:
```javascript
const Component = lazy(() => import('./Component'))
```

### 2. Image Optimization

- Use WebP format for images
- Lazy load images below the fold
- Use appropriate image sizes

### 3. Bundle Size

Check bundle size:
```bash
npm run build
```

Analyze bundle:
```bash
npm install -g vite-bundle-visualizer
npx vite-bundle-visualizer
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Android

## License

[Your License Here]
