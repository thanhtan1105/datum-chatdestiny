# Multi-Agent System with Strands

A professional multi-agent system using AWS Bedrock, Strands framework, and MCP tools.

## Features

- 🤖 **Multi-Agent Graph** - Router, Welcome, Numerology, and Tarot agents
- 🔮 **Tarot Swarm** - Specialized agents for card readings (spread_reader, card_interpreter, life_advisor)
- 💾 **Short-Term Memory** - Bedrock AgentCore Memory for conversation context
- 🔧 **MCP Tools** - Calculate numerology via SSE MCP server
- 🎴 **Tarot Tools** - Draw and interpret tarot cards
- 🚀 **FastAPI Server** - REST API with async support
- ⚙️ **Configuration** - Environment-based config management

## Project Structure

```
be/
├── app/
│   ├── agents/              # Agent definitions
│   │   ├── router.py        # Routes to appropriate agent
│   │   ├── welcome.py       # Handles greetings
│   │   ├── numerology.py    # Numerology calculations
│   │   ├── graph.py         # Multi-agent graph orchestration
│   │   ├── tarot_swarm.py   # Tarot swarm orchestration
│   │   ├── spread_reader.py # Tarot spread reader agent
│   │   ├── card_interpreter.py # Card meanings expert
│   │   └── life_advisor.py  # Practical guidance expert
│   ├── api/                 # API layer
│   │   └── routes.py        # API endpoints (/invocations, /ping)
│   ├── core/                # Core functionality
│   │   ├── config.py        # Configuration management
│   │   ├── memory.py        # Short-term memory
│   │   └── prompt_manager.py # AWS Prompt Management
│   └── tools/               # Agent tools
│       ├── tarot_tools.py   # Tarot card drawing tool
│       └── tarot_deck.py    # 78-card tarot deck
├── prompts/                 # Local prompt templates
│   ├── spread_reader_prompt.txt
│   ├── card_interpreter_prompt.txt
│   └── life_advisor_prompt.txt
├── main.py                  # FastAPI application entry point
├── Dockerfile               # Docker container configuration
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file (see `.env.example`):

```bash
# AWS Configuration
AWS_REGION=us-east-1
MODEL_ID=amazon.nova-micro-v1:0

# Server Configuration
HOST=0.0.0.0
PORT=8080

# AWS Prompt Management
ROUTER_PROMPT_ID=your-router-prompt-id
WELCOME_PROMPT_ID=your-welcome-prompt-id
NUMEROLOGY_PROMPT_ID=your-numerology-prompt-id
SPREAD_READER_PROMPT_ID=your-spread-reader-prompt-id
CARD_INTERPRETER_PROMPT_ID=your-card-interpreter-prompt-id
LIFE_ADVISOR_PROMPT_ID=your-life-advisor-prompt-id

# Optional: MCP Server for Numerology
MCP_SERVER_URI=http://your-mcp-server:8001/sse
```

### 3. Start Server

```bash
python main.py
```

## Usage

### Invocations API (Bedrock Agent Runtime Compatible)

```bash
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What does my love life future look like?",
    "actor_id": "user123",
    "session_id": "session1"
  }'
```

### Health Check

```bash
curl http://localhost:8080/ping
```

## Architecture

```
User Request → /invocations
     ↓
[Router Agent] → Analyzes intent
     ↓
     ├─→ [Welcome Agent] → Greetings
     ├─→ [Numerology Agent] → Calculations
     └─→ [Tarot Swarm]
          ↓
          [Spread Reader] → Draws cards, orchestrates
          ↓ (consults)
          [Card Interpreter] → Provides meanings
          ↓ (hands back)
          [Spread Reader]
          ↓ (consults)
          [Life Advisor] → Practical guidance
          ↓ (hands back)
          [Spread Reader] → Final synthesized response
     ↓
[Short-Term Memory] → Stores conversation
     ↓
Response to User
```

## Agents

### Router Agent
- Analyzes user input
- Routes to appropriate specialist agent
- No memory (stateless routing)

### Welcome Agent
- Handles greetings and introductions
- Provides friendly responses
- Uses Bedrock Nova model

### Numerology Agent
- Calculates numerology numbers
- Uses MCP tool: `calculate_numerology`
- Connects to SSE MCP server

### Tarot Swarm (Multi-Agent Collaboration)
The tarot agent is actually a swarm of three specialized agents that work together:

#### Spread Reader (Orchestrator & Final Responder)
- **Entry point** for all tarot queries
- Draws tarot cards using the `draw_tarot_cards` tool
- Performs various spread types (3-card, Celtic Cross, etc.)
- Consults other agents for their expertise
- **Always provides the final synthesized response** to users

#### Card Interpreter (Consultant)
- Expert in card meanings and symbolism
- Provides detailed interpretations when consulted
- Hands back control to spread_reader after providing insights

#### Life Advisor (Consultant)
- Translates tarot insights into practical guidance
- Offers actionable advice and timing predictions
- Hands back control to spread_reader after providing guidance

**Flow Example:**
1. User asks: "What's my love life future?"
2. Spread Reader draws 3 cards
3. Spread Reader consults Card Interpreter for meanings
4. Card Interpreter provides interpretations → hands back
5. Spread Reader consults Life Advisor for practical advice
6. Life Advisor provides guidance → hands back
7. **Spread Reader synthesizes everything into final response**
8. User receives complete reading with interpretations and advice

## Memory

Short-term memory using Bedrock AgentCore Memory:
- Stores conversation history per session
- Organized by `actor_id` and `session_id`
- Instant storage (synchronous)
- Auto-creates memory resource on first use

## Configuration

All configuration in `app/core/config.py`:

- `AWS_REGION` - AWS region for Bedrock
- `MODEL_ID` - Bedrock model identifier (e.g., amazon.nova-micro-v1:0)
- `MEMORY_ID` - Optional: existing memory resource ID
- `MCP_SERVER_URI` - Optional: MCP server endpoint for numerology
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 8080)

### AWS Prompt Management (Required)

All agent prompts are stored in AWS Bedrock Prompt Management:

```bash
# Prompt identifiers (ARN or ID)
ROUTER_PROMPT_ID=numerology-router
WELCOME_PROMPT_ID=numerology-welcome
NUMEROLOGY_PROMPT_ID=numerology-numerology
SPREAD_READER_PROMPT_ID=tarot-spread-reader
CARD_INTERPRETER_PROMPT_ID=tarot-card-interpreter
LIFE_ADVISOR_PROMPT_ID=tarot-life-advisor

# Optional: Specify versions (defaults to latest)
ROUTER_PROMPT_VERSION=1
WELCOME_PROMPT_VERSION=1
NUMEROLOGY_PROMPT_VERSION=1
SPREAD_READER_PROMPT_VERSION=1
CARD_INTERPRETER_PROMPT_VERSION=1
LIFE_ADVISOR_PROMPT_VERSION=1
```

**Note:** Prompts are fetched from AWS. Specific versions are cached, while "latest" fetches fresh content on each request.

## Deployment

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

### Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t tarot-agent .

# Run container
docker run -p 8080:8080 --env-file .env tarot-agent
```

The container:
- Exposes port 8080
- Includes health checks via `/ping` endpoint
- Uses Python 3.11 slim image
- Runs with uvicorn

### Production Considerations

1. **AWS Credentials**: Ensure the container has access to AWS credentials
2. **Prompt Management**: All prompts must be uploaded to AWS Bedrock Prompt Management
3. **Memory**: Short-term memory is stored in AWS Bedrock AgentCore Memory
4. **Timeouts**: Tarot swarm has extended timeouts (10 min execution, 3 min per node)
5. **CORS**: Configure allowed origins in `main.py` for your frontend

## API Endpoints

### POST /invocations
Main endpoint for agent interactions. Accepts:
```json
{
  "prompt": "Your question or message",
  "actor_id": "user_identifier",
  "session_id": "session_identifier"
}
```

Returns:
```json
{
  "response": "Agent's response",
  "agent": "which_agent_responded",
  "session_id": "session_identifier",
  "card_list": ["Card 1", "Card 2"]  // Only for tarot readings
}
```

### GET /ping
Health check endpoint. Returns:
```json
{
  "status": "healthy",
  "service": "bedrock-agent-runtime"
}
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

## License

MIT
